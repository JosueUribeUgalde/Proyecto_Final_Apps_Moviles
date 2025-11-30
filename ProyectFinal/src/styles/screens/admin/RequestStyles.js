import { StyleSheet } from 'react-native';
import { COLORS, FONTS, RADIUS } from '../../../components/constants/theme';

/**
 * RequestStyles
 * 
 * Estilos para la pantalla de solicitudes/peticiones del administrador
 * Incluye estilos para:
 * - Filtros de estado (Pendientes, Aprobadas, Rechazadas, Todas)
 * - Búsqueda de solicitudes
 * - Cards de solicitudes con detalles
 * - Decisiones recientes
 * - Modal de historial completo
 */

export default StyleSheet.create({
  // ===========================
  // CONTENEDORES PRINCIPALES
  // ===========================
  
  // Contenedor principal de la pantalla
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    width: '100%',
  },
  
  // Contenedor del contenido con scroll
  content: {
    flex: 1,
    width: '90%',
    alignSelf: 'center',
  },
  
  // Contenedor del banner de notificaciones
  bannerContainer: {
    width: '100%',
    height: 60,
    alignItems: 'center',
  },
  
  // Contenedor del footer con menú de navegación
  footerContainer: {
    backgroundColor: COLORS.backgroundWhite,
    width: '100%',
  },

  // ===========================
  // SECCIÓN DE FILTROS
  // ===========================
  
  // Contenedor principal de filtros
  filtersContainer: {
    marginTop: 16,
    marginBottom: 12,
  },
  
  // Header de la sección de filtros
  filtersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  
  // Título "Filtros"
  filtersTitle: {
    fontSize: FONTS.large,
    fontWeight: 'bold',
    color: COLORS.textBlack,
  },
  
  // Contenedor de los chips de filtro (Pendientes, Aprobadas, etc.)
  filterChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  
  // Chip de filtro individual (estado normal)
  filterChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
  },
  
  // Chip de filtro cuando está seleccionado
  filterChipActive: {
    backgroundColor: COLORS.backgroundBS,
    borderColor: COLORS.primary,
  },
  
  // Texto del chip de filtro (estado normal)
  filterChipText: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
    fontWeight: '500',
  },
  
  // Texto del chip cuando está activo
  filterChipTextActive: {
    color: COLORS.textGreen,
    fontWeight: '600',
  },

  // ===========================
  // SECCIÓN DE BÚSQUEDA
  // ===========================
  
  // Contenedor del campo de búsqueda
  searchWeekContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  
  // Contenedor de la barra de búsqueda con ícono
  searchContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.lg,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
  },
  
  // Input de búsqueda
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: FONTS.regular,
    color: COLORS.textBlack,
  },

  // ===========================
  // HEADERS DE SECCIÓN
  // ===========================
  
  // Contenedor del header de cada sección
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 12,
  },
  
  // Título principal de la sección
  sectionTitle: {
    fontSize: FONTS.large,
    fontWeight: '700',
    color: COLORS.textBlack,
  },
  
  // Subtítulo de la sección (ej: "Acciones Masivas")
  sectionSubtitle: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
    fontWeight: '500',
  },
  
  // Botón "Ver Todas" en secciones
  viewAllButton: {
    paddingVertical: 4,
  },
  
  // Texto del botón "Ver Todas"
  viewAllText: {
    fontSize: FONTS.small,
    color: COLORS.primary,
    fontWeight: '600',
  },

  // ===========================
  // CARDS DE SOLICITUDES
  // ===========================
  
  // Card individual de solicitud
  requestCard: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    borderColor: COLORS.borderSecondary,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  
  // Header de la card (nombre + badge de estado)
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  
  // Nombre del miembro que solicita
  requestName: {
    fontSize: FONTS.regular,
    fontWeight: '600',
    color: COLORS.textBlack,
  },
  
  // Puesto del miembro
  requestPosition: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
    marginTop: 2,
  },
  
  // Badge de estado (Pendiente/Aprobada/Rechazada)
  statusBadge: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  
  // Texto del badge de estado
  statusText: {
    fontSize: FONTS.small,
    color: COLORS.primary,
    fontWeight: '600',
  },
  
  // Contenedor de detalles de la solicitud (fecha, hora, razón)
  requestDetails: {
    marginBottom: 12,
    gap: 8,
  },
  
  // Fila individual de detalle (ícono + texto)
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  
  // Texto de cada detalle
  detailText: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
  },
  
  // Contenedor de botones de acción (Aprobar/Rechazar)
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },

  // ===========================
  // CARDS DE DECISIONES RECIENTES
  // ===========================
  
  // Card de decisión reciente (versión resumida)
  decisionCard: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
  },
  
  // Header de la card de decisión
  decisionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  
  // Estado de la decisión (Aprobada/Rechazada)
  decisionStatus: {
    fontSize: FONTS.regular,
    fontWeight: '700',
    color: COLORS.textBlack,
  },
  
  // Puesto del miembro en la decisión
  decisionRole: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
  },
  
  // Nombre del miembro (duplicado, se usa decisionStatus en su lugar)
  decisionName: {
    fontSize: FONTS.regular,
    fontWeight: '600',
    color: COLORS.textBlack,
  },
  
  // Fecha de la decisión
  decisionDate: {
    fontSize: FONTS.small - 1,
    color: COLORS.textGray,
    marginTop: 2,
  },

  // ===========================
  // ESTADO VACÍO
  // ===========================
  
  // Contenedor cuando no hay resultados
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  
  // Texto principal del estado vacío
  emptyStateText: {
    fontSize: FONTS.large,
    fontWeight: 'bold',
    color: COLORS.textBlack,
    marginTop: 16,
    textAlign: 'center',
  },
  
  // Texto secundario del estado vacío
  emptyStateSubtext: {
    fontSize: FONTS.medium,
    color: COLORS.textGray,
    marginTop: 8,
    textAlign: 'center',
  },

  // ===========================
  // MODAL DE HISTORIAL COMPLETO
  // ===========================
  
  // Fondo oscuro del modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  
  // Área tocable para cerrar el modal
  modalOverlayTouchable: {
    flex: 1,
  },
  
  // Contenedor principal del modal (desde abajo)
  modalContent: {
    backgroundColor: COLORS.backgroundWhite,
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
    maxHeight: '80%',
    paddingTop: 20,
  },
  
  // Header del modal con título y botón cerrar
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSecondary,
  },
  
  // Título "Todas las Decisiones"
  modalTitle: {
    fontSize: FONTS.large + 2,
    fontWeight: 'bold',
    color: COLORS.textBlack,
  },
  
  // Lista de decisiones en el modal
  modalList: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },

  // ===========================
  // CARDS DE DECISIONES EN MODAL
  // ===========================
  
  // Card de decisión en el modal (versión completa)
  modalDecisionCard: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
  },
  
  // Header de la card en el modal
  modalDecisionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  
  // Contenedor de info del miembro (nombre + puesto)
  modalDecisionInfo: {
    flex: 1,
  },
  
  // Nombre del miembro en el modal
  modalDecisionName: {
    fontSize: FONTS.regular,
    fontWeight: '600',
    color: COLORS.textBlack,
    marginBottom: 2,
  },
  
  // Puesto del miembro en el modal
  modalDecisionRole: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
  },
  
  // Badge de estado en el modal
  modalStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    marginLeft: 8,
  },
  
  // Badge verde para solicitudes aprobadas
  statusApproved: {
    backgroundColor: COLORS.backgroundBS,
  },
  
  // Badge rojo para solicitudes rechazadas
  statusRejected: {
    backgroundColor: '#FDE8E8',
  },
  
  // Badge azul para solicitudes auto-reasignadas
  statusAuto: {
    backgroundColor: '#E8F4FD',
  },
  
  // Texto del badge de estado en modal
  modalStatusText: {
    fontSize: FONTS.small - 1,
    fontWeight: '600',
  },
  
  // Texto verde para aprobadas
  statusApprovedText: {
    color: COLORS.textGreen,
  },
  
  // Texto rojo para rechazadas
  statusRejectedText: {
    color: COLORS.error,
  },
  
  // Texto azul para auto-reasignadas
  statusAutoText: {
    color: '#1E88E5',
  },
  
  // Contenedor de detalles en el modal (fecha, hora, razón)
  modalDecisionDetails: {
    gap: 6,
  },
  
  // Fila de detalle en el modal
  modalDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  
  // Texto de cada detalle en el modal
  modalDetailText: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
  },
});
