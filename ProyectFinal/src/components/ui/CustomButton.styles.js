import { StyleSheet } from 'react-native';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';

export const customButtonStyles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  disabledButton: {
    backgroundColor: colors.border.medium,
  },
  buttonText: {
    fontSize: typography.sizes.medium,
    fontWeight: typography.weights.semibold,
  },
  primaryButtonText: {
    color: colors.text.white,
  },
  secondaryButtonText: {
    color: colors.primary,
  },
  disabledButtonText: {
    color: colors.text.secondary,
  },
});