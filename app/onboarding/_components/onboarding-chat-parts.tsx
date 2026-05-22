import { Streamdown } from "streamdown";
import { cjk } from "@streamdown/cjk";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DEFAULT_ONBOARDING_SECTIONS, type OnboardingData, type OnboardingSelectedSections } from "@/lib/onboarding/types";
import {
  JSXPreview,
  JSXPreviewContent,
  JSXPreviewError,
} from "@/components/ai-elements/jsx-preview";
import type { JSXPreviewProps } from "@/components/ai-elements/jsx-preview";
import { CheckIcon } from "lucide-react";

const PREVIEW_JSX =
  "<Card className=\"border-primary/30 bg-primary/5\">" +
  "<CardHeader>" +
  "<CardTitle className=\"text-xl\">{data.name}</CardTitle>" +
  "<p className=\"text-muted-foreground text-sm\">{data.title}</p>" +
  "</CardHeader>" +
  "<CardContent className=\"space-y-4\">" +
  "<div><p className=\"text-muted-foreground text-xs font-medium uppercase tracking-wide\">Setup path</p><p className=\"text-sm\">{pathLabel}</p></div>" +
  "<div><p className=\"text-muted-foreground text-xs font-medium uppercase tracking-wide\">Bio</p><p className=\"text-sm\">{data.bio}</p></div>" +
  "<div><p className=\"text-muted-foreground text-xs font-medium uppercase tracking-wide\">Services</p><ul className=\"mt-1 flex flex-wrap gap-2\">{servicesList}</ul></div>" +
  "{projectsSection}" +
  "{existingSiteSection}" +
  "<div className=\"flex flex-wrap items-center justify-between gap-3 pt-2\">" +
  '<p className="text-muted-foreground text-xs">Mimick.me.io/' + "{data.handle}" + " · " + "{data.tone}" + "</p>" +
  "<div className=\"flex gap-2 shrink-0\"><EditButton /><ConfirmButton /></div></div></CardContent></Card>";

export function OnboardingMessageResponse({ children }: { children: string }) {
  return (
    <Streamdown className="[&>*:first-child]:mt-0 [&>*:last-child]:mb-0" plugins={{ cjk }} controls={{ code: false, mermaid: false }}>
      {children}
    </Streamdown>
  );
}

export function OnboardingPreviewCard({
  data,
  onConfirm,
  onEdit,
  isConfirming,
}: {
  data: OnboardingData;
  onConfirm: () => void;
  onEdit: () => void;
  isConfirming: boolean;
}) {
  const pathLabel = data.setupPath === "existing-site" ? "I already have a website" : "Build me a portfolio + agent";
  const sectionsList = <>{data.sections.map((section) => <li key={section} className="rounded-full bg-secondary/80 px-2.5 py-0.5 text-sm capitalize">{section}</li>)}</>;
  const servicesList = <>{data.services.map((s) => <li key={s} className="rounded-full bg-primary/10 px-2.5 py-0.5 text-sm">{s}</li>)}</>;
  const projectList = <>{(data.projects ?? []).map((project, i) => <div key={i} className="rounded-lg border bg-background/50 p-3"><p className="font-medium text-sm">{project.title}</p><p className="text-muted-foreground text-xs">{project.description}</p></div>)}</>;
  const projectsSection = (data.projects ?? []).length > 0 ? <div><p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">Projects</p><div className="mt-2 space-y-2">{projectList}</div></div> : <></>;
  const existingSiteSection = data.setupPath === "existing-site" ? <div className="space-y-2"><p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">Existing site setup</p><p className="text-sm">Site URL: {data.siteUrl}</p>{data.targetAudience ? <p className="text-sm">Target audience: {data.targetAudience}</p> : null}{data.contactPreferences ? <p className="text-sm">Contact preferences: {data.contactPreferences}</p> : null}{(data.faqs?.length ?? 0) > 0 ? <ul className="list-disc pl-5 text-sm">{data.faqs?.map((faq) => <li key={faq}>{faq}</li>)}</ul> : null}</div> : <></>;
  const EditButton = () => <Button type="button" variant="outline" size="sm" onClick={onEdit}>Edit</Button>;
  const ConfirmButton = () => (
    <Button onClick={onConfirm} disabled={isConfirming} size="sm" className="shrink-0">
      {isConfirming ? "Creating…" : <><CheckIcon className="size-4 mr-1" />Confirm</>}
    </Button>
  );

  return (
    <JSXPreview
      jsx={PREVIEW_JSX}
      components={{ Card, CardHeader, CardTitle, CardContent, EditButton, ConfirmButton } as NonNullable<JSXPreviewProps["components"]>}
      bindings={{ data, pathLabel, sectionsList, servicesList, projectList, projectsSection, existingSiteSection }}
      onError={(err) => console.error("JSX Preview error:", err)}
    >
      <JSXPreviewContent />
      <JSXPreviewError />
    </JSXPreview>
  );
}


const SECTION_LABELS: Array<{ key: keyof OnboardingSelectedSections; label: string; locked?: boolean }> = [
  { key: "hero", label: "Hero", locked: true },
  { key: "about", label: "About" },
  { key: "services", label: "Services" },
  { key: "projects", label: "Projects" },
  { key: "cta", label: "CTA" },
  { key: "socials", label: "Socials" },
];

export function SectionSelectorMessage({
  value,
  onChange,
  onSubmit,
  disabled,
}: {
  value: OnboardingSelectedSections;
  onChange: (next: OnboardingSelectedSections) => void;
  onSubmit: () => void;
  disabled: boolean;
}) {
  return (
    <div className="space-y-3 rounded-xl border bg-card p-4">
      <p className="text-sm font-medium">Choose portfolio sections</p>
      <div className="flex flex-wrap gap-2">
        {SECTION_LABELS.map((section) => {
          const enabled = value[section.key];
          return (
            <Button
              key={section.key}
              type="button"
              size="sm"
              variant={enabled ? "default" : "outline"}
              disabled={disabled || section.locked}
              onClick={() => {
                if (section.locked) return;
                onChange({ ...value, [section.key]: !enabled });
              }}
              className="rounded-full"
            >
              {section.label}
              {section.locked ? " (always on)" : ""}
            </Button>
          );
        })}
      </div>
      <Button type="button" size="sm" onClick={onSubmit} disabled={disabled}>
        Continue
      </Button>
    </div>
  );
}

export function getDefaultSectionSelection() {
  return DEFAULT_ONBOARDING_SECTIONS;
}
