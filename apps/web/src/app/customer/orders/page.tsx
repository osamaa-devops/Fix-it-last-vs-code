'use client';

import { useCustomerOnly } from '@/hooks/useRoleBasedAccess';
import { OrdersPage } from '@/components/customer/OrdersPage';
import { Button } from '@/components/customer/UI';

export default function OrdersTrackingPage() {
  useCustomerOnly();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Button variant="outline" onClick={() => window.history.back()} size="small" className="mb-6">
          ← Back
        </Button>
        <OrdersPage />
      </div>
    </div>
  );
}
