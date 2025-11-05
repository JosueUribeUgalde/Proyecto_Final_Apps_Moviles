import { StyleSheet } from "react-native";
import { COLORS, FONTS, RADIUS, SHADOWS } from "../../../components/constants/theme";

const WelcomeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerContainer: {
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 40,
  },
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
  title: {
    fontSize: FONTS.big,
    fontWeight: "bold",
    color: COLORS.textBlack,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: FONTS.regular,
    color: COLORS.textGray,
    textAlign: "center",
  },
  optionsContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  optionCard: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    borderColor: COLORS.borderSecondary,
    borderWidth: 1,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  optionCardPressed: {
    backgroundColor: COLORS.secondary,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.backgroundBS,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: FONTS.regular,
    fontWeight: "bold",
    color: COLORS.textBlack,
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
  },
  footerText: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
    textAlign: "center",
    paddingHorizontal: 20,
    paddingTop: 30,
  },
});

export default WelcomeStyles;
