import type { Metadata } from "next";
import { expertForensicContent } from "@/data/content";
import { forensicServices } from "@/data/services";
import { PageHero } from "@/components/site/PageHero";
import { SectionHeading } from "@/components/site/SectionHeading";
import { ServiceCard } from "@/components/site/ServiceCard";
import { ProcessTimeline } from "@/components/site/ProcessTimeline";
import { LeadForm } from "@/components/site/LeadForm";
import { CTASection } from "@/components/site/CTASection";
import { CheckIcon } from "@/components/site/icons";
import { FadeIn, Stagger, StaggerItem } from "@/components/site/Motion";

export const metadata: Metadata = {
  title: "Expert & Forensic Psychology",
  description:
    "Bright Mind's specialist division for independent expert psychological evidence — expert psychological reports, forensic assessment, immigration and asylum evidence, and court-facing expert evidence for legal teams.",
  alternates: { canonical: "/expert-forensic" },
};

export default function ExpertForensicPage() {
  return (
    <>
      <PageHero
        eyebrow="Specialist division"
        title={expertForensicContent.heading}
        description={expertForensicContent.intro}
        breadcrumbs={[
          { href: "/", label: "Home" },
          { label: "Expert & Forensic" },
        ]}
        ctas={[
          { href: "/request-a-report", label: "Instruct an Expert" },
          { href: "/services", label: "Psychological services", primary: false },
        ]}
      />

      <section className="section-pad">
        <div className="container-page">
          <FadeIn>
            <SectionHeading
              eyebrow="What we provide"
              title="Independent expert evidence, structured for scrutiny"
              subtitle="Every output is prepared by qualified professionals, quality-reviewed, and released securely — with evidence and limitations stated honestly."
            />
          </FadeIn>
          <Stagger className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {forensicServices.map((service) => (
              <StaggerItem key={service.id}>
                <ServiceCard service={service} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="section-pad border-y border-base-300 bg-base-200/40">
        <div className="container-page grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <FadeIn>
            <SectionHeading
              eyebrow="Reporting process"
              title="From instruction to secure release"
              subtitle="A clear, auditable journey with expert allocation and quality review built in."
            />
          </FadeIn>
          <ProcessTimeline steps={expertForensicContent.process} />
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page grid gap-10 lg:grid-cols-2 lg:items-start">
          <FadeIn>
            <SectionHeading
              eyebrow="Professional standards"
              title="Independence, evidence, and accountability"
              subtitle="The division operates to the standards courts and tribunals expect of expert evidence."
            />
          </FadeIn>
          <FadeIn delay={0.08}>
            <ul className="space-y-3">
              {expertForensicContent.standards.map((standard) => (
                <li key={standard} className="flex items-start gap-3">
                  <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <span className="text-base-content/80">{standard}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 rounded-box border border-dashed border-base-300 bg-base-200/50 p-4 text-sm text-base-content/70">
              The expert and forensic division is one part of Bright Mind.
              Psychological services such as assessment, consultation, and
              counselling are kept clearly separate from forensic evidence
              pathways.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="section-pad border-y border-base-300 bg-base-200/40">
        <div className="container-page grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-start">
          <FadeIn>
            <SectionHeading
              eyebrow="Instruct an expert"
              title="Tell us about the legal question"
              subtitle="Share the essentials of your instruction — we will confirm whether expert evidence is warranted and match the right specialist."
            />
          </FadeIn>
          <FadeIn delay={0.08} className="lg:sticky lg:top-28">
            <div className="surface-card">
              <div className="card-body">
                <LeadForm
                  formType="instruct_expert"
                  source="expert_forensic_page"
                  campaign="expert-forensic"
                  submitLabel="Instruct an Expert"
                />
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <CTASection
        title="Need expert psychological evidence for a case?"
        description="Instruct our expert division or speak with the team about whether expert evidence is right for your matter."
        primaryHref="/request-a-report"
        primaryLabel="Instruct an Expert"
        secondaryHref="/contact"
        secondaryLabel="Contact us"
      />
    </>
  );
}
