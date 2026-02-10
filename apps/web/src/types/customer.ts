import { z } from 'zod';

// Categories
export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  icon: z.string(),
  count: z.number(),
});

export type Category = z.infer<typeof CategorySchema>;

// Handyman
export const HandymanSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  rating: z.number().min(0).max(5),
  reviews: z.number(),
  hourlyRate: z.number(),
  skills: z.array(z.string()),
  about: z.string(),
  avatar: z.string(),
  verified: z.boolean(),
  responseTime: z.number(),
  completedJobs: z.number(),
});

export type Handyman = z.infer<typeof HandymanSchema>;

// Service Request
export const ServiceRequestSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  handymanId: z.string(),
  category: z.string(),
  title: z.string(),
  description: z.string(),
  status: z.enum(['pending', 'accepted', 'in-progress', 'completed', 'cancelled']),
  estimatedPrice: z.number().nullable(),
  actualPrice: z.number().nullable(),
  scheduledDate: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  handyman: HandymanSchema.optional(),
});

export type ServiceRequest = z.infer<typeof ServiceRequestSchema>;

// Pagination
export const PaginationSchema = z.object({
  page: z.number().default(1),
  limit: z.number().default(10),
  total: z.number(),
  pages: z.number(),
});

export type Pagination = z.infer<typeof PaginationSchema>;

// Paginated Response
export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(schema: T) =>
  z.object({
    data: z.array(schema),
    pagination: PaginationSchema,
  });

// User with Role
export const UserWithRoleSchema = z.object({
  id: z.string(),
  email: z.string(),
  fullName: z.string(),
  userType: z.enum(['customer', 'handyman', 'admin']),
  avatar: z.string().nullable(),
});

export type UserWithRole = z.infer<typeof UserWithRoleSchema>;
