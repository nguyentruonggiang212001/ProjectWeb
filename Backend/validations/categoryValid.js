import { z } from "zod";

const categorySchema = z.object({
  title: z.string().min(1, "Phải có tiêu đề"),
  description: z.string().optional(),
  slug: z.string().optional(),
});

export default categorySchema;
