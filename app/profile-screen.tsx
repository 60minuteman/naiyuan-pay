import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import { getUserDetails } from '../services/userService';

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const [userDetails, setUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUserDetails = async () => {
    setIsLoading(true);
    setError('');
    try {
      const details = await getUserDetails();
      setUserDetails(details);
    } catch (error) {
      console.error('Error fetching user details:', error);
      setError('Failed to load user details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Header
        variant="centered"
        title="My Profile"
        showBack={true}
      />
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={fetchUserDetails} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.content}>
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImage}>
              <Image source={require('../assets/profile-placeholder.png')} style={styles.placeholderImage} />
            </View>
            <TouchableOpacity>
              <Text style={styles.changeImageText}>Change Image</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <Text style={styles.detailText}>
                {userDetails ? `${userDetails.firstName} ${userDetails.lastName}` : 'Kachi Osuji'}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailText}>{userDetails?.phoneNumber || '07059957131'}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailText}>{userDetails?.email || 'kachiosuji@gmail.com'}</Text>
            </View>
          </View>
          
          <Text style={styles.addressVerificationTitle}>BVN Verification</Text>
          <View style={styles.addressVerificationContainer}>
            <Text style={styles.utilityBillText}>BVN Number</Text>
            <Text style={styles.bvnText}>{userDetails?.bvn || '22222222222'}</Text>
          </View>
          <Text style={styles.uploadText}>
            {userDetails?.verificationStatus === 'SUCCESS' 
              ? 'Your BVN is verified' 
              : 'Your BVN is pending verification'}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  placeholderImage: {
    width: 50,
    height: 50,
  },
  changeImageText: {
    fontFamily: 'RedHatDisplay-Medium',
    fontSize: 16,
    color: COLORS.PRIMARY,
  },
  detailsContainer: {
    marginBottom: 30,
  },
  detailItem: {
    backgroundColor: '#F7F7F7',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    height: 62,
    justifyContent: 'center',
  },
  detailText: {
    fontFamily: 'RedHatDisplay-Regular',
    fontSize: 16,
    color: COLORS.BLACK,
  },
  addressVerificationTitle: {
    fontFamily: 'RedHatDisplay-Medium',
    fontSize: 18,
    color: COLORS.BLACK,
    marginBottom: 10,
  },
  addressVerificationContainer: {
    backgroundColor: '#F7F7F7',
    borderRadius: 15,
    padding: 15,
    height: 62,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  utilityBillText: {
    fontFamily: 'RedHatDisplay-Regular',
    fontSize: 16,
    color: COLORS.BLACK,
  },
  bvnText: {
    fontFamily: 'RedHatDisplay-Medium',
    fontSize: 16,
    color: COLORS.PRIMARY,
  },
  uploadText: {
    fontFamily: 'RedHatDisplay-Regular',
    fontSize: 12,
    color: COLORS.GRAY,
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    color: COLORS.ERROR,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: COLORS.PRIMARY,
    padding: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    fontFamily: FONTS.BOLD,
    fontSize: 16,
    color: COLORS.WHITE,
  },
});

export default ProfileScreen;
