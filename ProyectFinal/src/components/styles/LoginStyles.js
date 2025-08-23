import { StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
  },
  titleOne: {
    fontSize: FONTS.large,
    fontWeight: 'bold',
    color: COLORS.textBlack,
    paddingTop: 20,
    marginBottom: 8,
  },
  underline: {
    width: '100%',
    height: 1,
    backgroundColor: COLORS.secondary,
    marginVertical: 20,    // arriba y abajo
    marginHorizontal: 0,  // izquierda y derecha
  },
  label: {
    marginBottom: 2,
    color: COLORS.textBlack,
    fontSize: FONTS.small,
    fontWeight: '600',//Equivale a semi-bold
  },
  group: {
    width: '80%',
    marginBottom: 12,
    alignSelf: 'center',
  },
  welcomeContainer: {
    alignItems: 'center',
    paddingBottom: 80,
  },
  logoImage: {
    width: 120,
    height: 120,
    marginBottom: 16,
    resizeMode: 'contain', // esto mantiene la proporción de la imagen
  },
  welcomeText: {
    fontSize: FONTS.large,
    fontWeight: 'bold',
    color: COLORS.textBlack,
  },
});
