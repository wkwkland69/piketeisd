import { Link } from 'react-router-dom';
import { Home, Calendar as CalendarIcon, Upload, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { currentUser } = useAuth();

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 bottom-0 w-64 bg-white shadow-lg z-30 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-16 flex items-center justify-between px-4 border-b">
          <span className="text-blue-600 font-bold text-xl">Lab Inspection</span>
          <button 
            className="p-2 rounded-md text-gray-500 lg:hidden"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        {currentUser && (
          <div className="p-4 border-b">
            <p className="text-sm font-medium text-gray-900">Welcome,</p>
            <p className="text-sm text-gray-600">{currentUser.nim}</p>
          </div>
        )}

        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link 
                to="/" 
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition"
                onClick={onClose}
              >
                <Home size={18} className="mr-3" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link 
                to="/calendar" 
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition"
                onClick={onClose}
              >
                <CalendarIcon size={18} className="mr-3" />
                Calendar
              </Link>
            </li>
            <li>
              <Link 
                to="/upload" 
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition"
                onClick={onClose}
              >
                <Upload size={18} className="mr-3" />
                Upload Proof
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;