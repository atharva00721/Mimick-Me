import { productFaqs } from "@/lib/structured-data";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function HomeFaq() {
  return (
    <section className="bg-background py-24 sm:py-32" aria-labelledby="homepage-faq-heading">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="homepage-faq-heading" className="font-serif text-3xl font-medium tracking-tight text-foreground sm:text-4xl text-balance">
            Frequently asked questions
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Have a different question and can&apos;t find the answer you&apos;re looking for? Reach out to our support team.
          </p>
        </div>
        <div className="mt-16">
          <Accordion type="single" collapsible className="w-full">
            {productFaqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b-border/40 py-2">
                <AccordionTrigger className="text-left font-medium text-base hover:text-primary transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
