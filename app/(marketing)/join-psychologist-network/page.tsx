import type { Metadata } from "next";
import { psychologistContent } from "@/data/content";
import { LeadForm } from "@/components/site/LeadForm";
import { PageHero } from "@/components/site/PageHero";
import { ProcessTimeline } from "@/components/site/ProcessTimeline";
import { SectionHeading } from "@/components/site/SectionHeading";
import { CheckIcon } from "@/components/site/icons";
import { FadeIn, Stagger, StaggerItem } from "@/components/site/Motion";

export const metadata: Metadata = {
  title: "Join Psychologist Network",
  description: psychologistContent.intro,
  alternates: { canonical: "/join-psychologist-network" },
};

export default function JoinPsychologistNetworkPage() {
  return (
    <>
      <PageHero
        eyebrow="Join Psychologist Network"
        title={psychologistContent.heading}
        description={psychologistContent.intro}
        breadcrumbs={[
          { href: "/", label: "Home" },
          { href: "/for-psychologists", label: "For Psychologists" },
          { label: "Join Network" },
        ]}
      />

      <section className="section-pad">
        <div className="container-page grid gap-12 lg:grid-cols-2 lg:items-start">
          <div className="space-y-12">
            <FadeIn>
              <SectionHeading eyebrow="Benefits" title="Why join" />
              <Stagger className="mt-6 grid gap-4">
                {psychologistContent.why.map((item) => (
                  <StaggerItem key={item.title}>
                    <article className="surface-card">
                      <div className="card-body gap-2">
                        <h3 className="font-display text-lg font-semibold text-primary">
                          {item.title}
                        </h3>
                        <p className="text-base-content/70">{item.text}</p>
                      </div>
                    </article>
                  </StaggerItem>
                ))}
              </Stagger>
            </FadeIn>

            <FadeIn>
              <SectionHeading eyebrow="Process" title="Application pathway" />
              <div className="mt-6">
                <ProcessTimeline steps={psychologistContent.process} />
              </div>
            </FadeIn>

            <FadeIn>
              <SectionHeading eyebrow="Requirements" title="What we look for" />
              <ul className="mt-4 space-y-3">
                {psychologistContent.lookFor.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                    <span className="text-base-content/80">{item}</span>
                  </li>
                ))}
              </ul>
            </FadeIn>
          </div>

          <FadeIn delay={0.08} className="lg:sticky lg:top-28">
            <div className="surface-card">
              <div className="card-body">
                <h2 className="font-display text-2xl font-semibold text-primary">
                  Application form
                </h2>
                <LeadForm
                  formType="psychologist"
                  source="join_psychologist_network_page"
                  campaign="psychologist"
                  submitLabel="Submit application"
                />
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
