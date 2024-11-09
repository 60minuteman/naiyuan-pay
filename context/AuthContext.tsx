import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signOut } from '../services/authService';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  verificationStatus: 'PENDING' | 'VERIFIED';
}

interface AuthState {
  token: string | null;
  userId: string | null;
  isLoading: boolean;
  user: User | null;
}

interface AuthContextType extends AuthState {
  login: (token: string, userId: string | number) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: any) => void;
  checkUserId: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    token: null,
    userId: null,
    isLoading: true,
    user: null,
  });

  useEffect(() => {
    const loadToken = async () => {
      try {
        const [token, userId] = await Promise.all([
          AsyncStorage.getItem('authToken'),
          AsyncStorage.getItem('userId'),
        ]);
        setAuthState({
          token,
          userId,
          isLoading: false,
          user: null,
        });
      } catch (e) {
        console.error('Failed to load auth state:', e);
        setAuthState(prevState => ({ ...prevState, isLoading: false }));
      }
    };
    loadToken();
  }, []);

  const login = async (token: string, userId: string | number) => {
    try {
      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('userId', userId.toString());
      setAuthState({ token, userId: userId.toString(), isLoading: false, user: null });
    } catch (e) {
      console.error('Failed to login:', e);
      throw e;
    }
  };

  const logout = async () => {
    try {
      await signOut();
      setAuthState({ token: null, userId: null, isLoading: false, user: null });
    } catch (e) {
      console.error('Failed to logout:', e);
      throw e;
    }
  };

  const setUser = (user: any) => {
    setAuthState(prevState => ({ ...prevState, user }));
  };

  const checkUserId = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        setAuthState(prev => ({ ...prev, userId }));
      }
    } catch (e) {
      console.error('Failed to check userId:', e);
    }
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout, setUser, checkUserId }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
