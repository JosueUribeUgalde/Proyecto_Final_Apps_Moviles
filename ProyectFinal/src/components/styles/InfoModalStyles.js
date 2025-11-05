import { StyleSheet } from 'react-native';
import { COLORS, FONTS, RADIUS, SHADOWS } from '../constants/theme';

export default StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  
  modalContainer: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    width: '100%',
    maxWidth: 400,
    padding: 24,
    ...SHADOWS.dark,
  },

  header: {
    alignItems: 'center',
    marginBottom: 20,
  },

  title: {
    fontSize: FONTS.large,
    fontWeight: '600',
    color: COLORS.textBlack,
    marginTop: 12,
    textAlign: 'center',
  },

  content: {
    marginBottom: 24,
  },

  message: {
    fontSize: FONTS.regular,
    color: COLORS.textGray,
    textAlign: 'center',
    lineHeight: 24,
  },

  closeButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: 14,
    alignItems: 'center',
  },

  closeButtonText: {
    color: COLORS.textWhite,
    fontSize: FONTS.regular,
    fontWeight: '600',
  },
});
