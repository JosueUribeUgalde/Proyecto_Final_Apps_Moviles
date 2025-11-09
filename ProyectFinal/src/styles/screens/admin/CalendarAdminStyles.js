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
    ...SHADOWS.light,
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
  
  // Botón Ver más
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 8,
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.primary,
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
    borderColor: COLORS.primary,
    borderWidth: 1.5,
    padding: 16,
    marginBottom: 12,
    gap: 16,
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
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: RADIUS.sm,
    gap: 8,
    alignSelf: 'stretch',
  },
  viewRequestsButtonText: {
    fontSize: FONTS.regular,
    fontWeight: '600',
    color: COLORS.textWhite,
  },
  
  // Tarjeta de petición
  requestCard: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    borderColor: COLORS.borderSecondary,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
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
  },
  noRequestsText: {
    fontSize: FONTS.regular,
    color: COLORS.textGray,
    textAlign: 'center',
    marginTop: 12,
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
  filterText: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
    fontWeight: '500',
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
  chartDescription: {
    color: COLORS.textGray,
    fontSize: FONTS.small,
    marginTop: 6,
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
    marginTop: 10,
  },
  topMetricsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
    gap: 8,
  },
});
