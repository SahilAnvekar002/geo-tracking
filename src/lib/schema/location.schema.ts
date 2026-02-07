import z from "zod";

export const locationSchema = z.object({
  email: z.email("Invalid Email"),
  lat: z.number().optional(),
  long: z.number().optional(),
});

export type TLocation = z.infer<typeof locationSchema>;