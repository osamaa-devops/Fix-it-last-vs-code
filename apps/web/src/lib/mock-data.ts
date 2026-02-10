import { Category, Handyman, ServiceRequest } from '@/types/customer';

// Mock Data
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
    skills: ['Electrical', 'Wiring', 'Testing'],
    about: 'Licensed electrician specializing in residential work',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria-garcia',
    verified: true,
    responseTime: 1,
    completedJobs: 501,
  },
  {
    id: 'hand_3',
    fullName: 'Michael Chen',
    rating: 4.7,
    reviews: 89,
    hourlyRate: 55,
    skills: ['HVAC', 'Installation', 'Maintenance'],
    about: 'Certified HVAC technician ready to help',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=michael-chen',
    verified: true,
    responseTime: 3,
    completedJobs: 178,
  },
  {
    id: 'hand_4',
    fullName: 'Sarah Williams',
    rating: 4.6,
    reviews: 112,
    hourlyRate: 48,
    skills: ['Carpentry', 'Furniture Repair', 'Assembly'],
    about: 'Professional carpenter with modern tools',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah-williams',
    verified: true,
    responseTime: 2,
    completedJobs: 267,
  },
  {
    id: 'hand_5',
    fullName: 'David Kumar',
    rating: 4.5,
    reviews: 73,
    hourlyRate: 40,
    skills: ['Painting', 'Interior Design', 'Surface Prep'],
    about: 'Expert painter with eye for detail',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david-kumar',
    verified: false,
    responseTime: 4,
    completedJobs: 145,
  },
  {
    id: 'hand_6',
    fullName: 'Lisa Anderson',
    rating: 4.9,
    reviews: 234,
    hourlyRate: 38,
    skills: ['Cleaning', 'Organization', 'Sanitizing'],
    about: 'Professional cleaner with eco-friendly products',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa-anderson',
    verified: true,
    responseTime: 1,
    completedJobs: 456,
  },
];

const serviceRequests: ServiceRequest[] = [
  {
    id: 'req_1',
    customerId: 'cust_1',
    handymanId: 'hand_1',
    category: 'plumbing',
    title: 'Fix kitchen sink leak',
    description: 'Water is dripping from under the sink',
    status: 'completed',
    estimatedPrice: 120,
    actualPrice: 135,
    scheduledDate: '2026-02-08',
    createdAt: '2026-02-05',
    updatedAt: '2026-02-08',
    handyman: handymen[0],
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
    handyman: handymen[1],
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
    handyman: handymen[2],
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
    handyman: handymen[3],
  },
];

// API Helpers
export function getCategories(): Category[] {
  return categories;
}

export function getHandymen(page: number = 1, limit: number = 10, category: string = '') {
  let filtered = handymen;
  
  if (category) {
    // In real app, would filter by category
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

export function getHandymanById(id: string): Handyman | null {
  return handymen.find((h) => h.id === id) || null;
}

export function getServiceRequests(customerId: string, page: number = 1, limit: number = 10) {
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

export function createServiceRequest(data: Partial<ServiceRequest>): ServiceRequest {
  const request: ServiceRequest = {
    id: `req_${Date.now()}`,
    customerId: data.customerId || 'cust_1',
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

export function updateServiceRequest(id: string, data: Partial<ServiceRequest>): ServiceRequest | null {
  const request = serviceRequests.find((r) => r.id === id);
  if (!request) return null;

  Object.assign(request, { ...data, updatedAt: new Date().toISOString() });
  return request;
}
