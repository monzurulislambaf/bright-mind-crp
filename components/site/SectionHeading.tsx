import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <div
      className={cn(
        "mb-10 space-y-4 sm:mb-12",
        align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"
      )}
    >
      {eyebrow ? (
        <p className="text-xs font-semibold tracking-[0.18em] text-accent uppercase">
          {eyebrow}
        </p>
      ) : null}
      <Tag
        className={cn(
          "font-display text-3xl leading-tight font-semibold tracking-tight text-primary sm:text-4xl lg:text-[2.75rem]",
          align === "center" && "text-balance"
        )}
      >
        {title}
      </Tag>
      {subtitle ? (
        <p
          className={cn(
            "text-base leading-relaxed text-base-content/70 sm:text-lg",
            align === "center" && "mx-auto max-w-2xl"
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
