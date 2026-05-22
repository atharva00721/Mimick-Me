import { useCallback, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Check, Plus, X } from "lucide-react";

interface ServicesTagSelectorProps {
  presets?: string[];
  onChange: (tags: string[]) => void;
  onSubmit: () => void;
  disabled?: boolean;
  max?: number;
}

export function ServicesTagSelector({ presets = [], onChange, onSubmit, disabled, max = 10 }: ServicesTagSelectorProps) {
  const [tags, setTags] = useState<string[]>([]);
  const [customInput, setCustomInput] = useState("");

  const addTag = useCallback((tag: string) => {
    const trimmed = tag.trim();
    if (!trimmed || tags.includes(trimmed) || tags.length >= max) return;
    const newTags = [...tags, trimmed];
    setTags(newTags);
    onChange(newTags);
    setCustomInput("");
  }, [tags, max, onChange]);

  const removeTag = useCallback((tag: string) => {
    const newTags = tags.filter(t => t !== tag);
    setTags(newTags);
    onChange(newTags);
  }, [tags, onChange]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(customInput);
    }
  };

  return (
    <div className="space-y-4">
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="gap-1 pr-1">
              {tag}
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                className="h-4 w-4 ml-1"
                onClick={() => removeTag(tag)}
                disabled={disabled}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <Input
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add custom service..."
          disabled={disabled || tags.length >= max}
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addTag(customInput)}
          disabled={disabled || !customInput.trim() || tags.length >= max}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {presets.length > 0 && (
        <>
          <Separator />
          <div>
            <p className="text-sm text-muted-foreground mb-2">Or choose from:</p>
            <div className="flex flex-wrap gap-2">
              {presets.map((preset) => (
                <Button
                  key={preset}
                  type="button"
                  variant={tags.includes(preset) ? "default" : "outline"}
                  size="sm"
                  className="rounded-full text-xs"
                  onClick={() => {
                    if (tags.includes(preset)) {
                      removeTag(preset);
                    } else {
                      addTag(preset);
                    }
                  }}
                  disabled={disabled || (tags.length >= max && !tags.includes(preset))}
                >
                  {tags.includes(preset) && <Check className="h-3 w-3 mr-1" />}
                  {preset}
                </Button>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="flex justify-end pt-2">
        <Button onClick={onSubmit} disabled={disabled || tags.length === 0} size="sm">
          Continue
        </Button>
      </div>
    </div>
  );
}
