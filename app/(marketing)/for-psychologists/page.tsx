import type { Metadata } from "next";
import Image from "next/image";
import {
  CalendarDaysIcon,
  ComputerDesktopIcon,
  ClipboardDocumentListIcon,
  ScaleIcon,
} from "@heroicons/react/24/outline";
import { psychologistContent, professionalTracks } from "@/data/content";
import { PageHero } from "@/components/site/PageHero";
import { ProcessTimeline } from "@/components/site/ProcessTimeline";
import { SectionHeading } from "@/components/site/SectionHeading";
import { CTASection } from "@/components/site/CTASection";
import { CheckIcon } from "@/components/site/icons";
import { FadeIn, Stagger, StaggerItem } from "@/components/site/Motion";

export const metadata: Metadata = {
  title: "For Psychologists",
  description: psychologistContent.intro,
  alternates: { canonical: "/for-psychologists" },
};

const whyIcons = [
  CalendarDaysIcon,
  ComputerDesktopIcon,
  ClipboardDocumentListIcon,
  ScaleIcon,
];

export default function ForPsychologistsPage() {
  return (
    <>
      <PageHero
        eyebrow="For Psychologists"
        title={psychologistContent.heading}
        description={psychologistContent.intro}
        breadcrumbs={[
          { href: "/", label: "Home" },
          { label: "For Psychologists" },
        ]}
        ctas={[
          {
            href: "/join-psychologist-network",
            label: "Apply to the network",
          },
          { href: "/contact", label: "Contact us", primary: false },
        ]}
      />

      <section className="section-pad">
        <div className="container-page grid items-center gap-10 lg:grid-cols-2">
          <FadeIn>
            <div className="overflow-hidden rounded-box border border-base-300 bg-base-200">
              <Image
                alt="Bright Mind professional network of psychologists and experts"
                className="h-auto w-full object-cover"
                height={900}
                src="/brightmind-professionals.png"
                width={1200}
              />
            </div>
          </FadeIn>
          <FadeIn delay={0.08}>
            <SectionHeading
              eyebrow="Professional tracks"
              title="A network built for reporting, counselling, and country expertise"
              subtitle="Join as a consultant psychologist, counsellor, country expert, or quality-review collaborator."
            />
          </FadeIn>
        </div>
        <div className="container-page mt-10">
          <Stagger className="grid gap-5 md:grid-cols-2">
            {professionalTracks.map((track) => (
              <StaggerItem key={track.title}>
                <article className="surface-card h-full">
                  <div className="card-body gap-2">
                    <h3 className="font-display text-lg font-semibold text-primary">
                      {track.title}
                    </h3>
                    <p className="text-sm font-medium text-accent">
                      {track.credential}
                    </p>
                    <p className="text-base-content/70">{track.summary}</p>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="section-pad border-y border-base-300 bg-base-200/40">
        <div className="container-page">
          <FadeIn>
            <SectionHeading eyebrow="Benefits" title="Why join our network" />
          </FadeIn>
          <Stagger className="grid gap-5 md:grid-cols-2">
            {psychologistContent.why.map((item, i) => {
              const Icon = whyIcons[i] ?? CalendarDaysIcon;
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

      <section className="section-pad">
        <div className="container-page grid gap-12 lg:grid-cols-2 lg:items-start">
          <FadeIn>
            <SectionHeading
              eyebrow="Process"
              title="Register → Compliance Review → Approval → Case Offers → Report → Quality Review"
              subtitle="A clear pathway from application to active case work."
            />
          </FadeIn>
          <ProcessTimeline steps={psychologistContent.process} />
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page max-w-3xl">
          <FadeIn>
            <SectionHeading
              eyebrow="Requirements"
              title="What we look for"
            />
            <ul className="space-y-3">
              {psychologistContent.lookFor.map((item) => (
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
        title="Ready to join the panel?"
        description="Submit your application for compliance review and network onboarding."
        primaryHref="/join-psychologist-network"
        primaryLabel="Apply now"
        secondaryHref="/contact"
        secondaryLabel="Ask a question"
      />
    </>
  );
}
