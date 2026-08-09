import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { siteContact } from "@/data/navigation";
import { FadeIn } from "@/components/site/Motion";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "Bright Mind Psychology Care and Reporting terms and conditions.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms and Conditions"
        breadcrumbs={[
          { href: "/", label: "Home" },
          { label: "Terms" },
        ]}
      />
      <section className="section-pad">
        <FadeIn className="container-page prose prose-base max-w-3xl dark:prose-invert">
          <p>
            Welcome to Bright Mind Psychology Care and Reporting. These terms
            and conditions outline the rules and regulations for the use of our
            website and services.
          </p>
          <h2>Acceptance of terms</h2>
          <p>
            By accessing or using our website or services, you agree to be bound
            by these terms and conditions. If you do not agree with any part of
            these terms, you must not use our website or services.
          </p>
          <h2>Services</h2>
          <p>
            We provide independent psychological reports, mental health status
            certificates, country expert reports, and counselling services to
            solicitors, barristers, legal professionals, and individuals.
          </p>
          <h2>Intellectual property</h2>
          <p>
            All content on our website, including text, graphics, logos, and
            images, is the property of Bright Mind Psychology Care and Reporting
            or its content suppliers and is protected by applicable intellectual
            property laws.
          </p>
          <h2>Disclaimer</h2>
          <p>
            The information provided on our website is for general informational
            purposes only and does not constitute professional advice. While we
            strive to keep the information accurate and up to date, we make no
            representations or warranties of any kind about completeness,
            accuracy, reliability, suitability, or availability.
          </p>
          <h2>Governing law</h2>
          <p>
            These terms and conditions are governed by and construed in
            accordance with the laws of England and Wales.
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
