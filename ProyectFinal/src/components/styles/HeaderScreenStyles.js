import { StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';

export default StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent:'center',
    gap: 115,
    width: '100%',
    paddingTop: 20,
    paddingBottom:20,
    borderBottomColor: COLORS.secondary,
    borderBottomWidth: 1,
    marginBottom: 15,
  },
  title: {
    fontSize: FONTS.large,
    fontWeight: 'bold',
    color: COLORS.textBlack,
  },
  underline: {
    width: '100%',
    height: 1,
    backgroundColor: COLORS.secondary,
    marginVertical: 20,
  },
});