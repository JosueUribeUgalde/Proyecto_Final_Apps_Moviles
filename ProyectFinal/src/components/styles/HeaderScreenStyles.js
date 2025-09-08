import { StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';

export default StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomColor: COLORS.secondary,
    borderBottomWidth: 1,
    marginBottom: 15,
    position: 'relative', // Necesario para posicionamiento absoluto de los iconos
  },
  title: {
    fontSize: FONTS.large,
    fontWeight: 'bold',
    color: COLORS.textBlack,
    textAlign: 'center',
    flex: 1, // Toma todo el espacio disponible
  },
  iconContainer: {
    width: 40, // Ancho fijo para los contenedores de iconos
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftIcon: {
    position: 'absolute',
    left: 20,
    zIndex: 10,
  },
  rightIcon: {
    position: 'absolute',
    right: 20,
    zIndex: 10,
  },
});