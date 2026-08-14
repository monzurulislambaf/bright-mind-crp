"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  createLeadFromForm,
  type PublicFormType,
} from "@/services/leads";
import { services, practiceAreas } from "@/data/services";
import { trainingProgrammes } from "@/data/training";

const baseSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  phone: z.string().optional(),
  company: z.string().optional(),
  role: z.string().optional(),
  notes: z.string().optional(),
  consent: z
    .boolean()
    .refine((value) => value === true, { message: "Consent is required" }),
  reportType: z.string().optional(),
  caseInformation: z.string().optional(),
  supportingInformation: z.string().optional(),
  preferredCallbackTime: z.string().optional(),
  reason: z.string().optional(),
  website: z.string().optional(),
  areasOfLaw: z.string().optional(),
  requirements: z.string().optional(),
  hcpcRegistration: z.string().optional(),
  professionalRole: z.string().optional(),
  expertise: z.string().optional(),
  experience: z.string().optional(),
  countries: z.string().optional(),
  availability: z.string().optional(),
  insurance: z.string().optional(),
  additionalInformation: z.string().optional(),
  position: z.string().optional(),
  country: z.string().optional(),
  course: z.string().optional(),
});

type FieldSchema = z.input<typeof baseSchema>;
type FieldName = keyof FieldSchema;

type FieldConfig = {
  label: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
  full?: boolean;
  as?: "input" | "textarea" | "select" | "consent";
  options?: Array<{ value: string; label: string }>;
};

const FIELD_CONFIG: Record<string, FieldConfig> = {
  firstName: { label: "First name", placeholder: "Jane", required: true },
  lastName: { label: "Last name", placeholder: "Doe" },
  email: {
    label: "Email",
    placeholder: "you@example.com",
    required: true,
    type: "email",
  },
  phone: { label: "Phone", placeholder: "Your phone number", type: "tel" },
  company: {
    label: "Organisation / Firm",
    placeholder: "Your firm or organisation",
  },
  role: { label: "Role", placeholder: "e.g. Solicitor" },
  position: { label: "Position", placeholder: "e.g. Partner" },
  website: { label: "Website", placeholder: "https://", type: "url" },
  notes: {
    label: "Message",
    placeholder: "Tell us briefly what you need…",
    full: true,
    as: "textarea",
  },
  reportType: {
    label: "Report / service required",
    full: true,
    as: "select",
    options: [
      { value: "", label: "Select a service" },
      ...services.map((s) => ({ value: s.title, label: s.title })),
      { value: "Not sure / other", label: "Not sure / other" },
    ],
  },
  caseInformation: {
    label: "Case information",
    placeholder: "Practice area, urgency, and relevant case context…",
    full: true,
    as: "textarea",
  },
  supportingInformation: {
    label: "Supporting information",
    placeholder:
      "Any additional context that will help us assess the instruction…",
    full: true,
    as: "textarea",
  },
  preferredCallbackTime: {
    label: "Preferred callback time",
    placeholder: "e.g. Weekday mornings",
  },
  reason: {
    label: "Reason for callback",
    placeholder: "Brief reason for the call…",
    full: true,
    as: "textarea",
  },
  areasOfLaw: {
    label: "Areas of law",
    placeholder: practiceAreas.join(", "),
    full: true,
  },
  requirements: {
    label: "Requirements",
    placeholder: "What does your firm need from Bright Mind?",
    full: true,
    as: "textarea",
  },
  hcpcRegistration: {
    label: "HCPC registration number",
    placeholder: "HCPC registration",
    required: true,
  },
  professionalRole: {
    label: "Professional role",
    placeholder: "e.g. Clinical Psychologist",
  },
  expertise: {
    label: "Areas of expertise",
    placeholder: "Clinical specialisms relevant to expert work…",
    full: true,
    as: "textarea",
  },
  experience: {
    label: "Relevant experience",
    placeholder: "Court / tribunal reporting experience…",
    full: true,
    as: "textarea",
  },
  countries: {
    label: "Country expertise",
    placeholder: "Countries you can report on…",
    full: true,
  },
  availability: {
    label: "Availability",
    placeholder: "Typical availability for assessments and reporting",
  },
  insurance: {
    label: "Professional indemnity insurance",
    placeholder: "Insurer / cover summary",
  },
  additionalInformation: {
    label: "Additional information",
    placeholder: "Anything else we should know…",
    full: true,
    as: "textarea",
  },
  country: {
    label: "Country / jurisdiction",
    placeholder: "e.g. Bangladesh",
    required: true,
  },
  course: {
    label: "Training programme",
    full: true,
    as: "select",
    options: [
      { value: "", label: "Select a programme" },
      ...trainingProgrammes.map((p) => ({ value: p.title, label: p.title })),
      { value: "In-house / custom training", label: "In-house / custom training" },
      { value: "Not sure / other", label: "Not sure / other" },
    ],
  },
  consent: {
    label: "Consent",
    as: "consent",
    full: true,
    required: true,
  },
};

