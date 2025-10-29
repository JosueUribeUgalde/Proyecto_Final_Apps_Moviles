import { StyleSheet } from "react-native";
import { COLORS, FONTS } from "../constants/theme";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  scrollContent: {
    flexGrow: 1,
    width: '100%',
  },
  logoImage: {
    width: 140,
    height: 140,
    marginBottom: 16,
    resizeMode: 'contain',
  },
  welcomeContainer: {
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: FONTS.large,
    fontWeight: 'bold',
    color: COLORS.textBlack,
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

  buttonContainer: {
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  footer: {
    width: '100%',
    paddingVertical: 16,
    paddingBottom: 24, // Extra padding para dispositivos con notch
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderGray,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: 'center',
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