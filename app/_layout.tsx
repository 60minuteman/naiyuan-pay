import React from 'react';
import { Platform, useColorScheme } from 'react-native';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { AuthProvider } from '../context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

const [queryClient] = useState(() => new QueryClient());

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'RedHatDisplay-Regular': require('../assets/fonts/RedHatDisplay-Regular.ttf'),
    'RedHatDisplay-Medium': require('../assets/fonts/RedHatDisplay-Medium.ttf'),
    'RedHatDisplay-Bold': require('../assets/fonts/RedHatDisplay-Bold.ttf'),
  });

  const colorScheme = useColorScheme();

  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
      if (fontsLoaded) {
        await SplashScreen.hideAsync();
      }
    }
    prepare();
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Stack 
          screenOptions={{
            headerShown: false,
            headerStyle: {
              backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
            },
            headerTintColor: colorScheme === 'dark' ? '#fff' : '#000',
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="homeScreen" />
          <Stack.Screen name="index" />
          <Stack.Screen name="history" />
          <Stack.Screen name="alipay" />
          <Stack.Screen name="paymentType" />
          <Stack.Screen name="accountDetails" />
          <Stack.Screen name="success" />
          <Stack.Screen name="homeOngoing" />
          <Stack.Screen name="security" />
          <Stack.Screen name="profile-screen" />
          <Stack.Screen name="change-password" />
          <Stack.Screen name="bank-card" />
          <Stack.Screen name="paymentMethod" options={{ headerShown: false }} />
          <Stack.Screen name="recipientDetails" options={{ headerShown: false }} />
        </Stack>
      </AuthProvider>
    </QueryClientProvider>
  );
}
