import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StyleSheet, StatusBar, Platform, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import CustomInput from '../components/CustomInput';
import Header from '../components/Header';
import Button from '../components/Button';
import { globalStyles } from '../styles/globalStyles';
import { FONTS, COLORS } from '../constants/theme';
import { signUp } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Toast from 'react-native-toast-message';

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
        text1: error,
        visibilityTime: 3000,
        autoHide: true,
      });
      setError('');
    }
  }, [error]);

  const handleNext = async () => {
    setIsLoading(true);
    try {
      const [firstName, lastName] = fullName.split(' ');
      const response = await signUp({ firstName, lastName, email, phoneNumber, password });
      if (response.isExistingUser) {
        router.push({
          pathname: '/signup2',
          params: { email, isExistingUser: true, firstName, lastName, password }
        });
      } else {
        router.push({
          pathname: '/signup2',
          params: { email, isExistingUser: false, firstName, lastName, password }
        });
      }
    } catch (err) {
      console.error('Error in handleNext:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during sign up');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      await resendOTP(email);
      Toast.show({
        type: 'success',
        text1: 'OTP resent successfully',
        visibilityTime: 3000,
        autoHide: true,
      });
    } catch (err) {
      console.error('Error resending OTP:', err);
      Toast.show({
        type: 'error',
        text1: 'Failed to resend OTP',
        visibilityTime: 3000,
        autoHide: true,
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
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
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
