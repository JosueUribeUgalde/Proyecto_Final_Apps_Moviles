import { StyleSheet } from 'react-native';
import { COLORS, RADIUS, FONTS } from '../constants/theme';

export default StyleSheet.create({
  button: {
    backgroundColor: COLORS.backgroundBP,
    borderRadius: RADIUS.lg,
    borderColor: COLORS.borderSecondary,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginVertical: 5,
    width: '80%',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 8,
  },
  buttonText: {
    color: COLORS.textWhite,
    fontSize: FONTS.regular,
    fontWeight: 'normal',
    textAlign: 'center',
  },
});