import type { Metadata } from "next";
import Image from "next/image";
import { countryReportsContent } from "@/data/content";
import { countries } from "@/data/countries";
import { PageHero } from "@/components/site/PageHero";
import { SectionHeading } from "@/components/site/SectionHeading";
import { CountryGrid } from "@/components/site/CountryGrid";
import { CTASection } from "@/components/site/CTASection";
import { CheckIcon } from "@/components/site/icons";
import { FadeIn, Stagger, StaggerItem } from "@/components/site/Motion";

export const metadata: Metadata = {
  title: "Country Expert Reports",
  description:
    "Country expert reports for asylum and immigration proceedings, including mental-health landscape evidence, return-risk context, and country conditions analysis.",
  alternates: { canonical: "/country-reports" },
};

export default function CountryReportsPage() {
  return (
    <>
      <PageHero
        eyebrow="Country expert reports"
        title={countryReportsContent.heading}
        description={countryReportsContent.intro}
        breadcrumbs={[
          { href: "/", label: "Home" },
          { label: "Country Reports" },
        ]}
        ctas={[
          { href: "/request-a-report", label: "Request a country report" },
          { href: "/services", label: "See all services", primary: false },
        ]}
      />

      <section className="section-pad">
        <div className="container-page grid items-center gap-10 lg:grid-cols-2">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.18em] text-accent uppercase">
              Why this page exists
            </p>
            <h2 className="font-display mt-3 text-3xl font-semibold text-primary">
              Legal teams often need more than background reading
            </h2>
            <p className="mt-4 text-base leading-relaxed text-base-content/70">
              Expert help on country conditions, access to mental health
              treatment, and the practical risks a client may face on return —
              prepared for legal scrutiny.
            </p>
          </FadeIn>
          <FadeIn delay={0.08}>
            <div className="overflow-hidden rounded-box border border-base-300 bg-base-200">
              <Image
                alt="Secure country report and legal evidence workflow"
                className="h-auto w-full object-cover"
                height={900}
                src="/brightmind-portal.png"
                width={1200}
              />
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="section-pad border-y border-base-300 bg-base-200/40">
        <div className="container-page">
          <FadeIn>
            <SectionHeading
              eyebrow="Report themes"
              title="What a professionally framed country report can address"
            />
          </FadeIn>
          <Stagger className="grid gap-5 md:grid-cols-3">
            {countryReportsContent.themes.map((theme) => (
              <StaggerItem key={theme.title}>
                <article className="surface-card h-full">
                  <div className="card-body gap-3">
                    <h3 className="font-display text-lg font-semibold text-primary">
                      {theme.title}
                    </h3>
                    <p className="text-base-content/70">{theme.summary}</p>
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
              eyebrow="Professional difference"
              title="Why legal teams commission expert country evidence"
              subtitle="Case-specific analysis carries more weight than generic online research."
            />
          </FadeIn>
          <FadeIn delay={0.08}>
            <ul className="space-y-3">
              {countryReportsContent.reasons.map((reason) => (
                <li key={reason} className="flex items-start gap-3">
                  <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <span className="text-base-content/80">{reason}</span>
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>
      </section>

      <section className="section-pad border-y border-base-300 bg-base-200/40">
        <div className="container-page">
          <FadeIn>
            <SectionHeading
              eyebrow="Coverage"
              title="Current jurisdictions visible on the website"
              subtitle={`Expert coverage across ${countries.length} jurisdictions. For countries outside this list, contact us to discuss availability.`}
            />
          </FadeIn>
          <FadeIn delay={0.08}>
            <CountryGrid />
          </FadeIn>
        </div>
      </section>

      <CTASection
        title="Need a country expert report for an asylum or immigration matter?"
        description="Tell us the jurisdiction, legal questions, and deadlines — we will match the right specialist pathway."
        primaryHref="/request-a-report"
        primaryLabel="Request a Report"
        secondaryHref="/contact"
        secondaryLabel="Contact us"
      />
    </>
  );
}
