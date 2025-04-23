import { Link } from 'react-router-dom';
import { Menu, LogOut, Calendar as CalendarIcon, Upload } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const { currentUser, logout } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-10 bg-white shadow-sm flex items-center h-16">
      <Link to="/" className="flex items-center h-full pl-[50px] pr-4">
        <span className="text-blue-600 font-bold text-xl">Piket Lab EISD</span>
      </Link>
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center">
            <button 
              className="p-2 rounded-md text-gray-500 lg:hidden"
              onClick={onMenuClick}
            >
              <Menu size={24} />
            </button>
          </div>

      <div className="hidden lg:flex items-center space-x-4 absolute left-1/2 -translate-x-1/2 top-0 bottom-0 h-full z-0">
        <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition">Dashboard</Link>
        <Link to="/calendar" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition">Calendar</Link>
        <Link to="/upload" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition">Upload Proof</Link>
      </div>
        </div>
      </div>
      <div className="pr-[50px] ml-auto flex items-center space-x-2">
        {currentUser && (
          <>
            <div className="hidden md:block text-sm text-gray-700">
              <span className="font-medium">{currentUser.nim}</span>
            </div>
            <button 
              onClick={logout}
              className="p-2 rounded-md text-gray-500 hover:text-red-500 hover:bg-gray-100 transition"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;