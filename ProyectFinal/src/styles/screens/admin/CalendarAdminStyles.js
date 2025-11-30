import { StyleSheet } from 'react-native';
import { COLORS, FONTS, RADIUS, SHADOWS } from '../../../components/constants/theme';

/**
 * CalendarAdminStyles
 * 
 * Estilos para la pantalla de calendario del administrador
 * Incluye estilos para:
 * - Calendario y navegación
 * - Indicadores de peticiones pendientes
 * - Selector de grupos
 * - Gráficas y métricas de asistencia
 * - Modales y componentes auxiliares
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
  // CALENDARIO
  // ===========================
  
  // Contenedor del componente de calendario
  calendarContainer: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    marginVertical: 16,
    ...SHADOWS.medium,
  },
  
  // Estilos específicos del calendario
  calendar: {
    borderRadius: RADIUS.md,
    paddingBottom: 10,
  },
  
  // ===========================
  // SECCIÓN DE PETICIONES
  // ===========================
  
  // Contenedor principal de la sección de peticiones
  requestsWrapper: {
    marginTop: 20,
    marginBottom: 20,
  },
  
  // Título de sección (alineado a la izquierda)
  sectionTitle: {
    fontSize: FONTS.large,
    fontWeight: 'bold',
    color: COLORS.textBlack,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  
  // Título de sección centrado
  sectionTitleCentered: {
    fontSize: FONTS.large,
    fontWeight: 'bold',
    color: COLORS.textBlack,
    marginBottom: 0,
    paddingHorizontal: 4,
  },
  
  // Card que muestra cuando hay peticiones pendientes
  requestIndicator: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    borderColor: COLORS.secondary,
    borderWidth: 1.5,
    padding: 16,
    marginBottom: 12,
    gap: 16,
    ...SHADOWS.medium,
  },
  
  // Contenedor del ícono y texto del indicador
  requestIndicatorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  
  // Contenedor del texto del indicador
  requestIndicatorText: {
    flex: 1,
    gap: 4,
  },
  
  // Título principal del indicador (cantidad de peticiones)
  requestIndicatorTitle: {
    fontSize: FONTS.regular,
    fontWeight: '600',
    color: COLORS.textBlack,
  },
  
  // Subtítulo del indicador (descripción)
  requestIndicatorSubtitle: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
  },
  
  // Botón "Ver" para ir a la pantalla de peticiones
  viewRequestsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.backgroundBS,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: RADIUS.sm,
    gap: 8,
    alignSelf: 'stretch',
  },
  
  // Texto del botón "Ver"
  viewRequestsButtonText: {
    fontSize: FONTS.regular,
    fontWeight: '600',
    color: COLORS.textGreen,
  },
  
  // Card que muestra cuando no hay peticiones pendientes
  noRequests: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.medium,
  },
  
  // Texto de "No hay peticiones"
  noRequestsText: {
    fontSize: FONTS.regular,
    color: COLORS.textGray,
    textAlign: 'center',
    marginTop: 12,
  },

  // ===========================
  // SELECTOR DE GRUPOS
  // ===========================
  
  // Contenedor del selector de grupos
  groupSelectorContainer: {
    marginTop: 20,
    marginBottom: 5,
  },
  
  // Título "Seleccionar Grupo"
  groupSelectorTitle: {
    fontSize: FONTS.regular,
    fontWeight: '600',
    color: COLORS.textBlack,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  
  // Botón para abrir el modal de selección
  groupSelectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.borderSecondary,
    padding: 16,
    gap: 12,
    ...SHADOWS.medium,
  },
  
  // Texto del grupo seleccionado o placeholder
  groupSelectorButtonText: {
    flex: 1,
    fontSize: FONTS.regular,
    color: COLORS.textGray,
  },

  // ===========================
  // MODAL DE SELECCIÓN DE GRUPOS
  // ===========================
  
  // Fondo oscuro del modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Contenedor principal del modal
  groupModalContainer: {
    width: '85%',
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.lg,
    padding: 20,
    maxHeight: '70%',
  },
  
  // Header del modal con título y botón cerrar
  groupModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSecondary,
  },
  
  // Título del modal
  groupModalTitle: {
    fontSize: FONTS.large,
    fontWeight: 'bold',
    color: COLORS.textBlack,
  },
  
  // Elemento de grupo en la lista
  groupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.borderSecondary,
    gap: 12,
  },
  
  // Elemento de grupo cuando está seleccionado
  groupItemSelected: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.primary,
  },
  
  // Texto del nombre del grupo
  groupItemText: {
    flex: 1,
    fontSize: FONTS.regular,
    color: COLORS.textBlack,
    fontWeight: '500',
  },
  
  // Texto cuando el grupo está seleccionado
  groupItemTextSelected: {
    fontWeight: '600',
    color: COLORS.primary,
  },

  // ===========================
  // SIN GRUPO SELECCIONADO
  // ===========================
  
  // Card que muestra cuando no hay grupo seleccionado
  noGroupSelected: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
    ...SHADOWS.medium,
  },
  
  // Título de "No hay información disponible"
  noGroupSelectedTitle: {
    fontSize: FONTS.large,
    fontWeight: '600',
    color: COLORS.textBlack,
    marginTop: 16,
    marginBottom: 8,
  },
  
  // Texto descriptivo cuando no hay grupo
  noGroupSelectedText: {
    fontSize: FONTS.regular,
    color: COLORS.textGray,
    textAlign: 'center',
    lineHeight: 22,
  },

  // ===========================
  // SECCIÓN DE REPORTES Y MÉTRICAS
  // ===========================
  
  // Contenedor principal de la sección de reportes
  reportsSection: {
    marginTop: 30,
  },
  
  // Contenedor de cada sección dentro de reportes
  section: {
    marginBottom: 18,
  },
  
  // Header de sección con título y botones
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    flexWrap: 'wrap',
    gap: 8,
  },
  
  // Header de sección centrado
  sectionHeaderCentered: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
  },
  
  // Contenedor del botón de exportar PDF
  exportButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  
  // Fila de métricas (contiene cards de métricas)
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  
  // Card individual de métrica
  metricCard: {
    width: '48%',
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
    ...SHADOWS.medium,
  },
  
  // Label de la métrica (ej: "Tasa de Cobertura")
  metricLabel: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
    marginBottom: 6,
  },
  
  // Valor principal de la métrica (número grande)
  metricValue: {
    fontSize: FONTS.large,
    fontWeight: '700',
    color: COLORS.textBlack,
  },
  
  // Subtítulo de la métrica (descripción)
  metricSub: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
    marginTop: 6,
  },
  
  // ===========================
  // GRÁFICAS Y VISUALIZACIONES
  // ===========================
  
  // Contenedor de cada gráfica
  chartContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  
  // Estilos del componente de gráfica
  chart: {
    marginVertical: 8,
    borderRadius: RADIUS.md,
  },
  
  // Texto descriptivo debajo de la gráfica
  chartDescription: {
    color: COLORS.textGray,
    fontSize: FONTS.small,
    marginTop: 6,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
});
