import { StyleSheet } from "react-native";
import { COLORS, FONTS } from "../constants/theme";

export default StyleSheet.create({
  // Contenedor principal (aplicado al SafeAreaView)
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
    alignItems: "center",
  },

  // Marca "ShiftFlow"
  brandWrap: {
    alignItems: "center",
    marginTop: 12,
    marginBottom: 8,
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: COLORS.primary,
    letterSpacing: 0.2,
    textAlign: "center",
  },

  // Subtítulo ("Crear Cuenta")
  subtitle: {
    fontSize: FONTS.large,
    fontWeight: "bold",
    color: COLORS.textBlack,
    marginTop: 20,
    marginBottom: 16,
    textAlign: "center",
  },

  // Grupo de cada campo
  group: {
    width: "100%",
    marginBottom: 12,
  },
  label: {
    color: COLORS.textBlack,
    fontSize: FONTS.small,
    fontWeight: "600",
    marginBottom: 4,
  },

  // Botón
  buttonContainer: {
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },

  // Footer (¿Ya tienes cuenta? Inicia sesión)
  footer: {
    flexDirection: "row",
    marginTop: 16,
    justifyContent: "center",
  },
  footerText: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
  },
  footerLink: {
    fontSize: FONTS.small,
    fontWeight: "bold",
    color: COLORS.textGreen,
    marginLeft: 5,
  },
});