// src/styles/screens/admin/EditProfileAdminStyles.js
// Estilos para la pantalla de edición de perfil del administrador (EditProfileAdmin.js)
import { StyleSheet } from "react-native";
import { COLORS, FONTS, RADIUS } from "../../../components/constants/theme";

export default StyleSheet.create({
  /* ==================== ESTILOS DE INPUTS ==================== */
  
  // Contenedor de grupo de input (usado en todos los campos editables)
  // Usado en: Nombre completo, Puesto, Experiencia, Correo, Teléfono
  inputGroup: {
    marginBottom: 12,
  },
  
  // Etiqueta superior de cada campo
  // Usado en: Labels de todos los inputs
  label: {
    fontSize: FONTS.small,
    color: COLORS.textBlack,
    marginBottom: 6,
  },
  
  // Contenedor de input editable (fondo sin opacidad)
  // Usado en: Nombre completo, Teléfono
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
  },
  
  // Contenedor de input deshabilitado (con opacidad reducida)
  // Usado en: Puesto, Experiencia, Correo electrónico
  inputBoxDisabled: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
    opacity: 0.7,
  },
  
  // Estilo de texto para inputs editables
  // Usado en: Nombre completo, Teléfono
  input: {
    flex: 1,
    fontSize: FONTS.regular,
    color: COLORS.textBlack,
  },
  
  // Estilo de texto para inputs deshabilitados
  // Usado en: Puesto, Experiencia, Correo electrónico
  inputDisabled: {
    flex: 1,
    fontSize: FONTS.regular,
    color: COLORS.textGray,
  },

  /* ==================== BOTONES DE ACCIÓN ==================== */
  
  // Contenedor de botones Guardar y Cancelar
  // Usado en: Fila inferior con ambos botones
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 12,
    marginHorizontal: 16,
    marginBottom: 24,
    marginTop: 8,
  },
  
  // Botón de guardar cambios (fondo blanco, borde y texto verde)
  // Usado en: Botón "Guardar cambios"
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
  
  // Texto del botón de guardar (color verde)
  // Usado en: Texto "Guardar cambios"
  saveBtnText: {
    color: COLORS.textGreen,
    fontSize: FONTS.regular,
    fontWeight: "600",
  },
  
  // Botón de cancelar (fondo blanco, borde gris, texto rojo)
  // Usado en: Botón "Cancelar"
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
  
  // Texto del botón cancelar (color rojo)
  // Usado en: Texto "Cancelar"
  removeBtnText: {
    color: COLORS.error,
    fontSize: FONTS.regular,
    fontWeight: "600",
  },

  /* ==================== BOTÓN DE CAMBIAR IMAGEN ==================== */
  
  // Botón para cambiar la imagen de perfil (centrado, ancho completo)
  // Usado en: Botón "Editar imagen de perfil" debajo del avatar
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
  
  // Texto del botón cambiar imagen (color verde)
  // Usado en: Texto "Editar imagen de perfil"
  changeImageBtnText: {
    fontSize: FONTS.regular,
    color: COLORS.textGreen,
    fontWeight: '600',
  },
});
