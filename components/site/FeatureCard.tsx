import { HoverLift } from "@/components/site/Motion";

export function FeatureCard({
  title,
  text,
  index,
}: {
  title: string;
  text: string;
  index?: string;
}) {
  return (
    <HoverLift className="h-full">
      <article className="surface-card h-full">
        <div className="card-body gap-3">
          {index ? (
            <span className="font-display text-sm tracking-widest text-base-content/35">
              {index}
            </span>
          ) : null}
          <h3 className="card-title font-display text-lg text-primary">
            {title}
          </h3>
          <p className="text-base-content/70">{text}</p>
        </div>
      </article>
    </HoverLift>
  );
}
