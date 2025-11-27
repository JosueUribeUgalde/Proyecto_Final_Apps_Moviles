import { StyleSheet } from "react-native";
import { COLORS, FONTS } from "../../../components/constants/theme";

export default StyleSheet.create({
  // Contenedor principal de la pantalla
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  // Contenedor de contenido del ScrollView
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: 20,
    width: '100%',
  },
  // Logo de la aplicación
  logoImage: {
    width: 140,
    height: 140,
    marginBottom: 16,
    resizeMode: 'contain',
  },
  // Contenedor del logo y texto de bienvenida
  welcomeContainer: {
    alignItems: 'center',
  },
  // Texto "Crear cuenta"
  welcomeText: {
    fontSize: FONTS.large,
    fontWeight: 'bold',
    color: COLORS.textBlack,
  },
  // Contenedor de cada grupo de input (label + input)
  group: {
    width: "80%",
    marginBottom: 12,
    alignSelf: "center",
  },
  // Etiquetas de los inputs (Nombre, Email, Contraseña, etc.)
  label: {
    color: COLORS.textBlack,
    fontSize: FONTS.small,
    fontWeight: "600",
    marginBottom: 4,
  },
  // Contenedor del botón "Crear Cuenta"
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 8,
  },
  // Footer fijo en la parte inferior
  footer: {
    width: '100%',
    paddingVertical: 9,
    paddingBottom: 24,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderGray,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: 'center',
  },
  // Texto "¿Ya tienes cuenta?"
  footerText: {
    fontSize: FONTS.regular,
    color: COLORS.textGray,
  },
  // Texto "Inicia sesión" (clickeable)
  footerLink: {
    fontSize: FONTS.regular,
    fontWeight: "700",
    color: COLORS.textGreen,
    marginLeft: 5,
  },
  // Contenedor de errores de validación
  errorsContainer: {
    marginTop: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#ffebee",
    borderRadius: 4,
  },
  // Texto de error (rojo)
  errorText: {
    color: "#c62828",
    fontSize: 12,
    marginTop: 4,
  },
});