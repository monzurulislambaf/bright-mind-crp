import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { insightsContent } from "@/data/content";
import { PageHero } from "@/components/site/PageHero";
import { SectionHeading } from "@/components/site/SectionHeading";
import { CTASection } from "@/components/site/CTASection";
import { FadeIn, Stagger, StaggerItem } from "@/components/site/Motion";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Insights on asylum psychological reports, immigration assessments, country expert evidence, remote counselling, and secure legal workflows.",
  alternates: { canonical: "/insights" },
};

export default function InsightsPage() {
  return (
    <>
      <PageHero
        eyebrow="Insights"
        title={insightsContent.heading}
        description={insightsContent.intro}
        breadcrumbs={[
          { href: "/", label: "Home" },
          { label: "Insights" },
        ]}
        ctas={[
          { href: "/for-solicitors", label: "Solicitor pathway" },
          { href: "/reporting", label: "Reporting pathway", primary: false },
        ]}
      />

      <section className="section-pad">
        <div className="container-page">
          <FadeIn>
            <SectionHeading
              eyebrow="Topic clusters"
              title="A starter insights hub for legal, clinical, and operational search intent"
              subtitle="Each card routes visitors into a relevant Bright Mind pathway."
            />
          </FadeIn>
          <Stagger className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {insightsContent.cards.map((card) => (
              <StaggerItem key={card.title}>
                <article className="surface-card h-full">
                  <div className="card-body gap-4">
                    <h3 className="font-display text-lg font-semibold text-primary">
                      {card.title}
                    </h3>
                    <p className="flex-1 text-base-content/70">{card.summary}</p>
                    <div className="card-actions">
                      <Link
                        href={card.href}
                        className="btn btn-ghost btn-sm gap-1 px-0 text-primary"
                      >
                        Open this topic
                        <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <CTASection
        title="Looking for the right pathway?"
        description="Explore reporting, country evidence, counselling, or speak with the team about your matter."
        primaryHref="/request-a-report"
        primaryLabel="Request a Report"
        secondaryHref="/contact"
        secondaryLabel="Contact us"
      />
    </>
  );
}
