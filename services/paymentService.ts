import api from './api';
import { useMutation, useQuery } from '@tanstack/react-query';

export const createVirtualAccount = async (paymentDetails: {
  amount: number;
  currency: string;
  description?: string;
  customerName?: string;
  customerEmail: string;
  customerPhone?: string;
  paymentType?: string;
}) => {
  try {
    console.log('Creating virtual account with details:', paymentDetails);
    const response = await api.post('/virtual-account', paymentDetails);
    console.log('Virtual account created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating virtual account:', error);
    throw error;
  }
};

function createMockVirtualAccount(paymentDetails: any) {
  return {
    status: 'active',
    accountNumber: Math.floor(1000000000 + Math.random() * 9000000000).toString(),
    accountName: paymentDetails.recipientName,
    bankName: 'Mock Bank',
    amount: parseFloat(paymentDetails.amount),
    currency: paymentDetails.currency,
    reference: 'MOCK-' + Math.random().toString(36).substring(7),
    expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    recipientEmail: paymentDetails.recipientEmail,
    recipientContact: paymentDetails.recipientContact,
    email: paymentDetails.email,
  };
}

export const checkVirtualAccountStatus = async (accountNumber: string) => {
  const response = await api.get(`/virtual-account/by-account-number/${accountNumber}`);
  console.log('response====', response.data)
  return response.data;
};

export const getVirtualAccountByReference = async (reference: string) => {
  const response = await api.get(`/virtual-account/by-reference/${reference}`);
  console.log('response====', response.data)
  return response.data;
};

export const useCreateTransaction = () => {
  return useMutation({
    mutationFn: async (transactionDetails) => {
      const response = await api.post('/payments/transaction', transactionDetails);
      return response.data;
    }
  });
};

export const useGetTransactionHistory = () => {
  return useQuery({
    queryKey: ['transactionHistory'],
    queryFn: async () => {
      const response = await api.get('/payments/transaction-history');
      return response.data;
    }
  });
};

export const useCheckVirtualAccountStatus = (params: {
  accountNumber?: string;
  reference?: string;
}) => {
  return useQuery({
    queryKey: ['accountDetails', params.accountNumber],
    queryFn: () => checkVirtualAccountStatus(params.accountNumber || ''),
    retry: false,
    enabled: !!(params.accountNumber || params.reference),
  });
};

// Add any other payment-related service functions here
