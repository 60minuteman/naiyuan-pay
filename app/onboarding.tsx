import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform, Dimensions, TouchableOpacity } from 'react-native';
import { COLORS, SIZES, FONTS } from '../constants/theme';
import Button from '../components/Button';
import { useRouter, Stack } from 'expo-router';
import { globalStyles } from '../styles/globalStyles';
import { Globe } from '../components/Globe'; // Import the Globe component

const { width, height } = Dimensions.get('window');

const notifications = [
  {
    name: "Fast Payments",
    description: "Send money quickly",
    icon: "💸",
    color: "#00C9A7",
    time: "",
  },
  {
    name: "Secure Transactions",
    description: "Your money is safe",
    icon: "🔒",
    color: "#FFB800",
    time: "",
  },
  {
    name: "Multiple Currencies",
    description: "Support for various currencies",
    icon: "💱",
    color: "#FF3D71",
    time: "",
  },
  {
    name: "24/7 Support",
    description: "We're always here to help",
    icon: "🆘",
    color: "#1E86FF",
    time: "",
  },
];

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={[globalStyles.safeArea, styles.container]}>
        <View style={styles.content}>
          <View style={styles.topSection}>
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoText}>LOGO</Text>
            </View>
            <Text style={styles.title}>Welcome to Naiyuan Pay</Text>
            <Text style={styles.subtitle}>Pay your Chinese merchants seamlessly with no hassle</Text>
          </View>
          
          <View style={styles.middleSection}>
            <Globe />
          </View>
        </View>
        
        <View style={styles.bottomSection}>
          <View style={styles.buttonContainer}>
            <Button
              title="Get Started"
              onPress={() => router.push('/signup1')}
            />
          </View>
          
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/loginScreen')}>
              <Text style={styles.loginLink}>Log in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}

const AnimatedListItem = ({ name, description, icon, color }: any) => {
  return (
    <View style={[styles.notificationItem, { borderLeftColor: color }]}>
      <Text style={styles.notificationIcon}>{icon}</Text>
      <View style={styles.notificationContent}>
        <Text style={styles.notificationName}>{name}</Text>
        <Text style={styles.notificationDescription}>{description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  topSection: {
    paddingTop: 80,
    alignItems: 'center',
  },
  logoPlaceholder: {
    width: 59,
    height: 59,
    backgroundColor: COLORS.GRAY,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 29.5,
    marginBottom: 20,
  },
  logoText: {
    color: COLORS.WHITE,
    fontSize: 14,
    fontFamily: FONTS.BOLD,
  },
  title: {
    fontSize: 28,
    fontFamily: FONTS.BOLD,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    fontFamily: FONTS.REGULAR,
    textAlign: 'center',
    lineHeight: 24,
    width: 275,
  },
  middleSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSection: {
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 20 : 20,
    paddingTop: 20,
  },
  loginContainer: {
    flexDirection: 'row',
    marginTop: 16,
  },
  loginText: {
    fontFamily: FONTS.REGULAR,
    fontSize: 18,
  },
  loginLink: {
    fontFamily: FONTS.BOLD,
    color: COLORS.PRIMARY,
    fontSize: 18,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notificationIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  notificationContent: {
    flex: 1,
  },
  notificationName: {
    fontFamily: FONTS.BOLD,
    fontSize: 16,
    marginBottom: 4,
  },
  notificationDescription: {
    fontFamily: FONTS.REGULAR,
    fontSize: 14,
    color: COLORS.GRAY,
  },
});
