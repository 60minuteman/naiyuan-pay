import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, Platform } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';
import Header from '../components/Header';
import Button from '../components/Button';
import CustomInput from '../components/CustomInput';
import { globalStyles } from '../styles/globalStyles';
import { useRouter } from 'expo-router';

const ChangePassword: React.FC = () => {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = () => {
    // Implement password change logic here
    console.log('Password change requested');
    // After successful password change, you might want to navigate back
    router.back();
  };

  const isFormValid = currentPassword !== '' && newPassword !== '' && confirmPassword !== '';

  // Determine if the background is light or dark
  const isLightBackground = COLORS.WHITE === '#FFFFFF';

  return (
    <>
      <StatusBar 
        barStyle={isLightBackground ? 'dark-content' : 'light-content'}
        backgroundColor={COLORS.WHITE}
      />
      <SafeAreaView style={[globalStyles.safeArea, styles.safeArea]}>
        <Header
          variant="default"
          showBack={true}
        />
        <View style={globalStyles.container}>
          <View style={globalStyles.titleContainer}>
            <Text style={styles.title}>Change your password</Text>
            <Text style={styles.subtitle}>Enter your current password and a new password</Text>
          </View>
          <View style={styles.inputContainer}>
            <CustomInput
              label="Current Password"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
              placeholder="Enter current password"
            />
            <CustomInput
              label="New Password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              placeholder="Enter new password"
            />
            <CustomInput
              label="Confirm New Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              placeholder="Confirm new password"
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title="Change Password"
              onPress={handleChangePassword}
              disabled={!isFormValid}
            />
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: COLORS.WHITE,
  },
  title: {
    fontFamily: FONTS.BOLD,
    fontSize: 24,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: FONTS.REGULAR,
    fontSize: 16,
    color: COLORS.GRAY,
  },
  inputContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 20 : 20,
    paddingTop: 20,
  },
});

export default ChangePassword;
