import { Category, Handyman, ServiceRequest, PaginatedResponse } from '@/types/customer';

const categories: Category[] = [
  {
    id: 'plumbing',
    name: 'Plumbing',
    description: 'Fix pipes, leaks, and water issues',
    icon: '🚰',
    count: 245,
  },
  {
    id: 'electrical',
    name: 'Electrical',
    description: 'Electrical repairs and installations',
    icon: '⚡',
    count: 189,
  },
  {
    id: 'carpentry',
    name: 'Carpentry',
    description: 'Furniture and wooden repairs',
    icon: '🪵',
    count: 156,
  },
  {
    id: 'painting',
    name: 'Painting',
    description: 'House and room painting',
    icon: '🎨',
    count: 203,
  },
  {
    id: 'cleaning',
    name: 'Cleaning',
    description: 'Professional cleaning services',
    icon: '🧹',
    count: 312,
  },
  {
    id: 'hvac',
    name: 'HVAC',
    description: 'Heating, cooling, and air conditioning',
    icon: '❄️',
    count: 128,
  },
];

const handymen: Handyman[] = [
  {
    id: 'hand_1',
    fullName: 'John Smith',
    rating: 4.8,
    reviews: 156,
    hourlyRate: 50,
    skills: ['Plumbing', 'PVC Repair', 'Leak Detection'],
    about: 'Expert plumber with 15 years of experience',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john-smith',
    verified: true,
    responseTime: 2,
    completedJobs: 342,
  },
  {
    id: 'hand_2',
    fullName: 'Maria Garcia',
    rating: 4.9,
    reviews: 203,
    hourlyRate: 45,
    skills: ['Electrical', 'Rewiring', 'Panel Installation'],
    about: 'Licensed electrician with 12 years of field experience',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria-garcia',
    verified: true,
    responseTime: 1,
    completedJobs: 456,
  },
  {
    id: 'hand_3',
    fullName: 'Robert Johnson',
    rating: 4.7,
    reviews: 128,
    hourlyRate: 55,
    skills: ['Carpentry', 'Furniture Building', 'Repairs'],
    about: 'Master carpenter specializing in custom woodwork',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=robert-johnson',
    verified: true,
    responseTime: 3,
    completedJobs: 289,
  },
  {
    id: 'hand_4',
    fullName: 'Sarah Martinez',
    rating: 4.6,
    reviews: 95,
    hourlyRate: 40,
    skills: ['Painting', 'Interior Design', 'Drywall'],
    about: 'Professional painter with eye for detail and quality',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah-martinez',
    verified: true,
    responseTime: 4,
    completedJobs: 178,
  },
  {
    id: 'hand_5',
    fullName: 'David Chen',
    rating: 4.9,
    reviews: 234,
    hourlyRate: 35,
    skills: ['Cleaning', 'Disinfection', 'Organizing'],
    about: 'Professional cleaner committed to excellence',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david-chen',
    verified: true,
    responseTime: 2,
    completedJobs: 567,
  },
  {
    id: 'hand_6',
    fullName: 'Michael Thompson',
    rating: 4.8,
    reviews: 156,
    hourlyRate: 60,
    skills: ['HVAC', 'AC Repair', 'Maintenance'],
    about: 'Certified HVAC technician with 18 years experience',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=michael-thompson',
    verified: true,
    responseTime: 5,
    completedJobs: 412,
  },
];

const serviceRequests: ServiceRequest[] = [
  {
    id: 'req_1',
    customerId: 'cust_1',
    handymanId: 'hand_1',
    category: 'plumbing',
    title: 'Fix kitchen sink leak',
    description: 'Water coming from under the kitchen sink',
    status: 'completed',
    estimatedPrice: 120,
    actualPrice: 100,
    scheduledDate: '2026-02-08',
    createdAt: '2026-02-07',
    updatedAt: '2026-02-08',
  },
  {
    id: 'req_2',
    customerId: 'cust_1',
    handymanId: 'hand_2',
    category: 'electrical',
    title: 'Broken light switch replacement',
    description: 'Bathroom light switch is broken, needs replacement',
    status: 'in-progress',
    estimatedPrice: 80,
    actualPrice: null,
    scheduledDate: '2026-02-10',
    createdAt: '2026-02-09',
    updatedAt: '2026-02-09',
  },
  {
    id: 'req_3',
    customerId: 'cust_1',
    handymanId: 'hand_3',
    category: 'hvac',
    title: 'AC maintenance check',
    description: 'Annual AC unit maintenance and filter change',
    status: 'accepted',
    estimatedPrice: 150,
    actualPrice: null,
    scheduledDate: '2026-02-12',
    createdAt: '2026-02-09',
    updatedAt: '2026-02-09',
  },
  {
    id: 'req_4',
    customerId: 'cust_1',
    handymanId: 'hand_4',
    category: 'carpentry',
    title: 'Build bookshelf',
    description: 'Custom built-in bookshelf for living room',
    status: 'pending',
    estimatedPrice: 300,
    actualPrice: null,
    scheduledDate: '2026-02-15',
    createdAt: '2026-02-09',
    updatedAt: '2026-02-09',
  },
];

export async function getCategories(): Promise<Category[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return categories;
}

export async function getHandymen(
  page: number = 1,
  limit: number = 10,
  category: string = ''
): Promise<PaginatedResponse<Handyman>> {
  await new Promise((resolve) => setTimeout(resolve, 600));
  let filtered = handymen;

  if (category) {
    filtered = handymen.slice(0, Math.min(3, handymen.length));
  }

  const start = (page - 1) * limit;
  const end = start + limit;
  const data = filtered.slice(start, end);
  const total = filtered.length;

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}

export async function getHandymanById(id: string): Promise<Handyman | null> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return handymen.find((h) => h.id === id) || null;
}

export async function getServiceRequests(
  customerId: string,
  page: number = 1,
  limit: number = 10
): Promise<PaginatedResponse<ServiceRequest>> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const userRequests = serviceRequests.filter((r) => r.customerId === customerId);
  const start = (page - 1) * limit;
  const end = start + limit;
  const data = userRequests.slice(start, end);

  return {
    data,
    pagination: {
      page,
      limit,
      total: userRequests.length,
      pages: Math.ceil(userRequests.length / limit),
    },
  };
}

export async function createServiceRequest(
  data: Partial<ServiceRequest> & { customerId: string }
): Promise<ServiceRequest> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  const request: ServiceRequest = {
    id: `req_${Date.now()}`,
    customerId: data.customerId,
    handymanId: data.handymanId || 'hand_1',
    category: data.category || 'plumbing',
    title: data.title || 'Service Request',
    description: data.description || '',
    status: 'pending',
    estimatedPrice: data.estimatedPrice || null,
    actualPrice: null,
    scheduledDate: data.scheduledDate || new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  serviceRequests.push(request);
  return request;
}

export async function updateServiceRequest(
  id: string,
  data: Partial<ServiceRequest>
): Promise<ServiceRequest | null> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const request = serviceRequests.find((r) => r.id === id);
  if (!request) return null;

  Object.assign(request, { ...data, updatedAt: new Date().toISOString() });
  return request;
}
