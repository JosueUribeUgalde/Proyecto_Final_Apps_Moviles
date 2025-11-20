import { StyleSheet } from 'react-native';
import { COLORS, FONTS, RADIUS, SHADOWS } from '../../../components/constants/theme';

export default StyleSheet.create({
  // Contenedor principal de la pantalla
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  // Contenedor del banner de notificaciones
  bannerContainer: {
    width: '100%',
    height: 60,
    alignItems: 'center',
  },
  
  // Contenedor del FlatList
  flatListContent: {
    width: '90%',
    alignSelf: 'center',
    paddingBottom: 16,
  },
  
  // Contenedor del footer con menú
  footerContainer: {
    backgroundColor: COLORS.backgroundWhite,
    width: '100%',
  },

  // ========== TARJETA DE DIRECTORIO ==========
  // Contenedor principal de la tarjeta de directorio
  directoryCard: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
    ...SHADOWS.medium,
  },
  
  // Título "Buscar a miembro" centrado
  directoryTitle: {
    fontSize: FONTS.large,
    fontWeight: '700',
    color: COLORS.textBlack,
    textAlign: 'center',
    marginBottom: 16,
  },
  
  // Contenedor del input de búsqueda
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
  },
  
  // Input de búsqueda
  searchInput: {
    flex: 1,
    fontSize: FONTS.regular,
    color: COLORS.textBlack,
  },

  // ========== ENCABEZADO DE SECCIÓN ==========
  // Encabezado de sección centrado
  sectionHeaderCentered: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 12,
  },
  
  // Título de sección centrado
  sectionTitleCentered: {
    fontSize: FONTS.large,
    fontWeight: '700',
    color: COLORS.textBlack,
    textAlign: 'center',
  },

  // ========== ACCIONES DE GRUPOS ==========
  // Contenedor de botones de acciones de grupos
  groupActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  
  // Botón base de acción de grupo
  groupActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: RADIUS.sm,
    flex: 1,
    minWidth: '48%',
    ...SHADOWS.medium,
  },
  
  // Botón "Create Group"
  createGroupButton: {
    backgroundColor: COLORS.backgroundWhite,
    borderColor: COLORS.borderSecondary,
    borderWidth: 1,
  },
  
  // Texto del botón "Create Group"
  createGroupButtonText: {
    color: COLORS.textGreen,
    fontSize: FONTS.regular,
    fontWeight: '600',
  },
  
  // Botón "Edit Group"
  editGroupButton: {
    backgroundColor: COLORS.backgroundWhite,
    borderColor: COLORS.borderSecondary,
    borderWidth: 1,
  },
  
  // Texto del botón "Edit Group"
  editGroupButtonText: {
    color: COLORS.textGreen,
    fontSize: FONTS.regular,
    fontWeight: '600',
  },
  
  // Botón "Delete Group"
  deleteGroupButton: {
    backgroundColor: COLORS.backgroundWhite,
    borderColor: COLORS.borderSecondary,
    borderWidth: 1,
  },
  
  // Texto del botón "Delete Group"
  deleteGroupButtonText: {
    color: COLORS.error,
    fontSize: FONTS.regular,
    fontWeight: '600',
  },
  
  // Botón "Share Directory"
  shareGroupButton: {
    backgroundColor: COLORS.backgroundWhite,
    borderColor: COLORS.borderSecondary,
    borderWidth: 1,
  },
  
  // Texto del botón "Share Directory"
  shareGroupButtonText: {
    color: COLORS.textGreen,
    fontSize: FONTS.regular,
    fontWeight: '600',
  },

  // ========== ESTADO VACÍO ==========
  // Contenedor de estado vacío
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  
  // Texto de estado vacío
  emptyStateText: {
    fontSize: FONTS.regular,
    color: COLORS.textGray,
    marginTop: 12,
  },

  // ========== TARJETA DE MIEMBRO ==========
  // Contenedor principal de la tarjeta de miembro
  memberCard: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    borderColor: COLORS.borderSecondary,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
    ...SHADOWS.medium,
  },
  
  // Encabezado de la tarjeta de miembro
  memberHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  
  // Contenedor de información del miembro (avatar + detalles)
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    gap: 12,
  },
  
  // Avatar placeholder circular
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Contenedor de detalles del miembro
  memberDetails: {
    flex: 1,
  },
  
  // Fila con nombre y grupo
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  
  // Nombre del miembro
  memberName: {
    fontSize: FONTS.regular,
    fontWeight: '700',
    color: COLORS.textBlack,
  },
  
  // Grupo del miembro
  memberGroup: {
    fontSize: FONTS.regular,
    fontWeight: '400',
    color: COLORS.textGray,
  },
  
  // Próximo turno del miembro
  memberShift: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
    marginTop: 4,
  },
  
  // Experiencia del miembro
  memberExperience: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
    marginTop: 2,
  },
  
  // Botón de más opciones
  moreButton: {
    padding: 4,
  },

  // ========== PIE DE TARJETA DE MIEMBRO ==========
  // Footer de la tarjeta de miembro
  memberFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  
  // Badge de estado
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
    ...SHADOWS.medium,
  },
  
  // Estado "Available"
  statusAvailable: {
    backgroundColor: '#E8F5E9',
  },
  
  // Estado "Off today"
  statusOff: {
    backgroundColor: '#F5F5F5',
  },
  
  // Estado "On leave request"
  statusLeave: {
    backgroundColor: '#FFF4E5',
  },
  
  // Estado por defecto
  statusDefault: {
    backgroundColor: COLORS.secondary,
  },
  
  // Texto del badge de estado
  statusText: {
    fontSize: FONTS.small,
    fontWeight: '600',
    color: COLORS.textBlack,
  },
  
  // Contenedor de información de turnos
  shiftsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  
  // Texto de turnos
  shiftsText: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
  },

  // ========== TARJETA DE DISTRIBUCIÓN ==========
  // Contenedor de distribución de roles
  distributionCard: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    borderColor: COLORS.borderSecondary,
    borderWidth: 1,
    padding: 16,
    marginTop: 8,
    marginBottom: 24,
    ...SHADOWS.medium,
  },
  
  // Encabezado de distribución
  distributionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  
  // Título de distribución
  distributionTitle: {
    fontSize: FONTS.large,
    fontWeight: '700',
    color: COLORS.textBlack,
  },
  
  // Texto "Reportes" en distribución
  viewAllText: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
    fontWeight: '500',
  },
  
  // Fila de distribución de grupo
  distributionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderGray,
  },
  
  // Nombre del grupo en distribución
  groupName: {
    fontSize: FONTS.regular,
    color: COLORS.textBlack,
    fontWeight: '500',
  },
  
  // Contador de miembros del grupo
  groupCount: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
  },

  // ========== ESTILOS DE MODALES ==========
  // Fondo oscuro semitransparente del modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Contenedor principal del modal
  modalContent: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    padding: 24,
    width: '85%',
    maxWidth: 400,
    ...SHADOWS.dark,
  },
  
  // Título del modal
  modalTitle: {
    fontSize: FONTS.large,
    fontWeight: '700',
    color: COLORS.textBlack,
    marginBottom: 16,
    textAlign: 'center',
  },
  
  // Descripción del modal
  modalDescription: {
    fontSize: FONTS.regular,
    color: COLORS.textGray,
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 22,
  },
  
  // Contenedor de inputs del modal
  modalInputContainer: {
    marginBottom: 20,
  },
  
  // Etiqueta de input del modal
  modalLabel: {
    fontSize: FONTS.small,
    fontWeight: '600',
    color: COLORS.textBlack,
    marginBottom: 8,
  },
  
  // Input del modal
  modalInput: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.sm,
    padding: 12,
    fontSize: FONTS.regular,
    color: COLORS.textBlack,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
  },
  
  // Contenedor de botones del modal
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  
  // Botón base del modal
  modalButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: RADIUS.sm,
  },
  
  // Botón "Cancel" del modal
  modalButtonCancel: {
    backgroundColor: COLORS.backgroundWhite,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
  },
  
  // Texto del botón "Cancel"
  modalButtonTextCancel: {
    color: COLORS.error,
    fontSize: FONTS.regular,
    fontWeight: '600',
  },
  
  // Botón "Confirm" del modal
  modalButtonConfirm: {
    backgroundColor: COLORS.backgroundWhite,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
  },
  
  // Texto del botón "Confirm"
  modalButtonTextConfirm: {
    color: COLORS.textGreen,
    fontSize: FONTS.regular,
    fontWeight: '600',
  },
  
  // Botón "Delete" del modal
  modalButtonDelete: {
    backgroundColor: COLORS.error,
  },
  
  // Texto del botón "Delete"
  modalButtonTextDelete: {
    color: COLORS.textWhite,
    fontSize: FONTS.regular,
    fontWeight: '600',
  },

  // ========== LISTA DE SELECCIÓN DE GRUPOS (MODALES) ==========
  // ScrollView de lista de grupos
  groupSelectList: {
    maxHeight: 200,
    marginTop: 8,
  },
  
  // Separador de lista de grupos
  groupSelectListSeparator: {
    height: 1,
    backgroundColor: COLORS.borderSecondary,
    marginVertical: 8,
  },
  
  // Item de grupo seleccionable
  groupSelectItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
    marginBottom: 8,
    backgroundColor: COLORS.backgroundWhite,
    ...SHADOWS.medium,
  },
  
  // Item de grupo activo/seleccionado
  groupSelectItemActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  
  // Texto del item de grupo
  groupSelectText: {
    fontSize: FONTS.regular,
    color: COLORS.textBlack,
    fontWeight: '500',
  },
  
  // Texto del item de grupo activo
  groupSelectTextActive: {
    color: COLORS.textWhite,
  },
  
  // Contador de miembros en selector de grupo
  groupSelectCount: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
  },

  // ========== CAJA DE ADVERTENCIA ==========
  // Contenedor de advertencia
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFE5E5',
    padding: 12,
    borderRadius: RADIUS.sm,
    marginTop: 12,
  },
  
  // Texto de advertencia
  warningText: {
    flex: 1,
    fontSize: FONTS.small,
    color: COLORS.textRed,
    lineHeight: 18,
  },

  // ========== MODAL DE GESTIÓN DE GRUPOS ==========
  // Contenedor de botones del modal "Manage Groups"
  manageGroupsButtons: {
    gap: 12,
    marginTop: 12,
  },
  
  // Botón base de gestión de grupos
  manageGroupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 16,
    borderRadius: RADIUS.sm,
    ...SHADOWS.medium,
  },
  
  // Botón "Create" del modal de gestión
  createButton: {
    backgroundColor: COLORS.primary,
  },
  
  // Botón "Edit" del modal de gestión
  editButton: {
    backgroundColor: '#4A90E2',
  },
  
  // Botón "Delete" del modal de gestión
  deleteButton: {
    backgroundColor: COLORS.error,
  },
  
  // Botón "Share" del modal de gestión
  shareButton: {
    backgroundColor: '#7B68EE',
  },
  
  // Texto de botones del modal de gestión
  manageGroupButtonText: {
    color: COLORS.textWhite,
    fontSize: FONTS.regular,
    fontWeight: '600',
  },

  // ========== MODAL DE COMPARTIR ==========
  // Contenedor de opciones de compartir
  shareOptions: {
    gap: 12,
  },
  
  // Opción individual de compartir
  shareOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.backgroundWhite,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
    ...SHADOWS.medium,
  },
  
  // Texto de opción de compartir
  shareOptionText: {
    fontSize: FONTS.regular,
    color: COLORS.textBlack,
    fontWeight: '500',
  },
  
  // Botón de cerrar del modal de compartir
  shareCloseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.backgroundWhite,
    marginTop: 16,
    borderColor: COLORS.borderSecondary,
    borderWidth: 1,
    ...SHADOWS.medium,
  },
  
  // Texto del botón de cerrar del modal de compartir
  shareCloseButtonText: {
    fontSize: FONTS.regular,
    color: COLORS.error,
    fontWeight: '600',
  },
});
