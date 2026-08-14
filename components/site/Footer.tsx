import Link from "next/link";
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { footerNav, siteContact, siteMeta } from "@/data/navigation";

const columns = [
  { title: "Explore", links: footerNav.explore },
  { title: "Services", links: footerNav.services },
  { title: "Professionals", links: footerNav.professionals },
  { title: "Legal", links: footerNav.legal },
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-base-300 bg-base-200">
      <div className="container-page footer gap-10 py-14 sm:footer-horizontal">
        <aside className="max-w-sm">
          <Link
            href="/"
            className="font-display text-2xl font-semibold text-primary"
          >
            Bright<span className="text-accent">Mind</span>
          </Link>
          <p className="mt-3 text-sm leading-relaxed text-base-content/70">
            {siteMeta.description}
          </p>
          <div className="mt-5 space-y-2 text-sm text-base-content/70">
            <p className="flex items-start gap-2">
              <EnvelopeIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
              <span>{siteContact.email}</span>
            </p>
            <p className="flex items-start gap-2">
              <PhoneIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
              <span>{siteContact.phone}</span>
            </p>
            <p className="flex items-start gap-2">
              <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
              <span>{siteContact.address}</span>
            </p>
          </div>
        </aside>

        {columns.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h6 className="footer-title opacity-70">{column.title}</h6>
            {column.links.map((link) => (
              <Link key={link.href} href={link.href} className="link link-hover">
                {link.label}
              </Link>
            ))}
          </nav>
        ))}
      </div>

      <div className="container-page border-t border-base-300 py-6">
        <div className="flex flex-col gap-2 text-sm text-base-content/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteMeta.name}
          </p>
          <p>Professional psychology, expert evidence, country expertise, and training & research.</p>
        </div>
      </div>
    </footer>
  );
}
