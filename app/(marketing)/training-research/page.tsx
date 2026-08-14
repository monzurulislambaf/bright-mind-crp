import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { trainingContent } from "@/data/content";
import { trainingProgrammes, trainingFormats } from "@/data/training";
import { PageHero } from "@/components/site/PageHero";
import { SectionHeading } from "@/components/site/SectionHeading";
import { LeadForm } from "@/components/site/LeadForm";
import { CTASection } from "@/components/site/CTASection";
import { CheckIcon } from "@/components/site/icons";
import { FadeIn, Stagger, StaggerItem } from "@/components/site/Motion";

export const metadata: Metadata = {
  title: "Training & Research",
  description:
    "Professional development, workshops, webinars, and research-informed insight from Bright Mind — for psychologists, legal teams, and organisations working with vulnerable people.",
  alternates: { canonical: "/training-research" },
};

export default function TrainingResearchPage() {
  return (
    <>
      <PageHero
        eyebrow="Training & Research"
        title={trainingContent.heading}
        description={trainingContent.intro}
        breadcrumbs={[
          { href: "/", label: "Home" },
          { label: "Training & Research" },
        ]}
        ctas={[
          { href: "/contact", label: "Register interest in training" },
          { href: "/insights", label: "Explore insights", primary: false },
        ]}
      />

      <section className="section-pad">
        <div className="container-page">
          <FadeIn>
            <SectionHeading
              eyebrow="Formats"
              title="Professional development, delivered your way"
              subtitle="Programmes are built with our expert panel and confirmed on request — dates, fees, and CPD points are always confirmed before booking."
            />
          </FadeIn>
          <Stagger className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {trainingFormats.map((format) => (
              <StaggerItem key={format.title}>
                <article className="surface-card h-full">
                  <div className="card-body gap-3">
                    <h3 className="font-display text-lg font-semibold text-primary">
                      {format.title}
                    </h3>
                    <p className="text-base-content/70">{format.summary}</p>
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
              eyebrow="Programmes"
              title="Current training programmes"
              subtitle="All programmes are confirmed against our expert panel before dates are published. Register interest and we will confirm availability, fees, and CPD details."
            />
          </FadeIn>
          <Stagger className="grid gap-5 md:grid-cols-2">
            {trainingProgrammes.map((programme) => (
              <StaggerItem key={programme.id}>
                <article className="surface-card h-full">
                  <div className="card-body gap-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="badge badge-soft badge-primary badge-sm">
                        {programme.format}
                      </span>
                      <span className="badge badge-soft badge-neutral badge-sm">
                        {programme.delivery}
                      </span>
                      <span className="badge badge-soft badge-secondary badge-sm">
                        {programme.status === "available-on-request"
                          ? "Available on request"
                          : "Planned"}
                      </span>
                    </div>
                    <h3 className="card-title font-display text-xl text-primary">
                      {programme.title}
                    </h3>
                    <p className="text-base-content/70">{programme.summary}</p>
                    <dl className="grid gap-2 text-sm sm:grid-cols-2">
                      <div>
                        <dt className="font-medium text-base-content/60">
                          Audience
                        </dt>
                        <dd className="text-base-content/80">
                          {programme.audience}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-medium text-base-content/60">
                          Duration
                        </dt>
                        <dd className="text-base-content/80">
                          {programme.duration}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-medium text-base-content/60">
                          Trainer
                        </dt>
                        <dd className="text-base-content/80">
                          {programme.trainer}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-medium text-base-content/60">
                          Fee
                        </dt>
                        <dd className="text-base-content/80">{programme.fee}</dd>
                      </div>
                    </dl>
                    <ul className="space-y-2">
                      {programme.objectives.map((objective) => (
                        <li
                          key={objective}
                          className="flex items-start gap-2 text-sm text-base-content/75"
                        >
                          <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                          {objective}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page grid gap-10 lg:grid-cols-2 lg:items-start">
          <FadeIn>
            <SectionHeading
              eyebrow="Research & publications"
              title="Research-informed professional insight"
              subtitle={trainingContent.research}
            />
            <Link href="/insights" className="btn btn-outline gap-2">
              Visit the Insights hub
              <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </Link>
          </FadeIn>
          <FadeIn delay={0.08} className="lg:sticky lg:top-28">
            <div className="surface-card">
              <div className="card-body">
                <h2 className="font-display text-2xl font-semibold text-primary">
                  Register interest in training
                </h2>
                <LeadForm
                  formType="training"
                  source="training_page"
                  campaign="training-research"
                  submitLabel="Register Interest"
                />
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <CTASection
        title="Build professional development around your team"
        description="Tell us what your team needs — we will design a workshop, webinar, or in-house programme around it."
        primaryHref="/contact"
        primaryLabel="Enquire about training"
        secondaryHref="/request-callback"
        secondaryLabel="Request a callback"
      />
    </>
  );
}
