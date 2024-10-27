import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, ImageBackground, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { COLORS, FONTS } from '../constants/theme';
import { globalStyles } from '../styles/globalStyles';
import Modal from 'react-native-modal';
import Keyboard from '../components/Keyboard';
import { useFonts } from 'expo-font';

const CurrencyScreen: React.FC = () => {
  const [fontsLoaded] = useFonts({
    'RedHatDisplay-Regular': require('../assets/fonts/RedHatDisplay-Regular.ttf'),
    'RedHatDisplay-Bold': require('../assets/fonts/RedHatDisplay-Bold.ttf'),
  });

  const params = useLocalSearchParams();
  const router = useRouter();
  const [sendAmount, setSendAmount] = useState('');
  const [receivedAmount, setReceivedAmount] = useState('0.00');
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('NGN');
  const [receiveCurrency, setReceiveCurrency] = useState('CNY');
  const [isSelectingTopCurrency, setIsSelectingTopCurrency] = useState(true);

  const handleProceed = () => {
    router.push({
      pathname: '/paymentMethod',
      params: {
        amount: sendAmount,
        currency: selectedCurrency,
        receiveCurrency: receiveCurrency
      }
    });
  };
  
  const exchangeRate = 1500; // Example exchange rate (1 NGN = 0.0024 USD)

  const currencies = ['NGN', 'USD', 'EUR', 'GBP', 'CNY'];

  useEffect(() => {
    if (params.selectedCurrency && typeof params.selectedCurrency === 'string') {
      setReceiveCurrency(params.selectedCurrency);
    } else {
      setReceiveCurrency('CNY'); // Set default receive currency if not provided
    }
  }, [params.selectedCurrency]);

  useEffect(() => {
    if (sendAmount) {
      const calculated = (parseFloat(sendAmount) * exchangeRate).toFixed(2);
      setReceivedAmount(calculated);
    } else {
      setReceivedAmount('0.00');
    }
  }, [sendAmount, selectedCurrency, receiveCurrency]);

  const handleCurrencyChange = (currency: string) => {
    if (isSelectingTopCurrency) {
      // Do nothing for top currency as it should always be NGN
    } else {
      setReceiveCurrency(currency);
    }
    setShowCurrencyModal(false);
  };

  const handleBackPress = () => {
    router.push('/homeScreen');
  };

  const getFlagIcon = (currencyCode: string) => {
    switch (currencyCode) {
      case 'CNY':
        return require('../assets/china-flag.png');
      case 'USD':
        return require('../assets/usa-flag.png');
      case 'EUR':
        return require('../assets/eu-flag.png');
      case 'GBP':
        return require('../assets/uk-flag.png');
      default:
        return require('../assets/nigeria-flag.png');
    }
  };

  const handleKeyPress = (key: string) => {
    if (key === 'Proceed') {
      if (sendAmount && parseFloat(sendAmount) > 0) {
        console.log('CurrencyScreen - Proceeding with amount:', sendAmount, 'currency:', selectedCurrency, 'receiveCurrency:', receiveCurrency);
        router.push({
          pathname: '/paymentMethod',
          params: {
            amount: sendAmount,
            currency: selectedCurrency,
            receiveCurrency: receiveCurrency
          }
        });
      } else {
        Alert.alert('Invalid Amount', 'Please enter a valid amount before proceeding.');
      }
    } else if (key === '<') {
      setSendAmount(prevAmount => prevAmount.slice(0, -1));
    } else if (key === '.') {
      if (!sendAmount.includes('.')) {
        setSendAmount(prevAmount => prevAmount + key);
      }
    } else {
      setSendAmount(prevAmount => prevAmount + key);
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Image source={require('../assets/back-arrow.png')} style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Enter Amount</Text>
          
          <View style={styles.amountContainer}>
            <Text style={styles.currencySymbol}>₦</Text>
            <Text style={styles.amountText}>{sendAmount || '0'}</Text>
            <View style={styles.currencySelector}>
              <Image source={getFlagIcon('NGN')} style={styles.flagIcon} />
              <Text style={styles.currencyCode}>NGN</Text>
            </View>
          </View>

          <View style={styles.rateContainer}>
            <Text style={styles.rateText}>Rate: ₦1,500 / $</Text>
            <Text style={styles.feeText}>Fee: 1.5%</Text>
          </View>

          <Text style={styles.supplierGetsText}>Your supplier gets</Text>
          <View style={styles.receivedAmountContainer}>
            <Text style={styles.receivedCurrencySymbol}>¥</Text>
            <Text style={styles.receivedAmountText}>{receivedAmount}</Text>
            <TouchableOpacity onPress={() => {setShowCurrencyModal(true); setIsSelectingTopCurrency(false);}} style={styles.currencySelector}>
              <Image source={getFlagIcon(receiveCurrency)} style={styles.flagIcon} />
              <Text style={styles.currencyCode}>{receiveCurrency}</Text>
              <Image source={require('../assets/chevron-down.png')} style={styles.chevronIcon} />
            </TouchableOpacity>
          </View>

          <View style={styles.keyboardContainer}>
            <Keyboard onKeyPress={handleKeyPress} onProceed={handleProceed} />
          </View>
        </View>
      </SafeAreaView>

      <Modal
        isVisible={showCurrencyModal}
        onBackdropPress={() => setShowCurrencyModal(false)}
        onSwipeComplete={() => setShowCurrencyModal(false)}
        swipeDirection={['down']}
        style={styles.bottomSheet}
      >
        <View style={styles.modalContent}>
          <View style={styles.indicator} />
          <Text style={styles.modalTitle}>Select Currency</Text>
          {currencies.filter(currency => currency !== 'NGN').map((currency) => (
            <TouchableOpacity key={currency} onPress={() => handleCurrencyChange(currency)} style={styles.currencyOption}>
              <Image source={getFlagIcon(currency)} style={styles.modalFlagIcon} />
              <Text style={styles.currencyOptionText}>{currency}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  backButton: {
    marginBottom: 20,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'RedHatDisplay-Bold',
    marginBottom: 30,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  currencySymbol: {
    fontSize: 32,
    fontFamily: 'RedHatDisplay-Bold',
  },
  amountText: {
    fontSize: 32,
    fontFamily: 'RedHatDisplay-Bold',
    flex: 1,
    marginLeft: 10,
  },
  currencySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5E5E5',
    borderRadius: 8,
    padding: 8,
  },
  flagIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  currencyCode: {
    fontSize: 16,
    fontFamily: 'RedHatDisplay-Bold',
    marginRight: 4,
  },
  chevronIcon: {
    width: 12,
    height: 12,
  },
  rateContainer: {
    backgroundColor: 'rgba(255, 165, 0, 0.1)', // Subtle orange background
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  rateText: {
    fontSize: 18, // Increased by 4px
    fontFamily: 'RedHatDisplay-Regular',
    color: '#333',
  },
  feeText: {
    fontSize: 18, // Increased by 4px
    fontFamily: 'RedHatDisplay-Regular',
    color: '#333',
    marginTop: 5,
  },
  supplierGetsText: {
    fontSize: 16,
    fontFamily: 'RedHatDisplay-Bold',
    color: '#333',
    marginBottom: 10,
  },
  receivedAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  receivedCurrencySymbol: {
    fontSize: 24,
    fontFamily: 'RedHatDisplay-Bold',
  },
  receivedAmountText: {
    fontSize: 24,
    fontFamily: 'RedHatDisplay-Bold',
    flex: 1,
    marginLeft: 10,
  },
  keyboardContainer: {
    marginTop: 'auto',
  },
  bottomSheet: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  indicator: {
    width: 50,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'RedHatDisplay-Bold',
    marginBottom: 20,
  },
  currencyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    width: '100%',
  },
  modalFlagIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  currencyOptionText: {
    fontSize: 16,
    fontFamily: 'RedHatDisplay-Bold',
  },
});

export default CurrencyScreen;
