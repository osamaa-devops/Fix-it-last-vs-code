'use client';

import { useState } from 'react';
import { useServiceRequests, useUpdateServiceRequest } from '@/hooks/useCustomer';
import { Button, LoadingSpinner } from './UI';
import { AlertCircle, CheckCircle, Clock, MapPin } from 'lucide-react';

const statusColors = {
  pending: 'bg-yellow-50 border-yellow-200 text-yellow-700',
  accepted: 'bg-blue-50 border-blue-200 text-blue-700',
  'in-progress': 'bg-purple-50 border-purple-200 text-purple-700',
  completed: 'bg-green-50 border-green-200 text-green-700',
  cancelled: 'bg-red-50 border-red-200 text-red-700',
};

const statusIcons = {
  pending: <Clock className="w-4 h-4" />,
  accepted: <AlertCircle className="w-4 h-4" />,
  'in-progress': <Clock className="w-4 h-4" />,
  completed: <CheckCircle className="w-4 h-4" />,
  cancelled: <AlertCircle className="w-4 h-4" />,
};

export function OrdersPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const limit = 5;

  const { data, isLoading, error } = useServiceRequests(page, limit);
  const { mutate: updateRequest } = useUpdateServiceRequest();

  const filteredRequests = statusFilter
    ? data?.data.filter((r) => r.status === statusFilter) || []
    : data?.data || [];

  const handleCancelRequest = (id: string) => {
    if (window.confirm('Cancel this service request?')) {
      updateRequest({ id, data: { status: 'cancelled' } });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {(error as Error).message}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Service Requests</h1>

      {/* Filter Tabs */}
      <div className="mb-6 flex gap-2 flex-wrap">
        <button
          onClick={() => {
            setStatusFilter('');
            setPage(1);
          }}
          className={`px-4 py-2 rounded-lg border transition ${
            statusFilter === ''
              ? 'bg-primary-500 text-white border-primary-500'
              : 'border-gray-300 hover:bg-gray-50'
          }`}
        >
          All Requests
        </button>
        {['pending', 'accepted', 'in-progress', 'completed'].map((status) => (
          <button
            key={status}
            onClick={() => {
              setStatusFilter(status);
              setPage(1);
            }}
            className={`px-4 py-2 rounded-lg border transition capitalize ${
              statusFilter === status
                ? 'bg-primary-500 text-white border-primary-500'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            {status === 'in-progress' ? 'In Progress' : status}
          </button>
        ))}
      </div>

      {/* Requests List */}
      <div className="space-y-4 mb-6">
        {filteredRequests.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No service requests found</p>
          </div>
        ) : (
          filteredRequests.map((request) => (
            <div
              key={request.id}
              className={`border rounded-lg p-4 ${statusColors[request.status as keyof typeof statusColors]}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-start gap-2 mb-2">
                  {statusIcons[request.status as keyof typeof statusIcons]}
                  <div>
                    <h3 className="font-semibold">{request.title}</h3>
                    <p className="text-sm opacity-80">Request #{request.id.slice(0, 8)}</p>
                  </div>
                </div>
                <span className="text-sm font-semibold capitalize bg-white bg-opacity-50 px-3 py-1 rounded">
                  {request.status === 'in-progress' ? 'In Progress' : request.status}
                </span>
              </div>

              <p className="text-sm mb-3">{request.description}</p>

              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <p className="opacity-75">Handyman</p>
                  <p className="font-semibold">{request.handymanId || 'Not assigned'}</p>
                </div>
                <div>
                  <p className="opacity-75">Scheduled Date</p>
                  <p className="font-semibold">
                    {new Date(request.scheduledDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="opacity-75">Category</p>
                  <p className="font-semibold capitalize">{request.category}</p>
                </div>
                <div>
                  <p className="opacity-75">Created</p>
                  <p className="font-semibold">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2 border-t border-current border-opacity-20">
                {request.status === 'pending' && (
                  <button
                    onClick={() => handleCancelRequest(request.id)}
                    className="text-sm px-3 py-1 rounded hover:bg-white hover:bg-opacity-50 transition"
                  >
                    Cancel
                  </button>
                )}
                <button className="text-sm px-3 py-1 rounded hover:bg-white hover:bg-opacity-50 transition">
                  View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {data && data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <Button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            variant="outline"
          >
            Previous
          </Button>

          <span className="text-gray-600">
            Page {page} of {data.pagination.pages}
          </span>

          <Button
            onClick={() => setPage(Math.min(data.pagination.pages, page + 1))}
            disabled={page === data.pagination.pages}
            variant="outline"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
