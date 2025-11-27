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
    fontWeight: '600', // Equivale a semi-bold
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
  // Texto "Panel de Administrador"
  welcomeText: {
    fontSize: FONTS.large,
    fontWeight: 'bold',
    color: COLORS.textBlack,
  },
  // Texto "Forgot Password?" (clickeable)
  forgotPassword: {
    color: COLORS.textGreen,
    fontSize: FONTS.regular,
    paddingBottom: 8,
    fontWeight: '500',
    textAlign: 'right',
  },
  // Contenedor usado por forgotPassword (posicionamiento)
  forgotPasswordContainer: {
    // Este estilo solo se usa para el Pressable wrapper
  },
  // Contenedor del divisor "Información"
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
  // Texto "Información"
  dividerText: {
    marginHorizontal: 8,
    color: COLORS.textGray,
    fontSize: FONTS.large,
  },
  // Contenedor del botón de información (ícono + texto)
  infoButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
  },
  // Texto clickeable "¿Cómo crear una cuenta de Administrador?"
  infoButtonText: {
    color: COLORS.textGreen,
    fontSize: FONTS.regular,
    fontWeight: '700',
  },

  // Registro (adaptado desde login company)
  registerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    gap: 6,
  },
  registerText: {
    color: COLORS.textGray,
    fontSize: FONTS.regular,
  },
  registerButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  registerButtonText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: FONTS.regular,
  },
});
