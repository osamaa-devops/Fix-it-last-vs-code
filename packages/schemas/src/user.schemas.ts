import { z } from "zod";

export const UpdateProfileSchema = z.object({
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number").optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  bio: z.string().max(500).optional(),
});

export type TUpdateProfile = z.infer<typeof UpdateProfileSchema>;

export const UserFilterSchema = z.object({
  role: z.enum(["CUSTOMER", "HANDYMAN", "ADMIN"]).optional(),
  search: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]).optional(),
});

export type TUserFilter = z.infer<typeof UserFilterSchema>;