const FORM_PRESETS: Record<
  PublicFormType,
  { fields: FieldName[]; intro?: string }
> = {
  request_report: {
    fields: [
      "firstName",
      "lastName",
      "email",
      "phone",
      "company",
      "reportType",
      "caseInformation",
      "supportingInformation",
      "consent",
    ],
    intro:
      "Share the essentials of your instruction and our team will respond with next steps.",
  },
  instruct_expert: {
    fields: [
      "firstName",
      "lastName",
      "email",
      "phone",
      "company",
      "reportType",
      "caseInformation",
      "supportingInformation",
      "consent",
    ],
    intro:
      "Tell us about the legal question and your matter — our expert division will confirm whether expert evidence is warranted and match the right specialist.",
  },
  country_expert: {
    fields: [
      "firstName",
      "lastName",
      "email",
      "phone",
      "company",
      "country",
      "caseInformation",
      "consent",
    ],
    intro:
      "Tell us the jurisdiction and the legal questions — we will confirm country expert availability and the right pathway.",
  },
  training: {
    fields: [
      "firstName",
      "lastName",
      "email",
      "phone",
      "company",
      "course",
      "notes",
      "consent",
    ],
    intro:
      "Register your interest in a training programme — dates, fees, and CPD points are confirmed on enquiry.",
  },
  solicitor_partner: {
    fields: [
      "company",
      "firstName",
      "lastName",
      "email",
      "phone",
      "position",
      "website",
      "areasOfLaw",
      "requirements",
      "notes",
      "consent",
    ],
    intro:
      "Tell us about your firm and how you would like to partner with Bright Mind.",
  },
  psychologist: {
    fields: [
      "firstName",
      "lastName",
      "email",
      "phone",
      "hcpcRegistration",
      "professionalRole",
      "expertise",
      "experience",
      "countries",
      "availability",
      "insurance",
      "additionalInformation",
      "consent",
    ],
    intro:
      "Submit your professional details for compliance review. CV upload can be arranged after initial contact.",
  },
  individual: {
    fields: ["firstName", "lastName", "email", "phone", "notes", "consent"],
    intro: "Tell us what you need and a little about your situation.",
  },
  callback: {
    fields: [
      "firstName",
      "phone",
      "email",
      "preferredCallbackTime",
      "reason",
      "notes",
      "consent",
    ],
    intro: "Leave your details and a member of our team will call you back.",
  },
  general: {
    fields: ["firstName", "lastName", "email", "phone", "notes", "consent"],
    intro: "Send a general enquiry and we will direct it to the right team.",
  },
};

export type LeadFormProps = {
  formType: PublicFormType;
  source: string;
  campaign?: string;
  submitLabel: string;
  showFields?: FieldName[];
  intro?: string;
  compact?: boolean;
};

