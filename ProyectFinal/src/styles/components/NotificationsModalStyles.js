import { StyleSheet } from 'react-native';
import { COLORS, FONTS, RADIUS, SHADOWS } from '../../components/constants/theme';

export default StyleSheet.create({
  // ============================================
  // CONTENEDOR DEL MODAL
  // ============================================

  // Fondo semi-transparente del modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },

  // Contenedor principal del modal
  modalContainer: {
    height: '80%',
    backgroundColor: COLORS.backgroundWhite,
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
    ...SHADOWS.medium,
  },

  // ============================================
  // HEADER DEL MODAL
  // ============================================

  // Contenedor del header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSecondary,
  },

  // Título del header
  headerTitle: {
    fontSize: FONTS.large,
    fontWeight: 'bold',
    color: COLORS.textBlack,
  },

  // Botón de cerrar
  closeButton: {
    padding: 4,
  },

  // ============================================
  // ESTADO DE CARGA
  // ============================================

  // Contenedor del loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },

  // Texto del loading
  loadingText: {
    marginTop: 12,
    fontSize: FONTS.regular,
    color: COLORS.textGray,
  },

  // ============================================
  // ITEMS DE NOTIFICACIÓN
  // ============================================

  // Item individual de notificación
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSecondary,
    backgroundColor: COLORS.backgroundWhite,
  },

  // Estilo para notificaciones no leídas
  notificationUnread: {
    backgroundColor: COLORS.secondary + '30',
  },

  // Contenedor del icono
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  // Contenedor del contenido (texto y acciones)
  contentContainer: {
    flex: 1,
  },

  // Título de la notificación
  notificationTitle: {
    fontSize: FONTS.regular,
    fontWeight: '600',
    color: COLORS.textBlack,
    marginBottom: 4,
  },

  // Mensaje de la notificación
  notificationMessage: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
    marginBottom: 8,
    lineHeight: 18,
  },

  // Fecha de la notificación
  notificationDate: {
    fontSize: FONTS.small - 2,
    color: COLORS.textGray,
    marginTop: 4,
  },

  // Punto indicador de no leída
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginLeft: 8,
    alignSelf: 'center',
  },

  // ============================================
  // BOTONES DE ACCIÓN
  // ============================================

  // Fila de botones de acción
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },

  // Botón de acción base
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: RADIUS.md,
  },

  // Botón de aceptar (verde)
  acceptButton: {
    backgroundColor: COLORS.textGreen,
  },

  // Botón de rechazar (rojo)
  rejectButton: {
    backgroundColor: COLORS.textRed,
  },

  // Texto del botón de acción
  actionButtonText: {
    fontSize: FONTS.small,
    fontWeight: '600',
    color: COLORS.textWhite,
  },

  // ============================================
  // ESTADO VACÍO
  // ============================================

  // Contenedor del estado vacío
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },

  // Lista vacía
  emptyList: {
    flexGrow: 1,
  },

  // Título del estado vacío
  emptyTitle: {
    fontSize: FONTS.large,
    fontWeight: 'bold',
    color: COLORS.textBlack,
    marginTop: 16,
  },

  // Mensaje del estado vacío
  emptyMessage: {
    fontSize: FONTS.regular,
    color: COLORS.textGray,
    marginTop: 8,
    textAlign: 'center',
  },
});
