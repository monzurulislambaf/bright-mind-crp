import {
  DocumentTextIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  ExclamationTriangleIcon,
  HeartIcon,
  ClipboardDocumentCheckIcon,
  ChatBubbleLeftRightIcon,
  SparklesIcon,
  VideoCameraIcon,
  ScaleIcon,
  MagnifyingGlassIcon,
  AcademicCapIcon,
  CheckIcon as HeroCheckIcon,
} from "@heroicons/react/24/outline";
import type { ServiceIconName } from "@/data/services";

const iconClass = "h-6 w-6";

export function ServiceIcon({
  icon,
  className = iconClass,
}: {
  icon: ServiceIconName;
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
    case "assessment":
      return (
        <ClipboardDocumentCheckIcon className={className} aria-hidden="true" />
      );
    case "consultation":
      return (
        <ChatBubbleLeftRightIcon className={className} aria-hidden="true" />
      );
    case "wellbeing":
      return <SparklesIcon className={className} aria-hidden="true" />;
    case "remote":
      return <VideoCameraIcon className={className} aria-hidden="true" />;
    case "forensic":
      return <ScaleIcon className={className} aria-hidden="true" />;
    case "evidence":
      return <MagnifyingGlassIcon className={className} aria-hidden="true" />;
    case "expert-consultation":
      return <AcademicCapIcon className={className} aria-hidden="true" />;
  }
}

export function CheckIcon({ className = "h-5 w-5" }: { className?: string }) {
  return <HeroCheckIcon className={className} aria-hidden="true" />;
}
