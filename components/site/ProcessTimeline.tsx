import { CheckIcon } from "@heroicons/react/24/solid";
import { FadeIn } from "@/components/site/Motion";

export function ProcessTimeline({
  steps,
}: {
  steps: ReadonlyArray<{ title: string; text: string }>;
}) {
  return (
    <ol className="relative space-y-0">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        return (
          <FadeIn key={step.title} delay={index * 0.06}>
            <li className="relative flex gap-5 pb-10 last:pb-0">
              {!isLast ? (
                <span
                  className="absolute top-10 bottom-0 left-5 w-px bg-gradient-to-b from-primary/40 to-base-300"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/25 bg-base-100 shadow-sm">
                {isLast ? (
                  <CheckIcon className="h-5 w-5 text-accent" aria-hidden="true" />
                ) : (
                  <span className="font-display text-sm font-semibold text-primary">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                )}
              </div>
              <div className="pt-1.5">
                <h3 className="font-display text-lg font-semibold text-primary">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-2xl text-base-content/70">{step.text}</p>
              </div>
            </li>
          </FadeIn>
        );
      })}
    </ol>
  );
}
