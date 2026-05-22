import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { OnboardingProjectInput } from "@/lib/onboarding/types";
import { Plus, Trash2 } from "lucide-react";

interface ProjectsCardEditorProps {
  onChange: (projects: OnboardingProjectInput[]) => void;
  onSubmit: () => void;
  disabled?: boolean;
  maxItems?: number;
}

export function ProjectsCardEditor({ onChange, onSubmit, disabled, maxItems = 3 }: ProjectsCardEditorProps) {
  const [projects, setProjects] = useState<OnboardingProjectInput[]>([
    { title: "", description: "" }
  ]);

  const updateProject = (index: number, field: keyof OnboardingProjectInput, value: string) => {
    const newProjects = [...projects];
    newProjects[index] = { ...newProjects[index], [field]: value };
    setProjects(newProjects);
    onChange(newProjects.filter(p => p.title.trim()));
  };

  const addProject = () => {
    if (projects.length >= maxItems) return;
    setProjects([...projects, { title: "", description: "" }]);
  };

  const removeProject = (index: number) => {
    if (projects.length <= 1) return;
    const newProjects = projects.filter((_, i) => i !== index);
    setProjects(newProjects);
    onChange(newProjects.filter(p => p.title.trim()));
  };

  const validProjects = projects.filter(p => p.title.trim());

  return (
    <div className="space-y-4">
      {projects.map((project, index) => (
        <Card key={index} className="relative">
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:text-destructive"
            onClick={() => removeProject(index)}
            disabled={disabled || projects.length <= 1}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
          <CardContent className="pt-4 space-y-3">
            <div>
              <Label htmlFor={`project-title-${index}`} className="text-xs text-muted-foreground">
                Project Title
              </Label>
              <Input
                id={`project-title-${index}`}
                value={project.title}
                onChange={(e) => updateProject(index, "title", e.target.value)}
                placeholder="E-commerce Platform Redesign"
                disabled={disabled}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor={`project-desc-${index}`} className="text-xs text-muted-foreground">
                Description
              </Label>
              <Textarea
                id={`project-desc-${index}`}
                value={project.description}
                onChange={(e) => updateProject(index, "description", e.target.value)}
                placeholder="Brief description of what you built..."
                disabled={disabled}
                className="mt-1"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>
      ))}

      {projects.length < maxItems && (
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={addProject}
          disabled={disabled}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Another Project
        </Button>
      )}

      <div className="flex justify-end pt-2">
        <Button
          onClick={onSubmit}
          disabled={disabled || validProjects.length === 0}
          size="sm"
        >
          Continue ({validProjects.length} project{validProjects.length !== 1 ? 's' : ''})
        </Button>
      </div>
    </div>
  );
}
