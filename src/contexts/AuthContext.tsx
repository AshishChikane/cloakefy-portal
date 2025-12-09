import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  email: string;
  name: string;
  picture: string;
  role?: 'admin' | 'user' | 'viewer';
  token?: string;
  api_key?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (user: User) => void;
  signOut: () => void;
  hasRole: (role: 'admin' | 'user' | 'viewer') => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for stored authentication
    const storedUser = localStorage.getItem('platform_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        // Also check for api_key in localStorage and add it if not present in userData
        if (!userData.api_key) {
          const apiKey = localStorage.getItem('api_key');
          if (apiKey) {
            userData.api_key = apiKey;
            localStorage.setItem('platform_user', JSON.stringify(userData));
          }
        }
        setUser(userData);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('platform_user');
      }
    }
  }, []);

  const signIn = (userData: User) => {
    // Assign role based on email domain or default to 'user'
    const role = userData.email.endsWith('@admin.com') 
      ? 'admin' 
      : userData.email.endsWith('@viewer.com')
      ? 'viewer'
      : 'user';
    
    const userWithRole = { ...userData, role };
    setUser(userWithRole);
    localStorage.setItem('platform_user', JSON.stringify(userWithRole));
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('platform_user');
  };

  const hasRole = (role: 'admin' | 'user' | 'viewer'): boolean => {
    if (!user) return false;
    
    // Role hierarchy: admin > user > viewer
    const roleHierarchy = { admin: 3, user: 2, viewer: 1 };
    const userRoleLevel = roleHierarchy[user.role || 'user'];
    const requiredRoleLevel = roleHierarchy[role];
    
    return userRoleLevel >= requiredRoleLevel;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        signIn,
        signOut,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

