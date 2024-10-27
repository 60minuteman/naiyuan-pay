import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';
import { globalStyles } from '../styles/globalStyles';
import { Ionicons } from '@expo/vector-icons'; // Make sure to install this package

interface CustomInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  rightIcon?: JSX.Element;
  onPress?: () => void;
  editable?: boolean;
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  rightIcon,
  onPress,
  editable = true,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);
  const animatedIsFocused = new Animated.Value(value === '' ? 0 : 1);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  React.useEffect(() => {
    Animated.timing(animatedIsFocused, {
      toValue: (isFocused || value !== '') ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  const labelStyle = {
    position: 'absolute' as const,
    left: 15,
    top: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [20, 8],
    }),
    fontSize: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [COLORS.GRAY, COLORS.PRIMARY],
    }),
    fontFamily: FONTS.REGULAR,
  };

  const InputComponent = onPress ? TouchableOpacity : View;

  return (
    <View style={[styles.container, isFocused && styles.focusedContainer]}>
      <Animated.Text style={labelStyle}>{label}</Animated.Text>
      <InputComponent onPress={onPress} style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          editable={editable}
        />
      </InputComponent>
      {rightIcon && <View style={styles.iconContainer}>{rightIcon}</View>}
      {secureTextEntry && (
        <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
          <Ionicons 
            name={isPasswordVisible ? 'eye-off' : 'eye'} 
            size={24} 
            color={COLORS.GRAY} 
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 62,
    backgroundColor: '#EBEBED',
    borderRadius: 14,
    paddingHorizontal: 15,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  focusedContainer: {
    borderWidth: 2,
    borderColor: COLORS.PRIMARY,
  },
  inputWrapper: {
    flex: 1,
  },
  input: {
    flex: 1,
    paddingTop: 24,
    paddingBottom: 8,
    fontSize: 16,
    color: COLORS.BLACK,
    fontFamily: FONTS.REGULAR,
  },
  eyeIcon: {
    padding: 10,
  },
  iconContainer: {
    position: 'absolute',
    right: 15,
    top: 24,
  },
});

export default CustomInput;
