import type { Metadata } from "next";
import { LeadForm } from "@/components/site/LeadForm";
import { PageHero } from "@/components/site/PageHero";
import { FadeIn } from "@/components/site/Motion";
import { services } from "@/data/services";
import { CheckIcon } from "@/components/site/icons";

export const metadata: Metadata = {
  title: "Request a Report",
  description:
    "Request an independent psychological or country expert report for your legal case.",
  alternates: { canonical: "/request-a-report" },
};

export default function RequestReportPage() {
  return (
    <>
      <PageHero
        eyebrow="Request a Report"
        title="Request a Report"
        description="Use this form to request an independent psychological assessment, mental health status certificate, country expert report, or counselling service."
        breadcrumbs={[
          { href: "/", label: "Home" },
          { label: "Request a Report" },
        ]}
      />

      <section className="section-pad">
        <div className="container-page grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <FadeIn>
            <h2 className="font-display text-2xl font-semibold text-primary">
              What you can instruct
            </h2>
            <ul className="mt-6 space-y-3">
              {services.map((service) => (
                <li key={service.id} className="flex items-start gap-3">
                  <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <div>
                    <p className="font-medium text-primary">{service.title}</p>
                    <p className="text-sm text-base-content/65">
                      {service.shortDescription}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </FadeIn>

          <FadeIn delay={0.08}>
            <div className="surface-card">
              <div className="card-body">
                <h2 className="font-display text-2xl font-semibold text-primary">
                  Instruction form
                </h2>
                <LeadForm
                  formType="request_report"
                  source="request_report_page"
                  campaign="request_report"
                  submitLabel="Submit Request"
                />
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
