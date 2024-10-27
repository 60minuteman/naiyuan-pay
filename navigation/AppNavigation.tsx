// navigation/AppNavigation.tsx

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';

import OnboardingScreen from '../screens/Onboarding';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen1 from '../screens/SignUpScreen1';
import SignUpScreen2 from '../screens/SignUpScreen2';
import SignUpScreen3 from '../screens/SignUpScreen3';
import WelcomeScreen from '../screens/WelcomeScreen';
import HomeScreen from '../screens/HomeScreen';
import HomeOngoing from '../screens/HomeOngoing'; // Import HomeOngoing
import RecipientDetails from '../screens/RecipientDetails';
import CurrencyConversionScreen from '../screens/CurrencyConversionScreen';
import PaymentMethodScreen from '../screens/PaymentMethodScreen';
import PaymentType from '../screens/PaymentType';
import AccountDetails from '../screens/AccountDetails';
import Success from '../screens/Success'; // Import the Success screen
import BankTransfer from '../screens/BankTransfer'; // Import the BankTransfer screen
import ProfileScreen from '../screens/ProfileScreen';
import BankCard from '../screens/BankCard';
import Security from '../screens/Security';
import ChangePassword from '../screens/ChangePassword';
import History from '../screens/History';
export type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  SignUpScreen1: undefined;
  SignUpScreen2: { email: string; phoneNumber: string; password: string };
  SignUpScreen3: { email: string; phoneNumber: string; password: string };
  Welcome: { bvn: string; nin: string; dob: string };
  HomeScreen: undefined;
  HomeOngoing: undefined; // Add this line
  RecipientDetails: { paymentMethod: string };
  CurrencyConversion: { selectedCurrency: { name: string; code: string } };
  PaymentMethod: undefined;
  PaymentType: { 
    paymentMethod: string; 
    recipientName?: string; 
    recipientContact?: string;
    accountName?: string;
    accountNumber?: string;
    bankName?: string;
  };
  AccountDetails: { paymentType: 'express' | 'standard' };
  Success: undefined;
  BankTransfer: { paymentMethod: string }; // Add this line
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUpScreen1" component={SignUpScreen1} />
        <Stack.Screen name="SignUpScreen2" component={SignUpScreen2} />
        <Stack.Screen name="SignUpScreen3" component={SignUpScreen3} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="HomeOngoing" component={HomeOngoing} /> // Add this line
        <Stack.Screen name="RecipientDetails" component={RecipientDetails} />
        <Stack.Screen name="CurrencyConversion" component={CurrencyConversionScreen} />
        <Stack.Screen name="PaymentMethod" component={PaymentMethodScreen} />
        <Stack.Screen name="PaymentType" component={PaymentType} />
        <Stack.Screen name="AccountDetails" component={AccountDetails} />
        <Stack.Screen name="Success" component={Success} />
        <Stack.Screen name="BankTransfer" component={BankTransfer} /> // Add this line
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="BankCard" component={BankCard} />
        <Stack.Screen name="Security" component={Security} />
        <Stack.Screen name="ChangePassword" component={ChangePassword} />
        <Stack.Screen name="History" component={History} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;