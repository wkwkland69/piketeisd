import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ScheduleProvider } from './contexts/ScheduleContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Calendar from './pages/Calendar';
import UploadProof from './pages/UploadProof';
import { useEffect, useState } from 'react';
import { useAuth } from './contexts/AuthContext';

// Buat komponen terpisah untuk konten yang membutuhkan Auth
function AuthContent() {
  const { logout, currentUser, loading } = useAuth();
  const [showWarning, setShowWarning] = useState(false);
  const [timeoutId, setTimeoutId] = useState<number>();

  const resetTimer = () => {
    localStorage.setItem('lastActivity', Date.now().toString());
    setShowWarning(false);
    if (timeoutId) clearTimeout(timeoutId);
    
    const id = window.setTimeout(() => {
      setShowWarning(true);
      const finalId = window.setTimeout(logout, 5000);
      setTimeoutId(finalId);
    }, 55000);

    setTimeoutId(id);
  };

  useEffect(() => {
    if (!currentUser || loading) return;

    const handleActivity = () => resetTimer();
    
    const events = ['mousemove', 'keypress', 'click', 'scroll'];
    events.forEach(event => window.addEventListener(event, handleActivity));

    resetTimer();

    return () => {
      events.forEach(event => window.removeEventListener(event, handleActivity));
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [currentUser, logout, loading]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <ScheduleProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="upload" element={<UploadProof />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      
      {showWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg text-center">
            <h2 className="text-xl font-bold mb-4">⏳ Session Timeout</h2>
            <p className="mb-4">Anda akan logout otomatis dalam 5 detik!</p>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              onClick={resetTimer}
            >
              Tetap Login
            </button>
          </div>
        </div>
      )}
    </ScheduleProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AuthContent />
    </AuthProvider>
  );
}

export default App;