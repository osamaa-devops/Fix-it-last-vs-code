'use client';

import { useState } from 'react';
import { useCustomerOnly } from '@/hooks/useRoleBasedAccess';
import { HandymenList } from '@/components/customer/HandymenList';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/customer/UI';

export default function HandymenPage() {
  useCustomerOnly();

  const searchParams = useSearchParams();
  const category = searchParams.get('category') || '';
  const [page, setPage] = useState(1);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button variant="outline" onClick={() => window.history.back()} size="small" className="mb-4">
            ← Back
          </Button>
          <h1 className="text-3xl font-bold">Available Handymen</h1>
          {category && (
            <p className="text-gray-600 mt-2">
              Showing professionals for <span className="font-semibold capitalize">{category}</span>
            </p>
          )}
        </div>

        {/* Handymen List */}
        <HandymenList page={page} limit={6} category={category.toLowerCase()} onPageChange={setPage} />
      </div>
    </div>
  );
}
