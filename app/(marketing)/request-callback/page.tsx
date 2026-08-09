import type { Metadata } from "next";
import { LeadForm } from "@/components/site/LeadForm";
import { PageHero } from "@/components/site/PageHero";
import { FadeIn } from "@/components/site/Motion";

export const metadata: Metadata = {
  title: "Request a Callback",
  description: "Request a callback from the Bright Mind team.",
  alternates: { canonical: "/request-callback" },
};

export default function RequestCallbackPage() {
  return (
    <>
      <PageHero
        eyebrow="Request a Callback"
        title="Request a Callback"
        description="Prefer to talk? Leave your details and a member of our team will call you back at your preferred time."
        breadcrumbs={[
          { href: "/", label: "Home" },
          { label: "Request a Callback" },
        ]}
      />

      <section className="section-pad">
        <div className="container-page max-w-2xl">
          <FadeIn>
            <div className="surface-card">
              <div className="card-body">
                <h2 className="font-display text-2xl font-semibold text-primary">
                  Callback request
                </h2>
                <LeadForm
                  formType="callback"
                  source="request_callback_page"
                  campaign="callback"
                  submitLabel="Request Callback"
                />
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
