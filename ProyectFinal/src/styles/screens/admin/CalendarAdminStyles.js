import { StyleSheet } from 'react-native';
import { COLORS, FONTS, RADIUS, SHADOWS } from '../../../components/constants/theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    width: '100%',
  },
  content: {
    flex: 1,
    width: '90%',
    alignSelf: 'center',
  },
  bannerContainer: {
    width: '100%',
    height: 60,
    alignItems: 'center',
  },
  footerContainer: {
    backgroundColor: COLORS.backgroundWhite,
    width: '100%',
  },
  
  // Estilos del calendario
  calendarContainer: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    marginVertical: 16,
    ...SHADOWS.medium,
  },
  calendar: {
    borderRadius: RADIUS.md,
    paddingBottom: 10,
  },
  
  // Sección de peticiones
  requestsWrapper: {
    marginTop: 20,
    marginBottom: 20,
  },
  requestsSection: {
    marginTop: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: FONTS.large,
    fontWeight: 'bold',
    color: COLORS.textBlack,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  sectionTitleCentered: {
    fontSize: FONTS.large,
    fontWeight: 'bold',
    color: COLORS.textBlack,
    marginBottom: 0,
    paddingHorizontal: 4,
  },
  
  // Botón Ver más
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 8,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    gap: 6,
  },
  viewMoreText: {
    fontSize: FONTS.regular,
    color: COLORS.primary,
    fontWeight: '600',
  },
  
  // Indicador de peticiones pendientes
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
  requestIndicatorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  requestIndicatorText: {
    flex: 1,
    gap: 4,
  },
  requestIndicatorTitle: {
    fontSize: FONTS.regular,
    fontWeight: '600',
    color: COLORS.textBlack,
  },
  requestIndicatorSubtitle: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
  },
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
  viewRequestsButtonText: {
    fontSize: FONTS.regular,
    fontWeight: '600',
    color: COLORS.textGreen,
  },
  
  // Tarjeta de petición
  requestCard: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    borderColor: COLORS.borderSecondary,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
    ...SHADOWS.medium,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  requestName: {
    fontSize: FONTS.regular,
    fontWeight: '600',
    color: COLORS.textBlack,
  },
  requestPosition: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  statusText: {
    fontSize: FONTS.small,
    color: COLORS.primary,
    fontWeight: '600',
  },
  
  // Detalles de la petición
  requestDetails: {
    marginBottom: 12,
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
  },
  
  // Botones de acción
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  approveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: RADIUS.sm,
    gap: 6,
  },
  approveButtonText: {
    color: '#FFFFFF',
    fontSize: FONTS.small,
    fontWeight: '600',
  },
  rejectButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.backgroundWhite,
    borderColor: COLORS.primary,
    borderWidth: 1,
    paddingVertical: 10,
    borderRadius: RADIUS.sm,
    gap: 6,
  },
  rejectButtonText: {
    color: COLORS.primary,
    fontSize: FONTS.small,
    fontWeight: '600',
  },
  
  // Sin peticiones
  noRequests: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.medium,
  },
  noRequestsText: {
    fontSize: FONTS.regular,
    color: COLORS.textGray,
    textAlign: 'center',
    marginTop: 12,
  },

  // Selector de Grupos
  groupSelectorContainer: {
    marginTop: 20,
    marginBottom: 5,
  },
  groupSelectorTitle: {
    fontSize: FONTS.regular,
    fontWeight: '600',
    color: COLORS.textBlack,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
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
  groupSelectorButtonText: {
    flex: 1,
    fontSize: FONTS.regular,
    color: COLORS.textGray,
  },

  // Modal de Grupos
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupModalContainer: {
    width: '85%',
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.lg,
    padding: 20,
    maxHeight: '70%',
  },
  groupModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSecondary,
  },
  groupModalTitle: {
    fontSize: FONTS.large,
    fontWeight: 'bold',
    color: COLORS.textBlack,
  },
  groupList: {
    gap: 8,
  },
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
  groupItemSelected: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.primary,
  },
  groupDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  groupItemText: {
    flex: 1,
    fontSize: FONTS.regular,
    color: COLORS.textBlack,
    fontWeight: '500',
  },
  groupItemTextSelected: {
    fontWeight: '600',
    color: COLORS.primary,
  },

  // Sin grupo seleccionado
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
  noGroupSelectedTitle: {
    fontSize: FONTS.large,
    fontWeight: '600',
    color: COLORS.textBlack,
    marginTop: 16,
    marginBottom: 8,
  },
  noGroupSelectedText: {
    fontSize: FONTS.regular,
    color: COLORS.textGray,
    textAlign: 'center',
    lineHeight: 22,
  },

  // Sección de Reportes
  reportsSection: {
    marginTop: 30,
  },
  section: {
    marginBottom: 18,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    flexWrap: 'wrap',
    gap: 8,
  },
  sectionHeaderCentered: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
  },
  exportButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
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
  metricLabel: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
    marginBottom: 6,
  },
  metricValue: {
    fontSize: FONTS.large,
    fontWeight: '700',
    color: COLORS.textBlack,
  },
  metricSub: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
    marginTop: 6,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
    ...SHADOWS.medium,
  },
  filterChipSelected: {
    backgroundColor: COLORS.backgroundBS,
    borderColor: COLORS.primary,
    ...SHADOWS.medium,
  },
  filterText: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
    fontWeight: '500',
  },
  filterTextSelected: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  chartPlaceholder: {
    height: 120,
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
  },
  chartPlaceholderText: {
    fontSize: FONTS.regular,
    color: COLORS.textGray,
  },
  
  // Estilos para las gráficas
  chartContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  chart: {
    marginVertical: 8,
    borderRadius: RADIUS.md,
  },
  chartDescription: {
    color: COLORS.textGray,
    fontSize: FONTS.small,
    marginTop: 6,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  
  // Leyenda para métricas
  metricsLegendContainer: {
    marginTop: 16,
    paddingHorizontal: 16,
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: FONTS.small,
    color: COLORS.textBlack,
  },
  
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    flexShrink: 1,
  },
  teamRow: {
    marginTop: 8,
  },
  teamItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSecondary,
  },
  teamName: {
    fontSize: FONTS.regular,
    color: COLORS.textBlack,
  },
  teamValue: {
    fontSize: FONTS.regular,
    fontWeight: '700',
    color: COLORS.textBlack,
  },
  topMetricsContainer: {
    marginTop: 16,
  },
  topMetricsHeader: {
    marginBottom: 8,
  },
  
  // Estilos para Estado de Peticiones
  statusCard: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    padding: 16,
    ...SHADOWS.medium,
  },
  statusLabel: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
    marginBottom: 6,
  },
  statusValue: {
    fontSize: FONTS.large,
    fontWeight: '700',
  },
  statusPercent: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
    marginTop: 4,
  },
  primaryLight: {
    backgroundColor: COLORS.secondary,
  },
});
