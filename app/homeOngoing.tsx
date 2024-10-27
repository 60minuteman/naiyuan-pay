import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';
import Modal from 'react-native-modal';
import FontLoader from '../components/FontLoader';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { globalStyles } from '../styles/globalStyles';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const HomeOngoing: React.FC = () => {
  const router = useRouter();
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [isOngoingTransactionsVisible, setOngoingTransactionsVisible] = useState(false);
  const [isTransactionDetailsVisible, setTransactionDetailsVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isSidePanelVisible, setIsSidePanelVisible] = useState(false);

  const sampleTransactions = [
    {
      id: '1',
      title: 'Money Sent- Alipay',
      subtitle: 'Yesterday',
      amount: '₦10,000',
      time: '10:30 PM',
      status: 'Completed',
      recipient: 'Alipay User',
      description: 'Payment for goods',
    },
    {
      id: '2',
      title: 'Money Sent- Wechat',
      subtitle: 'Yesterday',
      amount: '₦15,000',
      time: '2:45 PM',
      status: 'Completed',
      recipient: 'Wechat User',
      description: 'Transfer to friend',
    },
    // ... add more sample transactions as needed
  ];

  const gridItems = [
    { title: 'Pay Merchant', icon: require('../assets/rocket-launch.png') },
    { title: 'Beneficiaries', icon: require('../assets/UserCircle.png') },
    { title: 'History', icon: require('../assets/rectangle-stack.png') },
    { title: 'Saved Cards', icon: require('../assets/Credit_Card.png') },
  ];

  const currencies = [
    { name: 'Chinese Yuan', code: 'CNY', icon: require('../assets/currency-yen.png') },
    { name: 'US Dollar', code: 'USD', icon: require('../assets/currency-dollar.png') },
    { name: 'Euro', code: 'EUR', icon: require('../assets/currency-euro.png') },
    { name: 'British Pound', code: 'GBP', icon: require('../assets/currency-pound.png') },
  ];

  const handlePayMerchantPress = () => {
    setBottomSheetVisible(true);
  };

  const handleCurrencySelect = (currency: any) => {
    setBottomSheetVisible(false);
    router.push({
      pathname: '/CurrencyScreen',
      params: { selectedCurrency: currency }
    });
  };

  const handleTransactionPress = (transaction) => {
    setSelectedTransaction(transaction);
    setTransactionDetailsVisible(true);
  };

  const handleProfilePress = useCallback(() => {
    setIsSidePanelVisible(false);
    router.push('/ProfileScreen');
  }, [router]);

  const handleBankCardPress = useCallback(() => {
    setIsSidePanelVisible(false);
    router.push('/BankCard');
  }, [router]);

  const handleSecurityPress = useCallback(() => {
    setIsSidePanelVisible(false);
    router.push('/Security');
  }, [router]);

  const handleHistoryPress = useCallback(() => {
    router.push('/History');
  }, [router]);

  const createPastelColor = (hexColor: string, opacity: number = 0.2) => {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  return (
    <FontLoader>
      <ImageBackground 
        source={require('../assets/home-bg.png')} 
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setIsSidePanelVisible(true)}>
              <Image source={require('../assets/square.png')} style={styles.icon} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Naiyuanpay</Text>
            <TouchableOpacity>
              <Image source={require('../assets/chat-bubble.png')} style={styles.icon} />
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.gridContainer}>
              {[0, 1].map((rowIndex) => (
                <View key={rowIndex} style={styles.gridRow}>
                  {[0, 1].map((colIndex) => {
                    const index = rowIndex * 2 + colIndex;
                    return (
                      <TouchableOpacity
                        key={colIndex}
                        style={styles.gridBox}
                        onPress={index === 0 ? handlePayMerchantPress : undefined}
                      >
                        <View style={styles.circleContainer}>
                          <View style={styles.circle} />
                          <Image source={gridItems[index].icon} style={styles.gridIcon} />
                        </View>
                        <Text style={styles.gridBoxText}>{gridItems[index].title}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))}
            </View>
            
            <TouchableOpacity 
              style={styles.ongoingTransactionsBanner}
              onPress={() => setOngoingTransactionsVisible(true)}
            >
              <View style={styles.bannerIconContainer}>
                <Image source={require('../assets/paper-airplane.png')} style={styles.bannerIcon} />
              </View>
              <View style={styles.bannerTextContainer}>
                <Text style={styles.bannerTitle}>Ongoing transactions (2)</Text>
                <Text style={styles.bannerSubtitle}>Tap to keep track of your ongoing transactions</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.recentTransactionsSection}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              {sampleTransactions.map((transaction) => (
                <TouchableOpacity 
                  key={transaction.id}
                  style={styles.activityItem}
                  onPress={() => handleTransactionPress(transaction)}
                >
                  <View style={styles.activityIconContainer}>
                    <Image source={require('../assets/arrow-up-right.png')} style={styles.activityIcon} />
                  </View>
                  <View style={styles.activityDetails}>
                    <Text style={styles.activityTitle}>{transaction.title}</Text>
                    <Text style={styles.activitySubtitle}>{transaction.subtitle}</Text>
                  </View>
                  <View style={styles.activityAmountContainer}>
                    <Text style={styles.activityAmount}>{transaction.amount}</Text>
                    <Text style={styles.activityTime}>{transaction.time}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <Modal
            isVisible={isBottomSheetVisible}
            onBackdropPress={() => setBottomSheetVisible(false)}
            onSwipeComplete={() => setBottomSheetVisible(false)}
            swipeDirection={['down']}
            style={styles.bottomSheet}
          >
            <View style={styles.bottomSheetContent}>
              <View style={styles.indicator} />
              <View style={styles.bottomSheetHeader}>
                <Text style={styles.bottomSheetTitle}>Select Currency</Text>
              </View>
              {currencies.map((currency, index) => (
                <TouchableOpacity
                  key={currency.code}
                  style={[
                    styles.currencyOption,
                    index === currencies.length - 1 && styles.lastCurrencyOption
                  ]}
                  onPress={() => handleCurrencySelect(currency)}
                >
                  <View style={styles.currencyInfo}>
                    <Image source={currency.icon} style={styles.currencyIcon} />
                    <Text style={styles.currencyText}>{currency.name}</Text>
                  </View>
                  <Image source={require('../assets/chevron-right.png')} style={styles.chevronIcon} />
                </TouchableOpacity>
              ))}
            </View>
          </Modal>

          <Modal
            isVisible={isOngoingTransactionsVisible}
            onBackdropPress={() => setOngoingTransactionsVisible(false)}
            onSwipeComplete={() => setOngoingTransactionsVisible(false)}
            swipeDirection={['down']}
            style={styles.bottomSheet}
          >
            <View style={styles.ongoingTransactionsContent}>
              <View style={styles.indicator} />
              <View style={styles.bottomSheetHeader}>
                <Text style={styles.bottomSheetTitle}>Ongoing Transactions</Text>
              </View>
              <ScrollView style={styles.ongoingTransactionsList}>
                <View style={styles.activityItem}>
                  <View style={styles.activityIconContainer}>
                    <Image source={require('../assets/arrow-path.png')} style={styles.activityIcon} />
                  </View>
                  <View style={styles.activityDetails}>
                    <Text style={styles.activityTitle}>Money Sent- Yen</Text>
                    <View style={styles.activitySubtitleContainer}>
                      <Text style={styles.activitySubtitle}>5 Dec 2023, 02:30</Text>
                      <Text style={styles.pendingText}>• Pending</Text>
                    </View>
                  </View>
                  <View style={styles.activityAmountContainer}>
                    <Text style={styles.activityAmount}>₦100,000</Text>
                    <Text style={styles.activityTime}>10:30 PM</Text>
                  </View>
                </View>
                <View style={styles.activityItem}>
                  <View style={styles.activityIconContainer}>
                    <Image source={require('../assets/arrow-path.png')} style={styles.activityIcon} />
                  </View>
                  <View style={styles.activityDetails}>
                    <Text style={styles.activityTitle}>Money Sent out- Yen</Text>
                    <View style={styles.activitySubtitleContainer}>
                      <Text style={styles.activitySubtitle}>5 Dec 2023, 02:30</Text>
                      <Text style={styles.pendingText}>• Pending</Text>
                    </View>
                  </View>
                  <View style={styles.activityAmountContainer}>
                    <Text style={styles.activityAmount}>₦100,000</Text>
                    <Text style={styles.activityTime}>10:30 PM</Text>
                  </View>
                </View>
              </ScrollView>
            </View>
          </Modal>

          {/* Transaction Details Modal */}
          <Modal
            isVisible={isTransactionDetailsVisible}
            onBackdropPress={() => setTransactionDetailsVisible(false)}
            onSwipeComplete={() => setTransactionDetailsVisible(false)}
            swipeDirection={['down']}
            style={styles.bottomSheet}
          >
            <View style={styles.transactionDetailsContent}>
              <View style={styles.indicator} />
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

                <View style={styles.transferProgressContainer}>
                  <Text style={styles.transferProgressTitle}>Transfer in progress</Text>
                  {['Payment Received', 'Recipient Verified', 'Payment Completed'].map((step, index) => (
                    <View key={index} style={styles.transferProgressItem}>
                      <View style={[
                        styles.transferProgressIndicator,
                        index > 0 && styles.unverifiedProgressIndicator
                      ]} />
                      <View style={{flex: 1}}>
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
            </View>
          </Modal>

          <Modal
            isVisible={isSidePanelVisible}
            onBackdropPress={() => setIsSidePanelVisible(false)}
            animationIn="slideInLeft"
            animationOut="slideOutLeft"
            style={globalStyles.sidePanel}
          >
            <View style={[globalStyles.sidePanelContent, { backgroundColor: '#FAFAFA', paddingTop: 80 }]}>
              {/* ... (keep the existing side panel content) */}
            </View>
          </Modal>
        </SafeAreaView>
      </ImageBackground>
    </FontLoader>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontFamily: FONTS.BOLD,
    fontSize: 18,
    color: COLORS.BLACK,
  },
  icon: {
    width: 24,
    height: 24,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 50,
  },
  gridContainer: {
    marginBottom: 44,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  gridBox: {
    width: (width - 48) / 2,
    height: 107,
    padding: 14,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 2,
  },
  circleContainer: {
    position: 'relative',
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    position: 'absolute',
    width: 38,
    height: 38,
    borderRadius: 20,
    backgroundColor: '#4D62CD',
    opacity: 0.1,
  },
  gridIcon: {
    width: 24,
    height: 24,
    tintColor: '#4D62CD',
  },
  gridBoxText: {
    marginTop: 17,
    fontFamily: 'Red Hat Display',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 24,
    color: COLORS.BLACK,
  },
  ongoingTransactionsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1EC',
    borderRadius: 16,
    padding: 16,
    marginBottom: 44,
  },
  bannerIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  bannerIcon: {
    width: 24,
    height: 24,
  },
  bannerTextContainer: {
    flex: 1,
  },
  bannerTitle: {
    fontFamily: FONTS.BOLD,
    fontSize: 16,
    color: '#FF4500',
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontFamily: FONTS.REGULAR,
    fontSize: 12,
    color: '#FF4500',
  },
  recentTransactionsSection: {
    marginTop: 0,
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
  activitySubtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activitySubtitle: {
    fontFamily: FONTS.REGULAR,
    fontSize: 14,
    color: '#9B9BA7',
  },
  pendingText: {
    fontFamily: FONTS.MEDIUM,
    fontSize: 14,
    color: '#EC7E00',
    marginLeft: 4,
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
  bottomSheetContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  indicator: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  bottomSheetHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  bottomSheetTitle: {
    fontFamily: 'Red Hat Display',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#353D44',
  },
  currencyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(224, 224, 224, 0.5)',
  },
  lastCurrencyOption: {
    borderBottomWidth: 0,
  },
  currencyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencyIcon: {
    width: 28,
    height: 28,
    marginRight: 12,
  },
  currencyText: {
    fontFamily: 'Red Hat Display',
    fontSize: 16,
    color: '#353D44',
  },
  chevronIcon: {
    width: 20,
    height: 20,
  },
  ongoingTransactionsContent: {
    backgroundColor: '#FAFAFA',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  ongoingTransactionsList: {
    marginTop: 10,
  },
  transactionDetailsContent: {
    backgroundColor: '#FAFAFA',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  transactionAmount: {
    fontFamily: FONTS.BOLD,
    fontSize: 32,
    color: COLORS.BLACK,
    textAlign: 'left',
    marginBottom: 8,
  },
  transactionType: {
    fontFamily: FONTS.MEDIUM,
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
    fontFamily: FONTS.MEDIUM,
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
    fontFamily: FONTS.MEDIUM,
    fontSize: 16,
    color: '#4D62CD',
  },
  transferProgressContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,  // Added spacing between sections
  },
  transferProgressTitle: {
    fontFamily: FONTS.MEDIUM,
    fontSize: 16,
    color: '#9B9BA7',
    marginBottom: 16,
  },
  transferProgressItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 30,  // Increased spacing between steps to 30px
  },
  transferProgressIndicator: {
    width: 4,
    height: '100%',
    backgroundColor: '#4D62CD',
    borderRadius: 2,
    marginRight: 12,
  },
  unverifiedProgressIndicator: {
    backgroundColor: '#EAEAEA',
  },
  transferProgressItemTitle: {
    fontFamily: FONTS.MEDIUM,
    fontSize: 16,
    color: COLORS.BLACK,
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
    padding: 16,
  },
  transactionReceiptText: {
    fontFamily: FONTS.MEDIUM,
    fontSize: 16,
    color: COLORS.BLACK,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00C853',  // Changed to green
    borderRadius: 40,  // Updated corner radius
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  downloadIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  downloadButtonText: {
    fontFamily: FONTS.MEDIUM,
    fontSize: 14,
    color: '#FFFFFF',
  },
});

export default HomeOngoing;