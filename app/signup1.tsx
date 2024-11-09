import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StyleSheet, StatusBar, Platform, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import CustomInput from '../components/CustomInput';
import Header from '../components/Header';
import Button from '../components/Button';
import { globalStyles } from '../styles/globalStyles';
import { FONTS, COLORS } from '../constants/theme';
import { signup } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

export default function SignUpScreen1() {
  const router = useRouter();
  const { login } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error,
        visibilityTime: 3000,
        autoHide: true,
        position: 'top'
      });
      setError('');
    }
  }, [error]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const validatePhoneNumber = (phone: string) => {
    // Allow numbers that can be formatted to valid Nigerian numbers
    const cleaned = phone.replace(/\D/g, '');
    
    // Check if it's a valid Nigerian number format
    if (cleaned.startsWith('0')) {
      return cleaned.length === 11;
    }
    if (cleaned.startsWith('234')) {
      return cleaned.length === 13;
    }
    if (/^[789]/.test(cleaned)) {
      return cleaned.length === 10;
    }
    
    return false;
  };

  const formatPhoneNumber = (phone: string) => {
    // Remove any non-digit characters
    const digits = phone.replace(/\D/g, '');
    
    // If starts with 0, remove it and add 234
    if (digits.startsWith('0')) {
      return '234' + digits.substring(1);
    }
    
    // If doesn't start with 234, add it
    if (!digits.startsWith('234')) {
      return '234' + digits;
    }
    
    return digits;
  };

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  const handleNext = async () => {
    try {
      setError('');
      setIsLoading(true);
      
      // Network check
      const netInfo = await NetInfo.fetch();
      if (!netInfo.isConnected) {
        throw new Error('No internet connection. Please check your network.');
      }

      // Validate inputs
      if (!email || !password || !fullName || !phoneNumber) {
        throw new Error('All fields are required');
      }

      if (!validateEmail(email)) {
        throw new Error('Please enter a valid email address');
      }

      if (!validatePassword(password)) {
        throw new Error('Password must be at least 6 characters long');
      }

      const names = fullName.trim().split(' ');
      if (names.length < 2) {
        throw new Error('Please enter both first and last name');
      }

      const [firstName, ...lastNameParts] = names;
      const lastName = lastNameParts.join(' ');

      // Format phone number
      const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
      if (!validatePhoneNumber(formattedPhoneNumber)) {
        throw new Error('Please enter a valid Nigerian phone number');
      }

      console.log('Signup - Starting signup process...');
      
      const signupData = {
        email: email.trim().toLowerCase(),
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phoneNumber: formattedPhoneNumber
      };

      console.log('Signup - Sending data:', {
        ...signupData,
        password: '[REDACTED]'
      });

      const response = await signup(signupData);
      console.log('Signup - Response received:', response);

      if (response.success && response.otpSent) {
        console.log('Signup - OTP sent successfully, navigating to verification...');
        router.push({
          pathname: '/signup2',
          params: {
            email: response.email,
            firstName: response.user.firstName,
            lastName: response.user.lastName,
            userId: response.userId.toString(),
            isNewUser: response.isNewUser
          }
        });
      } else {
        throw new Error(response.message || 'Failed to send OTP');
      }

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Signup failed';
      console.error('Signup error:', message);
      
      Toast.show({
        type: 'error',
        text1: 'Signup Failed',
        text2: message,
        position: 'top',
        visibilityTime: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      await resendOTP(email);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'OTP resent successfully',
        visibilityTime: 3000,
        autoHide: true,
        position: 'top'
      });
    } catch (err) {
      console.error('Error resending OTP:', err);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to resend OTP',
        visibilityTime: 3000,
        autoHide: true,
        position: 'top'
      });
    }
  };

  const handleHelpPress = () => {
    // Handle help icon press
    console.log('Help icon pressed');
  };

  const isFormValid = fullName !== '' && email !== '' && phoneNumber !== '' && password !== '';

  // Determine if the background is light or dark
  const isLightBackground = COLORS.WHITE === '#FFFFFF';

  return (
    <SafeAreaView style={[globalStyles.safeArea, styles.safeArea]}>
      <Header showBack={true} onHelpPress={handleHelpPress} variant="default" />
      <View style={globalStyles.container}>
        <View style={globalStyles.titleContainer}>
          <Text style={styles.title}>Create your account</Text>
          <Text style={styles.subtitle}>Please fill in the details below</Text>
        </View>
        <View style={{ flex: 1 }}>
          <CustomInput
            label="Your Full Name"
            value={fullName}
            onChangeText={setFullName}
            placeholder="First and Last Name"
          />
          <CustomInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <CustomInput
            label="Phone Number"
            value={phoneNumber}
            onChangeText={(text) => {
              // Remove any non-digit characters as user types
              const cleaned = text.replace(/\D/g, '');
              setPhoneNumber(cleaned);
            }}
            keyboardType="phone-pad"
            placeholder="07059957131"
            helperText="Enter your Nigerian phone number starting with 0 or 234"
          />
          <CustomInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        <View style={globalStyles.buttonContainer}>
          <Button
            title="Next"
            onPress={handleNext}
            disabled={!isFormValid || isLoading}
            loading={isLoading}
          />
        </View>
      </View>
      <Toast />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: COLORS.WHITE,
  },
  title: {
    fontFamily: FONTS.BOLD,
    fontSize: 24,
    marginBottom: 8,
    width: 358,
  },
  subtitle: {
    fontFamily: FONTS.REGULAR,
    fontSize: 16,
    color: COLORS.GRAY,
    width: 342,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 20 : 20,
    paddingTop: 20,
  },
  buttonText: {
    color: COLORS.WHITE,
    fontFamily: FONTS.BOLD,
    fontSize: 16,
  },
});
