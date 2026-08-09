import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { HoverLift } from "@/components/site/Motion";

export function AudienceCard({
  title,
  text,
  href,
  cta,
  index,
}: {
  title: string;
  text: string;
  href: string;
  cta: string;
  index?: string;
}) {
  return (
    <HoverLift className="h-full">
      <article className="surface-card group h-full">
        <div className="card-body gap-4">
          {index ? (
            <span className="font-display text-sm tracking-widest text-accent">
              {index}
            </span>
          ) : null}
          <h3 className="card-title font-display text-xl text-primary">
            {title}
          </h3>
          <p className="text-base-content/70">{text}</p>
          <div className="card-actions mt-auto">
            <Link
              href={href}
              className="btn btn-outline gap-1.5 group-hover:btn-primary"
            >
              {cta}
              <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </article>
    </HoverLift>
  );
}
