import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CONTACT_OPTIONS } from "./constants";
import { IconComponent } from "./shared";

interface ContactPreferencesChipsProps {
  onSelect: (value: string) => void;
  disabled?: boolean;
}

export function ContactPreferencesChips({ onSelect, disabled }: ContactPreferencesChipsProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [customText, setCustomText] = useState("");

  const handleSelect = (id: string) => {
    setSelected(id);
    onSelect(id);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {CONTACT_OPTIONS.map((option) => {
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

      {selected && (
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">
            Additional instructions (optional)
          </Label>
          <Textarea
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="Any specific instructions for handling contacts..."
            disabled={disabled}
            rows={2}
          />
        </div>
      )}
    </div>
  );
}
