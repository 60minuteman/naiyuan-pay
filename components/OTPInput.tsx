import React, { useRef } from 'react';
import { 
  View, 
  TextInput, 
  StyleSheet, 
  Clipboard,
  Platform,
  NativeSyntheticEvent,
  TextInputKeyPressEventData 
} from 'react-native';
import { COLORS, FONTS } from '../constants/theme';

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  length: number;
  disabled?: boolean;
  allowPaste?: boolean;
  autoFocus?: boolean;
}

const OTPInput: React.FC<OTPInputProps> = ({
  value,
  onChange,
  length,
  disabled,
  allowPaste = true,
  autoFocus = true
}) => {
  const inputRef = useRef<TextInput>(null);

  const handleChange = async (text: string) => {
    // Handle pasting
    if (allowPaste && text.length > 1) {
      // Clean the input to only include numbers
      const cleanedText = text.replace(/[^0-9]/g, '');
      // Take only the first {length} characters
      const otpText = cleanedText.slice(0, length);
      onChange(otpText);
      return;
    }

    // Handle normal input
    const cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned.length <= length) {
      onChange(cleaned);
    }
  };

  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    if (e.nativeEvent.key === 'Backspace' && value.length === 0) {
      // Handle backspace when empty
      onChange('');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        ref={inputRef}
        style={[
          styles.hiddenInput,
          Platform.OS === 'web' && styles.webInput
        ]}
        value={value}
        onChangeText={handleChange}
        maxLength={length}
        keyboardType="number-pad"
        autoFocus={autoFocus}
        editable={!disabled}
        onKeyPress={handleKeyPress}
        caretHidden={true}
      />
      <View style={styles.inputsContainer}>
        {Array(length)
          .fill(0)
          .map((_, index) => (
            <View
              key={index}
              style={[
                styles.inputBox,
                value[index] ? styles.inputFilled : null,
                disabled ? styles.inputDisabled : null
              ]}
            >
              <Text style={styles.inputText}>
                {value[index] || ''}
              </Text>
            </View>
          ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hiddenInput: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },
  webInput: {
    width: '100%',
    height: 'auto',
    opacity: 1,
  },
  inputsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  inputBox: {
    width: 45,
    height: 45,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.GRAY,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.WHITE,
  },
  inputFilled: {
    borderColor: COLORS.PRIMARY,
    backgroundColor: COLORS.PRIMARY + '10',
  },
  inputDisabled: {
    backgroundColor: COLORS.GRAY + '20',
    borderColor: COLORS.GRAY,
  },
  inputText: {
    fontSize: 24,
    fontFamily: FONTS.BOLD,
    color: COLORS.PRIMARY,
  },
});

export default OTPInput;
