import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(6),
  password: z.string().min(6),
  role: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
