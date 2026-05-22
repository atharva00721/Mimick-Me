import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface FAQAccordionEditorProps {
  onChange: (faqs: string[]) => void;
  onSubmit: () => void;
  disabled?: boolean;
}

export function FAQAccordionEditor({ onChange, onSubmit, disabled }: FAQAccordionEditorProps) {
  const [faqs, setFaqs] = useState<Array<{ id: string; question: string; answer: string }>>([
    { id: crypto.randomUUID(), question: "", answer: "" },
  ]);

  const updateFaq = (index: number, field: "question" | "answer", value: string) => {
    const newFaqs = [...faqs];
    newFaqs[index] = { ...newFaqs[index], [field]: value };
    setFaqs(newFaqs);
    onChange(newFaqs.filter(f => f.question.trim()).map(f => `${f.question}: ${f.answer}`));
  };

  const addFaq = () => {
    setFaqs([...faqs, { id: crypto.randomUUID(), question: "", answer: "" }]);
  };

  const removeFaq = (index: number) => {
    if (faqs.length <= 1) return;
    const newFaqs = faqs.filter((_, i) => i !== index);
    setFaqs(newFaqs);
    onChange(newFaqs.filter(f => f.question.trim()).map(f => `${f.question}: ${f.answer}`));
  };

  const validFaqs = faqs.filter(f => f.question.trim());

  return (
    <div className="space-y-3">
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={faq.id} value={faq.id}>
            <AccordionTrigger className="text-sm">
              {faq.question || `FAQ ${index + 1}`}
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pt-2">
                <div>
                  <Label className="text-xs text-muted-foreground">Question</Label>
                  <Input
                    value={faq.question}
                    onChange={(e) => updateFaq(index, "question", e.target.value)}
                    placeholder="e.g. What industries do you work with?"
                    disabled={disabled}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Answer</Label>
                  <Textarea
                    value={faq.answer}
                    onChange={(e) => updateFaq(index, "answer", e.target.value)}
                    placeholder="e.g. I primarily work with tech startups..."
                    disabled={disabled}
                    className="mt-1"
                    rows={2}
                  />
                </div>
                {faqs.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => removeFaq(index)}
                    disabled={disabled}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full"
        onClick={addFaq}
        disabled={disabled}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add FAQ
      </Button>

      {validFaqs.length > 0 && (
        <div className="flex justify-end pt-2">
          <Button onClick={onSubmit} disabled={disabled} size="sm">
            Continue ({validFaqs.length})
          </Button>
        </div>
      )}
    </div>
  );
}
