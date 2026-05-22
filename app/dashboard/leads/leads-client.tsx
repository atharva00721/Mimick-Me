"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { LeadList } from "@/components/leads/LeadList";
import { LeadViewer } from "@/components/leads/LeadViewer";
import type { LeadDetailData, LeadStatus } from "@/components/leads/types";

async function patchRead(id: string) {
  await fetch(`/api/leads/${id}/read`, { method: "PATCH" });
}

async function patchStatus(id: string, status: LeadStatus) {
  const res = await fetch(`/api/leads/${id}/status`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error || "Failed to update status");
  }
}

export function LeadsClient({ leads: initialLeads }: { leads: LeadDetailData[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isMobile = useMediaQuery("(max-width: 767px)");

  const [leads, setLeads] = useState<LeadDetailData[]>(initialLeads);
  const [query, setQuery] = useState("");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(searchParams.get("selected"));
  const effectiveSelectedLeadId = selectedLeadId;

  const filteredLeads = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return leads.filter((lead) => {
      if (showUnreadOnly && lead.isRead !== false) return false;
      if (!normalizedQuery) return true;

      const searchable = [lead.name, lead.email, lead.subject, lead.budget, lead.conversationSummary]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(normalizedQuery);
    });
  }, [leads, query, showUnreadOnly]);

  const selectedLead = useMemo(
    () => (effectiveSelectedLeadId ? leads.find((l) => l.id === effectiveSelectedLeadId) ?? null : null),
    [leads, effectiveSelectedLeadId]
  );

  const unreadCount = useMemo(() => leads.filter((lead) => lead.isRead === false).length, [leads]);

  const markReadOptimistic = (id: string) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, isRead: true } : l))
    );
  };

  const updateStatusOptimistic = (id: string, status: LeadStatus) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
  };

  const handleSelectLead = (id: string) => {
    const lead = leads.find((l) => l.id === id);
    if (!lead) return;

    if (lead.isRead === false) {
      markReadOptimistic(id);
      void patchRead(id);
    }

    if (isMobile) {
      router.push(`/dashboard/leads/${id}`);
      return;
    }

    // Update the URL search param so it stays the single source of truth
    const params = new URLSearchParams(searchParams.toString());
    params.set("selected", id);
    router.replace(`/dashboard/leads?${params.toString()}`, { scroll: false });

    setSelectedLeadId(id);
  };

  const handleStatusChange = async (status: LeadStatus) => {
    if (!selectedLeadId) return;

    const previous = selectedLead?.status ?? "new";
    updateStatusOptimistic(selectedLeadId, status);

    try {
      await patchStatus(selectedLeadId, status);
      toast.success("Status updated");
    } catch (e) {
      updateStatusOptimistic(selectedLeadId, previous as LeadStatus);
      toast.error(e instanceof Error ? e.message : "Failed to update status");
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-6xl mx-auto">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl tracking-tight">Leads</h1>
          <p className="text-muted-foreground">
            {leads.length} lead{leads.length === 1 ? "" : "s"} captured by your AI agent • {unreadCount} unread.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name, email, summary..."
            className="pl-9"
          />
        </div>

        <Button
          type="button"
          variant={showUnreadOnly ? "default" : "outline"}
          onClick={() => setShowUnreadOnly((previous) => !previous)}
          className="rounded-full"
        >
          <SlidersHorizontal className="mr-2 size-4" />
          {showUnreadOnly ? "Unread only" : "All leads"}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-[320px_1fr] md:min-h-0 md:h-[calc(100vh-11rem)]">
        <Card className="h-[65vh] md:h-full min-h-0 overflow-hidden flex flex-col">
          <LeadList
            leads={filteredLeads}
            selectedLeadId={effectiveSelectedLeadId}
            onSelectLead={handleSelectLead}
          />
        </Card>

        <div className="hidden md:block h-full min-h-0 overflow-hidden">
          <LeadViewer lead={selectedLead} onStatusChange={handleStatusChange} />
        </div>
      </div>
    </div>
  );
}
