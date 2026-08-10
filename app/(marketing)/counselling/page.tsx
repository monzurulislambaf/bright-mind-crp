import type { Metadata } from "next";
import Image from "next/image";
import { counsellingContent } from "@/data/content";
import { PageHero } from "@/components/site/PageHero";
import { SectionHeading } from "@/components/site/SectionHeading";
import { CTASection } from "@/components/site/CTASection";
import { CheckIcon } from "@/components/site/icons";
import { FadeIn, Stagger, StaggerItem } from "@/components/site/Motion";

export const metadata: Metadata = {
  title: "Counselling",
  description:
    "Worldwide counselling pathways delivered by qualified professionals for trauma, displacement, and wider psycho-social needs.",
  alternates: { canonical: "/counselling" },
};

export default function CounsellingPage() {
  return (
    <>
      <PageHero
        eyebrow="Counselling"
        title={counsellingContent.heading}
        description={counsellingContent.intro}
        breadcrumbs={[
          { href: "/", label: "Home" },
          { label: "Counselling" },
        ]}
        ctas={[
          { href: "/contact", label: "Start counselling intake" },
          { href: "/for-individuals", label: "For individuals", primary: false },
        ]}
      />

      <section className="section-pad">
        <div className="container-page grid items-center gap-10 lg:grid-cols-2">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.18em] text-accent uppercase">
              Remote support
            </p>
            <h2 className="font-display mt-3 text-3xl font-semibold text-primary">
              Therapeutic care that can sit alongside legal reporting without blurring roles
            </h2>
            <p className="mt-4 text-base leading-relaxed text-base-content/70">
              Access, cultural sensitivity, remote delivery, and trauma awareness
              — with clinical and legal pathways kept distinct.
            </p>
          </FadeIn>
          <FadeIn delay={0.08}>
            <div className="overflow-hidden rounded-box border border-base-300 bg-base-200">
              <Image
                alt="Remote counselling session between psychologist and client"
                className="h-auto w-full object-cover"
                height={900}
                src="/brightmind-counselling.png"
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
              eyebrow="Video"
              title="Remote counselling in practice"
              subtitle="A short clip showing the remote counselling model for the public website."
            />
          </FadeIn>
          <FadeIn delay={0.08}>
            <div className="overflow-hidden rounded-box border border-base-300 bg-neutral">
              <video
                autoPlay
                className="aspect-video h-auto w-full object-cover"
                controls
                loop
                muted
                playsInline
                poster="/brightmind-counselling.png"
              >
                <source
                  src="/brightmind-remote-counselling.mp4"
                  type="video/mp4"
                />
              </video>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page">
          <FadeIn>
            <SectionHeading
              eyebrow="Care pillars"
              title="A counselling offer that complements legal reporting"
            />
          </FadeIn>
          <Stagger className="grid gap-5 md:grid-cols-2">
            {counsellingContent.pillars.map((pillar) => (
              <StaggerItem key={pillar.title}>
                <article className="surface-card h-full">
                  <div className="card-body gap-3">
                    <h3 className="font-display text-lg font-semibold text-primary">
                      {pillar.title}
                    </h3>
                    <p className="text-base-content/70">{pillar.summary}</p>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="section-pad border-y border-base-300 bg-base-200/40">
        <div className="container-page grid gap-10 lg:grid-cols-2 lg:items-start">
          <FadeIn>
            <SectionHeading
              eyebrow="Who this helps"
              title="Accessible support across borders"
              subtitle="Designed for vulnerable clients who need qualified remote care."
            />
          </FadeIn>
          <FadeIn delay={0.08}>
            <ul className="space-y-3">
              {counsellingContent.whoHelps.map((item) => (
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
        title="Need remote counselling support for a client or direct enquiry?"
        description="Counselling can sit as a standalone pathway or as part of a broader support journey around assessment, vulnerability, and recovery."
        primaryHref="/contact"
        primaryLabel="Start counselling intake"
        secondaryHref="/request-callback"
        secondaryLabel="Request a callback"
      />
    </>
  );
}
