import { z } from "zod";

export const issueDegreeSchema = z.object({
  body: z.object({
    studentName: z.string().min(2),
    studentEmail: z.string().email(),
    studentWallet: z.string().min(10),
    degreeTitle: z.string().min(2),
    department: z.string().min(2),
    graduationYear: z.number().int().min(1900).max(2200),
    issueDate: z.string().datetime().optional(),
    universityId: z.string().min(1),
    ipfsCID: z.string().min(3).optional(),
  }),
});

export const degreeIdSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});

export const revokeDegreeSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    reason: z.string().min(3),
  }),
});

