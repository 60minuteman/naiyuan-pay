import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';
import Button from '../components/Button';
import CustomInput from '../components/CustomInput';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRouter, useLocalSearchParams } from 'expo-router';

const AlipayScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [recipientName, setRecipientName] = React.useState('');
  const [recipientContact, setRecipientContact] = React.useState('');

  const handleNext = () => {
    router.push('/paymentType');
  };

  const handleUploadQRCode = () => {
    console.log('Upload QR Code pressed');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Image source={require('../assets/arrow-left.png')} style={styles.backArrow} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.pillButton} onPress={handleNext}>
          <Text style={styles.pillButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Recipient details</Text>
          <Icon name="information-outline" size={20} color="#ADB4B8" />
        </View>
        <CustomInput
          label="Recipient Name"
          value={recipientName}
          onChangeText={setRecipientName}
          placeholder="Enter recipient name"
        />
        <CustomInput
          label="Recipient Alipay phone number or email"
          value={recipientContact}
          onChangeText={setRecipientContact}
          placeholder="Enter phone number or email"
        />
        <View style={styles.orContainer}>
          <View style={styles.orLine} />
          <Text style={styles.orText}>Or</Text>
          <View style={styles.orLine} />
        </View>
        <TouchableOpacity style={styles.uploadButton} onPress={handleUploadQRCode}>
          <Image source={require('../assets/Upload.png')} style={styles.uploadIcon} />
          <Text style={styles.uploadButtonText}>Upload Recipient QR Code</Text>
        </TouchableOpacity>
      </ScrollView>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.WHITE, // Ensure this matches the page background
  },
  backArrow: {
    width: 24,
    height: 24,
  },
  pillButton: {
    backgroundColor: '#4D62CD',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  pillButtonText: {
    color: 'white',
    fontFamily: 'RedHatDisplay-Bold',
    fontSize: 14,
    fontWeight: 'bold',
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
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.GRAY_LIGHT,
  },
  orText: {
    fontFamily: FONTS.MEDIUM,
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
    fontFamily: FONTS.BOLD,
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
  },
});

export default AlipayScreen;
