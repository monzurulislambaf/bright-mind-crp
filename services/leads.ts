"use server";

import { z } from "zod";
import { Lead } from "@/models/Lead";
import { FormSubmission } from "@/models/FormSubmission";
import { connectToDatabase } from "@/lib/db";
import { nextId, buildSecureId } from "@/lib/ids";
import { writeAuditLog } from "@/services/audit";
import { headers } from "next/headers";

export type PublicFormType =
  | "request_report"
  | "solicitor_partner"
  | "psychologist"
  | "individual"
  | "callback"
  | "general";

const LeadPayload = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().optional().default(""),
  email: z.string().trim().email("Enter a valid email").toLowerCase(),
  phone: z.string().trim().optional().default(""),
  company: z.string().trim().optional().default(""),
  role: z.string().trim().optional().default(""),
  notes: z.string().trim().optional().default(""),
  consent: z
    .boolean()
    .refine((value) => value === true, {
      message: "Consent is required to submit this form",
    }),
  // Extended public-form fields (stored on payload + folded into notes)
  reportType: z.string().trim().optional().default(""),
  caseInformation: z.string().trim().optional().default(""),
  supportingInformation: z.string().trim().optional().default(""),
  preferredCallbackTime: z.string().trim().optional().default(""),
  reason: z.string().trim().optional().default(""),
  website: z.string().trim().optional().default(""),
  areasOfLaw: z.string().trim().optional().default(""),
  requirements: z.string().trim().optional().default(""),
  hcpcRegistration: z.string().trim().optional().default(""),
  professionalRole: z.string().trim().optional().default(""),
  expertise: z.string().trim().optional().default(""),
  experience: z.string().trim().optional().default(""),
  countries: z.string().trim().optional().default(""),
  availability: z.string().trim().optional().default(""),
  insurance: z.string().trim().optional().default(""),
  additionalInformation: z.string().trim().optional().default(""),
  position: z.string().trim().optional().default(""),
});

export type LeadFormPayload = z.input<typeof LeadPayload>;

export type LeadFormState =
  | { success: boolean; message?: string; errors?: Record<string, string[]> }
  | undefined;

function composeNotes(data: z.infer<typeof LeadPayload>): string {
  const sections: Array<[string, string]> = [
    ["Message", data.notes],
    ["Report required", data.reportType],
    ["Case information", data.caseInformation],
    ["Supporting information", data.supportingInformation],
    ["Preferred callback time", data.preferredCallbackTime],
    ["Reason", data.reason],
    ["Website", data.website],
    ["Position", data.position],
    ["Areas of law", data.areasOfLaw],
    ["Requirements", data.requirements],
    ["HCPC registration", data.hcpcRegistration],
    ["Professional role", data.professionalRole],
    ["Expertise", data.expertise],
    ["Experience", data.experience],
    ["Countries", data.countries],
    ["Availability", data.availability],
    ["Insurance", data.insurance],
    ["Additional information", data.additionalInformation],
  ];

  return sections
    .filter(([, value]) => value && value.trim().length > 0)
    .map(([label, value]) => `${label}: ${value.trim()}`)
    .join("\n\n");
}

/**
 * Creates a CRM lead from a public website form. Records the source,
 * campaign and landing page, and stores the raw submission for audit.
 */
export async function createLeadFromForm(
  formType: PublicFormType,
  source: string,
  campaign: string | undefined,
  payload: LeadFormPayload
): Promise<LeadFormState> {
  const parsed = LeadPayload.safeParse(payload);
  if (!parsed.success) {
    return {
      success: false,
      message: "Please correct the highlighted fields.",
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const h = await headers();
  const landingPage = h.get("referer") ?? "/";
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const userAgent = h.get("user-agent") ?? "unknown";

  try {
    await connectToDatabase();
    const composedNotes = composeNotes(parsed.data);
    const leadId = await nextId("LEAD");

    const lead = await Lead.create({
      leadId,
      source,
      campaign,
      landingPage,
      qualifier: formType,
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      company: parsed.data.company,
      role: parsed.data.role || parsed.data.position || parsed.data.professionalRole,
      notes: composedNotes,
      consent: true,
    });

    await FormSubmission.create({
      formId: buildSecureId("CON"),
      formType,
      source,
      campaign,
      landingPage,
      lead: lead._id,
      payload: parsed.data,
      ip,
      userAgent,
    });

    await writeAuditLog({
      action: "lead.created",
      resource: "lead",
      resourceId: lead.leadId,
      metadata: { formType, source },
    });

    return {
      success: true,
      message: "Thanks — we’ve received your details and will be in touch.",
    };
  } catch (error) {
    console.error("Failed to create lead", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}
