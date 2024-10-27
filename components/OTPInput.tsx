import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { View, TextInput, StyleSheet, Dimensions } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';
import { useWindowDimensions } from 'react-native';

const { width: SCREEN_WIDTH } = useWindowDimensions();
const BOX_COUNT = 6;
const BOX_SIZE = SCREEN_WIDTH * 0.12; // 12% of screen width
const SPACING = SCREEN_WIDTH * 0.02; // 2% of screen width

interface OTPInputProps {
  onOTPFilled: (otp: string) => void;
}

const OTPInput = forwardRef<{ focus: () => void }, OTPInputProps>(({ onOTPFilled }, ref) => {
  const [otp, setOTP] = useState(Array(BOX_COUNT).fill(''));
  const inputRefs = useRef<Array<TextInput | null>>([]);

  useImperativeHandle(ref, () => ({
    focus: () => inputRefs.current[0]?.focus(),
  }));

  const handleOTPChange = (text: string, index: number) => {
    const newOTP = [...otp];
    newOTP[index] = text;
    setOTP(newOTP);

    if (text.length === 1 && index < BOX_COUNT - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOTP.every(digit => digit !== '')) {
      onOTPFilled(newOTP.join(''));
    }
  };

  const handleKeyPress = (event: any, index: number) => {
    if (event.nativeEvent.key === 'Backspace' && index > 0 && otp[index] === '') {
      const newOTP = [...otp];
      newOTP[index - 1] = '';
      setOTP(newOTP);
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      {otp.map((digit, index) => (
        <React.Fragment key={index}>
          <TextInput
            style={styles.input}
            value={digit}
            onChangeText={(text) => handleOTPChange(text, index)}
            keyboardType="numeric"
            maxLength={1}
            ref={(ref) => (inputRefs.current[index] = ref)}
            onKeyPress={(event) => handleKeyPress(event, index)}
          />
          {index === 2 && <View style={styles.dash} />}
        </React.Fragment>
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  input: {
    width: BOX_SIZE,
    height: BOX_SIZE,
    borderRadius: BOX_SIZE * 0.2,
    backgroundColor: '#EBEBED',
    textAlign: 'center',
    fontSize: BOX_SIZE * 0.5,
    fontFamily: FONTS.BOLD,
    color: COLORS.BLACK,
    marginHorizontal: SPACING / 2,
  },
  dash: {
    width: SPACING * 2,
    height: 2,
    backgroundColor: COLORS.GRAY,
    marginHorizontal: SPACING,
  },
});

export default OTPInput;
