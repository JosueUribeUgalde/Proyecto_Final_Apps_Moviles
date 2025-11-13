import { StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../../../components/constants/theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
  },
  titleOne: {
    fontSize: FONTS.large,
    fontWeight: 'bold',
    color: COLORS.textBlack,
    paddingTop: 20,
    marginBottom: 8,
  },
  underline: {
    width: '100%',
    height: 1,
    backgroundColor: COLORS.secondary,
    marginVertical: 20,
    marginHorizontal: 0,
  },
  label: {
    marginBottom: 2,
    color: COLORS.textBlack,
    fontSize: FONTS.small,
    fontWeight: '600',
  },
  group: {
    width: '80%',
    marginBottom: 12,
    alignSelf: 'center',
  },
  welcomeContainer: {
    alignItems: 'center',
  },
  bannerContainer: {
    width: '100%',    
    height: 60,
    justifyContent: 'center',
  },
  logoImage: {
    width: 140,
    height: 140,
    marginBottom: 16,
    resizeMode: 'contain',
  },
  welcomeText: {
    fontSize: FONTS.large,
    fontWeight: 'bold',
    color: COLORS.textBlack,
  },
  registerContainer: {
    width: '80%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 10,
    backgroundColor: COLORS.backgroundWhite,
    padding: 15,
    borderRadius: RADIUS.sm,
    ...SHADOWS.light,
  },
  registerText: {
    color: COLORS.textGray,
    fontSize: FONTS.small,
    fontWeight: '500',
  },
  registerButton: {
    marginLeft: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.secondary,
  },
  registerButtonText: {
    color: COLORS.primary,
    fontSize: FONTS.small,
    fontWeight: '600',
  },
  forgotPassword: {
    color: COLORS.textGreen,
    fontSize: FONTS.small,
    paddingBottom: 8,
    fontWeight: '500',
    textAlign: 'right',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    width: '80%',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.borderGray,
  },
  dividerText: {
    marginHorizontal: 8,
    color: COLORS.textGray,
    fontSize: FONTS.small,
  },
  infoButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 8,
    gap: 8,
  },
  infoButtonText: {
    color: COLORS.primary,
    fontSize: FONTS.regular,
    fontWeight: '500',
  },
});