import { StyleSheet } from 'react-native';
import { COLORS, FONTS, RADIUS } from '../constants/theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  footerContainer: {
    backgroundColor: COLORS.backgroundWhite,
    width: '100%',
  },
  card: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.lg,
    borderColor: COLORS.borderSecondary,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: FONTS.large,
    fontWeight: '600',
    color: COLORS.textBlack,
    marginBottom: 8,
  },
  cardDate: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: FONTS.regular,
    color: COLORS.textBlack,
  }
});