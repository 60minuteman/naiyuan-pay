// screens/LoginScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, StatusBar, Image, Keyboard, Animated, Alert, Toast, ScrollView } from 'react-native';
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
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { login: contextLogin } = useAuth();
  const router = useRouter();
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const contentPosition = new Animated.Value(0);
  const buttonPosition = new Animated.Value(0);
  const [isLoading, setIsLoading] = useState(false);

  const [fontsLoaded] = useFonts({
    'RedHatDisplay-Regular': require('../assets/fonts/RedHatDisplay-Regular.ttf'),
    'RedHatDisplay-Bold': require('../assets/fonts/RedHatDisplay-Bold.ttf'),
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email is required');
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError('Password is required');
      return false;
    }
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return false;
    }
    setPasswordError('');
    return true;
  };

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
      (event) => {
        setKeyboardVisible(true);
        Animated.parallel([
          Animated.timing(contentPosition, {
            toValue: -event.endCoordinates.height * 0.5,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(buttonPosition, {
            toValue: -event.endCoordinates.height * 0.5,
            duration: 250,
            useNativeDriver: true,
          })
        ]).start();
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
        Animated.parallel([
          Animated.timing(contentPosition, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(buttonPosition, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
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
    try {
      setIsLoading(true);
      
      // Validate inputs
      if (!validateEmail(email) || !validatePassword(password)) {
        return;
      }

      console.log('Attempting login for:', email);
      const response = await login({ 
        email: email.trim().toLowerCase(), 
        password 
      });

      if (response.success && response.token) {
        console.log('Login successful, setting up session...');
        
        // Store token and user data
        await AsyncStorage.multiSet([
          ['authToken', response.token],
          ['userId', response.user.id.toString()]
        ]);

        // Update auth context
        await contextLogin(response.token, response.user.id);
        
        console.log('Session setup complete, navigating to home...');
        
        // Navigate to home screen
        router.replace('/homeScreen');
        
        // Show success message using Toast (make sure Toast is properly imported)
        if (Toast && Toast.show) {
          Toast.show({
            type: 'success',
            text1: 'Welcome Back!',
            text2: `Logged in as ${response.user.firstName}`,
            position: 'top',
            visibilityTime: 2000,
          });
        }
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      const message = err instanceof Error ? err.message : 'An error occurred during login';
      
      // Show error message
      if (Toast && Toast.show) {
        Toast.show({
          type: 'error',
          text1: 'Login Failed',
          text2: message,
          position: 'top',
          visibilityTime: 4000,
        });
      } else {
        // Fallback error handling if Toast is not available
        Alert.alert('Login Failed', message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? -64 : 0}
    >
      <StatusBar barStyle="light-content" backgroundColor="#5B6EF5" />
      <View style={styles.topSection}>
        <SafeAreaView style={styles.topContent}>
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={() => router.back()}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <View style={styles.logoContainer}>
            <Image 
              source={require('../assets/logow.png')}
              style={styles.logo}
              resizeMode="contain" 
            />
          </View>
        </SafeAreaView>
      </View>

      <Animated.View 
        style={[
          styles.bottomSection,
          {
            transform: [{ translateY: contentPosition }]
          }
        ]}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>
            New here? <Text style={styles.createAccountLink} onPress={() => router.push('/signup1')}>Create account</Text>
          </Text>
          <CustomInput
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              validateEmail(text);
            }}
            label="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            error={emailError}
          />
          <CustomInput
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              validatePassword(text);
            }}
            label="Password"
            secureTextEntry
            error={passwordError}
          />
          <Animated.View style={{
            transform: [{ translateY: buttonPosition }]
          }}>
            <TouchableOpacity 
              style={styles.button} 
              onPress={handleLogin} 
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? 'Loading...' : 'Get In'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/forgotPassword')}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </Animated.View>
    </KeyboardAvoidingView>
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
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
    marginBottom: Platform.OS === 'ios' ? 20 : 0,
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
});

export default LoginScreen;
