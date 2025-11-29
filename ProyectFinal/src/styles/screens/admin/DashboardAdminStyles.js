import { StyleSheet } from 'react-native';
import { COLORS, FONTS, RADIUS, SHADOWS } from '../../../components/constants/theme';

export default StyleSheet.create({
  // ============================================
  // CONTENEDORES PRINCIPALES
  // ============================================
  
  // Contenedor principal de la pantalla
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    width: '100%',
  },
  
  // Contenedor del área de scroll
  content: {
    flex: 1,
    width: '100%',
  },

  // Contenido interno del scroll con padding
  scrollContent: {
    paddingHorizontal: '7.5%',
    paddingBottom: 20,
  },
  
  // Contenedor del menú inferior del administrador
  footerContainer: {
    backgroundColor: COLORS.backgroundWhite,
    width: '100%',
  },

  // ============================================
  // SECCIÓN DE DESCRIPCIÓN DEL GRUPO
  // ============================================

  // Contenedor de la descripción del grupo seleccionado
  descriptionContainer: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
    padding: 16,
    marginTop: 16,
    ...SHADOWS.medium,
  },

  // Etiqueta "Descripción del Grupo"
  descriptionLabel: {
    fontSize: FONTS.small,
    fontWeight: '600',
    color: COLORS.textBlack,
    marginBottom: 8,
  },

  // Texto de la descripción
  descriptionText: {
    fontSize: FONTS.regular,
    color: COLORS.textGray,
    lineHeight: 20,
  },

  // ============================================
  // SECCIÓN DE MÉTRICAS (ESTADÍSTICAS)
  // ============================================

  // Contenedor horizontal para cards de métricas
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 12,
  },
  
  // Card individual de métrica (Total Miembros, Turnos, etc.)
  metricCard: {
    flex: 1,
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
    ...SHADOWS.medium,
  },

  // Etiqueta superior del card (ej: "Total de Miembros")
  metricLabel: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
    marginBottom: 8,
  },

  // Valor numérico grande de la métrica
  metricValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.textBlack,
    marginBottom: 4,
  },

  // Texto descriptivo debajo del valor (ej: "Acumulados")
  metricSub: {
    fontSize: 12,
    color: COLORS.textGray,
  },

  // ============================================
  // SECCIÓN DE SOLICITUDES
  // ============================================

  // Contenedor de toda la sección de solicitudes
  requestsSection: {
    marginTop: 24,
    marginBottom: 16,
  },
  
  // Header con título de la sección
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  // Título "Solicitudes de Ausencia Pendientes"
  sectionTitle: {
    fontSize: FONTS.large,
    fontWeight: 'bold',
    color: COLORS.textBlack,
  },

  // ============================================
  // CARD DE SOLICITUD INDIVIDUAL
  // ============================================

  // Contenedor de cada solicitud de ausencia
  requestCard: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    borderColor: COLORS.borderSecondary,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
    ...SHADOWS.medium,
  },
  
  // Header del card (nombre del usuario y badge de estado)
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },

  // Nombre del empleado que solicita la ausencia
  requestName: {
    fontSize: FONTS.regular,
    fontWeight: '600',
    color: COLORS.textBlack,
  },

  // Puesto/posición del empleado
  requestPosition: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
    fontWeight: '600',
    marginTop: 2,
  },
  
  // Contenedor de detalles (fecha, hora, motivo)
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

  // Texto del detalle (fecha, hora o motivo)
  detailText: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
  },

  // ============================================
  // BADGES DE ESTADO
  // ============================================

  // Badge amarillo para estado "Pendiente"
  statusPending: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },

  // Texto del badge "Pendiente"
  statusPendingText: {
    fontWeight: '600',
    color: COLORS.primary,
  },

  // ============================================
  // BOTONES DE ACCIÓN
  // ============================================

  // Contenedor de botones "Aprobar" y "Rechazar"
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },

  // ============================================
  // ESTADO VACÍO
  // ============================================

  // Contenedor cuando no hay solicitudes pendientes
  emptyRequestsContainer: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },

  // Texto principal del estado vacío
  emptyRequestsText: {
    fontSize: FONTS.large,
    fontWeight: '600',
    color: COLORS.textGray,
    marginTop: 16,
    marginBottom: 8,
  },

  // Texto secundario del estado vacío
  emptyRequestsSubtext: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
    textAlign: 'center',
    lineHeight: 18,
  },
});
