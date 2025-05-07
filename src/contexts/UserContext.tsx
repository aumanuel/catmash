import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { User, UserContextType } from '@/types/user';

const VISITOR_ID_COOKIE = 'visitor_id';
const VISITOR_ID_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name: string, value: string, maxAgeSeconds: number) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeUser = () => {
      let visitorId = getCookie(VISITOR_ID_COOKIE);
      if (!visitorId) {
        visitorId = uuidv4();
        setCookie(VISITOR_ID_COOKIE, visitorId, VISITOR_ID_COOKIE_MAX_AGE);
      }
      setUser({
        userId: null,
        visitorId,
        email: null,
        displayName: null,
        isAuthenticated: false
      });
      setLoading(false);
    };
    initializeUser();
  }, []);

  const value = {
    user,
    setUser,
    loading
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

export default UserContext; 