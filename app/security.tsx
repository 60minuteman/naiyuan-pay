import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Switch } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';
import Header from '../components/Header';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Security: React.FC = () => {
  console.log('Security component rendered');
  const router = useRouter();
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);

  const toggleBiometric = () => setIsBiometricEnabled(previousState => !previousState);

  const handleChangePassword = () => {
    router.push('/change-password');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        variant="centered"
        title="Security"
        showBack={true}
        titleStyle={styles.headerTitle}
        onBackPress={() => router.back()}  // Add this line
      />
      <View style={styles.content}>
        <View style={styles.optionContainer}>
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionTitle}>Biometric login</Text>
            <Text style={styles.optionSubtitle}>Use your fingerprint for faster login</Text>
          </View>
          <Switch
            trackColor={{ false: "#767577", true: "#4D62CD" }}
            thumbColor={isBiometricEnabled ? "#f4f3f4" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleBiometric}
            value={isBiometricEnabled}
          />
        </View>
        <TouchableOpacity style={styles.optionContainer} onPress={handleChangePassword}>
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionTitle}>Change your password</Text>
            <Text style={styles.optionSubtitle}>Update your current password</Text>
          </View>
          <Icon name="chevron-right" size={24} color="#000" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA', // Changed to FAFAFA as requested
  },
  headerTitle: {
    fontFamily: 'RedHatDisplay-Bold',
    fontSize: 18,
    color: COLORS.BLACK,
  },
  content: {
    padding: 20,
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // Changed to FFFFFF as requested
    borderRadius: 15, // Changed to 15px as requested
    padding: 16,
    marginBottom: 16,
    // Removed shadow styles
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontFamily: 'RedHatDisplay-Bold',
    fontSize: 16,
    color: COLORS.BLACK,
    marginBottom: 4,
  },
  optionSubtitle: {
    fontFamily: 'RedHatDisplay-Regular',
    fontSize: 14,
    color: '#9B9BA7',
  },
});

export default Security;
