import { StyleSheet, Platform } from 'react-native';
import { COLORS, SIZES, FONTS } from '../constants/theme';

export const globalStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    marginTop: 20,
    marginBottom: 20,
  },
  backArrow: {
    width: 24,
    height: 24,
  },
  titleContainer: {
    marginBottom: 30,
  },
  title: {
    fontFamily: 'RedHatDisplay-Bold',
    fontSize: 24,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: FONTS.REGULAR,
    fontSize: 14,
    color: COLORS.GRAY,
  },
  button: {
    height: 52,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 16,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: FONTS.SEMI_BOLD,
    color: COLORS.WHITE,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 20 : 20,
    paddingTop: 20,
  },
  // Add a default text style to be used across the app
  defaultText: {
    fontFamily: FONTS.REGULAR,
    fontSize: 16,
    color: COLORS.BLACK,
  },
  
  // Add the new styles here
  sidePanel: {
    margin: 0,
    justifyContent: 'flex-start',
  },
  sidePanelContent: {
    height: '100%',
    width: '80%',
    alignSelf: 'flex-start',
    padding: 20,
    paddingTop: 80, // Reduced by 20px
  },
  profileSection: {
    alignItems: 'flex-start',
    marginBottom: 30,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E6E6FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  profileInitial: {
    fontFamily: 'RedHatDisplay-Bold',
    fontSize: 24,
    color: '#4B0082',
  },
  profileInfo: {
    alignItems: 'flex-start',
  },
  profileName: {
    fontFamily: 'RedHatDisplay-Bold',
    fontSize: 18,
    marginBottom: 5,
  },
  profileHandle: {
    fontFamily: 'RedHatDisplay-Regular',
    fontSize: 14,
    color: '#666',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    height: 62, // Set height to 62px
    borderRadius: 15, // Set corner radius to 15px
  },
  menuIcon: {
    width: 20,
    height: 20,
    marginRight: 12,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontFamily: 'RedHatDisplay-Medium',
    fontSize: 16,
  },
  menuSubtitle: {
    fontFamily: 'RedHatDisplay-Regular',
    fontSize: 12,
    color: '#666',
  },
  themeToggle: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
  icon: {
    width: 24,
    height: 24,
  },
  helpIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EBEBED',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
