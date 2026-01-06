import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../api/services';
import { User } from '../types';
import Toast from 'react-native-toast-message';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    try {
      const token = await AsyncStorage.getItem('lt_token');
      if (!token) return;
      
      const response = await authAPI.getMe();
      setUser(response.data);
    } catch (error: any) {
      console.log('Load user error:', error.message);
      await AsyncStorage.removeItem('lt_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const response = await authAPI.getMe();
      setUser(response.data);
    } catch (error: any) {
      console.log('Refresh user error:', error.message);
      await logout();
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);
      await AsyncStorage.setItem('lt_token', response.data.token);
      setUser(response.data.user);
      
      Toast.show({
        type: 'success',
        text1: 'Welcome back!',
        text2: `Hello ${response.data.user.name}`,
      });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: message,
      });
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await authAPI.register(name, email, password);
      await AsyncStorage.setItem('lt_token', response.data.token);
      setUser(response.data.user);
      
      Toast.show({
        type: 'success',
        text1: 'Welcome to LankaTrips!',
        text2: 'Account created successfully',
      });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed';
      Toast.show({
        type: 'error',
        text1: 'Registration Failed',
        text2: message,
      });
      throw error;
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('lt_token');
    setUser(null);
    Toast.show({
      type: 'info',
      text1: 'Logged out',
      text2: 'See you soon!',
    });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      register, 
      logout, 
      refreshUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};