import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getStoredUser, hasSession, clearSession, StoredUser } from '@/lib/session';

type AuthContextType = {
  isAuthenticated: boolean;
  user: StoredUser | null;
  logout: () => void;
  revalidate: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => hasSession());
  const [user, setUser] = useState<StoredUser | null>(() => getStoredUser());

  const revalidate = () => {
    setIsAuthenticated(hasSession());
    setUser(getStoredUser());
  };

  const logout = () => {
    clearSession();
    setIsAuthenticated(false);
    setUser(null);
  };

  // Đồng bộ phiên giữa các tab
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'access_token' || e.key === 'user') {
        revalidate();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const value = useMemo(
    () => ({ isAuthenticated, user, logout, revalidate }),
    [isAuthenticated, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
