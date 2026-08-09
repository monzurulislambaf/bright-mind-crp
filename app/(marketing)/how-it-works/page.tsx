import type { Metadata } from "next";
import { LockClosedIcon } from "@heroicons/react/24/outline";
import { howItWorksContent } from "@/data/content";
import { PageHero } from "@/components/site/PageHero";
import { ProcessTimeline } from "@/components/site/ProcessTimeline";
import { SectionHeading } from "@/components/site/SectionHeading";
import { CTASection } from "@/components/site/CTASection";
import { FadeIn } from "@/components/site/Motion";

export const metadata: Metadata = {
  title: "How It Works",
  description: howItWorksContent.intro,
  alternates: { canonical: "/how-it-works" },
};

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        eyebrow="How It Works"
        title={howItWorksContent.heading}
        description={howItWorksContent.intro}
        breadcrumbs={[
          { href: "/", label: "Home" },
          { label: "How It Works" },
        ]}
        ctas={[
          { href: "/request-a-report", label: "Request a Report" },
          { href: "/contact", label: "Contact us", primary: false },
        ]}
      />

      <section className="section-pad">
        <div className="container-page grid gap-16">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <FadeIn>
              <SectionHeading
                eyebrow="Solicitors"
                title="Instruction to secure release"
              />
            </FadeIn>
            <ProcessTimeline steps={howItWorksContent.solicitors} />
          </div>

          <div className="grid gap-10 border-t border-base-300 pt-16 lg:grid-cols-2 lg:items-start">
            <FadeIn>
              <SectionHeading
                eyebrow="Individuals"
                title="Enquiry to secure documents"
              />
            </FadeIn>
            <ProcessTimeline steps={howItWorksContent.individuals} />
          </div>

          <div className="grid gap-10 border-t border-base-300 pt-16 lg:grid-cols-2 lg:items-start">
            <FadeIn>
              <SectionHeading
                eyebrow="Psychologists"
                title="Registration to report delivery"
              />
            </FadeIn>
            <ProcessTimeline steps={howItWorksContent.psychologists} />
          </div>
        </div>
      </section>

      <section className="section-pad border-t border-base-300 bg-base-200/40">
        <div className="container-page max-w-3xl">
          <FadeIn>
            <article className="surface-card">
              <div className="card-body flex-row items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-box bg-accent/15 text-accent">
                  <LockClosedIcon className="h-6 w-6" aria-hidden="true" />
                </span>
                <div>
                  <h2 className="font-display text-xl font-semibold text-primary">
                    Secure by design
                  </h2>
                  <p className="mt-2 text-base-content/70">
                    {howItWorksContent.secure}
                  </p>
                </div>
              </div>
            </article>
          </FadeIn>
        </div>
      </section>

      <CTASection
        title="Start your pathway"
        description="Whether you are instructing, applying, or seeking support — we will guide the next step."
        primaryHref="/request-a-report"
        primaryLabel="Request a Report"
        secondaryHref="/contact"
        secondaryLabel="Contact us"
      />
    </>
  );
}
