'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { auth } from '../lib/auth';
import { useRouter } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    auth.removeToken();
    router.push('/login');
  };

  // Don't show navigation on auth pages
  if (pathname === '/login' || pathname === '/signup' || pathname === '/forgot-password' || pathname === '/reset-password') {
    return null;
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - Logo and Links */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Issue Tracker
            </Link>
            <div className="hidden md:flex items-center space-x-8 ml-10">
              <Link 
                href="/dashboard" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === '/dashboard' 
                    ? 'text-indigo-600 bg-indigo-50' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Dashboard
              </Link>
              <Link 
                href="/teams" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname.startsWith('/teams') 
                    ? 'text-indigo-600 bg-indigo-50' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Teams
              </Link>
              <Link 
                href="/profile" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === '/profile' 
                    ? 'text-indigo-600 bg-indigo-50' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Profile
              </Link>
            </div>
          </div>

          {/* Right side - User actions */}
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLogout}
              className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile menu (simplified) */}
        <div className="md:hidden border-t pt-4 pb-3">
          <div className="flex flex-col space-y-2">
            <Link 
              href="/dashboard" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === '/dashboard' 
                  ? 'text-indigo-600 bg-indigo-50' 
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Dashboard
            </Link>
            <Link 
              href="/teams" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname.startsWith('/teams') 
                  ? 'text-indigo-600 bg-indigo-50' 
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Teams
            </Link>
            <Link 
              href="/profile" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === '/profile' 
                  ? 'text-indigo-600 bg-indigo-50' 
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Profile
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}