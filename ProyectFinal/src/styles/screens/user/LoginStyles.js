import { StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../../../components/constants/theme';

export default StyleSheet.create({
  // Contenedor principal de la pantalla
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
  },
  // Etiqueta de los inputs (Email, Password)
  label: {
    marginBottom: 2,
    color: COLORS.textBlack,
    fontSize: FONTS.small,
    fontWeight: '600',//Equivale a semi-bold
  },
  // Contenedor de cada grupo de input (label + input)
  group: {
    width: '80%',
    marginBottom: 12,
    marginTop: 1,
    alignSelf: 'center',
  },
  // Contenedor del logo y texto de bienvenida
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 0,
  },
  // Logo de la aplicación
  logoImage: {
    width: 140,
    height: 140,
    marginBottom: 16,
    resizeMode: 'contain',
  },
  // Texto "Panel usuario"
  welcomeText: {
    fontSize: FONTS.large,
    fontWeight: 'bold',
    color: COLORS.textBlack,
  },
  // Contenedor del texto "No tienes cuenta? Regístrate"
  registerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  // Texto "No tienes cuenta?"
  registerText: {
    color: COLORS.textGray,
    fontWeight: '500',
    fontSize: FONTS.small,
  },
  // Texto "Regístrate" (clickeable)
  registerTextClick: {
    color: COLORS.textGreen,
    fontWeight: '500',
    fontSize: FONTS.small,
  },
  // Texto "Forgot Password?" (clickeable)
  forgotPassword: {
    color: COLORS.textGreen,
    fontSize: FONTS.small,
    paddingBottom: 8,
    fontWeight: '500',
    textAlign: 'right',
  },
  // Contenedor usado por forgotPassword (posicionamiento)
  forgotPasswordContainer: {
    // Este estilo solo se usa para el Pressable wrapper
  },
  // Contenedor del divisor "OR"
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    width: '80%',
  },
  // Líneas del divisor
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.borderGray,
  },
  // Texto "OR"
  dividerText: {
    marginHorizontal: 8,
    color: COLORS.textGray,
    fontSize: FONTS.small,
  },
});
