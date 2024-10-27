import React, { useEffect, useRef, useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView, 
  StyleSheet, 
  StatusBar, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  Keyboard,
  Alert
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import OTPInput from '../components/OTPInput';
import Header from '../components/Header';
import Button from '../components/Button';
import { globalStyles } from '../styles/globalStyles';
import { FONTS, COLORS } from '../constants/theme';
import { verifyOTP, resendOTP } from '../services/api';
import { useAuth } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignUpScreen2() {
  const router = useRouter();
  const { email, isExistingUser, firstName, lastName, password } = useLocalSearchParams();
  const { login } = useAuth();
  const otpInputRef = useRef<any>(null);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setTimeout(() => otpInputRef.current?.focus(), 100);
    startResendTimer();
  }, []);

  const startResendTimer = () => {
    setCanResend(false);
    setResendTimer(30);
    const timer = setInterval(() => {
      setResendTimer((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  const handleOTPFilled = (otp: string) => {
    setOtp(otp);
  };

  const handleVerify = async () => {
    setIsLoading(true);
    try {
      const data = await verifyOTP(
        email as string,
        otp,
        password as string,
        firstName as string,
        lastName as string
      );
      const userId = data.user && data.user.id ? data.user.id : 'N/A';
      console.log('User verified with ID:', userId);
      await AsyncStorage.setItem('authToken', data.token);
      await AsyncStorage.setItem('userId', userId.toString());
      await login(data.token, userId);
      router.push('/signup3');
    } catch (err) {
      console.error('Error verifying OTP:', err);
      Alert.alert('Verification Failed', err.message || 'Please try again');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (canResend) {
      setIsLoading(true);
      try {
        await resendOTP(email as string);
        startResendTimer();
        setError('');
      } catch (error) {
        console.error('Error resending OTP:', error);
        setError('Failed to resend OTP');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleChangeEmail = () => {
    console.log('Changing email');
  };

  const handleHelpPress = () => {
    console.log('Help icon pressed');
  };

  const isLightBackground = COLORS.WHITE === '#FFFFFF';

  return (
    <>
      <StatusBar 
        barStyle={isLightBackground ? 'dark-content' : 'light-content'}
        backgroundColor={COLORS.WHITE}
      />
      <SafeAreaView style={[globalStyles.safeArea, styles.safeArea]}>
        <Header showBack={true} onHelpPress={handleHelpPress} variant="default" />
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
          keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollViewContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={globalStyles.container}>
              <View style={globalStyles.titleContainer}>
                <Text style={styles.title}>Enter verification code</Text>
                <Text style={styles.subtitle}>
                  Enter code sent to your email address{'\n'}
                  {email}{' '}
                  <Text style={styles.changeEmail} onPress={handleChangeEmail}>
                    Change Email
                  </Text>
                </Text>
              </View>
              <View style={styles.otpContainer}>
                <OTPInput onOTPFilled={handleOTPFilled} ref={otpInputRef} />
              </View>
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
              <TouchableOpacity onPress={handleResendOTP} disabled={!canResend || isLoading}>
                <Text style={[styles.resendText, (!canResend || isLoading) && styles.resendTextDisabled]}>
                  {canResend ? 'Resend Code' : `Resend Code in ${resendTimer}s`}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
          <View style={styles.buttonContainer}>
            <Button
              title="Verify"
              onPress={handleVerify}
              disabled={otp.length !== 6 || isLoading}
              loading={isLoading}
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: COLORS.WHITE,
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
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
    lineHeight: 19.2,
    color: COLORS.GRAY,
    width: 342,
    marginBottom: 32,
  },
  changeEmail: {
    color: COLORS.PRIMARY,
    textDecorationLine: 'underline',
  },
  otpContainer: {
    alignItems: 'center',
  },
  resendText: {
    fontFamily: FONTS.REGULAR,
    fontSize: 18,
    color: COLORS.PRIMARY,
    textAlign: 'center',
    marginTop: 20,
  },
  resendTextDisabled: {
    color: COLORS.GRAY,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 20 : 20,
    paddingTop: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
});
