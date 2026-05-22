import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { DEFAULT_TITLE_SUGGESTIONS } from "./constants";

interface TitleSuggestionsProps {
  suggestions?: string[];
  onSelect: (value: string) => void;
  disabled?: boolean;
}

export function TitleSuggestions({
  suggestions = DEFAULT_TITLE_SUGGESTIONS,
  onSelect,
  disabled,
}: TitleSuggestionsProps) {
  const [customValue, setCustomValue] = useState("");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion) => (
          <Button
            key={suggestion}
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={() => onSelect(suggestion)}
            disabled={disabled}
          >
            {suggestion}
          </Button>
        ))}
      </div>

      <Separator />

      <div>
        <Label className="text-xs text-muted-foreground mb-2 block">
          Or type your own:
        </Label>
        <Input
          value={customValue}
          onChange={(e) => setCustomValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && customValue.trim()) {
              onSelect(customValue.trim());
            }
          }}
          placeholder="e.g. Senior Product Designer at Acme"
          disabled={disabled}
          className="flex-1"
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
              Use this title
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
