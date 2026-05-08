import { z } from "zod";
import { userRoles } from "@/drizzle/schema";

export const createUserSchema = z.object({
  name:     z.string().min(2).max(100),
  username: z.string().min(3).max(50),
  email:    z.string().email(),
  dob:      z.string().date(),
  gender:   z.enum(["Male", "Female", "Other"]),
  role:     z.enum(userRoles).default("guest"),
  skills:   z.string().transform((val) =>
              val.split(",").map((s) => s.trim()).filter(Boolean)
            ),
});

export const updateUserSchema = createUserSchema.partial().extend({
  id: z.coerce.number().positive(),
});