import { z } from "zod";

export const CreateTranscationSchema = z.object({
  amount: z.coerce.number().positive().multipleOf(0.01),
  description: z.string().optional(),
  date: z.coerce.date(),
  category: z.string(),
  type: z.union([z.literal("income"), z.literal("expense")]),
});
export type CreateTranscationSchemaType = z.infer<
  typeof CreateTranscationSchema
>;
