import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:3000/api';
console.log('API - Base URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    console.log('API - Interceptor: Preparing request');
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('API - Token found and added to headers');
      } else {
        console.log('API - No token found');
      }
    } catch (error) {
      console.error('API - Error retrieving token:', error);
    }
    console.log('API - Request config:', config);
    return config;
  },
  (error) => {
    console.error('API - Interceptor error:', error);
    return Promise.reject(error);
  }
);

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/users/me');
    console.log('API - Current user fetched:', response.data);
    return response.data;
  } catch (error) {
    console.error('API - Error fetching current user:', error);
    throw error;
  }
};

export const signUp = async (userData: any) => {
  try {
    console.log('API - Signing up user:', userData);
    const response = await api.post('/auth/signup', userData);
    console.log('API - Signup response:', response.data);
    return response.data;
  } catch (error) {
    console.error('API - Signup error:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        if (error.response.status === 409) {
          throw new Error('Email already in use');
        } else if (error.response.status === 400) {
          throw new Error(error.response.data.message || 'Invalid input');
        } else {
          throw new Error('An error occurred during signup');
        }
      } else if (error.request) {
        throw new Error('No response from server');
      } else {
        throw new Error('Error setting up the request');
      }
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

export const verifyOTP = async (email: string, otp: string) => {
  try {
    console.log('API - Verifying OTP for:', email);
    const response = await api.post('/auth/verify-otp', { email, otp });
    console.log('API - OTP verification response:', response.data);
    return response.data;
  } catch (error) {
    console.error('API - OTP verification error:', error);
    throw error;
  }
};

export const login = async (credentials: any) => {
  try {
    console.log('API - Logging in user:', credentials.email);
    const response = await api.post('/auth/login', credentials);
    console.log('API - Login response:', response.data);
    return response.data;
  } catch (error) {
    console.error('API - Login error:', error);
    throw error;
  }
};

export const completeProfile = async (userId: string, profileData: any) => {
  try {
    console.log('API - Completing profile for user:', userId);
    const response = await api.post(`/users/${userId}/complete-profile`, profileData);
    console.log('API - Profile completion response:', response.data);
    return response.data;  // This now directly returns the user data
  } catch (error) {
    console.error('API - Profile completion error:', error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'An error occurred during profile completion');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

export const resendOTP = async (email: string) => {
  try {
    console.log('API - Resending OTP for:', email);
    const response = await api.post('/auth/resend-otp', { email });
    console.log('API - Resend OTP response:', response.data);
    return response.data;
  } catch (error) {
    console.error('API - Resend OTP error:', error);
    throw error;
  }
};

export const createVirtualAccount = async (paymentDetails: any) => {
  try {
    console.log('Sending request to create virtual account:', paymentDetails);
    const response = await api.post('/virtual-account', paymentDetails);
    console.log('Response from create virtual account:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating virtual account:', error);
    if (error.response) {
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);
      console.error('Error headers:', error.response.headers);
    }
    throw error;
  }
};

// ... (keep your existing checkVirtualAccountStatus function)

export default api;