export function LeadForm({
  formType,
  source,
  campaign,
  submitLabel,
  showFields,
  intro,
  compact = false,
}: LeadFormProps) {
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const fields = useMemo(
    () => showFields ?? FORM_PRESETS[formType].fields,
    [formType, showFields]
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FieldSchema>({
    resolver: zodResolver(baseSchema),
    defaultValues: {
      consent: false,
      reportType: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
    },
  });

  async function onSubmit(values: FieldSchema) {
    setPending(true);
    setFeedback(null);
    const result = await createLeadFromForm(formType, source, campaign, {
      ...values,
      consent: true,
    });
    setPending(false);

    if (result?.success) {
      setFeedback({
        type: "success",
        message:
          result.message ??
          "Thanks — we’ve received your details and will be in touch.",
      });
      // Clear every registered field so a second submission starts clean.
      const cleared = Object.fromEntries(
        fields.map((name) => [name, name === "consent" ? false : ""])
      );
      reset(cleared as Partial<FieldSchema>);
      return;
    }

    setFeedback({
      type: "error",
      message: result?.message ?? "Something went wrong. Please try again.",
    });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={compact ? "space-y-3" : "space-y-4"}
      noValidate
    >
      {(intro ?? FORM_PRESETS[formType].intro) && (
        <p className="text-sm leading-relaxed text-base-content/70">
          {intro ?? FORM_PRESETS[formType].intro}
        </p>
      )}

      {feedback ? (
        <div
          role="alert"
          className={`alert alert-soft ${
            feedback.type === "success" ? "alert-success" : "alert-error"
          }`}
        >
          <span>{feedback.message}</span>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {fields.map((name) => {
          const config = FIELD_CONFIG[name];
          if (!config) return null;

          if (config.as === "consent") {
            return (
              <div key={name} className="sm:col-span-2">
                <label className="flex items-start gap-3 rounded-box border border-base-300 bg-base-100 p-3">
                  <input
                    type="checkbox"
                    {...register("consent")}
                    className="checkbox checkbox-primary mt-0.5"
                  />
                  <span className="text-sm leading-relaxed text-base-content/75">
                    I consent to Bright Mind processing my details to respond to
                    this enquiry.{" "}
                    <span className="text-error">* required</span>
                  </span>
                </label>
                {errors.consent ? (
                  <p className="mt-1 text-sm text-error">
                    {errors.consent.message ?? "Consent is required"}
                  </p>
                ) : null}
              </div>
            );
          }

          const error = errors[name];
          const span = config.full ? "sm:col-span-2" : undefined;

          if (config.as === "textarea") {
            return (
              <div key={name} className={span}>
                <label className="label pb-1 text-sm font-medium" htmlFor={name}>
                  {config.label}
                  {config.required ? <span className="text-error"> *</span> : null}
                </label>
                <textarea
                  id={name}
                  {...register(name)}
                  className={`textarea w-full ${error ? "textarea-error" : ""}`}
                  placeholder={config.placeholder}
                  rows={4}
                />
                {error?.message ? (
                  <p className="mt-1 text-sm text-error">
                    {String(error.message)}
                  </p>
                ) : null}
              </div>
            );
          }

          if (config.as === "select") {
            return (
              <div key={name} className={span}>
                <label className="label pb-1 text-sm font-medium" htmlFor={name}>
                  {config.label}
                  {config.required ? <span className="text-error"> *</span> : null}
                </label>
                <select
                  id={name}
                  {...register(name)}
                  className={`select w-full ${error ? "select-error" : ""}`}
                >
                  {config.options?.map((opt) => (
                    <option key={opt.value || "empty"} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {error?.message ? (
                  <p className="mt-1 text-sm text-error">
                    {String(error.message)}
                  </p>
                ) : null}
              </div>
            );
          }

          return (
            <div key={name} className={span}>
              <label className="label pb-1 text-sm font-medium" htmlFor={name}>
                {config.label}
                {config.required ? <span className="text-error"> *</span> : null}
              </label>
              <input
                id={name}
                type={config.type ?? "text"}
                {...register(name)}
                className={`input w-full ${error ? "input-error" : ""}`}
                placeholder={config.placeholder}
              />
              {error?.message ? (
                <p className="mt-1 text-sm text-error">{String(error.message)}</p>
              ) : null}
            </div>
          );
        })}
      </div>

      <button
        type="submit"
        className="btn btn-primary btn-lg btn-block"
        disabled={pending}
      >
        {pending ? (
          <>
            <span className="loading loading-spinner loading-sm" />
            Sending…
          </>
        ) : (
          submitLabel
        )}
      </button>
    </form>
  );
}
