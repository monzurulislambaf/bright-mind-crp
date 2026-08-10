import { countries } from "@/data/countries";
import { siteContact, siteMeta } from "@/data/navigation";
import { services } from "@/data/services";

const seoThemes = [
  "asylum psychological report UK",
  "immigration psychological assessment",
  "expert witness psychologist for solicitors",
  "country expert report for asylum cases",
  "remote trauma counselling worldwide",
  "psychological report for immigration tribunal",
] as const;

export function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: siteMeta.name,
    url: siteMeta.url,
    email: siteContact.email,
    areaServed: [siteMeta.region, "Worldwide"],
    description: siteMeta.description,
    serviceType: services.map((service) => service.title),
    knowsAbout: [...seoThemes, ...countries.map((country) => country.name)],
  };

  return (
    <script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      type="application/ld+json"
    />
  );
}
