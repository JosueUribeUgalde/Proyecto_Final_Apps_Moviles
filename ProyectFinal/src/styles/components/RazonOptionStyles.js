import { StyleSheet } from 'react-native';
import { COLORS, FONTS, RADIUS } from '../../components/constants/theme';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
    backgroundColor: COLORS.backgroundWhite,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
    borderRadius: RADIUS.md,
    padding: 8,
    marginVertical: 12,
  },
  containerSelected: {
    borderColor: COLORS.borderSecondary,
    borderWidth: 2,
    backgroundColor: COLORS.backgroundBS,
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: FONTS.regular,
    fontWeight: '600',
    color: COLORS.textBlack,
    marginBottom: 4,
  },
  titleSelected: {
    color: COLORS.primary,
  },
  description: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
  },
  checkContainer: {
    marginLeft: 8,
  },
});