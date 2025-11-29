'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../lib/auth';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    // Check if user has token
    if (!auth.isLoggedIn()) {
      router.push('/login');
    }
  }, [router]);

  // If no token, don't render anything (will redirect)
  if (!auth.isLoggedIn()) {
    return null;
  }

  return <>{children}</>;
}