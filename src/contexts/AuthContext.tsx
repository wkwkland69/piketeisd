import { createContext, useContext, useState, useEffect } from 'react';
import { Student, students } from '../data/students';

interface AuthContextType {
  currentUser: Student | null;
  login: (nim: string) => boolean;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const savedNim = localStorage.getItem('currentUserNim');
      const lastActivity = localStorage.getItem('lastActivity');
      
      if (savedNim && lastActivity) {
        const sessionDuration = Date.now() - parseInt(lastActivity);
        
        // Tambahkan buffer 5 detik untuk antisipasi delay
        if (sessionDuration < 59000) {
          const user = students.find(student => student.nim === savedNim);
          if (user) {
            setCurrentUser(user);
            // Update last activity untuk refresh session
            localStorage.setItem('lastActivity', Date.now().toString());
          }
        } else {
          localStorage.removeItem('currentUserNim');
          localStorage.removeItem('lastActivity');
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (nim: string): boolean => {
    const user = students.find(student => student.nim === nim);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('currentUserNim', nim);
      localStorage.setItem('lastActivity', Date.now().toString());
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUserNim');
    localStorage.removeItem('lastActivity');
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};