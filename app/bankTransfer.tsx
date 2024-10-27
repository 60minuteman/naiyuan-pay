import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, FlatList, TextInput } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';
import CustomInput from '../components/CustomInput';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Modal from 'react-native-modal';

export type RootStackParamList = {
  PaymentMethod: undefined;
  BankTransfer: { paymentMethod: string };
  PaymentType: { paymentMethod: string; accountName: string; accountNumber: string; bankName: string };
};

type BankTransferRouteProp = RouteProp<RootStackParamList, 'BankTransfer'>;
type BankTransferNavigationProp = StackNavigationProp<RootStackParamList, 'BankTransfer'>;

type Props = {
  route: BankTransferRouteProp;
  navigation: BankTransferNavigationProp;
};

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

const BankSelector = ({ value, onPress, placeholder }) => (
  <TouchableOpacity style={styles.selectorContainer} onPress={onPress}>
    <View style={styles.selectorContent}>
      <Text style={value ? styles.selectorValue : styles.selectorPlaceholder}>
        {value || placeholder}
      </Text>
      <Icon name="chevron-down" size={24} color="#ADB4B8" />
    </View>
  </TouchableOpacity>
);

const BankTransfer: React.FC<Props> = ({ route, navigation }) => {
  const { paymentMethod } = route.params;
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [isBankListVisible, setIsBankListVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleNext = () => {
    navigation.navigate('PaymentType', {
      paymentMethod,
      accountName,
      accountNumber,
      bankName,
    });
  };

  const handleBankSelect = () => {
    setIsBankListVisible(true);
  };

  const handleBankChoice = (bank: string) => {
    setBankName(bank);
    setIsBankListVisible(false);
  };

  const filteredBanks = dummyBanks.filter(bank =>
    bank.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderBankItem = useCallback(({ item }) => (
    <TouchableOpacity
      style={styles.bankItem}
      onPress={() => handleBankChoice(item)}
    >
      <Text style={styles.bankItemText}>{item}</Text>
    </TouchableOpacity>
  ), []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../assets/arrow-left.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Bank Transfer Details</Text>
          <Icon name="information-outline" size={20} color="#ADB4B8" />
        </View>
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
  nextButtonText: {
    color: COLORS.WHITE,
    fontFamily: 'RedHatDisplay-Medium',
    fontSize: 16,
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
    fontFamily: 'RedHatDisplay-Medium',
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.BLACK,
    marginRight: 10,
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
    fontFamily: 'RedHatDisplay-Medium',
    fontSize: 18,
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

export default BankTransfer;
