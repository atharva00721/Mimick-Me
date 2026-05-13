"use client";

import { useMemo, useState } from "react";
import { submitOnboardingForm } from "@/app/onboarding/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { OnboardingChatWrapper } from "@/app/onboarding/onboarding-chat-wrapper";
import { Sparkles, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import type { OnboardingData } from "@/lib/onboarding/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";

const STEPS = [
  "Profile",
  "Bio",
  "Services",
  "Projects",
  "Tone",
  "Handle",
] as const;

type ToneOption = "Professional" | "Friendly" | "Bold" | "Minimal";

export function TraditionalOnboardingFlow() {
  const [view, setView] = useState<"choice" | "form" | "chat">("choice");
  const [step, setStep] = useState(0);

  // Controlled form state
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [servicesInput, setServicesInput] = useState("");
  const [projects, setProjects] = useState([
    { title: "", description: "" },
    { title: "", description: "" },
    { title: "", description: "" },
  ]);
  const [tone, setTone] = useState<ToneOption>("Professional");
  const [handle, setHandle] = useState("");

  const progressValue = useMemo(() => ((step + 1) / STEPS.length) * 100, [step]);

  const updateProject = (index: number, field: "title" | "description", value: string) => {
    setProjects((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const goNext = () => setStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  const goBack = () => setStep((prev) => Math.max(prev - 1, 0));

  const handleAutofill = async () => {
    try {
      const res = await fetch("/api/onboarding/draft", { credentials: "include" });
      const json = await res.json();
      if (json.ok && json.state) {
        const state = json.state as Partial<OnboardingData>;
        if (state.name) setName(state.name);
        if (state.title) setTitle(state.title);
        if (state.bio) setBio(state.bio);
        if (state.services) {
          const s = Array.isArray(state.services) ? state.services.join(", ") : String(state.services);
          setServicesInput(s);
        }
        if (state.projects && Array.isArray(state.projects)) {
          setProjects((prev) => {
            const next = [...prev];
            state.projects?.forEach((p: unknown, i: number) => {
              if (i < 3 && typeof p === "object" && p !== null) {
                const project = p as { title?: string; description?: string };
                next[i] = { title: project.title || "", description: project.description || "" };
              }
            });
            return next;
          });
        }
        if (state.tone) setTone(state.tone as ToneOption);
        if (state.handle) setHandle(state.handle);
        toast.success("Form autofilled from your AI chat draft!");
      } else {
        toast.error("No AI chat draft found. Try the AI setup first!");
      }
    } catch {
      toast.error("Failed to fetch AI draft.");
    }
  };

  if (view === "choice") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-4xl w-full grid md:grid-cols-2 gap-6">
          <Card className="relative overflow-hidden group cursor-pointer hover:border-primary transition-all" onClick={() => setView("chat")}>
            <div className="absolute top-4 right-4 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <Sparkles className="size-3" /> Recommended
            </div>
            <CardHeader>
              <CardTitle className="text-2xl">AI-Powered Setup</CardTitle>
              <CardDescription>Chat with our AI to build your portfolio. Upload a resume or provide a website URL for instant autofill.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted rounded-lg p-4 h-40 flex flex-col justify-end">
                <p className="text-sm font-medium italic">&quot;I&apos;ll help you extract your best projects and write a killer bio...&quot;</p>
              </div>
              <Button className="w-full mt-6 gap-2">Start with AI <ArrowRight className="size-4" /></Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:border-primary transition-all" onClick={() => setView("form")}>
            <CardHeader>
              <CardTitle className="text-2xl">Traditional Form</CardTitle>
              <CardDescription>Prefer to do it yourself? Fill out the fields manually in a step-by-step form.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted rounded-lg p-4 h-40 flex flex-col justify-end">
                <div className="space-y-2">
                  <div className="h-2 w-full bg-border rounded" />
                  <div className="h-2 w-3/4 bg-border rounded" />
                  <div className="h-2 w-1/2 bg-border rounded" />
                </div>
              </div>
              <Button variant="outline" className="w-full mt-6">Fill manually</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (view === "chat") {
    return (
      <div className="h-screen flex flex-col">
        <div className="p-2 border-b bg-muted/50 flex justify-between items-center px-4">
          <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            <Sparkles className="size-3" /> AI Onboarding Mode
          </span>
          <Button variant="ghost" size="sm" onClick={() => setView("form")} className="text-xs">
            Switch to manual form
          </Button>
        </div>
        <div className="flex-1 overflow-hidden">
          <OnboardingChatWrapper />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto w-full max-w-3xl space-y-4">
        <div className="flex justify-between items-center">
          <Button variant="ghost" size="sm" onClick={() => setView("choice")}>&larr; Back to choices</Button>
          <Button variant="outline" size="sm" onClick={handleAutofill} className="gap-2 text-primary border-primary/20 hover:bg-primary/5">
            <Sparkles className="size-4" /> Autofill with AI draft
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Set up your portfolio</CardTitle>
            <CardDescription>
              Step {step + 1} of {STEPS.length}: {STEPS[step]}
            </CardDescription>
            <Progress value={progressValue} className="mt-2" />
          </CardHeader>
          <CardContent>
            <form action={submitOnboardingForm} className="space-y-8">
              <section className={step === 0 ? "block space-y-4" : "hidden"}>
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Professional title</Label>
                  <Input id="title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Product Designer" required />
                </div>
              </section>

              <section className={step === 1 ? "block space-y-2" : "hidden"}>
                <Label htmlFor="bio">Short bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="I help startups design and ship polished digital products."
                  minLength={20}
                  required
                  className="min-h-32"
                />
              </section>

              <section className={step === 2 ? "block space-y-2" : "hidden"}>
                <Label htmlFor="servicesView">Services (comma separated)</Label>
                <Textarea
                  id="servicesView"
                  placeholder="UI/UX Design, Web Development, Product Strategy"
                  value={servicesInput}
                  onChange={(event) => setServicesInput(event.target.value)}
                  required
                />
                <input type="hidden" name="services" value={servicesInput} />
              </section>

              <section className={step === 3 ? "block space-y-4" : "hidden"}>
                {projects.map((project, index) => {
                  const number = index + 1;
                  return (
                    <div key={number} className="rounded-lg border p-4 space-y-2">
                      <p className="text-sm font-medium">Project {number}</p>
                      <Input
                        name={`projectTitle${number}`}
                        placeholder="Project title"
                        value={project.title}
                        onChange={(event) => updateProject(index, "title", event.target.value)}
                        required={number <= 2}
                      />
                      <Textarea
                        name={`projectDescription${number}`}
                        placeholder="What you built and the result"
                        value={project.description}
                        onChange={(event) => updateProject(index, "description", event.target.value)}
                        required={number <= 2}
                      />
                    </div>
                  );
                })}
                <p className="text-xs text-muted-foreground">Please fill at least 2 projects. The third one is optional.</p>
              </section>

              <section className={step === 4 ? "block space-y-3" : "hidden"}>
                <Label htmlFor="tone">Preferred tone</Label>
                <select
                  id="tone"
                  name="tone"
                  value={tone}
                  onChange={(e) => setTone(e.target.value as ToneOption)}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                  required
                >
                  {(["Professional", "Friendly", "Bold", "Minimal"] as ToneOption[]).map((toneOption) => (
                    <option key={toneOption} value={toneOption}>
                      {toneOption}
                    </option>
                  ))}
                </select>
              </section>

              <section className={step === 5 ? "block space-y-2" : "hidden"}>
                <Label htmlFor="handle">Public handle</Label>
                <Input id="handle" name="handle" value={handle} onChange={(e) => setHandle(e.target.value)} placeholder="jane-doe" required />
                <p className="text-xs text-muted-foreground">Use lowercase letters, numbers, or hyphens (3–30 characters).</p>
              </section>

              <div className="flex items-center justify-between border-t pt-4">
                <Button type="button" variant="outline" onClick={goBack} disabled={step === 0}>
                  Back
                </Button>
                {step < STEPS.length - 1 ? (
                  <Button type="button" onClick={goNext}>
                    Next
                  </Button>
                ) : (
                  <Button type="submit">Create portfolio</Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
