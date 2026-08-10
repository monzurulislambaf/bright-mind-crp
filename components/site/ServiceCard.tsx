import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import type { Service } from "@/data/services";
import { ServiceIcon } from "@/components/site/icons";
import { HoverLift } from "@/components/site/Motion";

export function ServiceCard({
  service,
  featured = false,
}: {
  service: Service;
  featured?: boolean;
}) {
  return (
    <HoverLift className={featured ? "lg:col-span-2 h-full" : "h-full"}>
      <article className="surface-card h-full">
        <div className="card-body gap-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-box bg-primary/10 text-primary">
              <ServiceIcon icon={service.icon} />
            </div>
            <span className="font-display text-sm tracking-widest text-base-content/40">
              {service.number}
            </span>
          </div>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h3 className="card-title font-display text-xl text-primary">
              {service.title}
            </h3>
            <span className="badge badge-soft badge-primary badge-sm shrink-0">
              {service.rate}
            </span>
          </div>
          <p className="text-base-content/70">{service.shortDescription}</p>
          <div className="card-actions mt-auto justify-start pt-2">
            <Link
              href={service.href}
              className="btn btn-ghost btn-sm gap-1 px-0 text-primary"
            >
              Learn more
              <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </article>
    </HoverLift>
  );
}
