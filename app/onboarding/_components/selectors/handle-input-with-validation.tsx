import { useEffect, useState, type ChangeEvent } from "react";
import { AlertCircle, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HandleInputWithValidationProps {
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  baseUrl?: string;
}

export function HandleInputWithValidation({ onChange, onSubmit, disabled, baseUrl = "Mimick.me.io" }: HandleInputWithValidationProps) {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<"idle" | "checking" | "available" | "unavailable">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!value || value.length < 3) {
      return;
    }

    const timeout = setTimeout(async () => {
      setStatus("checking");
      setError(null);

      if (!/^[a-z0-9-]+$/.test(value)) {
        setStatus("unavailable");
        setError("Only lowercase letters, numbers, and hyphens allowed");
        return;
      }

      try {
        const res = await fetch(`/api/check-handle?handle=${encodeURIComponent(value)}`);
        const data = await res.json();

        if (data.available) {
          setStatus("available");
          return;
        }

        setStatus("unavailable");
        setError("This handle is already taken");
      } catch {
        setStatus("idle");
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [value]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "");
    setValue(val);

    if (!val || val.length < 3) {
      setStatus("idle");
      setError(null);
    }

    onChange(val);
  };

  const isValid = status === "available";

  return (
    <div className="space-y-4">
      <div className="relative">
        <Input
          value={value}
          onChange={handleChange}
          placeholder="your-name"
          disabled={disabled}
          className={`pr-20 ${status === "available" ? "border-green-500" : status === "unavailable" ? "border-red-500" : ""}`}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
          .{baseUrl}
        </div>
      </div>

      {status === "checking" && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Checking availability...
        </div>
      )}

      {status === "available" && (
        <div className="flex items-center gap-2 text-sm text-green-600">
          <Check className="h-4 w-4" />
          Available!
        </div>
      )}

      {status === "unavailable" && error && (
        <div className="flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {value && isValid && (
        <div className="flex justify-end">
          <Button onClick={onSubmit} disabled={disabled || !isValid} size="sm">
            Continue
          </Button>
        </div>
      )}
    </div>
  );
}
