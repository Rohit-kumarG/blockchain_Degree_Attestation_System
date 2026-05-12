import { z } from "zod";

export const createUniversitySchema = z.object({
  body: z.object({
    name: z.string().min(2),
    code: z.string().min(2).max(20),
    walletAddress: z.string().min(10),
  }),
});

export const universityIdSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});

