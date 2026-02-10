import { z } from "zod";

export const CreateOrderSchema = z.object({
  handymanId: z.string().uuid("Invalid handyman ID"),
  serviceId: z.string().uuid("Invalid service ID"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  scheduledDate: z.string().datetime(),
  address: z.string().min(5, "Address must be at least 5 characters"),
  budget: z.number().positive("Budget must be positive").optional(),
});

export type TCreateOrder = z.infer<typeof CreateOrderSchema>;

export const OrderFilterSchema = z.object({
  status: z
    .enum(["PENDING", "ACCEPTED", "IN_PROGRESS", "COMPLETED", "CANCELLED"])
    .optional(),
  customerId: z.string().uuid().optional(),
  handymanId: z.string().uuid().optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
});

export type TOrderFilter = z.infer<typeof OrderFilterSchema>;

export const OrderStatusUpdateSchema = z.object({
  status: z.enum(["ACCEPTED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]),
  notes: z.string().optional(),
});

export type TOrderStatusUpdate = z.infer<typeof OrderStatusUpdateSchema>;
