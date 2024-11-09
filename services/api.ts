import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

// Add new interfaces
interface JWTToken {
  token: string;
  expiresIn: number;
}

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
    // Check network connection
    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      throw new Error('No internet connection. Please check your network.');
    }

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
    console.error('API - Request interceptor error:', error);
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

      if (error.response?.status === 401) {
        // Handle unauthorized access
        AsyncStorage.removeItem('authToken');
        throw new Error('Session expired. Please login again.');
      }

      const message = error.response?.data?.message
        ? Array.isArray(error.response.data.message)
          ? error.response.data.message.join(', ')
          : error.response.data.message
        : 'An unexpected error occurred';

      throw new Error(message);
    }
    console.error('API - Non-Axios error:', error);
    return Promise.reject(error);
  }
);

// Add request retry interceptor
api.interceptors.response.use(undefined, async (error) => {
  if (axios.isAxiosError(error)) {
    const config = error.config as any;
    if (!config || !config.retry) {
      return Promise.reject(error);
    }
    
    config.retry -= 1;
    console.log('API - Retrying request. Attempts remaining:', config.retry);
    
    const delayRetry = new Promise(resolve => {
      setTimeout(resolve, 1000);
    });
    
    await delayRetry;
    return api(config);
  }
  console.error('API - Retry interceptor error:', error);
  return Promise.reject(error);
});

// Add new token storage function
export const setAuthToken = async (token: string) => {
  try {
    await AsyncStorage.setItem('authToken', token);
  } catch (error) {
    console.error('Failed to save auth token:', error);
    throw error;
  }
};

// Add logout function
export const logout = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.post('/auth/logout');
    await AsyncStorage.removeItem('authToken');
    console.log('API - Logout response:', response.data);
    return response.data;
  } catch (error) {
    console.error('API - Logout error:', error);
    throw error;
  }
};

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

interface SignupResponse {
  success: boolean;
  message: string;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    verificationStatus: string;
  };
  userId: number;
  email: string;
  verificationStatus: string;
  otpSent: boolean;
  isNewUser: boolean;
}

export const signup = async (signupData: SignUpData): Promise<SignupResponse> => {
  try {
    // Validate required fields
    if (!signupData.email || !signupData.password || !signupData.firstName || !signupData.lastName || !signupData.phoneNumber) {
      throw new Error('All fields are required');
    }

    console.log('API - Signup request:', { 
      ...signupData, 
      password: '[REDACTED]' 
    });

    const response = await api.post('/auth/signup', signupData);
    
    console.log('API - Raw signup response:', {
      status: response.status,
      headers: response.headers,
      data: response.data
    });

    if (!response.data) {
      throw new Error('No response data received from server');
    }

    if (response.data.error) {
      throw new Error(response.data.error);
    }

    if (!response.data.success) {
      throw new Error(response.data.message || 'Signup failed');
    }

    return {
      success: true,
      message: response.data.message,
      user: response.data.user,
      userId: response.data.userId,
      email: response.data.email,
      verificationStatus: response.data.verificationStatus,
      otpSent: response.data.otpSent,
      isNewUser: response.data.isNewUser
    };

  } catch (error) {
    console.error('API - Signup error:', error);
    
    if (axios.isAxiosError(error)) {
      console.error('API - Full error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data,
          baseURL: error.config?.baseURL
        }
      });

      switch (error.response?.status) {
        case 400:
          throw new Error(error.response.data.message || 'Invalid input data');
        case 409:
          throw new Error('Email already exists');
        case 500:
          throw new Error('Server error occurred. Please try again later.');
        default:
          throw new Error(error.response?.data?.message || 'Signup failed');
      }
    }
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('An unexpected error occurred during signup');
  }
};

interface OTPVerificationResponse {
  success: boolean;
  message: string;
  token: string;
  user: {
    id: number;
    email: string;
    verificationStatus: string;
  };
}

export const verifyOTP = async (email: string, otp: string) => {
  try {
    console.log('API - Verify OTP request:', { email, otp });
    const response = await api.post('/auth/verify-otp', { email, otp });
    console.log('API - Verify OTP response:', response.data);
    return response.data;
  } catch (error) {
    console.error('API - Verify OTP error:', error);
    throw error;
  }
};

interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    verificationStatus: 'PENDING' | 'VERIFIED';
  };
}

export const login = async (credentials: {
  email: string;
  password: string;
}): Promise<LoginResponse> => {
  try {
    console.log('API - Login attempt:', { email: credentials.email });
    const response = await api.post('/auth/login', credentials);
    
    if (response.data.success && response.data.token) {
      // Store the token
      await setAuthToken(response.data.token);
    }
    
    console.log('API - Login response:', {
      ...response.data,
      token: response.data.token ? '[REDACTED]' : null
    });
    
    return response.data;
  } catch (error) {
    console.error('API - Login error:', error);
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      throw new Error('Invalid email or password');
    }
    throw error;
  }
};

interface ProfileData {
  bvn: string;
  nin: string;
  dateOfBirth: string;
}

interface CompleteProfileResponse {
  success: boolean;
  message: string;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    bvn: string;
    nin: string;
    dateOfBirth: string;
    verificationStatus: 'PENDING' | 'VERIFIED';
  };
}

export const completeProfile = async (
  userId: string, 
  profileData: ProfileData
): Promise<CompleteProfileResponse> => {
  try {
    console.log('API - Completing profile for user:', userId);
    
    // Format the date to ISO string before sending
    const formattedData = {
      ...profileData,
      dateOfBirth: new Date(profileData.dateOfBirth).toISOString()
    };

    console.log('API - Formatted profile data:', {
      ...formattedData,
      bvn: '[REDACTED]',
      nin: '[REDACTED]'
    });

    const response = await api.post(`/auth/complete-profile/${userId}`, formattedData);
    
    console.log('API - Profile completion response:', {
      ...response.data,
      user: response.data.user ? {
        ...response.data.user,
        bvn: '[REDACTED]',
        nin: '[REDACTED]'
      } : null
    });

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to complete profile');
    }

    return response.data;
  } catch (error) {
    console.error('API - Profile completion error:', error);
    if (axios.isAxiosError(error)) {
      // Log the full error details for debugging
      console.error('API - Full error details:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data,
          baseURL: error.config?.baseURL
        }
      });

      // Handle specific error cases
      switch (error.response?.status) {
        case 400:
          throw new Error(error.response.data.message || 'Invalid profile data');
        case 401:
          throw new Error('Unauthorized. Please login again.');
        case 404:
          throw new Error('User not found');
        case 500:
          throw new Error('Server error occurred. Please try again later.');
        default:
          throw new Error(error.response?.data?.message || 'Failed to complete profile');
      }
    }
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('Failed to complete profile. Please try again.');
  }
};

export const resendOTP = async (email: string) => {
  try {
    console.log('API - Resend OTP request:', { email });
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
  } catch (error: unknown) {
    console.error('Error creating virtual account:', error);
    if (axios.isAxiosError(error) && error.response) {
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
