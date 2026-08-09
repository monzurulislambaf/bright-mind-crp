import type { Metadata } from "next";
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  DocumentTextIcon,
  PhoneArrowUpRightIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import { LeadForm } from "@/components/site/LeadForm";
import { PageHero } from "@/components/site/PageHero";
import { siteContact } from "@/data/navigation";
import { FadeIn, Stagger, StaggerItem } from "@/components/site/Motion";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Bright Mind for report instructions, callbacks, and general enquiries.",
  alternates: { canonical: "/contact" },
};

const forms = [
  {
    label: "Request a Report",
    description: "New instructions for assessments and reports.",
    formType: "request_report" as const,
    icon: DocumentTextIcon,
  },
  {
    label: "Request a Callback",
    description: "Prefer to talk? We will call you back.",
    formType: "callback" as const,
    icon: PhoneArrowUpRightIcon,
  },
  {
    label: "General Enquiry",
    description: "Anything else — we are happy to help.",
    formType: "general" as const,
    icon: ChatBubbleLeftRightIcon,
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Get in touch"
        description="Choose the option that fits you best and our team will take it from there."
        breadcrumbs={[
          { href: "/", label: "Home" },
          { label: "Contact" },
        ]}
      />

      <section className="section-pad">
        <div className="container-page">
          <FadeIn className="mb-12 grid gap-4 sm:grid-cols-3">
            <div className="surface-card">
              <div className="card-body flex-row items-start gap-3">
                <EnvelopeIcon className="mt-0.5 h-5 w-5 text-accent" aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium text-base-content/60">Email</p>
                  <p className="text-primary">{siteContact.email}</p>
                </div>
              </div>
            </div>
            <div className="surface-card">
              <div className="card-body flex-row items-start gap-3">
                <PhoneIcon className="mt-0.5 h-5 w-5 text-accent" aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium text-base-content/60">Phone</p>
                  <p className="text-primary">{siteContact.phone}</p>
                </div>
              </div>
            </div>
            <div className="surface-card">
              <div className="card-body flex-row items-start gap-3">
                <MapPinIcon className="mt-0.5 h-5 w-5 text-accent" aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium text-base-content/60">Address</p>
                  <p className="text-primary">{siteContact.address}</p>
                </div>
              </div>
            </div>
          </FadeIn>

          <Stagger className="grid gap-6 lg:grid-cols-3">
            {forms.map((form) => {
              const Icon = form.icon;
              return (
                <StaggerItem key={form.formType}>
                  <article className="surface-card h-full">
                    <div className="card-body gap-4">
                      <span className="flex h-11 w-11 items-center justify-center rounded-box bg-primary/10 text-primary">
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </span>
                      <h2 className="font-display text-xl font-semibold text-primary">
                        {form.label}
                      </h2>
                      <p className="text-base-content/70">{form.description}</p>
                      <LeadForm
                        formType={form.formType}
                        source="contact_page"
                        campaign="contact"
                        submitLabel="Send"
                        compact
                      />
                    </div>
                  </article>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>
    </>
  );
}
