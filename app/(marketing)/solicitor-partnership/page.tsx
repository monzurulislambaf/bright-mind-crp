import type { Metadata } from "next";
import { solicitorContent } from "@/data/content";
import { LeadForm } from "@/components/site/LeadForm";
import { PageHero } from "@/components/site/PageHero";
import { SectionHeading } from "@/components/site/SectionHeading";
import { CheckIcon } from "@/components/site/icons";
import { FadeIn, Stagger, StaggerItem } from "@/components/site/Motion";

export const metadata: Metadata = {
  title: "Solicitor Partnership",
  description: solicitorContent.intro,
  alternates: { canonical: "/solicitor-partnership" },
};

export default function SolicitorPartnershipPage() {
  return (
    <>
      <PageHero
        eyebrow="Solicitor Partnership"
        title="Partner with Bright Mind"
        description={solicitorContent.intro}
        breadcrumbs={[
          { href: "/", label: "Home" },
          { href: "/for-solicitors", label: "For Solicitors" },
          { label: "Partnership" },
        ]}
      />

      <section className="section-pad">
        <div className="container-page grid gap-12 lg:grid-cols-2 lg:items-start">
          <div className="space-y-10">
            <FadeIn>
              <SectionHeading
                eyebrow="Support"
                title="How partnership works"
              />
              <Stagger className="mt-6 grid gap-4">
                {solicitorContent.support.map((item) => (
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
              <SectionHeading eyebrow="Benefits" title="Why partner with us" />
              <ul className="mt-4 space-y-3">
                {solicitorContent.why.map((item) => (
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
                  Partnership enquiry
                </h2>
                <LeadForm
                  formType="solicitor_partner"
                  source="solicitor_partnership_page"
                  campaign="solicitor"
                  submitLabel="Submit enquiry"
                />
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
