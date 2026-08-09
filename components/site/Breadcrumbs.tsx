import Link from "next/link";
import { cn } from "@/lib/utils";

type Crumb = { href?: string; label: string };

export function Breadcrumbs({
  items,
  className,
}: {
  items: Crumb[];
  className?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className={cn("breadcrumbs text-sm", className)}>
      <ul>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`}>
              {item.href && !isLast ? (
                <Link href={item.href} className="link link-hover">
                  {item.label}
                </Link>
              ) : (
                <span className="text-base-content/70" aria-current={isLast ? "page" : undefined}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
