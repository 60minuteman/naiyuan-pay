import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { COLORS, FONTS } from '../constants/theme';
import Button from '../components/Button';

export default function WelcomeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const userFirstName = params.firstName as string || "User"; // Default to "User" if firstName is not provided

  const handleGetStarted = () => {
    router.replace('/homeScreen');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.imageContainer} />
        <View style={styles.textContainer}>
          <Text style={styles.welcomeText}>Welcome,</Text>
          <Text style={styles.nameText}>{userFirstName}</Text>
        </View>
        <Text style={styles.subtitle}>Your account has been created successfully.</Text>
        <Button
          title="Get Started"
          onPress={handleGetStarted}
          style={styles.button}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CDDFFA',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.PRIMARY,
    marginBottom: 32,
  },
  textContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  welcomeText: {
    fontFamily: FONTS.BOLD,
    fontSize: 40,
    textAlign: 'center',
    color: COLORS.BLACK,
  },
  nameText: {
    fontFamily: FONTS.BOLD,
    fontSize: 40,
    textAlign: 'center',
    color: COLORS.BLACK,
    marginLeft: 8,
  },
  subtitle: {
    fontFamily: FONTS.REGULAR,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: COLORS.BLACK,
  },
  button: {
    width: 172,
  },
});
