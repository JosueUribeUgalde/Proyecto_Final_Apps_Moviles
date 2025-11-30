import { StyleSheet } from 'react-native';
import { COLORS, FONTS, RADIUS, SHADOWS, AVATAR } from '../../../components/constants/theme';

const styles = StyleSheet.create({
  // ============================================
  // CONTENEDOR PRINCIPAL
  // ============================================
  
  // Contenedor principal de la pantalla
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // ============================================
  // SECCIONES
  // ============================================
  
  // Contenedor de la sección de preferencias
  preferencesSection: {
    marginTop: 20,
  },
  
  // Contenedor de la sección de cuenta
  accountSection: {
    marginTop: 20,
  },
  
  // Título de las secciones (Preferencias, Cuenta)
  sectionTitle: {
    fontSize: FONTS.regular,
    fontWeight: 'bold',
    marginLeft: 15,
    marginBottom: 10,
    color: COLORS.textBlack,
  },
  
  // ============================================
  // ITEMS DE PREFERENCIAS
  // ============================================
  
  // Item individual de preferencia o cuenta
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.backgroundWhite,
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderGray,
  },
  
  // Contenedor izquierdo del item (icono + texto)
  preferenceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  // Contenedor del texto del item
  preferenceTextContainer: {
    marginLeft: 15,
  },
  
  // Título principal del item
  preferenceTitle: {
    fontSize: FONTS.regular,
    color: COLORS.textBlack,
    marginBottom: 4,
  },
  
  // Subtítulo descriptivo del item
  preferenceSubtitle: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
  },
  
  // ============================================
  // BOTONES DE ACCIÓN
  // ============================================
  
  // Botón de ayuda
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundWhite,
    padding: 15,
    marginTop: 20,
  },
  
  // Texto del botón de ayuda
  helpButtonText: {
    marginLeft: 15,
    fontSize: FONTS.regular,
    color: COLORS.textBlack,
  },
  
  // Botón de cerrar sesión
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
  
  // Texto del botón de cerrar sesión (color rojo)
  signOutText: {
    color: COLORS.error,
    fontSize: FONTS.regular,
    fontWeight: '600',
  },

  // ============================================
  // TARJETA DE PERFIL
  // ============================================
  
  // Tarjeta principal con información del usuario
  profileCard: {
    margin: 16,
    padding: 14,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.backgroundWhite,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
    ...SHADOWS.medium,
  },
  
  // Header de la tarjeta (avatar + nombre + botón editar)
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 12,
    marginBottom: 12,
  },
  
  // Avatar circular del usuario
  avatar: {
    width: AVATAR.sizeMd,
    height: AVATAR.sizeMd,
    borderRadius: AVATAR.sizeMd / 2,
  },
  
  // Contenedor de nombre y rol (flex para ocupar espacio disponible)
  nameAndRole: {
    flex: 1,
  },
  
  // Nombre del usuario en la card
  cardName: {
    fontSize: FONTS.large,
    fontWeight: 'bold',
    color: COLORS.textBlack,
  },
  
  // Rol/puesto del usuario
  cardRole: {
    marginTop: 2,
    fontSize: FONTS.regular,
    color: COLORS.textGray,
  },
  
  // Botón de editar perfil
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
  
  // Texto del botón editar
  editBtnText: {
    marginLeft: 6,
    fontSize: FONTS.regular,
    color: COLORS.textGreen,
    fontWeight: '600',
  },
  
  // Fila que contiene los badges (rol del usuario)
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  
  // Badge individual (icono + texto)
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.secondary,
  },
  
  // Texto dentro del badge
  badgeText: {
    fontSize: FONTS.small,
    color: COLORS.textBlack,
    fontWeight: '600',
  },
  
  // Caja de información (email, teléfono, horarios)
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
  
  // Texto dentro de las cajas de información
  infoText: {
    flex: 1,
    fontSize: FONTS.regular,
    color: COLORS.textGray,
  },
  
  // Contenedor del Switch de notificaciones
  toggleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ============================================
  // MODAL DE REGIÓN
  // ============================================
  
  // Fondo semi-transparente del modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  
  // Contenedor del contenido del modal
  modalContent: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.lg,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  
  // Título del modal
  modalTitle: {
    fontSize: FONTS.large,
    fontWeight: 'bold',
    color: COLORS.textBlack,
    marginBottom: 20,
  },
  
  // Opción de región en el modal
  regionOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: RADIUS.md,
  },
  
  // Estilo para la región seleccionada
  regionOptionSelected: {
    backgroundColor: COLORS.secondary,
  },
  
  // Texto de la opción de región
  regionOptionText: {
    fontSize: FONTS.regular,
    color: COLORS.textBlack,
  },
  
  // Texto de la región seleccionada
  regionOptionTextSelected: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});

export default styles;

// ============================================
// CONSTANTES DE COLORES PARA TOGGLE
// ============================================

// Colores del Switch de notificaciones
export const TOGGLE_COLORS = {
  on: COLORS.secondary,    // Color cuando está activado
  off: COLORS.borderGray,  // Color cuando está desactivado
  thumb: COLORS.textWhite, // Color del círculo del switch
};
