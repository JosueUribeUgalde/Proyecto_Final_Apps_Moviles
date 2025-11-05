import { StyleSheet } from 'react-native';
import { COLORS, FONTS, RADIUS, SHADOWS } from '../components/constants/theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  headerContainer: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },

  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.backgroundWhite,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    ...SHADOWS.medium,
  },

  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.textBlack,
    marginBottom: 8,
  },

  subtitle: {
    fontSize: FONTS.large,
    color: COLORS.textGray,
    fontWeight: '500',
  },

  optionsContainer: {
    flex: 1,
    paddingHorizontal: 24,
    gap: 16,
  },

  optionCard: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
    ...SHADOWS.light,
  },

  optionCardPressed: {
    backgroundColor: COLORS.backgroundBS,
    transform: [{ scale: 0.98 }],
  },

  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },

  optionTitle: {
    fontSize: FONTS.large,
    fontWeight: '600',
    color: COLORS.textBlack,
    marginBottom: 4,
    flex: 1,
  },

  optionDescription: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
    position: 'absolute',
    left: 106,
    bottom: 20,
  },

  chevron: {
    marginLeft: 'auto',
  },

  footerContainer: {
    paddingHorizontal: 24,
    paddingVertical: 30,
    alignItems: 'center',
  },

  footerText: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
    textAlign: 'center',
  },
});
