import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(5000),

  FRONTEND_URL: z
    .url()
    .default("http://localhost:5173"),

  DATABASE_URL: z
    .string()
    .min(1, "DATABASE_URL is required"),

  JWT_SECRET: z
    .string()
    .min(32, "JWT_SECRET must be at least 32 characters long"),

  GOOGLE_CLIENT_ID: z.string().optional(),

  GOOGLE_CLIENT_SECRET: z.string().optional(),

  GOOGLE_CALLBACK_URL: z.url().optional(),

  GEMINI_API_KEY: z.string().optional(),

  GEMINI_MODEL: z
    .string()
    .default("gemini-3.6-flash"),
});

export const env = envSchema.parse({
  PORT: process.env.PORT,

  FRONTEND_URL: process.env.FRONTEND_URL,

  DATABASE_URL: process.env.DATABASE_URL,

  JWT_SECRET: process.env.JWT_SECRET,

  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,

  GOOGLE_CLIENT_SECRET:
    process.env.GOOGLE_CLIENT_SECRET,

  GOOGLE_CALLBACK_URL:
    process.env.GOOGLE_CALLBACK_URL,

  GEMINI_API_KEY:
    process.env.GEMINI_API_KEY,

  GEMINI_MODEL:
    process.env.GEMINI_MODEL,
});