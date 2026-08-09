import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { siteContact } from "@/data/navigation";
import { FadeIn } from "@/components/site/Motion";

export const metadata: Metadata = {
  title: "Cookies Policy",
  description: "Bright Mind Psychology Care and Reporting cookies policy.",
  alternates: { canonical: "/cookies" },
};

export default function CookiesPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Cookies Policy"
        breadcrumbs={[
          { href: "/", label: "Home" },
          { label: "Cookies" },
        ]}
      />
      <section className="section-pad">
        <FadeIn className="container-page prose prose-base max-w-3xl dark:prose-invert">
          <p>
            This cookies policy explains how Bright Mind Psychology Care and
            Reporting uses cookies and similar technologies when you visit our
            website.
          </p>
          <h2>What are cookies?</h2>
          <p>
            Cookies are small data files placed on your device when you visit a
            website. They are widely used to make websites work, work more
            efficiently, and provide reporting information.
          </p>
          <h2>How we use cookies</h2>
          <p>
            We may use essential cookies required for the website to function,
            preference cookies (such as theme selection), and analytics cookies
            to understand how the site is used.
          </p>
          <h2>Your choices</h2>
          <p>
            You can control cookies through your browser settings. Blocking some
            types of cookies may affect your experience of the site.
          </p>
          <h2>Contact</h2>
          <p>
            Email: {siteContact.email}
            <br />
            Phone: {siteContact.phone}
            <br />
            Address: {siteContact.address}
          </p>
        </FadeIn>
      </section>
    </>
  );
}
