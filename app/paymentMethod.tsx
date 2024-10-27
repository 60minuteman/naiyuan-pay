import React, { useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';
import Header from '../components/Header';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRouter, Stack, useLocalSearchParams } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import FontLoader from '../components/FontLoader';

const paymentMethods = [
  { id: 'alipay', name: 'Send to Alipay', icon: 'alpha-a-circle' },
  { id: 'wechat', name: 'Send to WeChat', icon: 'wechat' },
  { id: 'bank', name: 'Bank Transfer', icon: 'bank' },
  { id: 'cash', name: 'Cash Payment', icon: 'cash' },
  { id: 'eyuan', name: 'E-Yuan', icon: 'currency-cny' },
  { id: 'qqpay', name: 'QQ Pay', icon: 'alpha-q-circle' },
];

const PaymentMethodScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [fontsLoaded] = useFonts({
    'RedHatDisplay-Bold': require('../assets/fonts/RedHatDisplay-Bold.ttf'),
  });

  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  const handleMethodSelect = useCallback((methodId: string) => {
    console.log('PaymentMethod - Passing params:', {
      paymentMethod: methodId,
      amount: params.amount,
      currency: params.currency,
      receiveCurrency: params.receiveCurrency
    });
    router.push({
      pathname: '/recipientDetails',
      params: {
        paymentMethod: methodId,
        amount: params.amount,
        currency: params.currency,
        receiveCurrency: params.receiveCurrency
      }
    });
  }, [params, router]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <FontLoader>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container} onLayout={onLayoutRootView}>
        <Header
          variant="centered"
          title="Select Payment Method"
          titleStyle={styles.headerTitle}
        />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {paymentMethods.map((method, index) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.methodItem,
                index === paymentMethods.length - 1 && styles.lastMethodItem
              ]}
              onPress={() => handleMethodSelect(method.id)}
            >
              <View style={styles.methodIconContainer}>
                <Icon name={method.icon} size={24} color="#4D62CD" />
              </View>
              <Text style={styles.methodName}>{method.name}</Text>
              <Image source={require('../assets/chevron-right.png')} style={styles.chevronIcon} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    </FontLoader>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFB',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  methodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E6EB',
  },
  lastMethodItem: {
    marginBottom: 0,
  },
  methodIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(77, 98, 205, 0.1)', // #4D62CD with 10% opacity
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  methodName: {
    flex: 1,
    fontFamily: 'RedHatDisplay-Bold',
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.BLACK,
  },
  chevronIcon: {
    width: 24,
    height: 24,
  },
  headerTitle: {
    fontFamily: 'RedHatDisplay-Bold',
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.BLACK,
  },
});

export default PaymentMethodScreen;
