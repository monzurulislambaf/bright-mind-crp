import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { siteContact } from "@/data/navigation";
import { FadeIn } from "@/components/site/Motion";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Bright Mind Psychology Care and Reporting privacy policy.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        breadcrumbs={[
          { href: "/", label: "Home" },
          { label: "Privacy" },
        ]}
      />
      <section className="section-pad">
        <FadeIn className="container-page prose prose-base max-w-3xl dark:prose-invert">
          <p>
            Bright Mind Psychology Care and Reporting (&quot;we&quot;,
            &quot;us&quot;, or &quot;our&quot;) is committed to protecting your
            privacy. This privacy policy explains how we collect, use, disclose,
            and safeguard your information when you visit our website, use our
            services, or otherwise interact with us.
          </p>
          <h2>Information we collect</h2>
          <p>
            We may collect personal information such as your name, email
            address, phone number, organisation, and other details you provide
            through our forms or when you communicate with us.
          </p>
          <h2>How we use your information</h2>
          <p>
            We use your information to respond to your enquiries, provide our
            services, manage your account, and for other legitimate business
            purposes. We do not sell your personal information to third parties.
          </p>
          <h2>Data security</h2>
          <p>
            We implement appropriate technical and organisational measures to
            protect your personal information against unauthorised access,
            alteration, disclosure, or destruction.
          </p>
          <h2>Your rights</h2>
          <p>
            You have the right to access, correct, or delete your personal
            information. To exercise these rights, please contact us using the
            details below.
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
