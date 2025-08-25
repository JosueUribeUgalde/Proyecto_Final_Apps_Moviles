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
  },
  bannerContainer: {
    width: '100%',    
    height: 60,
    justifyContent: 'center',
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
  registerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  registerText: {
    color: COLORS.textGray,
        fontWeight: '500',
    fontSize: FONTS.small,
  },
  registerTextClick: {
    color: COLORS.textGreen,
        fontWeight: '500',
    fontSize: FONTS.small,
  },
  forgotPassword: {
    color: COLORS.textGreen,
    fontSize: FONTS.small,
    paddingBottom: 8,
    fontWeight: '500',
    textAlign: 'right',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    width: '80%',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.borderGray,
  },
  dividerText: {
    marginHorizontal: 8,
    color: COLORS.textGray,
    fontSize: FONTS.small,
  },
});
