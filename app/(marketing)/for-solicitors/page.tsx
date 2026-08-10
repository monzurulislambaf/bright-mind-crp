import type { Metadata } from "next";
import {
  DocumentTextIcon,
  ClipboardDocumentCheckIcon,
  GlobeAltIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { solicitorContent } from "@/data/content";
import { PageHero } from "@/components/site/PageHero";
import { ProcessTimeline } from "@/components/site/ProcessTimeline";
import { SectionHeading } from "@/components/site/SectionHeading";
import { CTASection } from "@/components/site/CTASection";
import { CheckIcon } from "@/components/site/icons";
import { FadeIn, Stagger, StaggerItem } from "@/components/site/Motion";

export const metadata: Metadata = {
  title: "For Solicitors",
  description: solicitorContent.intro,
  alternates: { canonical: "/for-solicitors" },
};

const supportIcons = [
  DocumentTextIcon,
  ClipboardDocumentCheckIcon,
  GlobeAltIcon,
  LockClosedIcon,
];

export default function ForSolicitorsPage() {
  return (
    <>
      <PageHero
        eyebrow="For Solicitors"
        title={solicitorContent.heading}
        description={solicitorContent.intro}
        breadcrumbs={[
          { href: "/", label: "Home" },
          { label: "For Solicitors" },
        ]}
        ctas={[
          { href: "/request-a-report", label: "Request a Report" },
          {
            href: "/solicitor-partnership",
            label: "Partnership enquiry",
            primary: false,
          },
        ]}
      />

      <section className="section-pad">
        <div className="container-page">
          <FadeIn>
            <SectionHeading
              eyebrow="Support"
              title="How we support legal teams"
            />
          </FadeIn>
          <Stagger className="grid gap-5 md:grid-cols-2">
            {solicitorContent.support.map((item, i) => {
              const Icon = supportIcons[i] ?? DocumentTextIcon;
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
              title="Instruct → Allocation → Assessment → Quality Review → Secure Release"
              subtitle="A transparent pathway designed for legal instruction and controlled document release."
            />
          </FadeIn>
          <ProcessTimeline steps={solicitorContent.process} />
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page grid gap-12 lg:grid-cols-2 lg:items-start">
          <FadeIn>
            <SectionHeading eyebrow="Why Bright Mind" title="Built for instruction quality" />
            <ul className="mt-2 space-y-3">
              {solicitorContent.why.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <span className="text-base-content/80">{item}</span>
                </li>
              ))}
            </ul>
          </FadeIn>
          <FadeIn delay={0.08}>
            <SectionHeading
              eyebrow="Instruction checklist"
              title="What to include when you instruct"
              subtitle="Help us triage efficiently and route the matter into the right workflow."
            />
            <ul className="mt-2 space-y-3">
              {solicitorContent.instructionChecklist.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <span className="text-base-content/80">{item}</span>
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>
      </section>

      <CTASection
        title="Ready to instruct?"
        description="Submit an instruction or explore a firm partnership with Bright Mind."
        primaryHref="/request-a-report"
        primaryLabel="Request a Report"
        secondaryHref="/solicitor-partnership"
        secondaryLabel="Solicitor Partnership"
      />
    </>
  );
}
