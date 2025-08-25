// src/components/styles/RegisterStyles.js
import { StyleSheet } from "react-native";
import { COLORS, FONTS } from "../constants/theme";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  brandWrap: {
    alignItems: "center",
    marginTop: 12,
    marginBottom: 8,
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: COLORS.textGreen || COLORS.primary,
    letterSpacing: 0.2,
    textAlign: "center",
  },
  subtitle: {
    fontSize: FONTS.large,
    fontWeight: "bold",
    color: COLORS.textBlack,
    marginTop: 20,
    marginBottom: 16,
    textAlign: "center",
  },
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
});
