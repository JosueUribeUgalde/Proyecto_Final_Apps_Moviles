import { StyleSheet } from 'react-native';
import { COLORS, FONTS, RADIUS, SHADOWS } from '../constants/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  title: {
    fontSize: FONTS.large,
    fontWeight: 'bold',
    color: COLORS.textBlack,
    marginBottom: 16,
  },
  helpCard: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.lg,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
    ...SHADOWS.light,
  },
  helpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  helpTitle: {
    fontSize: FONTS.regular,
    fontWeight: '600',
    color: COLORS.textBlack,
    flex: 1,
  },
  helpContent: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
    lineHeight: 20,
  },
  contactSection: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.lg,
    padding: 16,
    marginTop: 24,
    alignItems: 'center',
  },
  contactTitle: {
    fontSize: FONTS.regular,
    color: COLORS.textBlack,
    fontWeight: '600',
    marginBottom: 8,
  },
  contactText: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
    textAlign: 'center',
    marginBottom: 16,
  },
  contactButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactButtonText: {
    color: COLORS.textWhite,
    fontSize: FONTS.regular,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default styles;