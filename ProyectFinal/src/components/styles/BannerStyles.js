import { StyleSheet } from 'react-native';
import { COLORS, FONTS, RADIUS } from '../constants/theme';

export default StyleSheet.create({
  container: {
    borderRadius: RADIUS.sm,
    padding: 10,
    width: '80%',
    alignSelf: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    color: COLORS.textWhite,
    fontSize: FONTS.regular,
    marginLeft: 10,
    flex: 1,
  },
  error: {
    backgroundColor: COLORS.error,
  },
  success: {
    backgroundColor: COLORS.primary,
  },
});