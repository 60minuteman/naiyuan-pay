import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text,
  TouchableOpacity,
  SafeAreaView, 
  StatusBar,
  Platform,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, FONTS } from '../constants/theme';
import Header from '../components/Header';
import Button from '../components/Button';
import CustomInput from '../components/CustomInput';
import { globalStyles } from '../styles/globalStyles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { completeProfile } from '../services/api';
import { useAuth } from '../context/AuthContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import Toast from 'react-native-toast-message';

export default function SignUpScreen3() {
  const router = useRouter();
  const { userId, checkUserId } = useAuth();
  const [bvn, setBvn] = useState('');
  const [nin, setNin] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const ensureUserId = async () => {
      if (!userId) {
        await checkUserId();
      }
    };
    ensureUserId();
  }, [userId, checkUserId]);

  const validateBVN = (bvn: string): boolean => {
    return /^\d{11}$/.test(bvn);
  };

  const validateNIN = (nin: string): boolean => {
    return /^\d{11}$/.test(nin);
  };

  const validateDateOfBirth = (date: Date): boolean => {
    const today = new Date();
    const minAge = 18;
    const maxAge = 100;
    
    let age = today.getFullYear() - date.getFullYear();
    const monthDiff = today.getMonth() - date.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
      age--;
    }
    
    return age >= minAge && age <= maxAge;
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setError('');

      if (!userId) {
        throw new Error('User ID is missing');
      }

      if (!validateBVN(bvn)) {
        throw new Error('Please enter a valid 11-digit BVN');
      }

      if (!validateNIN(nin)) {
        throw new Error('Please enter a valid 11-digit NIN');
      }

      if (!validateDateOfBirth(dateOfBirth)) {
        throw new Error('You must be at least 18 years old to register');
      }

      const formattedDate = new Date(dateOfBirth);
      formattedDate.setHours(0, 0, 0, 0);

      const profileData = {
        bvn: bvn.trim(),
        nin: nin.trim(),
        dateOfBirth: formattedDate.toISOString(),
      };

      console.log('Submitting profile data:', {
        userId,
        ...profileData,
        dateOfBirth: profileData.dateOfBirth,
      });

      const response = await completeProfile(userId, profileData);
      console.log('Profile completion response:', response);

      if (response.success) {
        Toast.show({
          type: 'success',
          text1: 'Profile Completed',
          text2: 'Your profile has been successfully updated',
          position: 'top',
          visibilityTime: 2000,
        });

        if (response.user) {
          setUser(response.user);
        }

        console.log('Navigating to home screen...');
        router.replace('/home');
      } else {
        throw new Error(response.message || 'Failed to complete profile');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to complete profile';
      console.error('Profile completion error:', message);
      
      setError(message);
      Toast.show({
        type: 'error',
        text1: 'Profile Update Failed',
        text2: message,
        position: 'top',
        visibilityTime: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleHelpPress = () => {
    console.log('Help icon pressed');
  };

  const isLightBackground = COLORS.WHITE === '#FFFFFF';

  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || dateOfBirth;
    
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }

    if (event.type === 'set') {  // User clicked "OK"
      setDateOfBirth(currentDate);
      if (Platform.OS === 'ios') {
        // Don't auto-hide on iOS - let user click Done
      }
    } else if (event.type === 'dismissed') {  // User clicked "Cancel"
      setShowDatePicker(false);
    }
  };

  const handleDateConfirm = () => {
    if (Platform.OS === 'ios') {
      setShowDatePicker(false);
    }
  };

  const handleDateCancel = () => {
    setShowDatePicker(false);
    // Optionally reset to previous date if needed
    // setDateOfBirth(previousDate);
  };

  const renderDatePicker = () => {
    if (Platform.OS === 'ios') {
      return (
        <Modal
          animationType="slide"
          transparent={true}
          visible={showDatePicker}
          onRequestClose={handleDateCancel}
        >
          <TouchableOpacity 
            style={styles.modalContainer} 
            activeOpacity={1} 
            onPress={handleDateCancel}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={handleDateCancel}>
                  <Text style={styles.modalButton}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDateConfirm}>
                  <Text style={styles.modalButton}>Done</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                testID="dateTimePicker"
                value={dateOfBirth}
                mode="date"
                display="spinner"
                onChange={onDateChange}
                maximumDate={new Date(new Date().getFullYear() - 18, new Date().getMonth(), new Date().getDate())}
                minimumDate={new Date(1900, 0, 1)}
                textColor={COLORS.BLACK}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      );
    }

    if (showDatePicker) {
      return (
        <DateTimePicker
          testID="dateTimePicker"
          value={dateOfBirth}
          mode="date"
          display="default"
          onChange={onDateChange}
          maximumDate={new Date(new Date().getFullYear() - 18, new Date().getMonth(), new Date().getDate())}
          minimumDate={new Date(1900, 0, 1)}
        />
      );
    }

    return null;
  };

  return (
    <>
      <StatusBar 
        barStyle={isLightBackground ? 'dark-content' : 'light-content'}
        backgroundColor={COLORS.WHITE}
      />
      <SafeAreaView style={[globalStyles.safeArea, styles.safeArea]}>
        <Header showBack={true} onHelpPress={handleHelpPress} variant="default" />
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
          keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollViewContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={globalStyles.container}>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>Additional Information</Text>
                <Text style={styles.subtitle}>Please provide the following details to complete your registration</Text>
              </View>
              <View style={styles.inputContainer}>
                <CustomInput
                  label="BVN"
                  value={bvn}
                  onChangeText={(text) => setBvn(text.replace(/[^0-9]/g, '').slice(0, 11))}
                  keyboardType="numeric"
                  maxLength={11}
                  placeholder="Enter 11-digit BVN"
                />
                <CustomInput
                  label="NIN"
                  value={nin}
                  onChangeText={(text) => setNin(text.replace(/[^0-9]/g, '').slice(0, 11))}
                  keyboardType="numeric"
                  maxLength={11}
                  placeholder="Enter 11-digit NIN"
                />
                <TouchableOpacity 
                  onPress={() => setShowDatePicker(true)}
                  activeOpacity={0.7}
                >
                  <CustomInput
                    label="Date of Birth"
                    value={formatDate(dateOfBirth)}
                    editable={false}
                    rightIcon={<Icon name="calendar-today" size={24} color={COLORS.GRAY} />}
                    placeholder="Select your date of birth"
                  />
                </TouchableOpacity>
              </View>
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
            </View>
          </ScrollView>
          <View style={styles.buttonContainer}>
            <Button
              title="Submit"
              onPress={handleSubmit}
              disabled={!validateBVN(bvn) || !validateNIN(nin) || !validateDateOfBirth(dateOfBirth) || isLoading}
              loading={isLoading}
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
      {renderDatePicker()}
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: COLORS.WHITE,
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  titleContainer: {
    marginBottom: 20,
  },
  title: {
    fontFamily: FONTS.BOLD,
    fontSize: 24,
    marginBottom: 8,
    color: COLORS.BLACK,
  },
  subtitle: {
    fontFamily: FONTS.REGULAR,
    fontSize: 16,
    lineHeight: 19.2,
    color: COLORS.GRAY,
  },
  inputContainer: {
    // Styles remain the same
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 20 : 20,
    paddingTop: 20,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: COLORS.WHITE,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GRAY + '20',
  },
  modalButton: {
    color: COLORS.PRIMARY,
    fontSize: 16,
    fontFamily: FONTS.MEDIUM,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});
