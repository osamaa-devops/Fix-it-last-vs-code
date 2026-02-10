// Screens
export { CategoriesScreen } from './CategoriesScreen';
export { HandymenScreen } from './HandymenScreen';
export { HandymanProfileScreen } from './HandymanProfileScreen';
export { CreateRequestScreen } from './CreateRequestScreen';
export { OrdersScreen } from './OrdersScreen';
export { CustomerNavigator } from './index';

// Types
export type { Category, Handyman, ServiceRequest, PaginatedResponse } from '@/types/customer';

// Hooks
export { useCategories, useHandymen, useHandymanProfile, useServiceRequests, useCreateServiceRequest, useUpdateServiceRequest } from '@/hooks/useCustomer';

// Services
export { getCategories, getHandymen, getHandymanById, getServiceRequests, createServiceRequest, updateServiceRequest } from '@/services/customerService';
