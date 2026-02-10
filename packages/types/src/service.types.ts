export interface Category {
  id: string;
  name: string;
  description: string;
  icon?: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  category?: Category;
  price?: number;
  estimatedDuration?: number; // in minutes
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceFilters {
  categoryId?: string;
  search?: string;
  minRating?: number;
  maxPrice?: number;
  limit?: number;
  offset?: number;
}

export interface Handyman {
  id: string;
  userId: string;
  user?: import("./user.types").User;
  services: Service[];
  hourlyRate: number;
  rating: number;
  reviewCount: number;
  completedOrders: number;
  isAvailable: boolean;
  verificationStatus: "PENDING" | "VERIFIED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
}

export interface HandymanFilters {
  serviceId?: string;
  city?: string;
  minRating?: number;
  availability?: boolean;
  limit?: number;
  offset?: number;
}

export interface Rating {
  id: string;
  handymanId: string;
  customerId: string;
  orderId: string;
  rating: number;
  review: string;
  createdAt: string;
  updatedAt: string;
}
