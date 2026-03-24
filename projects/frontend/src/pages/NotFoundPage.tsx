import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen text-white flex items-center justify-center p-4">
      {/* Main container */}
      <div className="text-center">
        <AlertCircle className="w-20 h-20 text-red-400 mx-auto mb-6" />
        <h1 className="text-5xl font-bold text-white mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>404</h1>
        <h2 className="text-2xl font-semibold text-gray-300 mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>Page Not Found</h2>
        <p className="text-gray-400 mb-8 max-w-md">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>

        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-lime-400 text-black font-semibold rounded-lg hover:bg-lime-300 transition-colors shadow-lg shadow-lime-400/50"
          style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px' }}
        >
          Return to Home
        </button>
      </div>
    </div>
  );
}
