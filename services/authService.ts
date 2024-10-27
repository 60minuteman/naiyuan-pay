import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.51.59:5001/api'; // This should be your actual API URL

export const login = async (credentials) => {
  try {
    console.log('Attempting to reach server at:', API_URL);
    const response = await axios.post(`${API_URL}/auth/login`, credentials, {
      timeout: 10000 // 10 seconds timeout
    });
    console.log('Server response:', response.data);

    if (response.data && response.data.token && response.data.user) {
      await AsyncStorage.setItem('authToken', response.data.token);
      await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
      console.log('Token and user data stored successfully:', response.data.user);
      return response.data;
    } else {
      throw new Error('Invalid response from server');
    }
  } catch (error) {
    console.error('Login error:', error);
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        console.error('Request timed out');
      } else if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }
    }
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

export const signOut = async () => {
  try {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('userData');
    // Clear any other stored data related to the user session
    console.log('User signed out successfully');
    return true;
  } catch (error) {
    console.error('Error during sign out:', error);
    throw error;
  }
};
