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
  logoImage: {
    width: 120,
    height: 120,
    marginBottom: 16,
    resizeMode: 'contain', // esto mantiene la proporción de la imagen
  },

  // Contenedor y subtitulo de crear cuenta
  welcomeContainer: {
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: FONTS.large,
    fontWeight: 'bold',
    color: COLORS.textBlack,
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
  block: {
    width: "80%",
    marginBottom: 12,
    marginTop: 20,
  }
});