import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, FlatList, TextInput, ScrollView, Alert } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';
import CustomInput from '../components/CustomInput';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Modal from 'react-native-modal';

const RecipientDetailsScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  console.log('RecipientDetails - Raw params:', params);

  const amount = params.amount as string;
  const currency = params.currency as string;
  const receiveCurrency = params.receiveCurrency as string;
  const paymentMethod = params.paymentMethod as string;

  console.log('RecipientDetails - Parsed params:', { amount, currency, receiveCurrency, paymentMethod });

  React.useEffect(() => {
    if (!amount || !currency || !receiveCurrency || !paymentMethod) {
      console.error('Missing required parameters');
      Alert.alert(
        'Error',
        'Some required information is missing. Please go back and try again.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    }
  }, [amount, currency, receiveCurrency, paymentMethod, router]);

  const [recipientName, setRecipientName] = useState('');
  const [recipientContact, setRecipientContact] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [isBankListVisible, setIsBankListVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isNextButtonActive = useMemo(() => {
    if (paymentMethod === 'bank') {
      return recipientName && bankName && accountNumber && accountName;
    } else {
      return recipientName && recipientContact;
    }
  }, [paymentMethod, recipientName, recipientContact, bankName, accountNumber, accountName]);

  const handleNext = () => {
    if (isNextButtonActive) {
      console.log('RecipientDetails - Passing to PaymentType:', {
        amount,
        currency,
        receiveCurrency
      });
      router.push({
        pathname: '/paymentType',
        params: {
          paymentMethod,
          recipientName,
          recipientContact,
          accountName,
          accountNumber,
          bankName,
          amount,
          currency,
          receiveCurrency,
        },
      });
    }
  };

  const handleUploadQRCode = () => {
    console.log('Upload QR Code pressed');
  };

  const handleBankSelect = () => {
    setIsBankListVisible(true);
  };

  const handleBankChoice = (bank: string) => {
    setBankName(bank);
    setIsBankListVisible(false);
  };

  const getPaymentMethodDetails = (method: string) => {
    switch (method) {
      case 'alipay':
        return { title: 'Alipay', contactLabel: 'Recipient Alipay phone number or email' };
      case 'wechat':
        return { title: 'WeChat', contactLabel: 'Recipient WeChat ID' };
      case 'bank':
        return { title: 'Bank Transfer', contactLabel: 'Recipient Bank Account Number' };
      case 'cash':
        return { title: 'Cash Payment', contactLabel: 'Recipient Phone Number' };
      case 'eyuan':
        return { title: 'E-Yuan', contactLabel: 'Recipient E-Yuan Account' };
      case 'qqpay':
        return { title: 'QQ Pay', contactLabel: 'Recipient QQ Number' };
      default:
        return { title: 'Payment', contactLabel: 'Recipient Contact' };
    }
  };

  const { title, contactLabel } = getPaymentMethodDetails(paymentMethod);

  const dummyBanks = [
    "Bank of America", "JPMorgan Chase", "Wells Fargo", "Citibank", "U.S. Bank",
    "PNC Bank", "Capital One", "TD Bank", "Bank of New York Mellon",
    "State Street Corporation", "Goldman Sachs", "Morgan Stanley", "HSBC Bank USA",
    "Charles Schwab Corporation", "American Express", "Ally Financial",
    "Citizens Financial Group", "Fifth Third Bank", "KeyCorp", "Regions Financial Corporation",
    "M&T Bank", "Huntington Bancshares", "Synchrony Financial", "Discover Financial",
    "First Republic Bank", "SVB Financial Group", "Popular, Inc.", "Comerica",
    "CIT Group", "Zions Bancorporation"
  ];

  const filteredBanks = dummyBanks.filter(bank =>
    bank.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderBankItem = useCallback(({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.bankItem}
      onPress={() => handleBankChoice(item)}
    >
      <Text style={styles.bankItemText}>{item}</Text>
    </TouchableOpacity>
  ), []);

  const BankSelector = ({ value, onPress, placeholder }: { value: string, onPress: () => void, placeholder: string }) => (
    <TouchableOpacity style={styles.selectorContainer} onPress={onPress}>
      <View style={styles.selectorContent}>
        <Text style={value ? styles.selectorValue : styles.selectorPlaceholder}>
          {value || placeholder}
        </Text>
        <Icon name="chevron-down" size={24} color="#ADB4B8" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Image source={require('../assets/arrow-left.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.nextButton, !isNextButtonActive && styles.nextButtonInactive]} 
          onPress={handleNext}
          disabled={!isNextButtonActive}
        >
          <Text style={[styles.nextButtonText, !isNextButtonActive && styles.nextButtonTextInactive]}>Next</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title} Recipient Details</Text>
          <Icon name="information-outline" size={20} color="#ADB4B8" />
        </View>
        <CustomInput
          label="Recipient Name"
          value={recipientName}
          onChangeText={setRecipientName}
          placeholder="Enter recipient name"
        />
        {paymentMethod === 'bank' ? (
          <>
            <BankSelector
              value={bankName}
              onPress={handleBankSelect}
              placeholder="Select bank"
            />
            <CustomInput
              label="Account Number"
              value={accountNumber}
              onChangeText={setAccountNumber}
              placeholder="Enter account number"
              keyboardType="numeric"
            />
            <CustomInput
              label="Account Name"
              value={accountName}
              onChangeText={setAccountName}
              placeholder="Enter account name"
            />
          </>
        ) : (
          <CustomInput
            label={contactLabel}
            value={recipientContact}
            onChangeText={setRecipientContact}
            placeholder="Enter recipient contact"
          />
        )}
        {['alipay', 'wechat', 'qqpay'].includes(paymentMethod) && (
          <>
            <View style={styles.orContainer}>
              <View style={styles.orLine} />
              <Text style={styles.orText}>Or</Text>
              <View style={styles.orLine} />
            </View>
            <TouchableOpacity style={styles.uploadButton} onPress={handleUploadQRCode}>
              <Image source={require('../assets/Upload.png')} style={styles.uploadIcon} />
              <Text style={styles.uploadButtonText}>Upload Recipient QR Code</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
      <Modal
        isVisible={isBankListVisible}
        onBackdropPress={() => setIsBankListVisible(false)}
        onSwipeComplete={() => setIsBankListVisible(false)}
        swipeDirection={['down']}
        style={styles.bottomSheet}
      >
        <View style={styles.bankListContainer}>
          <View style={styles.modalHandle} />
          <Text style={styles.bankListTitle}>Select a Bank</Text>
          <View style={styles.searchContainer}>
            <Icon name="magnify" size={24} color="#ADB4B8" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search banks"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <FlatList
            data={filteredBanks}
            keyExtractor={(item) => item}
            renderItem={renderBankItem}
            contentContainerStyle={styles.bankList}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  nextButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  nextButtonInactive: {
    backgroundColor: '#6D7394',
  },
  nextButtonText: {
    color: COLORS.WHITE,
    fontFamily: 'RedHatDisplay-Bold',
    fontSize: 16,
  },
  nextButtonTextInactive: {
    color: '#999EB6',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontFamily: 'RedHatDisplay-Bold',
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.BLACK,
    marginRight: 10,
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.GRAY,
  },
  orText: {
    fontFamily: 'RedHatDisplay-Medium',
    fontSize: 14,
    color: COLORS.GRAY,
    marginHorizontal: 10,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#BFDEDB',
    borderRadius: 40,
    padding: 16,
  },
  uploadIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  uploadButtonText: {
    fontFamily: 'RedHatDisplay-Bold',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
  },
  bottomSheet: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  bankListContainer: {
    backgroundColor: '#FAFAFA',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 10,
    paddingHorizontal: 20,
    maxHeight: '80%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 10,
  },
  bankListTitle: {
    fontFamily: 'RedHatDisplay-Bold',
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.BLACK,
    marginBottom: 15,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontFamily: 'RedHatDisplay-Medium',
    fontSize: 16,
  },
  bankList: {
    paddingBottom: 20,
  },
  bankItem: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  bankItemText: {
    fontFamily: 'RedHatDisplay-Medium',
    fontSize: 16,
    color: COLORS.BLACK,
  },
  selectorContainer: {
    marginBottom: 20,
  },
  selectorContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 62,
    backgroundColor: '#EBEBED',
    borderRadius: 15,
    paddingHorizontal: 16,
  },
  selectorValue: {
    fontFamily: 'RedHatDisplay-Medium',
    fontSize: 16,
    color: COLORS.BLACK,
  },
  selectorPlaceholder: {
    fontFamily: 'RedHatDisplay-Medium',
    fontSize: 16,
    color: '#ADB4B8',
  },
});

export default RecipientDetailsScreen;
