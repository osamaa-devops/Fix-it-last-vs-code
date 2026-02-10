# Customer Portal

## Setup
- Routes: `/customer`, `/customer/handymen`, `/customer/handyman/[id]`, `/customer/request`, `/customer/orders`
- **Components**: CategoriesGrid, HandymenList, HandymanProfile, ServiceRequestForm, OrdersPage
- **Hooks**: useCategories, useHandymen, useHandymanProfile, useServiceRequests, useCreateServiceRequest, useUpdateServiceRequest
- **Mock Data**: 6 categories, 6 handymen, 4 sample service requests
- **TanStack Query**: Auto caching, pagination, mutation invalidation
- **Role Protection**: useCustomerOnly() hook on all routes
- To integrate real backend: Update `/lib/mock-data.ts` functions with actual API calls
