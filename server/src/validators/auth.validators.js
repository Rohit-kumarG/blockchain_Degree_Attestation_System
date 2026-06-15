import { z } from "zod";
import { roles } from "../utils/roles.js";

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email().refine(
      (email) => {
        const domain = email.split("@")[1]?.toLowerCase();
        return domain === "iqra.edu.pk" || domain?.endsWith(".iqra.edu.pk");
      },
      { message: "Only Iqra University emails (e.g. @iqra.edu.pk) are accepted." }
    ),
    password: z.string().min(8),
    role: z.enum(Object.values(roles)).default(roles.STUDENT),
    walletAddress: z.string().optional(),
    university: z.string().optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1),
  }),
});

