import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, TextInput, ImageBackground, ActivityIndicator } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';
import FontLoader from '../components/FontLoader';
import { globalStyles } from '../styles/globalStyles';
import { useRouter } from 'expo-router';
import Modal from 'react-native-modal';
import { getTransactions, getTransactionByReference } from '../services/api';
import Toast from 'react-native-toast-message';

const History: React.FC = () => {
  const router = useRouter();
  const [isTransactionDetailsVisible, setTransactionDetailsVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = transactions.filter(transaction => 
        transaction.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.amount.toString().includes(searchQuery)
      );
      setFilteredTransactions(filtered);
    } else {
      setFilteredTransactions(transactions);
    }
  }, [searchQuery, transactions]);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const data = await getTransactions();
      setTransactions(data);
      setFilteredTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load transactions',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTransactionPress = async (transaction) => {
    try {
      setSelectedTransaction(transaction);
      setTransactionDetailsVisible(true);
      setIsLoadingDetails(true);

      const details = await getTransactionByReference(transaction.reference);
      setSelectedTransaction(details);
    } catch (error) {
      console.error('Error fetching transaction details:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load transaction details',
      });
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const renderTransactionItem = (transaction) => (
    <TouchableOpacity 
      key={transaction.id}
      style={styles.activityItem}
      onPress={() => handleTransactionPress(transaction)}
    >
      <View style={styles.activityIconContainer}>
        <Image 
          source={require('../assets/arrow-up-right.png')}
          style={styles.activityIcon} 
        />
      </View>
      <View style={styles.activityDetails}>
        <Text style={styles.activityTitle}>{transaction.title}</Text>
        <Text style={styles.activitySubtitle}>
          {new Date(transaction.createdAt).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.activityAmountContainer}>
        <Text style={[
          styles.activityAmount,
          { color: transaction.type === 'CREDIT' ? '#00C853' : '#F04438' }
        ]}>
          ₦{transaction.amount.toLocaleString()}
        </Text>
        <Text style={styles.activityTime}>
          {new Date(transaction.createdAt).toLocaleTimeString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <FontLoader>
      <ImageBackground 
        source={require('../assets/home-bg.png')} 
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <SafeAreaView style={[globalStyles.safeArea, styles.safeArea]}>
          <View style={globalStyles.container}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => router.back()}>
                <Image source={require('../assets/arrow-left.png')} style={styles.backIcon} />
              </TouchableOpacity>
              <Text style={styles.title}>Transactions</Text>
              <View style={styles.placeholder} />
            </View>
            
            <View style={styles.searchContainer}>
              <View style={styles.searchInputContainer}>
                <Image source={require('../assets/search-icon.png')} style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search transactions"
                  placeholderTextColor="#A0A0A0"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
              <TouchableOpacity style={styles.filterButton}>
                <Image source={require('../assets/filter-icon.png')} style={styles.filterIcon} />
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>All Transactions</Text>

            <ScrollView style={styles.scrollView}>
              <View style={styles.transactionsContainer}>
                {isLoading ? (
                  <ActivityIndicator size="large" color={COLORS.PRIMARY} />
                ) : filteredTransactions.length > 0 ? (
                  filteredTransactions.map(renderTransactionItem)
                ) : (
                  <Text style={styles.noTransactionsText}>No transactions found</Text>
                )}
              </View>
            </ScrollView>
          </View>
        </SafeAreaView>
      </ImageBackground>

      <Modal
        isVisible={isTransactionDetailsVisible}
        onBackdropPress={() => setTransactionDetailsVisible(false)}
        onSwipeComplete={() => setTransactionDetailsVisible(false)}
        swipeDirection={['down']}
        style={styles.bottomSheet}
      >
        <View style={styles.transactionDetailsContent}>
          <View style={styles.indicator} />
          {isLoadingDetails ? (
            <ActivityIndicator size="large" color={COLORS.PRIMARY} />
          ) : selectedTransaction ? (
            <ScrollView>
              <Text style={styles.transactionAmount}>¥ 50,100.73</Text>
              <Text style={styles.transactionType}>Alipay Payment</Text>
              <Text style={styles.transactionDate}>May 22 - 08:36AM</Text>
              
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.primaryButton}>
                  <Text style={styles.primaryButtonText}>Send Again</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondaryButton}>
                  <Text style={styles.secondaryButtonText}>View Recipient Details</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.transferProgressTitle}>Transfer in progress</Text>
              <View style={styles.transferProgressContainer}>
                {['Payment Received', 'Recipient Verified', 'Payment Completed'].map((step, index) => (
                  <View key={index} style={styles.transferProgressItem}>
                    <View style={[
                      styles.transferProgressIndicator,
                      index > 0 && styles.unverifiedProgressIndicator
                    ]} />
                    <View style={styles.transferProgressTextContainer}>
                      <Text style={styles.transferProgressItemTitle}>{step}</Text>
                      <Text style={styles.transferProgressItemTime}>May 22 - 08:36AM</Text>
                    </View>
                  </View>
                ))}
              </View>

              <View style={styles.transactionReceiptContainer}>
                <Text style={styles.transactionReceiptText}>Transaction Receipt</Text>
                <TouchableOpacity style={styles.downloadButton}>
                  <Image source={require('../assets/download-icon.png')} style={styles.downloadIcon} />
                  <Text style={styles.downloadButtonText}>Download</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          ) : (
            <Text style={styles.errorText}>Failed to load transaction details</Text>
          )}
        </View>
      </Modal>
      <Toast />
    </FontLoader>
  );
};

