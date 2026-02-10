'use client';

import { useCustomerOnly } from '@/hooks/useRoleBasedAccess';
import { CategoriesGrid } from '@/components/customer/CategoriesGrid';

export default function CustomerHomePage() {
  useCustomerOnly();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white py-12 mb-12">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Fix It</h1>
          <p className="text-lg opacity-90">Find trusted handymen for all your home repair needs</p>
        </div>
      </div>

      {/* Categories Section */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Browse by Service</h2>
          <CategoriesGrid />
        </div>
      </div>
    </div>
  );
}
