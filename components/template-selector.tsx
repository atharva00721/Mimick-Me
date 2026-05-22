"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function TemplateSelector() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTheme = searchParams.get("theme") || "modern";

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground">Theme:</span>
      <Select
        value={currentTheme}
        onValueChange={(val) => {
          const params = new URLSearchParams(searchParams.toString());
          params.set("theme", val);
          router.push(`${pathname}?${params.toString()}`);
        }}
      >
        <SelectTrigger className="w-[120px] h-9">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="landing">Landing</SelectItem>
          <SelectItem value="modern">Modern</SelectItem>
          <SelectItem value="veil">Veil (Minimal)</SelectItem>
          <SelectItem value="bold">Bold (Dark)</SelectItem>
          <SelectItem value="editorial">Editorial</SelectItem>
          <SelectItem value="gallery">Gallery</SelectItem>
          <SelectItem value="minimal">Minimal</SelectItem>
          <SelectItem value="interactive">Interactive</SelectItem>
          <SelectItem value="studio">Studio</SelectItem>
          <SelectItem value="personal">Personal</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
