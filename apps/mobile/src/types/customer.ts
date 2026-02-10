export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  count: number;
}

export interface Handyman {
  id: string;
  fullName: string;
  rating: number;
  reviews: number;
  hourlyRate: number;
  skills: string[];
  about: string;
  avatar: string;
  verified: boolean;
  responseTime: number;
  completedJobs: number;
}

export interface ServiceRequest {
  id: string;
  customerId: string;
  handymanId: string;
  category: string;
  title: string;
  description: string;
  status: 'pending' | 'accepted' | 'in-progress' | 'completed' | 'cancelled';
  estimatedPrice: number | null;
  actualPrice: number | null;
  scheduledDate: string;
  createdAt: string;
  updatedAt: string;
  handyman?: Handyman;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
