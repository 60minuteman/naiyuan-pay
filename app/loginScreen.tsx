// screens/LoginScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, StatusBar, Image, Keyboard, Animated, Alert } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';
import { login } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomInput from '../components/CustomInput';
import { useFonts } from 'expo-font';
import axios from 'axios';
import NetInfo from "@react-native-community/netinfo";

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login: contextLogin } = useAuth();
  const router = useRouter();
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const logoPosition = new Animated.Value(0);
  const buttonPosition = new Animated.Value(0);
  const [isLoading, setIsLoading] = useState(false);

  const [fontsLoaded] = useFonts({
    'RedHatDisplay-Regular': require('../assets/fonts/RedHatDisplay-Regular.ttf'),
    'RedHatDisplay-Bold': require('../assets/fonts/RedHatDisplay-Bold.ttf'),
  });

  const testAsyncStorage = async () => {
    try {
      await AsyncStorage.setItem('testKey', 'testValue');
      const testValue = await AsyncStorage.getItem('testKey');
      console.log('AsyncStorage test result:', testValue);
      if (testValue !== 'testValue') {
        console.error('AsyncStorage test failed');
      }
    } catch (error) {
      console.error('AsyncStorage test error:', error);
    }
  };

  useEffect(() => {
    testAsyncStorage();
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
        Animated.parallel([
          Animated.timing(logoPosition, {
            toValue: -50,
            duration: 300,
            useNativeDriver: false,
          }),
          Animated.timing(buttonPosition, {
            toValue: -100,
            duration: 300,
            useNativeDriver: false,
          })
        ]).start();
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
        Animated.parallel([
          Animated.timing(logoPosition, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
          }),
          Animated.timing(buttonPosition, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
          })
        ]).start();
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  const handleLogin = async () => {
    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      Alert.alert('No Internet Connection', 'Please check your internet connection and try again.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await login({ email, password });
      await AsyncStorage.setItem('authToken', response.token);
      await AsyncStorage.setItem('userId', response.user.id.toString());
      console.log('Token after login:', response.token);
      console.log('User ID after login:', response.user.id);
      await contextLogin(response.token, response.user.id);
      router.replace('/homeScreen');
    } catch (error) {
      console.error('Login failed:', error);
      let errorMessage = 'An error occurred. Please try again later.';
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          errorMessage = 'Connection timed out. Please check your internet connection and try again.';
        } else if (error.response) {
          errorMessage = error.response.data.message || errorMessage;
        }
      }
      Alert.alert('Login Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#5B6EF5" />
      <View style={styles.topSection}>
        <SafeAreaView style={styles.topContent}>
          <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <View style={styles.logoContainer}>
            <Image source={require('../assets/logow.png')} style={styles.logo} resizeMode="contain" />
          </View>
        </SafeAreaView>
      </View>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.bottomSection}
        keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
      >
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>
          New here? <Text style={styles.createAccountLink} onPress={() => router.push('/signup1')}>Create account</Text>
        </Text>
        <CustomInput
          value={email}
          onChangeText={setEmail}
          label="Email"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <CustomInput
          value={password}
          onChangeText={setPassword}
          label="Password"
          secureTextEntry
        />
        <Animated.View style={{ transform: [{ translateY: buttonPosition }] }}>
          <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
            <Text style={styles.buttonText}>{isLoading ? 'Loading...' : 'Get In'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/forgotPassword')}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5B6EF5',
  },
  topSection: {
    height: '45%',
    justifyContent: 'space-between',
    padding: 20,
  },
  topContent: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  bottomSection: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    padding: 20,
    justifyContent: 'flex-start',
  },
  closeButton: {
    alignSelf: 'flex-start',
    marginTop: 10,
    zIndex: 1,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 28,
    fontFamily: 'RedHatDisplay-Regular',
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '30%',
    height: '30%',
  },
  title: {
    color: '#000000',
    fontSize: 32,
    fontFamily: 'RedHatDisplay-Bold',
    marginBottom: 10,
    marginTop: 20,
  },
  subtitle: {
    color: '#666',
    fontSize: 16,
    fontFamily: 'RedHatDisplay-Regular',
    marginBottom: 20,
  },
  createAccountLink: {
    color: '#5B6EF5',
    fontFamily: 'RedHatDisplay-Bold',
  },
  button: {
    backgroundColor: '#5B6EF5',
    width: '100%',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'RedHatDisplay-Bold',
  },
  forgotPasswordText: {
    color: '#5B6EF5',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'RedHatDisplay-Regular',
  },
});

export default LoginScreen;
