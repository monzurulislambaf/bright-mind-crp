import type { Metadata } from "next";
import {
  GlobeAltIcon,
  LanguageIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { ourExpertsContent } from "@/data/content";
import { experts, expertSelectionSteps } from "@/data/experts";
import { PageHero } from "@/components/site/PageHero";
import { SectionHeading } from "@/components/site/SectionHeading";
import { CTASection } from "@/components/site/CTASection";
import { FadeIn, Stagger, StaggerItem } from "@/components/site/Motion";

export const metadata: Metadata = {
  title: "Our Experts",
  description:
    "Meet Bright Mind's panel of qualified psychologists, counsellors, and country experts — reviewed for registration, qualifications, and expertise before joining the panel.",
  alternates: { canonical: "/our-experts" },
};

export default function OurExpertsPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Experts"
        title={ourExpertsContent.heading}
        description={ourExpertsContent.intro}
        breadcrumbs={[
          { href: "/", label: "Home" },
          { label: "Our Experts" },
        ]}
        ctas={[
          { href: "/request-a-report", label: "Instruct an Expert" },
          {
            href: "/join-psychologist-network",
            label: "Join the expert network",
            primary: false,
          },
        ]}
      />

      <section className="section-pad">
        <div className="container-page">
          <FadeIn>
            <SectionHeading
              eyebrow="How experts are selected"
              title="Vetting before publication, verification before instruction"
              subtitle="No expert appears on the panel without review. Registration, qualifications, experience, and insurance are verified before approval."
            />
          </FadeIn>
          <Stagger className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {expertSelectionSteps.map((step, index) => (
              <StaggerItem key={step.title}>
                <article className="surface-card h-full">
                  <div className="card-body gap-3">
                    <span className="font-display text-sm tracking-widest text-base-content/40">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-display text-lg font-semibold text-primary">
                      {step.title}
                    </h3>
                    <p className="text-base-content/70">{step.text}</p>
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
            <SectionHeading
              eyebrow="Expert directory"
              title="Our expert panel"
              subtitle="Public profiles are published as experts are onboarded and verified. Until then, the panel is described by role — contact us to confirm the current panel for your matter."
            />
          </FadeIn>
          <Stagger className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {experts.map((expert) => (
              <StaggerItem key={expert.id}>
                <article className="surface-card h-full">
                  <div className="card-body gap-4">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="card-title font-display text-xl text-primary">
                        {expert.role}
                      </h3>
                      <span className="badge badge-soft badge-secondary badge-sm shrink-0">
                        {expert.name ? "Published" : "Profile in progress"}
                      </span>
                    </div>
                    {expert.name ? (
                      <p className="font-medium text-base-content/80">
                        {expert.name}
                      </p>
                    ) : (
                      <p className="text-sm italic text-base-content/60">
                        Name and qualifications published on onboarding
                      </p>
                    )}
                    {expert.title ? (
                      <p className="text-base-content/70">{expert.title}</p>
                    ) : null}
                    {expert.registration ? (
                      <p className="flex items-start gap-2 text-sm text-base-content/70">
                        <CheckCircleIcon
                          className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                          aria-hidden="true"
                        />
                        {expert.registration}
                      </p>
                    ) : null}
                    <div>
                      <p className="mb-2 text-sm font-medium text-base-content/60">
                        Specialisms
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {expert.specialisms.map((specialism) => (
                          <span
                            key={specialism}
                            className="badge badge-soft badge-neutral badge-sm"
                          >
                            {specialism}
                          </span>
                        ))}
                      </div>
                    </div>
                    <dl className="grid gap-2 text-sm">
                      <div className="flex items-start gap-2">
                        <GlobeAltIcon
                          className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                          aria-hidden="true"
                        />
                        <dd className="text-base-content/75">
                          {expert.countries.join(", ")}
                        </dd>
                      </div>
                      <div className="flex items-start gap-2">
                        <LanguageIcon
                          className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                          aria-hidden="true"
                        />
                        <dd className="text-base-content/75">
                          {expert.languages.join(", ")}
                        </dd>
                      </div>
                    </dl>
                    {expert.bio ? (
                      <p className="text-sm leading-relaxed text-base-content/70">
                        {expert.bio}
                      </p>
                    ) : null}
                    {expert.availability ? (
                      <p className="text-sm font-medium text-base-content/60">
                        Availability: {expert.availability}
                      </p>
                    ) : null}
                  </div>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page max-w-3xl">
          <FadeIn>
            <div className="rounded-box border border-dashed border-base-300 bg-base-200/50 p-6">
              <h2 className="font-display text-xl font-semibold text-primary">
                Public and confidential information
              </h2>
              <p className="mt-3 leading-relaxed text-base-content/70">
                {ourExpertsContent.note}
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      <CTASection
        title="Instruct an expert or join the network"
        description="Legal teams can instruct our expert division directly; psychologists and country experts can apply to join the panel."
        primaryHref="/request-a-report"
        primaryLabel="Instruct an Expert"
        secondaryHref="/join-psychologist-network"
        secondaryLabel="Join the expert network"
      />
    </>
  );
}
