import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StyleSheet, StatusBar, Platform, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import NetInfo from '@react-native-community/netinfo';
import { verifyOTP, resendOTP } from '../services/api';
import { useAuth } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomInput from '../components/CustomInput';
import Header from '../components/Header';
import Button from '../components/Button';
import { globalStyles } from '../styles/globalStyles';
import { COLORS, FONTS } from '../constants/theme';
import Toast from 'react-native-toast-message';

const validateOTP = (otp: string) => {
  return otp.length === 6 && /^\d{6}$/.test(otp);
};

export default function SignUpScreen2() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { login } = useAuth();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  
  const email = params.email as string;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [resendTimer]);

  const handleVerifyOTP = async () => {
    try {
      setIsLoading(true);
      setError('');

      if (!validateOTP(otp)) {
        throw new Error('Please enter a valid 6-digit OTP');
      }

      console.log('Verifying OTP for:', email, 'OTP:', otp);
      const response = await verifyOTP(email, otp.trim());

      if (response.success && response.token) {
        console.log('OTP verification successful, setting tokens...');
        await AsyncStorage.multiSet([
          ['authToken', response.token],
          ['userId', response.user.id.toString()]
        ]);

        console.log('Tokens set, logging in...');
        await login(response.token, response.user.id);
        
        console.log('Login successful, navigating to signup3...');
        router.push('/signup3');
      } else {
        throw new Error(response.message || 'OTP verification failed');
      }

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Verification failed';
      console.error('OTP Verification error:', message);
      setError(message);
      Toast.show({
        type: 'error',
        text1: 'Verification Failed',
        text2: message,
        position: 'top',
        visibilityTime: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 6);
    setOtp(cleaned);
    
    if (cleaned.length === 6) {
      handleVerifyOTP();
    }
  };

  const handleResendOTP = async () => {
    try {
      setIsResending(true);
      setError('');
      
      await resendOTP(email);
      setResendTimer(30);
      
      Toast.show({
        type: 'success',
        text1: 'OTP Resent',
        text2: 'Please check your email for the new OTP',
        position: 'top',
        visibilityTime: 3000,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to resend OTP';
      setError(message);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: message,
        position: 'top',
        visibilityTime: 3000,
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleHelpPress = () => {
    console.log('Help icon pressed');
  };

  return (
    <SafeAreaView style={[globalStyles.safeArea, styles.safeArea]}>
      <Header showBack={true} onHelpPress={handleHelpPress} variant="default" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={[globalStyles.container, { flex: 1 }]}
      >
        <View style={globalStyles.titleContainer}>
          <Text style={styles.title}>Verify your email</Text>
          <Text style={styles.subtitle}>
            Please enter the 6-digit code sent to {email}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <CustomInput
            label="Enter OTP"
            value={otp}
            onChangeText={handleOTPChange}
            keyboardType="numeric"
            maxLength={6}
            placeholder="Enter 6-digit code"
          />
          
          <TouchableOpacity
            onPress={handleResendOTP}
            disabled={resendTimer > 0 || isResending}
            style={styles.resendButton}
          >
            <Text style={[
              styles.resendText,
              (resendTimer > 0 || isResending) && styles.resendTextDisabled
            ]}>
              {resendTimer > 0
                ? `Resend code in ${resendTimer}s`
                : isResending
                ? 'Sending...'
                : 'Resend code'}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={[globalStyles.buttonContainer, styles.buttonContainer]}>
          <Button
            title="Verify"
            onPress={handleVerifyOTP}
            disabled={!validateOTP(otp) || isLoading}
            loading={isLoading}
          />
        </View>
      </KeyboardAvoidingView>
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
  resendButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  resendText: {
    color: COLORS.PRIMARY,
    fontSize: 16,
    fontFamily: FONTS.REGULAR,
  },
  resendTextDisabled: {
    color: COLORS.GRAY,
  },
  buttonContainer: {
    marginBottom: Platform.OS === 'ios' ? 20 : 10,
  }
});
