import { StyleSheet } from 'react-native';
import { COLORS, FONTS, RADIUS, SHADOWS, AVATAR } from '../../../components/constants/theme';

const styles = StyleSheet.create({
  // ===================================
  // CONTAINER PRINCIPAL
  // ===================================
  // Contenedor principal de las pantallas ProfileAdmin y EditProfileAdmin
  // Usado en: ProfileAdmin.js (SafeAreaView), EditProfileAdmin.js (SafeAreaView)
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // ===================================
  // SECCIONES
  // ===================================
  // Contenedor de la sección de preferencias
  // Usado en: ProfileAdmin.js (View de "Preferencias")
  preferencesSection: {
    marginTop: 20,
  },
  // Contenedor de la sección de cuenta
  // Usado en: ProfileAdmin.js (View de "Cuenta")
  accountSection: {
    marginTop: 20,
  },
  // Título de sección (Información, Contacto, Preferencias, Cuenta)
  // Usado en: ProfileAdmin.js (2×), EditProfileAdmin.js (2×)
  sectionTitle: {
    fontSize: FONTS.regular,
    fontWeight: 'bold',
    marginLeft: 15,
    marginBottom: 10,
    color: COLORS.textBlack,
  },

  // ===================================
  // ITEMS DE PREFERENCIAS
  // ===================================
  // Item de preferencia (notificaciones, región, cambiar contraseña)
  // Usado en: ProfileAdmin.js (3×)
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.backgroundWhite,
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderGray,
  },
  // Contenedor izquierdo de item de preferencia (icono + texto)
  // Usado en: ProfileAdmin.js (3×)
  preferenceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  // Contenedor de texto de preferencia
  // Usado en: ProfileAdmin.js (3×)
  preferenceTextContainer: {
    marginLeft: 15,
  },
  // Título de preferencia
  // Usado en: ProfileAdmin.js (3×)
  preferenceTitle: {
    fontSize: FONTS.regular,
    color: COLORS.textBlack,
    marginBottom: 4,
  },
  // Subtítulo de preferencia
  // Usado en: ProfileAdmin.js (3×)
  preferenceSubtitle: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
  },

  // ===================================
  // BOTONES DE AYUDA Y CERRAR SESIÓN
  // ===================================
  // Botón de ayuda
  // Usado en: ProfileAdmin.js (1×)
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundWhite,
    padding: 15,
    marginTop: 20,
  },
  // Texto del botón de ayuda
  // Usado en: ProfileAdmin.js (1×)
  helpButtonText: {
    marginLeft: 15,
    fontSize: FONTS.regular,
    color: COLORS.textBlack,
  },
  // Botón de cerrar sesión
  // Usado en: ProfileAdmin.js (1×)
  signOutButton: {
    backgroundColor: COLORS.backgroundWhite,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
    borderRadius: RADIUS.md,
    width: '250',
    alignSelf: 'center',
    padding: 15,
    marginTop: 20,
    marginBottom: 30,
    alignItems: 'center',
  },
  // Texto del botón de cerrar sesión
  // Usado en: ProfileAdmin.js (1×)
  signOutText: {
    color: COLORS.error,
    fontSize: FONTS.regular,
    fontWeight: '600',
  },

  // ===================================
  // TARJETA DE PERFIL
  // ===================================
  // Tarjeta contenedora de perfil
  // Usado en: ProfileAdmin.js (1×), EditProfileAdmin.js (3×)
  profileCard: {
    margin: 16,
    padding: 14,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.backgroundWhite,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
    ...SHADOWS.light,
  },
  // Cabecera de tarjeta (avatar + nombre/rol + botón editar)
  // Usado en: ProfileAdmin.js (1×), EditProfileAdmin.js (1×)
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 12,
    marginBottom: 12,
  },
  // Avatar circular
  // Usado en: ProfileAdmin.js (1×), EditProfileAdmin.js (1×)
  avatar: {
    width: AVATAR.sizeMd,
    height: AVATAR.sizeMd,
    borderRadius: AVATAR.sizeMd / 2,
  },
  // Contenedor de nombre y rol
  // Usado en: ProfileAdmin.js (1×), EditProfileAdmin.js (1×)
  nameAndRole: {
    flex: 1,
  },
  // Nombre del usuario
  // Usado en: ProfileAdmin.js (1×), EditProfileAdmin.js (1×)
  cardName: {
    fontSize: FONTS.large,
    fontWeight: 'bold',
    color: COLORS.textBlack,
  },
  // Rol del usuario
  // Usado en: ProfileAdmin.js (1×), EditProfileAdmin.js (1×)
  cardRole: {
    marginTop: 2,
    fontSize: FONTS.regular,
    color: COLORS.textGray,
  },
  // Botón de editar perfil
  // Usado en: ProfileAdmin.js (1×)
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: COLORS.backgroundWhite,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
  },
  // Texto del botón de editar
  // Usado en: ProfileAdmin.js (1×)
  editBtnText: {
    marginLeft: 6,
    fontSize: FONTS.regular,
    color: COLORS.textGreen,
    fontWeight: '600',
  },

  // ===================================
  // BADGES Y CHIPS
  // ===================================
  // Fila de badges (Administrador, etc.)
  // Usado en: ProfileAdmin.js (1×)
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  // Badge individual
  // Usado en: ProfileAdmin.js (1×)
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.secondary,
  },
  // Texto del badge
  // Usado en: ProfileAdmin.js (1×)
  badgeText: {
    fontSize: FONTS.small,
    color: COLORS.textBlack,
    fontWeight: '600',
  },

  // ===================================
  // CAJAS DE INFORMACIÓN
  // ===================================
  // Caja de información (email, teléfono, inputs)
  // Usado en: ProfileAdmin.js (2×), EditProfileAdmin.js (5×) - combinado con styles.inputBox/inputBoxDisabled
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.backgroundWhite,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
    marginBottom: 10,
  },
  // Texto de información
  // Usado en: ProfileAdmin.js (2×)
  infoText: {
    flex: 1,
    fontSize: FONTS.regular,
    color: COLORS.textGray,
  },
  // Contenedor del Switch de notificaciones
  // Usado en: ProfileAdmin.js (1×)
  toggleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ===================================
  // MODAL DE SELECCIÓN DE REGIÓN
  // ===================================
  // Overlay del modal
  // Usado en: ProfileAdmin.js (1×)
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  // Contenido del modal
  // Usado en: ProfileAdmin.js (1×)
  modalContent: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.lg,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  // Título del modal
  // Usado en: ProfileAdmin.js (1×)
  modalTitle: {
    fontSize: FONTS.large,
    fontWeight: 'bold',
    color: COLORS.textBlack,
    marginBottom: 20,
  },
  // Opción de región en el modal
  // Usado en: ProfileAdmin.js (1×)
  regionOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: RADIUS.md,
  },
  // Opción de región seleccionada
  // Usado en: ProfileAdmin.js (1×)
  regionOptionSelected: {
    backgroundColor: COLORS.secondary,
  },
  // Texto de opción de región
  // Usado en: ProfileAdmin.js (1×)
  regionOptionText: {
    fontSize: FONTS.regular,
    color: COLORS.textBlack,
  },
  // Texto de opción de región seleccionada
  // Usado en: ProfileAdmin.js (1×)
  regionOptionTextSelected: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});

export default styles;

export const TOGGLE_COLORS = {
  on: COLORS.secondary,
  off: COLORS.borderGray,
  thumb: COLORS.textWhite,
};
