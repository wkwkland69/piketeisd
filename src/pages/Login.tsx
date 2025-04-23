import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Clipboard, AlertCircle, Info } from 'lucide-react';
import InfoModal from '../components/InfoModal';

const Login = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [nim, setNim] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!nim.trim()) {
      setError('Please enter your NIM');
      setIsLoading(false);
      return;
    }

    const success = login(nim.trim());
    setIsLoading(false);

    if (success) {
      navigate('/');
    } else {
      setError('Invalid NIM. Please check and try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        {/* Cover Section */}
        <div className="mb-8 text-center">
          <div className="relative w-full max-w-4xl mx-auto mb-8 rounded-2xl shadow-xl overflow-hidden">
            <img 
              src="https://i.imgur.com/9bQ3NV0.jpeg"
              alt="EISD Lab Team" 
              className="w-full object-cover h-[400px]"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30"></div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">EISD Lab Room Inspection</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Welcome to the EISD Lab Room Inspection System. Our platform helps manage and track daily lab inspections, ensuring our workspace remains organized and well-maintained.
            <br />
          <span className="text-xs text-gray-500">Created with love by Juanda ♥</span>
          </p>
        </div>

        {/* Login Form */}
        <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Sign In</h2>
            <p className="mt-2 text-sm text-gray-600">Access with your Student ID (NIM)</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <span className="ml-2 text-sm text-red-700">{error}</span>
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="nim" className="block text-sm font-medium text-gray-700">
                Student ID (NIM)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clipboard className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="nim"
                  name="nim"
                  type="text"
                  value={nim}
                  onChange={(e) => setNim(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your NIM"
                />
              </div>
              {/* Info version and icon */}
              <div className="flex items-center mt-1">
                <span className="text-xs text-blue-300">piketeisd v1.3</span>
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="ml-1 p-0.5 rounded-full hover:bg-gray-100 focus:outline-none"
                  aria-label="Show update info"
                >
                  <Info className="w-4 h-4 text-gray-400 hover:text-blue-500" />
                </button>
              </div>
              <InfoModal open={modalOpen} onClose={() => setModalOpen(false)} />
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;