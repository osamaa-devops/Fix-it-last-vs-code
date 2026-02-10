# Mobile Customer Flow

## Screens
- **Categories**: Browse service categories (6 available)
- **Handymen**: List with pagination, filtering by category
- **Handyman Profile**: Full profile with stats, skills, CTA
- **Create Request**: Book a service (pre-filled handyman)
- **Orders**: Track requests with status filters

## Data
- 6 Categories, 6 Handymen mock profiles, Sample service requests
- Mock service: `apps/mobile/src/services/customerService.ts`

## Setup
1. Use `CustomerNavigator` from `screens/customer/index.tsx` in your tab navigator
2. React Query hooks: `useCategories()`, `useHandymen()`, `useHandymanProfile()`, `useServiceRequests()`, `useCreateServiceRequest()`, `useUpdateServiceRequest()`
3. Types: `Category`, `Handyman`, `ServiceRequest`, `PaginatedResponse`
4. Mock → Real API: Update `apps/mobile/src/services/customerService.ts` functions with API calls
5. All screens protected with `useCustomerOnly()` hook (add when auth context ready)

## Styling
- Primary: #0ea5e9 | Tailwind responsive | Status-specific colors
