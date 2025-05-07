export interface User {
  userId: string | null;
  visitorId: string;
  email: string | null;
  displayName: string | null;
  isAuthenticated: boolean;
}

export interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
} 