import {
  DocumentTextIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  ExclamationTriangleIcon,
  HeartIcon,
  CheckIcon as HeroCheckIcon,
} from "@heroicons/react/24/outline";
import type { Service } from "@/data/services";

const iconClass = "h-6 w-6";

export function ServiceIcon({
  icon,
  className = iconClass,
}: {
  icon: Service["icon"];
  className?: string;
}) {
  switch (icon) {
    case "report":
      return <DocumentTextIcon className={className} aria-hidden="true" />;
    case "certificate":
      return <ShieldCheckIcon className={className} aria-hidden="true" />;
    case "country":
      return <GlobeAltIcon className={className} aria-hidden="true" />;
    case "risk":
      return (
        <ExclamationTriangleIcon className={className} aria-hidden="true" />
      );
    case "counselling":
      return <HeartIcon className={className} aria-hidden="true" />;
  }
}

export function CheckIcon({ className = "h-5 w-5" }: { className?: string }) {
  return <HeroCheckIcon className={className} aria-hidden="true" />;
}
