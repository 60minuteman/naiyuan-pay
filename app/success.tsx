import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity, Dimensions, Switch } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';
import Button from '../components/Button';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';

const { width } = Dimensions.get('window');

const Success = () => {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [saveBeneficiary, setSaveBeneficiary] = useState(false);
  const animation = useRef<LottieView>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    // Play the animation
    if (animation.current) {
      animation.current.play();
    }

    return () => clearInterval(timer);
  }, []);

  const formatTime = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} mins`;
  }, []);

  const handleGoHome = useCallback(() => {
    router.push('/homeOngoing');
  }, [router]);

  const toggleSaveBeneficiary = useCallback(() => {
    setSaveBeneficiary(prev => !prev);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.logo}>Naiyuanpay</Text>
      <View style={styles.content}>
        <LottieView
          ref={animation}
          source={require('../assets/success.json')}
          style={styles.lottie}
          autoPlay
          loop={false}
        />
        <Text style={styles.title}>Transaction Successful</Text>
        <Text style={styles.subtitle}>
          You have successfully sent <Text style={styles.amount}>NGN 50,000</Text> to your merchant.
        </Text>
        <View style={styles.receiptContainer}>
          <View style={styles.downloadCircle}>
            <Image source={require('../assets/download-icon.png')} style={styles.downloadIcon} />
          </View>
          <Text style={styles.downloadText}>
            Download receipt in <Text style={styles.downloadTime}>{formatTime(timeLeft)}</Text>
          </Text>
        </View>
        <View style={styles.toggleContainer}>
          <Text style={styles.toggleText}>Save Beneficiary</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={saveBeneficiary ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSaveBeneficiary}
            value={saveBeneficiary}
          />
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Button 
          title="Go back to home" 
          onPress={() => router.push('/homeScreen')}
          style={styles.button}
          textStyle={styles.buttonText}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  logo: {
    fontFamily: FONTS.BOLD,
    fontSize: 24,
    color: COLORS.PRIMARY,
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  lottie: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontFamily: FONTS.BOLD,
    fontSize: 24,
    color: COLORS.BLACK,
    marginBottom: 16,
  },
  subtitle: {
    fontFamily: FONTS.REGULAR,
    fontSize: 16,
    color: COLORS.GRAY,
    textAlign: 'center',
    marginBottom: 40,
  },
  amount: {
    fontFamily: FONTS.BOLD,
    color: COLORS.BLACK,
  },
  receiptContainer: {
    backgroundColor: '#EBEBED',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    height: 200,
  },
  downloadCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#00AD84', // Green border color
  },
  downloadIcon: {
    width: 24,
    height: 24,
  },
  downloadText: {
    fontFamily: FONTS.REGULAR,
    fontSize: 14,
    color: COLORS.BLACK,
    textAlign: 'center',
  },
  downloadTime: {
    color: COLORS.PRIMARY,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  toggleText: {
    fontFamily: FONTS.REGULAR,
    fontSize: 16,
    color: COLORS.BLACK,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  button: {
    backgroundColor: '#EBEBED',
    borderRadius: 40,
  },
  buttonText: {
    fontFamily: FONTS.MEDIUM,
    fontSize: 16,
    color: '#39374F',
  },
});

export default Success;
