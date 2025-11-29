import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI-Powered Issue Tracker
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Streamline your project management with AI assistance
          </p>
          <div className="space-x-4">
            <Link
              href="/signup"
              className="bg-indigo-600 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-indigo-700"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="bg-white text-indigo-600 px-6 py-3 rounded-md text-lg font-medium border border-indigo-600 hover:bg-indigo-50"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}