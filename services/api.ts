import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

const API_URL = 'https://naiyuan-backend.onrender.com';  // Remove /api if it's not in the backend routes

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
  validateStatus: (status) => status >= 200 && status < 500,
});

// Add logging to see the full URL being requested
api.interceptors.request.use(
  async (config) => {
    console.log('API - Full request URL:', `${config.baseURL}${config.url}`);
    console.log('API - Request method:', config.method);
    console.log('API - Request data:', config.data);
    
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('API - Error retrieving token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for better error logging
api.interceptors.response.use(
  (response) => {
    console.log('API - Response status:', response.status);
    console.log('API - Response data:', response.data);
    return response;
  },
  (error) => {
    if (axios.isAxiosError(error)) {
      console.error('API - Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data,
        }
      });

      // Handle specific error cases
      if (error.response?.status === 500) {
        console.error('API - Server error details:', error.response.data);
        throw new Error('Server error occurred. Please try again later.');
      }

      const message = error.response?.data?.message
        ? Array.isArray(error.response.data.message)
          ? error.response.data.message.join(', ')
          : error.response.data.message
        : 'An unexpected error occurred';

      throw new Error(message);
    }
    return Promise.reject(error);
  }
);

// Add request retry interceptor
api.interceptors.response.use(undefined, async (error) => {
  if (axios.isAxiosError(error)) {
    const config = error.config;
    if (!config || !config.retry) {
      return Promise.reject(error);
    }
    
    config.retry -= 1;
    
    const delayRetry = new Promise(resolve => {
      setTimeout(resolve, 1000);
    });
    
    await delayRetry;
    return api(config);
  }
  return Promise.reject(error);
});

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

interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export const signup = async (userData: SignUpData) => {
  try {
    console.log('Starting signup request...');
    
    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 seconds timeout

    const response = await axios.post(
      `${API_URL}/auth/signup`,
      userData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
        timeout: 60000, // Increase timeout to 60 seconds
      }
    );

    clearTimeout(timeoutId);
    
    if (response.data) {
      console.log('Signup successful');
      return response.data;
    }
    
    throw new Error('No data received from server');

  } catch (error) {
    console.error('Signup error details:', {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      status: error.response?.status
    });

    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      throw new Error('Server is taking too long to respond. Please try again later.');
    }

    if (error.response?.status === 409) {
      throw new Error('This email is already registered.');
    }

    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }

    throw new Error('Failed to create account. Please try again later.');
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

export const login = async (credentials: { email: string; password: string }) => {
  try {
    console.log('API - Attempting login for:', credentials.email);
    
    if (!credentials.email || !credentials.password) {
      throw new Error('Email and password are required');
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(credentials.email)) {
      throw new Error('Please enter a valid email address');
    }
    
    // Validate password length
    if (credentials.password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    const response = await api.post('/auth/login', {
      email: credentials.email.trim().toLowerCase(),
      password: credentials.password
    });
    
    console.log('API - Login response:', response.data);
    return response.data;
  } catch (error) {
    console.error('API - Login error:', error);
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      const message = Array.isArray(error.response.data.message) 
        ? error.response.data.message.join(', ')
        : error.response.data.message;
      throw new Error(message);
    }
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

export const getTransactions = async () => {
  try {
    const response = await api.get('/transactions');
    console.log('API - Transactions response:', response.data);
    return response.data;
  } catch (error) {
    console.error('API - Error fetching transactions:', error);
    throw error;
  }
};

export const getTransactionByReference = async (reference: string) => {
  try {
    const response = await api.get(`/transactions/${reference}`);
    console.log('API - Transaction details response:', response.data);
    return response.data;
  } catch (error) {
    console.error('API - Error fetching transaction details:', error);
    throw error;
  }
};

export default api;
