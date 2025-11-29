'use client';

import { useEffect, useState } from 'react';
import { clientApi } from '../../lib/client-api';
import Link from 'next/link';
import ProtectedRoute from '../../components/ProtectedRoute';

interface User {
  _id: string;
  email: string;
  name: string;
  profileImage?: string;
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const response = await clientApi.getProfile();
      setUser(response.data);
    } catch (error) {
      console.error('Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation is now in layout */}
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Welcome to Issue Tracker, {user?.name}!
              </h2>
              <p className="text-gray-600 mb-8">
                Your dashboard is ready. Team and project management features coming soon.
              </p>
              <div className="space-x-4">
                <Link 
                  href="/teams" 
                  className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700"
                >
                  Manage Teams
                </Link>
                <Link 
                  href="/profile" 
                  className="bg-white text-indigo-600 px-6 py-3 rounded-md border border-indigo-600 hover:bg-indigo-50"
                >
                  View Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}