import { z } from "zod";

const roleSchema = z.enum(["CREATOR", "CLIENT"]);

export const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: roleSchema.optional().default("CREATOR"),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: roleSchema.optional(),
});

export const creatorProfileSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-z0-9_]+$/, "Username must use lowercase letters, numbers, and underscore only."),
  name: z.string().min(2),
  tiktokHandle: z.string().min(2),
  bio: z.string().min(10).max(280),
  niche: z.string().min(2),
  followers: z.coerce.number().int().nonnegative(),
  priceRange: z.string().optional(),
  sampleVideos: z
    .array(z.string().url("Each sample video must be a valid URL."))
    .min(1, "Add at least one sample video URL.")
    .max(5, "Maximum 5 sample video URLs allowed."),
});

export const clientProfileSchema = z.object({
  companyName: z.string().min(2),
  contactName: z.string().min(2),
  industry: z.string().min(2),
  website: z.string().url("Website must be a valid URL.").optional().or(z.literal("")),
  description: z.string().min(15),
});

export const campaignPostSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(20),
  budget: z.string().min(1),
  niche: z.string().min(2),
  deliverables: z.string().min(10),
  deadline: z.string().optional(),
});

export const dealRequestSchema = z.object({
  creatorId: z.string().min(1),
  name: z.string().min(2),
  email: z.string().email(),
  description: z.string().min(10),
  budget: z.string().min(1),
  deliverables: z.string().min(5),
});
