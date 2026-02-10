'use client';

import { useAuth } from '@/lib/auth-context';
import { Protected } from '@/components/auth/ProtectedRoute';

function DashboardContent() {
  const { user, logout, isLoading } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Fix It</h1>
          <div className="flex items-center gap-4">
            {user && (
              <>
                <span className="text-gray-700">
                  Welcome, <strong>{user.fullName}</strong>
                </span>
                <button
                  onClick={handleLogout}
                  disabled={isLoading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Logging out...' : 'Logout'}
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Dashboard</h2>
              <p className="text-gray-600">Welcome to your Fix It dashboard</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-6 bg-blue-50">
                <h3 className="font-semibold text-gray-900 mb-2">User Information</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>
                    <strong>Name:</strong> {user?.fullName}
                  </p>
                  <p>
                    <strong>Email:</strong> {user?.email}
                  </p>
                  <p>
                    <strong>Role:</strong> {user?.role}
                  </p>
                  <p>
                    <strong>Status:</strong> {user?.status}
                  </p>
                </div>
              </div>

              <div className="border rounded-lg p-6 bg-indigo-50">
                <h3 className="font-semibold text-gray-900 mb-2">Next Steps</h3>
                <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
                  {user?.role === 'HANDYMAN' ? (
                    <>
                      <li>Complete your profile</li>
                      <li>Add your services</li>
                      <li>Set your availability</li>
                      <li>Wait for job requests</li>
                    </>
                  ) : (
                    <>
                      <li>Browse available services</li>
                      <li>Find a handyman</li>
                      <li>Book a service</li>
                      <li>Rate and review</li>
                    </>
                  )}
                </ul>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Navigation</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {user?.role === 'HANDYMAN' ? (
                  <>
                    <a
                      href="/handyman/profile"
                      className="p-4 border rounded-lg hover:bg-blue-50 transition-colors text-center"
                    >
                      <div className="font-semibold text-gray-900">Profile</div>
                      <div className="text-sm text-gray-500">Edit your details</div>
                    </a>
                    <a
                      href="/handyman/services"
                      className="p-4 border rounded-lg hover:bg-blue-50 transition-colors text-center"
                    >
                      <div className="font-semibold text-gray-900">Services</div>
                      <div className="text-sm text-gray-500">Manage services</div>
                    </a>
                    <a
                      href="/handyman/jobs"
                      className="p-4 border rounded-lg hover:bg-blue-50 transition-colors text-center"
                    >
                      <div className="font-semibold text-gray-900">Jobs</div>
                      <div className="text-sm text-gray-500">View requests</div>
                    </a>
                    <a
                      href="/handyman/earnings"
                      className="p-4 border rounded-lg hover:bg-blue-50 transition-colors text-center"
                    >
                      <div className="font-semibold text-gray-900">Earnings</div>
                      <div className="text-sm text-gray-500">View payments</div>
                    </a>
                  </>
                ) : (
                  <>
                    <a
                      href="/customer/browse"
                      className="p-4 border rounded-lg hover:bg-blue-50 transition-colors text-center"
                    >
                      <div className="font-semibold text-gray-900">Browse</div>
                      <div className="text-sm text-gray-500">Find services</div>
                    </a>
                    <a
                      href="/customer/orders"
                      className="p-4 border rounded-lg hover:bg-blue-50 transition-colors text-center"
                    >
                      <div className="font-semibold text-gray-900">Orders</div>
                      <div className="text-sm text-gray-500">View bookings</div>
                    </a>
                    <a
                      href="/customer/profile"
                      className="p-4 border rounded-lg hover:bg-blue-50 transition-colors text-center"
                    >
                      <div className="font-semibold text-gray-900">Profile</div>
                      <div className="text-sm text-gray-500">Edit details</div>
                    </a>
                    <a
                      href="/customer/payments"
                      className="p-4 border rounded-lg hover:bg-blue-50 transition-colors text-center"
                    >
                      <div className="font-semibold text-gray-900">Payments</div>
                      <div className="text-sm text-gray-500">Payment history</div>
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Protected>
      <DashboardContent />
    </Protected>
  );
}
