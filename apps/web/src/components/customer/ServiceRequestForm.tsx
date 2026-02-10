'use client';

import { useState } from 'react';
import { useCreateServiceRequest, useHandymanProfile } from '@/hooks/useCustomer';
import { Button, TextInput } from './UI';
import { useSearchParams } from 'next/navigation';
import { LoadingSpinner } from './UI';

interface ServiceRequestFormProps {
  initialHandymanId?: string;
}

export function ServiceRequestForm({ initialHandymanId }: ServiceRequestFormProps) {
  const searchParams = useSearchParams();
  const handymanId = searchParams.get('handyman') || initialHandymanId || '';

  const { data: handyman } = useHandymanProfile(handymanId);
  const { mutate: createRequest, isPending, error } = useCreateServiceRequest();

  const [formData, setFormData] = useState({
    handymanId,
    category: '',
    title: '',
    description: '',
    scheduledDate: '',
  });

  const categories = [
    'Plumbing',
    'Electrical',
    'Carpentry',
    'Painting',
    'Cleaning',
    'HVAC',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim() || !formData.category || !formData.scheduledDate) {
      alert('Please fill in all fields');
      return;
    }

    createRequest(formData);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h1 className="text-2xl font-bold mb-6">Request Service</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
            {(error as Error).message}
          </div>
        )}

        {/* Selected Handyman */}
        {handyman && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Selected Professional</p>
            <div className="flex items-center gap-3">
              <img
                src={handyman.avatar}
                alt={handyman.fullName}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold">{handyman.fullName}</p>
                <p className="text-sm text-gray-600">${handyman.hourlyRate}/hour</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Service Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            >
              <option value="">Select a category...</option>
              {categories.map((cat) => (
                <option key={cat} value={cat.toLowerCase()}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Service Title</label>
            <TextInput
              placeholder="What needs to be fixed?"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              placeholder="Provide details about what you need done..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          {/* Scheduled Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date</label>
            <input
              type="date"
              value={formData.scheduledDate}
              onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isPending}
            fullWidth
            size="large"
          >
            {isPending ? 'Submitting...' : 'Submit Request'}
          </Button>
        </form>
      </div>
    </div>
  );
}
