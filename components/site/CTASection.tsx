import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { FadeIn } from "@/components/site/Motion";

export function CTASection({
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: {
  title: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <section className="section-pad">
      <div className="container-page">
        <FadeIn>
          <div className="relative overflow-hidden rounded-box border border-primary/15 bg-primary px-6 py-12 text-primary-content shadow-lg sm:px-10 lg:px-14 lg:py-16">
            <div
              className="pointer-events-none absolute inset-0 opacity-40 mesh-bg"
              aria-hidden="true"
            />
            <div className="relative mx-auto max-w-3xl text-center">
              <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                {title}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-primary-content/80 sm:text-lg">
                {description}
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href={primaryHref}
                  className="btn btn-lg gap-2 border-0 bg-base-100 text-primary hover:bg-base-200"
                >
                  {primaryLabel}
                  <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
                </Link>
                {secondaryHref && secondaryLabel ? (
                  <Link
                    href={secondaryHref}
                    className="btn btn-lg btn-outline border-primary-content/40 text-primary-content hover:border-primary-content hover:bg-primary-content/10"
                  >
                    {secondaryLabel}
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
