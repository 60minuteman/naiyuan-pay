import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from '../components/Button';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createVirtualAccount } from '../services/paymentService';
import { getUserDetails } from '../services/userService';

const PaymentType = () => {
  const [selectedType, setSelectedType] = useState<'express' | 'standard'>('express');
  const router = useRouter();
  const params = useLocalSearchParams();
  const queryClient = useQueryClient();

  console.log('PaymentType - Raw params:', params);
  const amount = parseFloat(params.amount as string);
  const currency = params.currency as string;
  const receiveCurrency = params.receiveCurrency as string;

  console.log('params====', params)

  console.log('PaymentType - Component rendered');
  console.log('PaymentType - Selected type:', selectedType);
  console.log('PaymentType - Amount:', amount);
  console.log('PaymentType - Currency:', currency);
  console.log('PaymentType - Receive Currency:', receiveCurrency);

  const { data: userDetails, isLoading: isUserDetailsLoading, error: userDetailsError } = useQuery({
    queryKey: ['userDetails'],
    queryFn: getUserDetails,
    onSuccess: (data) => console.log('PaymentType - User details fetched:', data),
    onError: (error) => console.error('PaymentType - Error fetching user details:', error),
    retry: 1, // Retry once if the request fails
  });

  const createVirtualAccountMutation = useMutation({
    mutationFn: createVirtualAccount,
    onSuccess: (data) => {
      console.log('PaymentType - Virtual account created:', data);
      if (data.status) {
        console.log('PaymentType - Backend response after successful account generation:', data);
        router.push({
          pathname: '/accountDetails',
          params: {
            reference: data.reference,
            accountNumber: data.accountNumber,
            accountName: data.accountName,
            bankName: data.bankName,
            amount: data.amount.toString(),
            currency: data.currency,
          },
        });
      }
    },
    onError: (error) => {
      console.error('PaymentType - Error creating virtual account:', error);
      Alert.alert('Error', 'Failed to create virtual account. Please try again.');
    }
  });

  const handleSubmit = async () => {
    if (!userDetails) {
      Alert.alert('Error', 'User details are not available. Please try again later.');
      return;
    }

    try {
      const paymentDetails = {
        amount: parseFloat(amount.toFixed(2)),
        currency,
        customerName: `${userDetails.firstName} ${userDetails.lastName}`,
        customerEmail: userDetails.email,
        customerPhone: userDetails.phone || '',
        paymentMethod: selectedType,
        receiveCurrency,
        recipientName: 'Recipient Name',
        recipientContact: 'Recipient Contact',
        recipientEmail: 'recipient@example.com',
        paymentType: selectedType
      };

      createVirtualAccountMutation.mutate(paymentDetails);
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      Alert.alert('Error', 'An error occurred while processing your request. Please try again.');
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleSelectPaymentType = (type: 'express' | 'standard') => {
    setSelectedType(type);
  };

  const renderOptionSubText = (processingTime: string, charge: string) => (
    <Text style={styles.optionSubText}>
      Payment processed in {processingTime},{' '}
      <Text style={styles.chargeText}>This will attract a {charge} charge</Text>
    </Text>
  );

  const isLoading = isUserDetailsLoading || createVirtualAccountMutation.isPending;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Image source={require('../assets/arrow-left.png')} style={styles.backIcon} />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Transaction Summary</Text>
          <Text style={styles.summaryText}>Amount: {currency} {amount}</Text>
          <Text style={styles.summaryText}>Recipient Currency: {receiveCurrency}</Text>
        </View>
        
        <Text style={styles.title}>Payment type</Text>
        <Text style={styles.subtitle}>Select preferred payment type</Text>
        
        <TouchableOpacity
          style={[styles.optionContainer, selectedType === 'express' && styles.selectedOption]}
          onPress={() => handleSelectPaymentType('express')}
        >
          <View style={styles.optionContent}>
            <View style={styles.iconCircle}>
              <Icon name="send" size={24} color="#4D62CD" />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>Express Payment</Text>
              {renderOptionSubText('1 hour', '5%')}
            </View>
          </View>
          {selectedType === 'express' && (
            <Icon name="check-circle" size={24} color={COLORS.PRIMARY} style={styles.checkIcon} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionContainer, selectedType === 'standard' && styles.selectedOption]}
          onPress={() => handleSelectPaymentType('standard')}
        >
          <View style={styles.optionContent}>
            <View style={styles.iconCircle}>
              <Icon name="clock-outline" size={24} color="#4D62CD" />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>Standard Payment</Text>
              {renderOptionSubText('4 hours', '2.9%')}
            </View>
          </View>
          {selectedType === 'standard' && (
            <Icon name="check-circle" size={24} color={COLORS.PRIMARY} style={styles.checkIcon} />
          )}
        </TouchableOpacity>
      </View>
      {userDetailsError && (
        <Text style={styles.errorText}>Using default user information. Some details may be inaccurate.</Text>
      )}
      <View style={styles.buttonContainer}>
        <Button
          title={isLoading ? "Loading..." : "Proceed"}
          onPress={handleSubmit}
          disabled={isLoading || isNaN(amount)}
          icon={isLoading ? <ActivityIndicator size="small" color={COLORS.WHITE} /> : null}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontFamily: FONTS.BOLD,
    fontSize: 32,
    color: COLORS.BLACK,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: FONTS.REGULAR,
    fontSize: 16,
    color: COLORS.GRAY,
    marginBottom: 24,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E6EB',
    marginBottom: 16,
  },
  selectedOption: {
    borderColor: COLORS.PRIMARY,
  },
  optionContent: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    flex: 1,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(77, 98, 205, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  optionTextContainer: {
    alignItems: 'flex-start',
  },
  optionTitle: {
    fontFamily: FONTS.BOLD,
    fontSize: 16,
    color: COLORS.BLACK,
    marginBottom: 4,
  },
  optionSubText: {
    fontFamily: FONTS.REGULAR,
    fontSize: 14,
    color: COLORS.GRAY,
    flexWrap: 'wrap',
  },
  chargeText: {
    fontFamily: FONTS.BOLD,
    color: COLORS.BLACK,
  },
  checkIcon: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  summaryContainer: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  summaryTitle: {
    fontFamily: FONTS.BOLD,
    fontSize: 18,
    color: COLORS.WHITE,
    marginBottom: 10,
  },
  summaryText: {
    fontFamily: FONTS.REGULAR,
    fontSize: 16,
    color: COLORS.WHITE,
    marginBottom: 5,
  },
  errorText: {
    color: COLORS.RED,
    fontFamily: FONTS.REGULAR,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default PaymentType;
