import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EXPO_PUBLIC_API_URL } from '@env';
import api from './api';

const API_URL = EXPO_PUBLIC_API_URL || 'https://naiyuan-backend.onrender.com'; // This should be your actual API URL

export const login = async (credentials: { email: string; password: string }) => {
  try {
    console.log('AuthService - Login attempt:', credentials.email);
    const response = await api.post('/auth/login', credentials);
    console.log('AuthService - Login response:', response.data);
    return response.data;
  } catch (error) {
    console.error('AuthService - Login error:', error);
    throw error;
  }
};

// You can add other authentication-related functions here, such as:
export const logout = async () => {
  try {
    await AsyncStorage.removeItem('authToken');
    // Any other logout logic (e.g., clearing user data from state)
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

export const getAuthToken = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
      console.error('No token found in AsyncStorage');
    } else {
      console.log('Token retrieved successfully');
    }
    return token;
  } catch (error) {
    console.error('Error retrieving auth token:', error);
    return null;
  }
};

// ... sign out

export const signOut = async (): Promise<{ success: boolean; message: string }> => {
  try {
    console.log('AuthService - Starting sign out process');
    
    const token = await AsyncStorage.getItem('authToken');
    
    if (token) {
      try {
        await api.post('/auth/logout');
      } catch (error) {
        console.warn('AuthService - Failed to call logout endpoint:', error);
      }
    }

    const keysToRemove = ['authToken', 'userId', 'userData'];
    await AsyncStorage.multiRemove(keysToRemove);
    
    return {
      success: true,
      message: 'Logged out successfully'
    };
  } catch (error) {
    console.error('AuthService - Sign out error:', error);
    throw new Error('Failed to sign out properly');
  }
};
