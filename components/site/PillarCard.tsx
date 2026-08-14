import Link from "next/link";
import {
  HeartIcon,
  ScaleIcon,
  GlobeAltIcon,
  AcademicCapIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { HoverLift } from "@/components/site/Motion";

export type PillarIcon = "psychological" | "forensic" | "country" | "training";

const pillarIcons: Record<PillarIcon, typeof HeartIcon> = {
  psychological: HeartIcon,
  forensic: ScaleIcon,
  country: GlobeAltIcon,
  training: AcademicCapIcon,
};

export function PillarCard({
  title,
  summary,
  href,
  cta,
  icon,
  index,
}: {
  title: string;
  summary: string;
  href: string;
  cta: string;
  icon: PillarIcon;
  index: string;
}) {
  const Icon = pillarIcons[icon];
  return (
    <HoverLift className="h-full">
      <article className="surface-card flex h-full flex-col">
        <div className="card-body gap-4">
          <div className="flex items-start justify-between gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-box bg-primary/10 text-primary">
              <Icon className="h-6 w-6" aria-hidden="true" />
            </span>
            <span className="font-display text-sm tracking-widest text-base-content/40">
              {index}
            </span>
          </div>
          <h3 className="card-title font-display text-xl text-primary">
            {title}
          </h3>
          <p className="flex-1 text-base-content/70">{summary}</p>
          <div className="card-actions justify-start pt-2">
            <Link
              href={href}
              className="btn btn-ghost btn-sm gap-1 px-0 text-primary"
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
