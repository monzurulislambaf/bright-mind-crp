import type { Faq } from "@/data/faqs";

export function FAQAccordion({ items }: { items: Faq[] }) {
  return (
    <div className="space-y-3">
      {items.map((faq) => (
        <details
          key={faq.id}
          className="collapse-arrow collapse border border-base-300 bg-base-100 shadow-sm open:border-primary/20 open:shadow-md"
        >
          <summary className="collapse-title font-medium text-primary">
            {faq.question}
          </summary>
          <div className="collapse-content">
            <p className="pb-2 leading-relaxed text-base-content/70">
              {faq.answer}
            </p>
          </div>
        </details>
      ))}
    </div>
  );
}
