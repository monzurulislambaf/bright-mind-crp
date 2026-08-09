import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { FadeIn } from "@/components/site/Motion";

type Crumb = { href?: string; label: string };
type Cta = { href: string; label: string; primary?: boolean };

export function PageHero({
  eyebrow,
  title,
  description,
  breadcrumbs,
  ctas,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  breadcrumbs?: Crumb[];
  ctas?: Cta[];
}) {
  return (
    <section className="relative overflow-hidden border-b border-base-300 bg-base-200/70">
      <div className="pointer-events-none absolute inset-0 opacity-50 mesh-bg" aria-hidden="true" />
      <div className="container-page relative section-pad !pb-14 !pt-10 sm:!pb-16 sm:!pt-12">
        {breadcrumbs ? <Breadcrumbs items={breadcrumbs} className="mb-8" /> : null}
        <FadeIn>
          {eyebrow ? (
            <p className="mb-4 text-xs font-semibold tracking-[0.18em] text-accent uppercase">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="font-display max-w-4xl text-4xl leading-tight font-semibold tracking-tight text-primary sm:text-5xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-base-content/70">
              {description}
            </p>
          ) : null}
          {ctas && ctas.length > 0 ? (
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {ctas.map((cta) => (
                <Link
                  key={cta.href + cta.label}
                  href={cta.href}
                  className={
                    cta.primary === false
                      ? "btn btn-outline btn-lg"
                      : "btn btn-primary btn-lg gap-2"
                  }
                >
                  {cta.label}
                  {cta.primary !== false ? (
                    <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
                  ) : null}
                </Link>
              ))}
            </div>
          ) : null}
        </FadeIn>
      </div>
    </section>
  );
}
