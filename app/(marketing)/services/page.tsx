import type { Metadata } from "next";
import { psychologicalServices } from "@/data/services";
import { servicesIntro } from "@/data/content";
import { PageHero } from "@/components/site/PageHero";
import { ServiceCard } from "@/components/site/ServiceCard";
import { LeadForm } from "@/components/site/LeadForm";
import { CTASection } from "@/components/site/CTASection";
import { FadeIn, Stagger, StaggerItem } from "@/components/site/Motion";
import { CheckIcon } from "@/components/site/icons";

export const metadata: Metadata = {
  title: "Psychological Services",
  description: servicesIntro,
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Psychological Services"
        title="Professional psychological services for individuals and organisations"
        description={servicesIntro}
        breadcrumbs={[
          { href: "/", label: "Home" },
          { label: "Psychological Services" },
        ]}
        ctas={[
          { href: "/contact", label: "Enquire / Book" },
          { href: "/request-a-report", label: "Instruct an Expert", primary: false },
        ]}
      />

      <section className="section-pad">
        <div className="container-page">
          <Stagger className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {psychologicalServices.map((service) => (
              <StaggerItem key={service.id}>
                <div id={service.id} className="scroll-mt-28 h-full">
                  <ServiceCard service={service} />
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="section-pad border-y border-base-300 bg-base-200/40">
        <div className="container-page grid gap-10 lg:grid-cols-2 lg:items-start">
          <FadeIn>
            <h2 className="font-display text-3xl font-semibold text-primary">
              Service detail
            </h2>
            <p className="mt-4 text-base-content/70">
              Each service explains what it is, who it is for, what it involves,
              and who provides it. Suitability is always confirmed before any
              commitment, and forensic evidence pathways are kept separate from
              psychological services.
            </p>
            <div className="mt-8 space-y-6">
              {psychologicalServices.map((service) => (
                <article
                  key={service.id}
                  id={`${service.id}-detail`}
                  className="surface-card scroll-mt-28"
                >
                  <div className="card-body gap-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-display text-sm tracking-widest text-base-content/40">
                        {service.number}
                      </span>
                      <h3 className="font-display text-xl font-semibold text-primary">
                        {service.title}
                      </h3>
                      <span className="badge badge-soft badge-primary badge-sm">
                        {service.rate}
                      </span>
                    </div>
                    <p className="text-base-content/70">{service.description}</p>
                    <ul className="mt-1 space-y-2">
                      {service.details.map((detail) => (
                        <li
                          key={detail}
                          className="flex items-start gap-2 text-sm text-base-content/75"
                        >
                          <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                    <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                      {service.useCases.map((useCase) => (
                        <li
                          key={useCase}
                          className="flex items-start gap-2 text-sm text-base-content/75"
                        >
                          <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                          {useCase}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.08} className="lg:sticky lg:top-28">
            <div className="surface-card">
              <div className="card-body">
                <h2 className="font-display text-2xl font-semibold text-primary">
                  Enquire / Book
                </h2>
                <p className="text-base-content/70">
                  Tell us what you need and we will confirm suitability and the
                  right pathway for you.
                </p>
                <div className="mt-4">
                  <LeadForm
                    formType="individual"
                    source="services_page"
                    campaign="psychological-services"
                    submitLabel="Send Enquiry"
                    showFields={[
                      "firstName",
                      "lastName",
                      "email",
                      "phone",
                      "reportType",
                      "notes",
                      "consent",
                    ]}
                  />
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <CTASection
        title="Not sure which service is right for you?"
        description="Our team can help you understand your options — honestly and without obligation."
        primaryHref="/contact"
        primaryLabel="Contact us"
        secondaryHref="/request-callback"
        secondaryLabel="Request a callback"
      />
    </>
  );
}
