import { StyleSheet } from 'react-native';
import { colors } from '../../styles/colors';

export const containerStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  containerWithPadding: {
    paddingHorizontal: 20,
  },
});