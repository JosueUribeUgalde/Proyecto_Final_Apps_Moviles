import { StyleSheet } from "react-native";
import { COLORS, FONTS, RADIUS, SHADOWS } from "../../../components/constants/theme";

/**
 * WelcomeStyles
 * 
 * Estilos para la pantalla de bienvenida inicial
 * Permite al usuario elegir su rol: Empresa o Administrador
 * Incluye estilos para:
 * - Header con logo y títulos
 * - Cards de opciones de rol
 * - Estados interactivos (pressed)
 * - Texto de footer
 */

const WelcomeStyles = StyleSheet.create({
  // ===========================
  // CONTENEDORES PRINCIPALES
  // ===========================
  
  // Contenedor principal de la pantalla
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  // ===========================
  // SECCIÓN DE HEADER
  // ===========================
  
  // Contenedor del header con logo y títulos
  headerContainer: {
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 40,
  },
  
  // Contenedor circular del logo con sombra
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.backgroundWhite,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    ...SHADOWS.medium,
  },
  
  // Título principal "Bienvenido"
  title: {
    fontSize: FONTS.big,
    fontWeight: "bold",
    color: COLORS.textBlack,
    textAlign: "center",
    marginBottom: 8,
  },
  
  // Subtítulo "¿Quién eres?"
  subtitle: {
    fontSize: FONTS.regular,
    color: COLORS.textGray,
    textAlign: "center",
  },
  
  // ===========================
  // SECCIÓN DE OPCIONES DE ROL
  // ===========================
  
  // Contenedor de las cards de opciones
  optionsContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  
  // Card de opción individual (Empresa/Administrador)
  optionCard: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    borderColor: COLORS.borderSecondary,
    borderWidth: 1,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  
  // Estado de card cuando está presionada
  optionCardPressed: {
    backgroundColor: COLORS.secondary,
  },
  
  // Círculo de ícono en cada opción
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.backgroundBS,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  
  // Contenedor del texto de la opción (título + descripción)
  optionContent: {
    flex: 1,
  },
  
  // Título de la opción ("Empresa" / "Administrador")
  optionTitle: {
    fontSize: FONTS.regular,
    fontWeight: "bold",
    color: COLORS.textBlack,
    marginBottom: 2,
  },
  
  // Descripción de cada opción
  optionDescription: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
  },
  
  // ===========================
  // FOOTER
  // ===========================
  
  // Texto informativo en el footer
  footerText: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
    textAlign: "center",
    paddingHorizontal: 20,
    paddingTop: 30,
  },
});

export default WelcomeStyles;
