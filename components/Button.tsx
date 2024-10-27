import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, ActivityIndicator } from 'react-native';
import { COLORS, FONTS, SIZES } from '../constants/theme';

interface ButtonProps extends TouchableOpacityProps {
  style?: object;
  textStyle?: object;
  title: string;
  disabled?: boolean;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ style, textStyle, title, disabled, loading, ...props }) => {
  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        style, 
        disabled && styles.disabledButton,
        loading && styles.loadingButton
      ]} 
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color="#A6B0F2" size="small" />
      ) : (
        <Text style={[styles.buttonText, textStyle, disabled && styles.disabledText]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#5B6EF5',
    height: 56,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // for Android
  },
  buttonText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontFamily: FONTS.MEDIUM,
    fontWeight: '500',
    lineHeight: 20,
  },
  disabledButton: {
    backgroundColor: '#E8EAFD',
  },
  disabledText: {
    color: '#A6B0F2',
  },
  loadingButton: {
    backgroundColor: '#E8EAFD',
  },
});

export default Button;
