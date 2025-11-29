import { StyleSheet } from "react-native";
import { COLORS, FONTS, RADIUS } from "../../../components/constants/theme";

export default StyleSheet.create({
  // ============================================
  // GRUPOS DE INPUT
  // ============================================
  
  // Contenedor de cada grupo de input (label + campo)
  inputGroup: {
    marginBottom: 12,
  },
  
  // Etiqueta del campo de entrada
  label: {
    fontSize: FONTS.small,
    color: COLORS.textBlack,
    marginBottom: 6,
  },
  
  // Contenedor del input editable (con icono)
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
  },
  
  // Contenedor del input deshabilitado (solo lectura)
  inputBoxDisabled: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
    opacity: 0.7,
  },
  
  // Estilo del TextInput editable
  input: {
    flex: 1,
    fontSize: FONTS.regular,
    color: COLORS.textBlack,
  },
  
  // Estilo del TextInput deshabilitado
  inputDisabled: {
    flex: 1,
    fontSize: FONTS.regular,
    color: COLORS.textGray,
  },

  // ============================================
  // BOTONES DE ACCIÓN
  // ============================================
  
  // Fila que contiene los botones de guardar y cancelar
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 12,
    marginHorizontal: 16,
    marginBottom: 24,
    marginTop: 8,
  },
  
  // Botón de guardar cambios
  saveBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 8,
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    borderColor: COLORS.borderSecondary,
    borderWidth: 1,
    paddingVertical: 14,
  },
  
  // Texto del botón de guardar
  saveBtnText: {
    color: COLORS.textGreen,
    fontSize: FONTS.regular,
    fontWeight: "600",
  },
  
  // Botón de cancelar
  removeBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 8,
    backgroundColor: COLORS.backgroundWhite,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
    borderRadius: RADIUS.md,
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  
  // Texto del botón de cancelar
  removeBtnText: {
    color: COLORS.error,
    fontSize: FONTS.regular,
    fontWeight: "600",
  },
  
  // Botón para cambiar imagen de perfil
  changeImageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.backgroundWhite,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
    marginTop: 8,
  },
  
  // Texto del botón de cambiar imagen
  changeImageBtnText: {
    fontSize: FONTS.regular,
    color: COLORS.textGreen,
    fontWeight: '600',
  },
});
