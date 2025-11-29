'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { clientApi } from '../../../../lib/client-api';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import Link from 'next/link';

export default function AcceptInvite() {
  return (
    <ProtectedRoute>
      <AcceptInviteContent />
    </ProtectedRoute>
  );
}

function AcceptInviteContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [team, setTeam] = useState<any>(null);

  useEffect(() => {
    if (token) {
      acceptInvite();
    } else {
      setError('Invalid invitation link - missing token');
      setLoading(false);
    }
  }, [token]);

  const acceptInvite = async () => {
    try {
      setLoading(true);
      const response:any = await clientApi.acceptInvite(token!);
      setTeam(response?.team);
      setMessage(`You have successfully joined "${response?.team?.name}"!`);
      
      // Redirect to team page after 3 seconds
      setTimeout(() => {
        router.push(`/teams/${response?.team?._id}`);
      }, 3000);
    } catch (err: any) {
      console.error('Invite acceptance error:', err);
      setError(err.response?.data?.message || 'Failed to accept invitation. The link may have expired or is invalid.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Processing Invitation</h2>
            <p className="text-gray-600">Please wait while we process your invitation...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          {error ? (
            <>
              <div className="text-center mb-6">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Invitation Error</h2>
                <p className="text-gray-600 mb-6">{error}</p>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/teams')}
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Back to Teams
                </button>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Go to Dashboard
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Invitation Accepted!</h2>
                <p className="text-gray-600 mb-2">{message}</p>
                {team && (
                  <p className="text-sm text-gray-500">
                    Redirecting to <strong>{team.name}</strong> in a few seconds...
                  </p>
                )}
              </div>
              
              <div className="space-y-3">
                {team && (
                  <Link
                    href={`/teams/${team._id}`}
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-center block"
                  >
                    Go to Team Now
                  </Link>
                )}
                <button
                  onClick={() => router.push('/teams')}
                  className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  View All Teams
                </button>
              </div>
            </>
          )}
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t">
          <p className="text-xs text-gray-500 text-center">
            Having issues? Contact support or ask the team owner to resend the invitation.
          </p>
        </div>
      </div>
    </div>
  );
}