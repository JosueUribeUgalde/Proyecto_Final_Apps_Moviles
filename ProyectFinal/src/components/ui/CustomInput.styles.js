import { StyleSheet } from 'react-native';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';

export const customInputStyles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: typography.sizes.medium,
    color: colors.text.primary,
    backgroundColor: colors.background,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    fontSize: typography.sizes.small,
    color: colors.error,
    marginTop: 4,
    marginLeft: 4,
  },
});