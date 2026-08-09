import type { Metadata } from "next";
import {
  ClipboardDocumentCheckIcon,
  DocumentTextIcon,
  HeartIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { individualContent } from "@/data/content";
import { PageHero } from "@/components/site/PageHero";
import { ProcessTimeline } from "@/components/site/ProcessTimeline";
import { SectionHeading } from "@/components/site/SectionHeading";
import { CTASection } from "@/components/site/CTASection";
import { FadeIn, Stagger, StaggerItem } from "@/components/site/Motion";

export const metadata: Metadata = {
  title: "For Individuals",
  description: individualContent.intro,
  alternates: { canonical: "/for-individuals" },
};

const helpIcons = [
  ClipboardDocumentCheckIcon,
  DocumentTextIcon,
  HeartIcon,
];

export default function ForIndividualsPage() {
  return (
    <>
      <PageHero
        eyebrow="For Individuals"
        title={individualContent.heading}
        description={individualContent.intro}
        breadcrumbs={[
          { href: "/", label: "Home" },
          { label: "For Individuals" },
        ]}
        ctas={[
          { href: "/contact", label: "Start an enquiry" },
          {
            href: "/request-callback",
            label: "Request a callback",
            primary: false,
          },
        ]}
      />

      <section className="section-pad">
        <div className="container-page">
          <FadeIn>
            <SectionHeading eyebrow="Support" title="How we can help" />
          </FadeIn>
          <Stagger className="grid gap-5 md:grid-cols-3">
            {individualContent.help.map((item, i) => {
              const Icon = helpIcons[i] ?? DocumentTextIcon;
              return (
                <StaggerItem key={item.title}>
                  <article className="surface-card h-full">
                    <div className="card-body gap-4">
                      <span className="flex h-11 w-11 items-center justify-center rounded-box bg-primary/10 text-primary">
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </span>
                      <h3 className="font-display text-lg font-semibold text-primary">
                        {item.title}
                      </h3>
                      <p className="text-base-content/70">{item.text}</p>
                    </div>
                  </article>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>

      <section className="section-pad border-y border-base-300 bg-base-200/40">
        <div className="container-page grid gap-12 lg:grid-cols-2 lg:items-start">
          <FadeIn>
            <SectionHeading
              eyebrow="Process"
              title="Enquiry → Suitability Review → Assessment → Secure Documents"
              subtitle="A calm, private pathway designed around your needs."
            />
          </FadeIn>
          <ProcessTimeline steps={individualContent.process} />
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page max-w-3xl">
          <FadeIn>
            <article className="surface-card">
              <div className="card-body flex-row items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-box bg-accent/15 text-accent">
                  <LockClosedIcon className="h-6 w-6" aria-hidden="true" />
                </span>
                <div>
                  <h2 className="font-display text-xl font-semibold text-primary">
                    Privacy & confidentiality
                  </h2>
                  <p className="mt-2 text-base-content/70">
                    {individualContent.privacy}
                  </p>
                </div>
              </div>
            </article>
          </FadeIn>
        </div>
      </section>

      <CTASection
        title="Need support?"
        description="Tell us what you need and our team will guide you to the right service."
        primaryHref="/contact"
        primaryLabel="Start an enquiry"
        secondaryHref="/request-callback"
        secondaryLabel="Request a callback"
      />
    </>
  );
}
