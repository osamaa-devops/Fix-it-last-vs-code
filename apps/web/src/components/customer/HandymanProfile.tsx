'use client';

import { useHandymanProfile } from '@/hooks/useCustomer';
import { LoadingSpinner, Button } from './UI';
import { useRouter } from 'next/navigation';
import { Star, MapPin, Clock, Award, CheckCircle } from 'lucide-react';

interface HandymanProfileProps {
  handymanId: string;
}

export function HandymanProfile({ handymanId }: HandymanProfileProps) {
  const router = useRouter();
  const { data: handyman, isLoading, error } = useHandymanProfile(handymanId);

  if (isLoading) return <LoadingSpinner />;
  if (error)
    return (
      <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
        {(error as Error).message}
      </div>
    );
  if (!handyman)
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Handyman not found</p>
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-start gap-6 mb-8 p-6 bg-white rounded-lg border border-gray-200">
        <img
          src={handyman.avatar}
          alt={handyman.fullName}
          className="w-24 h-24 rounded-full object-cover"
        />

        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold">{handyman.fullName}</h1>
            {handyman.verified && (
              <CheckCircle size={24} className="text-green-500" />
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i < Math.floor(handyman.rating)
                        ? 'fill-warning-400 text-warning-400'
                        : 'text-gray-300'
                    }
                  />
                ))}
            </div>
            <span className="font-semibold">{handyman.rating}</span>
            <span className="text-gray-600">({handyman.reviews} reviews)</span>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-2xl font-bold text-primary-600">${handyman.hourlyRate}</div>
              <div className="text-sm text-gray-600">per hour</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary-600">{handyman.completedJobs}</div>
              <div className="text-sm text-gray-600">jobs completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary-600">{handyman.responseTime}h</div>
              <div className="text-sm text-gray-600">avg response</div>
            </div>
          </div>
        </div>
      </div>

      {/* About */}
      <div className="mb-8 p-6 bg-white rounded-lg border border-gray-200">
        <h2 className="text-lg font-semibold mb-3">About</h2>
        <p className="text-gray-700">{handyman.about}</p>
      </div>

      {/* Skills */}
      <div className="mb-8 p-6 bg-white rounded-lg border border-gray-200">
        <h2 className="text-lg font-semibold mb-3">Skills & Expertise</h2>
        <div className="flex flex-wrap gap-2">
          {handyman.skills.map((skill, i) => (
            <span key={i} className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 text-blue-900 font-semibold">
            <Clock size={20} />
            Response Time
          </div>
          <p className="text-sm text-blue-800 mt-1">{handyman.responseTime} hours average</p>
        </div>

        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 text-green-900 font-semibold">
            <Award size={20} />
            Verified Professional
          </div>
          <p className="text-sm text-green-800 mt-1">
            {handyman.verified ? 'Identity and reviews verified' : 'Not yet verified'}
          </p>
        </div>
      </div>

      {/* CTA Button */}
      <Button
        onClick={() => router.push(`/customer/request?handyman=${handyman.id}`)}
        size="large"
        fullWidth
      >
        Request Service
      </Button>

      <button
        onClick={() => router.back()}
        className="w-full mt-3 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
      >
        Back
      </button>
    </div>
  );
}
