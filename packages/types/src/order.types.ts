export enum OrderStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export interface Order {
  id: string;
  customerId: string;
  handymanId: string;
  serviceId: string;
  status: OrderStatus;
  description: string;
  scheduledDate: string;
  address: string;
  budget?: number;
  actualPrice?: number;
  rating?: number;
  review?: string;
  cancelReason?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface CreateOrderRequest {
  handymanId: string;
  serviceId: string;
  description: string;
  scheduledDate: string;
  address: string;
  budget?: number;
}

export interface OrderFilters {
  status?: OrderStatus;
  customerId?: string;
  handymanId?: string;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
  offset?: number;
}
