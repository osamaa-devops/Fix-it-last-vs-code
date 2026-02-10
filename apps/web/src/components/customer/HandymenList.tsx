'use client';

import { useState } from 'react';
import { useHandymen } from '@/hooks/useCustomer';
import { LoadingSpinner, Button, EmptyState } from './UI';
import { Handyman } from '@/types/customer';
import Link from 'next/link';
import { Star } from 'lucide-react';

interface HandymenListProps {
  category?: string;
  page?: number;
  limit?: number;
  onPageChange?: (page: number) => void;
}

export function HandymenList({ category, page: externalPage, limit = 10, onPageChange }: HandymenListProps) {
  const [internalPage, setInternalPage] = useState(1);
  const page = externalPage !== undefined ? externalPage : internalPage;
  const setPage = onPageChange || setInternalPage;

  const { data, isLoading, error } = useHandymen(page, limit, category || '');

  if (isLoading) return <LoadingSpinner />;
  if (error)
    return (
      <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
        {(error as Error).message}
      </div>
    );

  const items = data?.data || [];
  const pagination = data?.pagination;

  if (!items.length)
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No handymen available</p>
      </div>
    );

  return (
    <div>
      <div className="grid gap-4 mb-8">
        {items.map((handyman: Handyman) => (
          <Link
            key={handyman.id}
            href={`/customer/handyman/${handyman.id}`}
            className="block border border-gray-200 rounded-lg p-4 hover:border-primary-500 hover:shadow-lg transition-all"
          >
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <img
                src={handyman.avatar}
                alt={handyman.fullName}
                className="w-16 h-16 rounded-full object-cover"
              />

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">{handyman.fullName}</h3>
                    {handyman.verified && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        ✓ Verified
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-primary-600">${handyman.hourlyRate}/hr</div>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={
                            i < Math.floor(handyman.rating)
                              ? 'fill-warning-400 text-warning-400'
                              : 'text-gray-300'
                          }
                        />
                      ))}
                  </div>
                  <span className="text-sm font-medium">{handyman.rating}</span>
                  <span className="text-xs text-gray-500">({handyman.reviews} reviews)</span>
                </div>

                {/* Stats */}
                <div className="flex gap-4 text-sm text-gray-600 mb-2">
                  <div>
                    <span className="font-medium">{handyman.completedJobs}</span> jobs
                  </div>
                  <div>
                    <span className="font-medium">{handyman.responseTime}h</span> response
                  </div>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-1">
                  {handyman.skills.slice(0, 3).map((skill, i) => (
                    <span key={i} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="flex-shrink-0">
                <span className="text-primary-600 hover:text-primary-700">→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex justify-between items-center mt-8 pt-4 border-t">
          <Button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            variant="outline"
          >
            Previous
          </Button>

          <div className="text-sm text-gray-600">
            Page {pagination.page} of {pagination.pages}
          </div>

          <Button
            onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
            disabled={page === pagination.pages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
