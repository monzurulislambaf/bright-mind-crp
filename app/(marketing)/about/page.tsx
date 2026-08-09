import type { Metadata } from "next";
import {
  ScaleIcon,
  BeakerIcon,
  BookOpenIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { aboutContent } from "@/data/content";
import { PageHero } from "@/components/site/PageHero";
import { SectionHeading } from "@/components/site/SectionHeading";
import { CTASection } from "@/components/site/CTASection";
import { FadeIn, Stagger, StaggerItem } from "@/components/site/Motion";

export const metadata: Metadata = {
  title: "About",
  description: aboutContent.intro,
  alternates: { canonical: "/about" },
};

const approachIcons = [ScaleIcon, BeakerIcon, BookOpenIcon, LockClosedIcon];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title={aboutContent.heading}
        description={aboutContent.intro}
        breadcrumbs={[
          { href: "/", label: "Home" },
          { label: "About" },
        ]}
      />

      <section className="section-pad">
        <div className="container-page max-w-4xl space-y-8">
          <FadeIn>
            <p className="text-lg leading-relaxed text-base-content/75">
              {aboutContent.body}
            </p>
          </FadeIn>
          <Stagger className="grid gap-6 md:grid-cols-2">
            <StaggerItem>
              <article className="surface-card h-full">
                <div className="card-body">
                  <h2 className="font-display text-xl font-semibold text-primary">
                    What we do
                  </h2>
                  <p className="text-base-content/70">{aboutContent.whatWeDo}</p>
                </div>
              </article>
            </StaggerItem>
            <StaggerItem>
              <article className="surface-card h-full">
                <div className="card-body">
                  <h2 className="font-display text-xl font-semibold text-primary">
                    Our network
                  </h2>
                  <p className="text-base-content/70">{aboutContent.network}</p>
                </div>
              </article>
            </StaggerItem>
          </Stagger>
        </div>
      </section>

      <section className="section-pad border-y border-base-300 bg-base-200/40">
        <div className="container-page">
          <FadeIn>
            <SectionHeading
              eyebrow="Our approach"
              title="How we work"
              subtitle="Independence, clinical standards, legal relevance, and confidentiality in every engagement."
            />
          </FadeIn>
          <Stagger className="grid gap-5 md:grid-cols-2">
            {aboutContent.approach.map((item, i) => {
              const Icon = approachIcons[i] ?? ScaleIcon;
              return (
                <StaggerItem key={item.title}>
                  <article className="surface-card h-full">
                    <div className="card-body gap-4">
                      <span className="flex h-11 w-11 items-center justify-center rounded-box bg-primary/10 text-primary">
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </span>
                      <h3 className="font-display text-lg font-semibold text-primary">
                        {item.title}
                      </h3>
                      <p className="text-base-content/70">{item.text}</p>
                    </div>
                  </article>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page max-w-3xl">
          <FadeIn>
            <SectionHeading eyebrow="Our team" title="Vetted expert panel" />
            <p className="text-lg leading-relaxed text-base-content/75">
              {aboutContent.team}
            </p>
          </FadeIn>
        </div>
      </section>

      <CTASection
        title="Ready to work with Bright Mind?"
        description="Instruct a report, join our network, or speak with our team."
        primaryHref="/request-a-report"
        primaryLabel="Request a Report"
        secondaryHref="/contact"
        secondaryLabel="Contact us"
      />
    </>
  );
}
