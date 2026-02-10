'use client';

import { useCategories } from '@/hooks/useCustomer';
import { LoadingSpinner } from './UI';
import Link from 'next/link';
import { Category } from '@/types/customer';

export function CategoriesGrid() {
  const { data, isLoading, error } = useCategories();

  if (isLoading) return <LoadingSpinner />;
  if (error)
    return (
      <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
        {(error as Error).message}
      </div>
    );
  if (!data?.length)
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No categories found</p>
      </div>
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((category: Category) => (
        <Link
          key={category.id}
          href={`/customer/handymen?category=${category.id}`}
          className="group block p-6 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-blue-50 transition-all"
        >
          <div className="text-4xl mb-3">{category.icon}</div>
          <h3 className="font-semibold text-lg group-hover:text-primary-600">{category.name}</h3>
          <p className="text-sm text-gray-600 mb-3">{category.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded">
              {category.count} available
            </span>
            <span className="text-primary-600 group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
