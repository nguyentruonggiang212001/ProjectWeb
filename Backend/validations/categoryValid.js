import { z } from "zod";

const categorySchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  slug: z.string().optional(),
});

export default categorySchema;
