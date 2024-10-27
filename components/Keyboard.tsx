import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  onProceed: () => void;
}

const Keyboard: React.FC<KeyboardProps> = ({ onKeyPress, onProceed }) => {
  const [fontsLoaded] = useFonts({
    'RedHatDisplay-Bold': require('../assets/fonts/RedHatDisplay-Bold.ttf'),
  });

  const router = useRouter();

  const keys = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['.', '0', '<'],
  ];

  if (!fontsLoaded) {
    return null;
  }

  const handleProceed = () => {
    router.push('/paymentMethod');
  };

  return (
    <View style={styles.container}>
      {keys.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((key) => (
            <TouchableOpacity
              key={key}
              style={styles.key}
              onPress={() => onKeyPress(key)}
            >
              <Text style={styles.keyText}>{key}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
      <TouchableOpacity style={styles.proceedButton} onPress={onProceed}>
        <Text style={styles.proceedButtonText}>Proceed</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  key: {
    backgroundColor: '#F5F5F5',
    width: '30%',
    aspectRatio: 2,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyText: {
    fontSize: 24,
    color: '#333333',
    fontFamily: 'RedHatDisplay-Bold',
  },
  proceedButton: {
    backgroundColor: '#4D62CD',
    borderRadius: 100,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  proceedButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'RedHatDisplay-Bold',
  },
});

export default Keyboard;