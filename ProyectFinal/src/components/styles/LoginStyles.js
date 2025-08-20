import { StyleSheet } from 'react-native';

import { COLORS,FONTS } from '../constants/theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
  },
  title: {
    fontSize: FONTS.big,
    fontWeight: 'bold',
    color: COLORS.textBlack,
    paddingTop: 20,
  },
});
