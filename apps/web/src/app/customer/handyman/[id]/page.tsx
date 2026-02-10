'use client';

import { useCustomerOnly } from '@/hooks/useRoleBasedAccess';
import { HandymanProfile } from '@/components/customer/HandymanProfile';
import { Button } from '@/components/customer/UI';

interface HandymanDetailPageProps {
  params: {
    id: string;
  };
}

export default function HandymanDetailPage({ params }: HandymanDetailPageProps) {
  useCustomerOnly();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Button variant="outline" onClick={() => window.history.back()} size="small" className="mb-6">
          ← Back
        </Button>
        <HandymanProfile handymanId={params.id} />
      </div>
    </div>
  );
}
