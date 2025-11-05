import { StyleSheet } from 'react-native';
import { COLORS, FONTS, RADIUS, SHADOWS } from '../../../components/constants/theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  bannerContainer: {
    paddingHorizontal: 20,
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  iconContainer: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },

  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.medium,
  },

  mainTitle: {
    fontSize: FONTS.big,
    fontWeight: 'bold',
    textAlign: 'center',
    color: COLORS.textBlack,
    marginBottom: 10,
  },

  subtitle: {
    fontSize: FONTS.regular,
    textAlign: 'center',
    color: COLORS.textGray,
    marginBottom: 40,
  },

  infoCard: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    padding: 20,
    marginBottom: 30,
    ...SHADOWS.light,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderGray,
  },

  infoLabel: {
    fontSize: FONTS.regular,
    color: COLORS.textGray,
    fontWeight: '500',
    flex: 1,
  },

  infoValue: {
    fontSize: FONTS.regular,
    color: COLORS.textBlack,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },

  buttonContainer: {
    gap: 15,
    paddingBottom: 20,
    alignItems: 'center',
  },

  footerContainer: {
    backgroundColor: COLORS.backgroundWhite,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderGray,
  },
});