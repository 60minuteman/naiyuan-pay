import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONTS } from '../constants/theme';
import { globalStyles } from '../styles/globalStyles';

interface HeaderProps {
  variant: 'default' | 'centered' | 'withCTA' | 'close';
  title?: string;
  showBack?: boolean;
  onBackPress?: () => void;
  onHelpPress?: () => void;
  ctaText?: string;
  onCtaPress?: () => void;
  titleStyle?: object;
}

const Header: React.FC<HeaderProps> = ({
  variant = 'default',
  title,
  showBack = true,
  onBackPress,
  onHelpPress,
  ctaText,
  onCtaPress,
  titleStyle,
}) => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  const renderLeftIcon = () => {
    if (!showBack) return null;

    const iconSource = variant === 'close' 
      ? require('../assets/close-icon.png')
      : require('../assets/arrow-left.png');

    return (
      <TouchableOpacity onPress={handleBackPress} style={globalStyles.iconContainer}>
        <Image source={iconSource} style={globalStyles.backArrow} />
      </TouchableOpacity>
    );
  };

  const renderTitle = () => {
    if (!title) return null;

    return (
      <Text style={[
        globalStyles.headerTitle,
        variant === 'centered' && styles.centeredTitle,
        variant === 'default' && styles.defaultTitle,
        titleStyle,
      ]}>
        {title}
      </Text>
    );
  };

  const renderRightElement = () => {
    if (variant === 'withCTA' && ctaText) {
      return (
        <TouchableOpacity onPress={onCtaPress} style={styles.ctaButton}>
          <Text style={styles.ctaText}>{ctaText}</Text>
        </TouchableOpacity>
      );
    }

    if (variant === 'default' && onHelpPress) {
      return (
        <TouchableOpacity onPress={onHelpPress} style={globalStyles.helpIconContainer}>
          <Image 
            source={require('../assets/question-mark-circle.png')}
            style={[globalStyles.icon, styles.rightIcon]}
          />
        </TouchableOpacity>
      );
    }

    return null;
  };

  return (
    <View style={[globalStyles.headerContainer, styles.container]}>
      {renderLeftIcon()}
      {renderTitle()}
      {renderRightElement()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24,
  },
  title: {
    fontFamily: 'RedHatDisplay-SemiBold',
    fontSize: 18,
    color: COLORS.BLACK,
  },
  centeredTitle: {
    flex: 1,
    textAlign: 'center',
  },
  defaultTitle: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  helpIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EBEBED',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 20,
  },
  ctaText: {
    fontFamily: 'RedHatDisplay-SemiBold',
    fontSize: 14,
    color: COLORS.WHITE,
  },
  rightIcon: {
    width: 20,
    height: 20,
  },
});

export default Header;
