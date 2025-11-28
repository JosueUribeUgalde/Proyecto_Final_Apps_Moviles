// Estilos específicos para la edición de perfil de empresa
import { StyleSheet } from "react-native";
import { COLORS, FONTS, RADIUS } from "../../../components/constants/theme";

export default StyleSheet.create({
  /* ==================== INPUTS GENERALES ==================== */

  inputGroup: {
    marginBottom: 12,
  },

  label: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
    marginBottom: 6,
  },

  // Caja base editable (se apila a la derecha del icono)
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.backgroundWhite,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
  },

  input: {
    flex: 1,
    fontSize: FONTS.regular,
    color: COLORS.textBlack,
    paddingVertical: 2,
  },

  // Caja deshabilitada (para correo/rol/experiencia)
  inputBoxDisabled: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
    opacity: 0.7,
  },

  inputDisabled: {
    flex: 1,
    fontSize: FONTS.regular,
    color: COLORS.textGray,
    paddingVertical: 2,
  },

  /* ==================== BOTÓN CAMBIAR IMAGEN ==================== */

  changeImageBtn: {
    marginTop: 10,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.backgroundWhite,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
  },

  changeImageBtnText: {
    fontSize: FONTS.regular,
    color: COLORS.textGreen,
    fontWeight: "600",
  },

  /* ==================== ACCIONES ==================== */

  actionsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
    marginBottom: 24,
    justifyContent: "center",
  },

  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.backgroundWhite,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },

  saveBtnText: {
    fontSize: FONTS.regular,
    color: COLORS.textGreen,
    fontWeight: "600",
  },

  removeBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.backgroundWhite,
    borderWidth: 1,
    borderColor: COLORS.error,
  },

  removeBtnText: {
    fontSize: FONTS.regular,
    color: COLORS.error,
    fontWeight: "600",
  },

  /* ==================== DOCUMENTOS (SOLO LECTURA) ==================== */

  docStatusBox: {
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },

  docStatusText: {
    flex: 1,
    fontSize: FONTS.regular,
    color: COLORS.textGray,
  },

  statusPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },

  statusPillActive: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.secondary,
  },

  statusPillPending: {
    backgroundColor: COLORS.backgroundWhite,
    borderColor: COLORS.borderSecondary,
  },

  statusPillText: {
    fontSize: FONTS.small,
    fontWeight: "600",
  },

  statusPillTextActive: {
    color: COLORS.textBlack,
  },

  statusPillTextPending: {
    color: COLORS.textGray,
  },
});
