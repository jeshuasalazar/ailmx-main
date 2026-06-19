import { z } from "zod";

const academyBaseSchema = z.string().url().transform((value) => new URL(value));
const campaignSchema = z.string().regex(/^[a-z0-9-]{1,80}$/);
const sourceSchema = z.string().regex(/^[a-z0-9-]{1,80}$/);

export function buildAcademyUrl({ locale, source, campaign }: { locale: "es"; source: string; campaign?: string }) {
  const fallback = "https://academia.ailearning.mx";
  const parsed = academyBaseSchema.safeParse(process.env.ACADEMIA_PUBLIC_URL || fallback);
  const base = parsed.success && (process.env.NODE_ENV !== "production" || parsed.data.protocol === "https:") ? parsed.data : new URL(fallback);
  const url = new URL("/register", base);
  url.searchParams.set("locale", locale);
  if (sourceSchema.safeParse(source).success) url.searchParams.set("source", source);
  if (campaign && campaignSchema.safeParse(campaign).success) url.searchParams.set("campaign", campaign);
  return url.toString();
}
