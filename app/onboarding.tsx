import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform, Dimensions, TouchableOpacity, Image, Animated } from 'react-native';
import { COLORS, SIZES, FONTS } from '../constants/theme';
import Button from '../components/Button';
import { useRouter, Stack } from 'expo-router';
import { globalStyles } from '../styles/globalStyles';

const { width, height } = Dimensions.get('window');

const notifications = [
  {
    name: "Fast Payments",
    description: "Pay suppliers quickly",
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
  }
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [fadeAnims] = useState(notifications.map(() => new Animated.Value(0)));

  useEffect(() => {
    notifications.forEach((_, index) => {
      Animated.timing(fadeAnims[index], {
        toValue: 1,
        duration: 500,
        delay: index * 200,
        useNativeDriver: true,
      }).start();
    });
  }, []);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={[globalStyles.safeArea, styles.container]}>
        <View style={styles.content}>
          <View style={styles.topSection}>
            <View style={styles.logoPlaceholder}>
              <Image 
                source={require('../assets/logow.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.title}>Welcome to Naiyuan Pay</Text>
            <Text style={styles.subtitle}>Pay your Chinese merchants seamlessly with no hassle</Text>
          </View>
          
          <View style={styles.middleSection}>
            {notifications.map((item, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.notificationContainer,
                  {
                    opacity: fadeAnims[index],
                    transform: [{
                      translateY: fadeAnims[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [50, 0],
                      }),
                    }],
                  },
                ]}
              >
                <AnimatedListItem
                  name={item.name}
                  description={item.description}
                  icon={item.icon}
                  color={item.color}
                />
              </Animated.View>
            ))}
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
    paddingTop: 40, // Reduced from 80
    alignItems: 'center',
  },
  logoPlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    marginBottom: 20,
  },
  logo: {
    width: 40,
    height: 40,
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
    paddingVertical: 40, // Increased padding
    justifyContent: 'center', // Center content vertically
  },
  notificationContainer: {
    marginBottom: 16, // Increased spacing between cards
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
