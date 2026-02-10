import { z } from "zod";

export const ServiceFilterSchema = z.object({
  categoryId: z.string().uuid().optional(),
  search: z.string().optional(),
  minRating: z.number().min(0).max(5).optional(),
  maxPrice: z.number().positive().optional(),
});

export type TServiceFilter = z.infer<typeof ServiceFilterSchema>;

export const HandymanFilterSchema = z.object({
  serviceId: z.string().uuid().optional(),
  city: z.string().optional(),
  minRating: z.number().min(0).max(5).optional(),
  availability: z.boolean().optional(),
});

export type THandymanFilter = z.infer<typeof HandymanFilterSchema>;

export const RatingSchema = z.object({
  rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
  review: z.string().min(10, "Review must be at least 10 characters").max(1000),
});

export type TRating = z.infer<typeof RatingSchema>;
