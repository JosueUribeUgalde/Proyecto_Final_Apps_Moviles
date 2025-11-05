import { StyleSheet } from 'react-native';
import { COLORS, FONTS, RADIUS } from '../../../components/constants/theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  iconContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: FONTS.large,
    fontWeight: 'bold',
    color: COLORS.textBlack,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 26,
  },
  subtitle: {
    fontSize: FONTS.regular,
    color: COLORS.textGray,
    textAlign: 'center',
    marginBottom: 50,
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
    alignItems: 'center',
  },
});