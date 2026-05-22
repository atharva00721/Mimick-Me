import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { AUDIENCE_OPTIONS } from "./constants";
import { IconComponent } from "./shared";

interface TargetAudienceChipsProps {
  onSelect: (value: string) => void;
  disabled?: boolean;
}

export function TargetAudienceChips({ onSelect, disabled }: TargetAudienceChipsProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [customValue, setCustomValue] = useState("");

  const handleSelect = (id: string) => {
    setSelected(id);
    onSelect(id);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {AUDIENCE_OPTIONS.map((option) => {
          const isSelected = selected === option.id;
          return (
            <Button
              key={option.id}
              type="button"
              variant={isSelected ? "default" : "outline"}
              size="sm"
              className="rounded-full gap-2"
              onClick={() => handleSelect(option.id)}
              disabled={disabled}
            >
              <IconComponent name={option.icon} className="h-4 w-4" />
              {option.label}
            </Button>
          );
        })}
      </div>

      <Separator />

      <div>
        <Label className="text-xs text-muted-foreground mb-2 block">
          Or describe your audience:
        </Label>
        <Textarea
          value={customValue}
          onChange={(e) => setCustomValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && customValue.trim() && !e.shiftKey) {
              e.preventDefault();
              onSelect(customValue.trim());
            }
          }}
          placeholder="Tech startups in the SaaS space looking for design help..."
          disabled={disabled}
          rows={2}
        />
        {customValue.trim() && (
          <div className="flex justify-end mt-2">
            <Button
              size="sm"
              onClick={() => {
                onSelect(customValue.trim());
                setCustomValue("");
              }}
              disabled={disabled}
            >
              Use this
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
