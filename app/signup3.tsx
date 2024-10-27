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

export default function SignUpScreen3() {
  const router = useRouter();
  const { userId, checkUserId } = useAuth();
  const [bvn, setBvn] = useState('');
  const [nin, setNin] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const ensureUserId = async () => {
      if (!userId) {
        await checkUserId();
      }
    };
    ensureUserId();
  }, [userId, checkUserId]);

  const handleSubmit = async () => {
    try {
      if (!userId) {
        throw new Error('User ID is missing');
      }

      console.log('Submitting profile data:', { userId, bvn, nin, dateOfBirth: dateOfBirth.toISOString() });

      const profileData = {
        bvn,
        nin,
        dateOfBirth: dateOfBirth.toISOString(),
      };

      const response = await completeProfile(userId.toString(), profileData);
      console.log('Profile completion response:', response);

      if (response && response.firstName) {
        router.replace({
          pathname: '/welcome',
          params: { firstName: response.firstName }
        });
      } else {
        console.error('Unexpected response structure:', response);
        // If the response doesn't contain the expected data, navigate without the firstName
        router.replace('/welcome');
      }
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during profile completion');
    }
  };

  const handleHelpPress = () => {
    console.log('Help icon pressed');
  };

  const isLightBackground = COLORS.WHITE === '#FFFFFF';

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dateOfBirth;
    setShowDatePicker(Platform.OS === 'ios');
    setDateOfBirth(currentDate);
  };

  return (
    <>
      <StatusBar 
        barStyle={isLightBackground ? 'dark-content' : 'light-content'}
        backgroundColor={COLORS.WHITE}
      />
      <SafeAreaView style={[globalStyles.safeArea, styles.safeArea]}>
        <Header showBack={true} onHelpPress={handleHelpPress} />
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
                  onChangeText={setBvn}
                  keyboardType="numeric"
                />
                <CustomInput
                  label="NIN"
                  value={nin}
                  onChangeText={setNin}
                  keyboardType="numeric"
                />
                <CustomInput
                  label="Date of Birth"
                  value={formatDate(dateOfBirth)}
                  onChangeText={() => {}}
                  onPress={() => setShowDatePicker(true)}
                  editable={false}
                  rightIcon={<Icon name="calendar-today" size={24} color={COLORS.GRAY} />}
                />
              </View>
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
            </View>
          </ScrollView>
          <View style={styles.buttonContainer}>
            <Button
              title="Submit"
              onPress={handleSubmit}
              disabled={!bvn && !nin}
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={dateOfBirth}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={onDateChange}
        />
      )}
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
});
