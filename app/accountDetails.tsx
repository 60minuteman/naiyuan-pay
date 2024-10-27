import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from '../components/Button';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { checkVirtualAccountStatus, createVirtualAccount } from '../services/paymentService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const AccountDetails = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const reference = params.reference as string;
  const queryClient = useQueryClient();
  const [showDummyData, setShowDummyData] = useState(false);

  const { data: accountDetails, isLoading, error, refetch } = useQuery({
    queryKey: ['accountDetails', params.accountNumber],
    queryFn: () => checkVirtualAccountStatus(params.accountNumber as string),
    enabled: !!params.accountNumber,
    onError: () => {
      setShowDummyData(true);
    },
  });

  console.log('params====', params, accountDetails, isLoading)

  const createVirtualAccountMutation = useMutation({
    mutationFn: createVirtualAccount,
    onSuccess: (newAccountDetails) => {
      queryClient.setQueryData(['accountDetails', reference], newAccountDetails);
    },
    onError: (error) => {
      console.error('Error creating virtual account:', error);
      Alert.alert('Error', 'Failed to create virtual account. Please try again.');
      setShowDummyData(true);
    },
  });

  useEffect(() => {
    if (accountDetails?.status === 'NOT_FOUND') {
      const virtualAccountData = {
        amount: Number(params.amount),
        currency: params.currency as string,
        customerName: params.customerName as string,
        customerEmail: params.customerEmail as string,
        customerPhone: params.customerPhone as string,
        paymentMethod: params.paymentMethod as string,
        receiveCurrency: params.receiveCurrency as string,
        recipientName: params.recipientName as string,
        recipientContact: params.recipientContact as string,
        recipientEmail: params.recipientEmail as string,
        email: params.customerEmail as string,
      };

      console.log('Creating virtual account with data:', virtualAccountData);
      createVirtualAccountMutation.mutate(virtualAccountData);
    }
  }, [accountDetails]);

  const handleBack = () => {
    router.back();
  };

  const handleSentMoney = async () => {
    Alert.alert('Confirmation', 'Thank you for your payment. We will verify it shortly.');
    refetch();
  };

  if (isLoading || createVirtualAccountMutation.isPending) {
    return (
      <View style={styles.loaderOverlay}>
        <ActivityIndicator size="large" color={COLORS.WHITE} />
        <Text style={styles.loaderText}>
          {createVirtualAccountMutation.isPending ? 'Creating new virtual account...' : 'Loading account details...'}
        </Text>
      </View>
    );
  }

  if ((error && !createVirtualAccountMutation.isPending) || showDummyData) {
    const dummyData = {
      amount: 1000,
      bankName: 'Dummy Bank',
      accountNumber: '1234567890',
      accountName: 'John Doe',
      currency: 'NGN',
    };

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack}>
            <Icon name="close" size={24} color={COLORS.BLACK} />
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>Account Details (Dummy Data)</Text>
          <View style={styles.detailsContainer}>
            <DetailItem label="Amount" value={`${dummyData.currency} ${dummyData.amount.toFixed(2)}`} />
            <DetailItem label="Bank Name" value={dummyData.bankName} />
            <DetailItem label="Account Number" value={dummyData.accountNumber} />
            <DetailItem label="Account Name" value={dummyData.accountName} />
          </View>
          <Text style={styles.warningText}>Please transfer the exact amount to this account.</Text>
        </View>
        <View style={styles.buttonContainer}>
          <Button title="I have sent the money" onPress={handleSentMoney} />
        </View>
      </SafeAreaView>
    );
  }

  if (!accountDetails || (accountDetails.status === 'NOT_FOUND' && !createVirtualAccountMutation.isPending)) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Virtual account not found. Creating a new one...</Text>
      </View>
    );
  }

  const { amount = 0, bankName = 'N/A', accountNumber = 'N/A', accountName = 'N/A', currency = 'NGN' } = accountDetails;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Icon name="close" size={24} color={COLORS.BLACK} />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Account Details</Text>
        <View style={styles.detailsContainer}>
          <DetailItem label="Amount" value={`${currency} ${amount.toFixed(2)}`} />
          <DetailItem label="Bank Name" value={bankName} />
          <DetailItem label="Account Number" value={accountNumber} />
          <DetailItem label="Account Name" value={accountName} />
        </View>
        <Text style={styles.warningText}>Please transfer the exact amount to this account.</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button title="I have sent the money" onPress={handleSentMoney} />
      </View>
    </SafeAreaView>
  );
};

type DetailItemProps = {
  label: string;
  value: string;
};

const DetailItem: React.FC<DetailItemProps> = ({ label, value }) => (
  <View style={styles.detailItem}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontFamily: FONTS.BOLD,
    fontSize: 24,
    color: COLORS.BLACK,
    marginBottom: 20,
  },
  detailsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  detailItem: {
    marginBottom: 16,
  },
  detailLabel: {
    fontFamily: FONTS.REGULAR,
    fontSize: 14,
    color: COLORS.GRAY,
    marginBottom: 4,
  },
  detailValue: {
    fontFamily: FONTS.BOLD,
    fontSize: 16,
    color: COLORS.BLACK,
  },
  warningText: {
    fontFamily: FONTS.REGULAR,
    fontSize: 14,
    color: '#676767',
    marginBottom: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    color: COLORS.WHITE,
    fontFamily: FONTS.REGULAR,
    fontSize: 18,
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontFamily: FONTS.REGULAR,
    fontSize: 16,
    color: COLORS.GRAY,
    textAlign: 'center',
    marginBottom: 20,
  },
  errorButton: {
    width: '50%',
  },
});

export default AccountDetails;
