import { StyleSheet } from "react-native";
import { COLORS, FONTS, RADIUS, SHADOWS } from "../../../components/constants/theme";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    width: "100%",
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  logoImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 16,
    resizeMode: "cover",
  },
  logoPlaceholder: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: COLORS.secondary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    ...SHADOWS.light,
  },

  logoPlaceholderText: {
    color: COLORS.primary,
    fontSize: FONTS.small,
    marginTop: 8,
  },
  welcomeContainer: {
    alignItems: "center",
  },
  formContainer: {
    width: "100%",
    paddingHorizontal: 20,
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
  documentsContainer: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: FONTS.regular,
    fontWeight: "600",
    color: COLORS.textBlack,
    marginBottom: 12,
  },
  documentButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.backgroundWhite,
    padding: 12,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    marginBottom: 8,
    ...SHADOWS.light,
  },
  documentButtonText: {
    flex: 1,
    marginLeft: 12,
    fontSize: FONTS.small,
    color: COLORS.textBlack,
  },
  buttonContainer: {
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
});
