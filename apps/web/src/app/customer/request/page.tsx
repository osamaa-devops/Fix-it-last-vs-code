'use client';

import { useCustomerOnly } from '@/hooks/useRoleBasedAccess';
import { ServiceRequestForm } from '@/components/customer/ServiceRequestForm';
import { Button } from '@/components/customer/UI';

export default function RequestServicePage() {
  useCustomerOnly();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <Button variant="outline" onClick={() => window.history.back()} size="small" className="mb-6">
          ← Back
        </Button>
        <ServiceRequestForm />
      </div>
    </div>
  );
}
