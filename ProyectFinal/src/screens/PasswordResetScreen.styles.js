import { StyleSheet } from 'react-native';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';

export const passwordResetStyles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 60,
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: typography.sizes.xxlarge,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.sizes.medium,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: typography.lineHeights.medium,
    paddingHorizontal: 20,
  },
  form: {
    gap: 16,
  },
  secondaryButton: {
    marginTop: 8,
  },
  successContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  successTitle: {
    fontSize: typography.sizes.xlarge,
    fontWeight: typography.weights.bold,
    color: colors.secondary,
    marginBottom: 16,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: typography.sizes.medium,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: typography.lineHeights.medium,
  },
  successSubmessage: {
    fontSize: typography.sizes.medium,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: typography.lineHeights.medium,
  },
  backButton: {
    width: '100%',
  },
});