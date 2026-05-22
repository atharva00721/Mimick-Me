"use client";

import { useMemo, useState } from "react";
import { submitOnboardingForm } from "@/app/onboarding/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  const [step, setStep] = useState(0);
  const [servicesInput, setServicesInput] = useState("");
  const [projects, setProjects] = useState([
    { title: "", description: "" },
    { title: "", description: "" },
    { title: "", description: "" },
  ]);

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

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto w-full max-w-3xl">
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
                  <Input id="name" name="name" placeholder="Jane Doe" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Professional title</Label>
                  <Input id="title" name="title" placeholder="Product Designer" required />
                </div>
              </section>

              <section className={step === 1 ? "block space-y-2" : "hidden"}>
                <Label htmlFor="bio">Short bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
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
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                  defaultValue="Professional"
                  required
                >
                  {(["Professional", "Friendly", "Bold", "Minimal"] as ToneOption[]).map((tone) => (
                    <option key={tone} value={tone}>
                      {tone}
                    </option>
                  ))}
                </select>
              </section>

              <section className={step === 5 ? "block space-y-2" : "hidden"}>
                <Label htmlFor="handle">Public handle</Label>
                <Input id="handle" name="handle" placeholder="jane-doe" required />
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
