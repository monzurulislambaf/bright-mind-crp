import type { Metadata } from "next";
import { faqs } from "@/data/faqs";
import { PageHero } from "@/components/site/PageHero";
import { FAQAccordion } from "@/components/site/FAQAccordion";
import { CTASection } from "@/components/site/CTASection";
import { FadeIn } from "@/components/site/Motion";

export const metadata: Metadata = {
  title: "FAQs",
  description:
    "Answers about Bright Mind services, instructions, country coverage, confidentiality, and network applications.",
  alternates: { canonical: "/faqs" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export default function FaqsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHero
        eyebrow="FAQs"
        title="Frequently asked questions"
        description="Everything you might want to know before working with Bright Mind."
        breadcrumbs={[
          { href: "/", label: "Home" },
          { label: "FAQs" },
        ]}
      />

      <section className="section-pad">
        <div className="container-page max-w-3xl">
          <FadeIn>
            <FAQAccordion items={faqs} />
          </FadeIn>
        </div>
      </section>

      <CTASection
        title="Still have a question?"
        description="Our team is happy to help with instructions, partnerships, and individual enquiries."
        primaryHref="/contact"
        primaryLabel="Contact us"
        secondaryHref="/request-callback"
        secondaryLabel="Request a callback"
      />
    </>
  );
}
