import { StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';

export default StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Cambia center a space-between
    alignItems: 'center',            // Añade alineación vertical
    width: '100%',
    paddingHorizontal: 20,          // Añade padding horizontal
    paddingVertical: 15, // Reemplazado paddingTop y paddingBottom por paddingVertical
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