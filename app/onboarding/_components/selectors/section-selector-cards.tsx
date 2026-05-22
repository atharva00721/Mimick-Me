import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { OnboardingSelectedSections } from "@/lib/onboarding/types";
import { Check } from "lucide-react";
import { IconComponent } from "./shared";

interface SectionSelectorCardsProps {
  value: OnboardingSelectedSections;
  onChange: (next: OnboardingSelectedSections) => void;
  onSubmit: () => void;
  disabled?: boolean;
}

const SECTION_CONFIG: Array<{
  key: keyof OnboardingSelectedSections;
  label: string;
  icon: string;
  description: string;
  locked?: boolean;
}> = [
  { key: "hero", label: "Hero", icon: "user", description: "Your name & title", locked: true },
  { key: "about", label: "About", icon: "info", description: "Your bio & story" },
  { key: "services", label: "Services", icon: "briefcase", description: "What you offer" },
  { key: "projects", label: "Projects", icon: "folder", description: "Your work samples" },
  { key: "cta", label: "CTA", icon: "sparkles", description: "Call to action" },
  { key: "socials", label: "Socials", icon: "link", description: "Links & contact" },
];

export function SectionSelectorCards({ value, onChange, onSubmit, disabled }: SectionSelectorCardsProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {SECTION_CONFIG.map((section) => {
          const isEnabled = value[section.key];

          return (
            <Card
              key={section.key}
              className={`cursor-pointer transition-all duration-200 ${isEnabled
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/30"
                } ${section.locked ? "opacity-80" : ""}`}
              onClick={() => {
                if (disabled || section.locked) return;
                onChange({ ...value, [section.key]: !isEnabled });
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${isEnabled ? "bg-primary/10" : "bg-muted"}`}>
                    <IconComponent name={section.icon} className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{section.label}</p>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isEnabled ? "border-primary bg-primary" : "border-muted-foreground"
                        }`}>
                        {isEnabled && <Check className="w-3 h-3 text-primary-foreground" />}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{section.description}</p>
                    {section.locked && (
                      <Badge variant="outline" className="text-[10px] mt-2">Always on</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <div className="flex justify-end pt-2">
        <Button onClick={onSubmit} disabled={disabled} size="sm">
          Continue
        </Button>
      </div>
    </div>
  );
}