const additionalStyles = {
  noTransactionsText: {
    textAlign: 'center',
    fontFamily: FONTS.REGULAR,
    fontSize: 16,
    color: COLORS.GRAY,
    marginTop: 20,
  },
  errorText: {
    textAlign: 'center',
    fontFamily: FONTS.REGULAR,
    fontSize: 16,
    color: COLORS.ERROR,
    marginTop: 20,
  },
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  safeArea: {
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  title: {
    fontFamily: FONTS.BOLD,
    fontSize: 18,
    color: COLORS.BLACK,
  },
  placeholder: {
    width: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 10,
  },
  searchIcon: {
    width: 16,
    height: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: FONTS.REGULAR,
    fontSize: 16,
    color: COLORS.BLACK,
  },
  filterButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterIcon: {
    width: 16,
    height: 16,
  },
  sectionTitle: {
    fontFamily: 'Red Hat Display',
    fontSize: 20,
    fontWeight: '500',
    lineHeight: 24,
    color: '#353D44',
    textAlign: 'left',
    marginBottom: 14,
  },
  scrollView: {
    flex: 1,
  },
  transactionsContainer: {
    paddingTop: 8,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
  },
  activityIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityIcon: {
    width: 14,
    height: 14,
  },
  activityDetails: {
    flex: 1,
  },
  activityTitle: {
    fontFamily: FONTS.BOLD,
    fontSize: 16,
    color: COLORS.BLACK,
  },
  activitySubtitle: {
    fontFamily: FONTS.REGULAR,
    fontSize: 14,
    color: '#9B9BA7',
  },
  activityAmountContainer: {
    alignItems: 'flex-end',
  },
  activityAmount: {
    fontFamily: FONTS.BOLD,
    fontSize: 14,
    color: '#F04438',
  },
  activityTime: {
    fontFamily: FONTS.REGULAR,
    fontSize: 14,
    color: '#9B9BA7',
    marginTop: 2,
  },
  bottomSheet: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  transactionDetailsContent: {
    backgroundColor: '#FAFAFA',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  indicator: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  transactionAmount: {
    fontFamily: FONTS.BOLD,
    fontSize: 32,
    color: COLORS.BLACK,
    textAlign: 'left',
    marginBottom: 8,
  },
  transactionType: {
    fontFamily: FONTS.BOLD,
    fontSize: 18,
    color: COLORS.BLACK,
    textAlign: 'left',
    marginBottom: 4,
  },
  transactionDate: {
    fontFamily: FONTS.REGULAR,
    fontSize: 14,
    color: '#9B9BA7',
    textAlign: 'left',
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: '#4D62CD',
    borderRadius: 40,
    width: 135,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    fontFamily: FONTS.BOLD,
    fontSize: 16,
    color: '#FFFFFF',
  },
  secondaryButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 40,
    height: 46,
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontFamily: FONTS.BOLD,
    fontSize: 16,
    color: '#4D62CD',
  },
  transferProgressTitle: {
    fontFamily: FONTS.BOLD,
    fontSize: 16,
    color: '#9B9BA7',
    marginBottom: 16,
    marginTop: 24, // Add some space above the title
  },
  transferProgressContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 24, // Increase padding for better spacing
    marginBottom: 24,
  },
  transferProgressItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24, // Increase space between items
  },
  transferProgressIndicator: {
    width: 4,
    height: '100%',
    backgroundColor: '#4D62CD',
    borderRadius: 2,
    marginRight: 16, // Increase space between indicator and text
  },
  unverifiedProgressIndicator: {
    backgroundColor: '#EAEAEA',
  },
  transferProgressTextContainer: {
    flex: 1,
  },
  transferProgressItemTitle: {
    fontFamily: FONTS.BOLD,
    fontSize: 16,
    color: COLORS.BLACK,
    marginBottom: 4, // Add space between title and time
  },
  transferProgressItemTime: {
    fontFamily: FONTS.REGULAR,
    fontSize: 14,
    color: '#9B9BA7',
  },
  transactionReceiptContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 24, // Increase padding for better spacing
    marginTop: 24, // Add space above the receipt container
  },
  transactionReceiptText: {
    fontFamily: FONTS.BOLD,
    fontSize: 16,
    color: COLORS.BLACK,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00C853',
    borderRadius: 40,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  downloadIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  downloadButtonText: {
    fontFamily: FONTS.BOLD,
    fontSize: 14,
    color: '#FFFFFF',
  },
  ...additionalStyles,
});

export default History;
