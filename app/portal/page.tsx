import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth/dal";

export const dynamic = "force-dynamic";

export default async function PortalIndexPage() {
  const user = await requireAuth();
  switch (user.role) {
    case "PSYCHOLOGIST":
      redirect("/portal/psychologist");
    case "SOLICITOR":
    case "SOLICITOR_FIRM_ADMIN":
      redirect("/portal/solicitor");
    case "INDIVIDUAL_CLIENT":
      redirect("/portal/individual");
    default:
      redirect("/dashboard");
  }
}