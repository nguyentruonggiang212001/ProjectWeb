import * as z from "zod";

export const schemaCart = z.object({
  number: z.number().positive,
});
