import { StyleSheet } from 'react-native';
import { COLORS, FONTS, RADIUS, SHADOWS } from '../../../components/constants/theme';

export default StyleSheet.create({
  // Contenedor principal
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    width: '100%',
  },
  
  // Contenedor de scroll
  content: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    paddingHorizontal: '7.5%',
    paddingBottom: 20,
  },
  
  // Footer del menú
  footerContainer: {
    backgroundColor: COLORS.backgroundWhite,
    width: '100%',
  },

  // Banner container
  bannerContainer: {
    width: '100%',
    height: 60,
    alignItems: 'center',
  },

  // Contenedor de métricas (cards de estadísticas)
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 12,
  },
  
  // Card individual de métrica
  metricCard: {
    flex: 1,
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
    ...SHADOWS.medium,
  },
  metricLabel: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.textBlack,
    marginBottom: 4,
  },
  metricSub: {
    fontSize: 12,
    color: COLORS.textGray,
  },

  // Contenedor de descripción del grupo
  descriptionContainer: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
    padding: 16,
    marginTop: 16,
    ...SHADOWS.medium,
  },
  descriptionLabel: {
    fontSize: FONTS.small,
    fontWeight: '600',
    color: COLORS.textBlack,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: FONTS.regular,
    color: COLORS.textGray,
    lineHeight: 20,
  },

  // Sección de solicitudes
  requestsSection: {
    marginTop: 24,
    marginBottom: 16,
  },
  
  // Header de sección (título)
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: FONTS.large,
    fontWeight: 'bold',
    color: COLORS.textBlack,
  },

  // Card de solicitud individual
  requestCard: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    borderColor: COLORS.borderSecondary,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
    ...SHADOWS.medium,
  },
  
  // Header del card (nombre y badge de estado)
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
    fontWeight: '600',
    marginTop: 2,
  },
  
  // Contenedor de detalles (fecha y motivo)
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

  // Badges de estado de solicitud
  statusPending: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  statusApproved: {
    backgroundColor: COLORS.backgroundBS,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  statusRejected: {
    backgroundColor: '#FDE8E8',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  
  // Texto de los badges
  statusText: {
    fontSize: FONTS.small,
    fontWeight: '700',
  },
  statusPendingText: {
    fontWeight: '600',
    color: COLORS.primary,
  },
  statusApprovedText: {
    fontWeight: '600',
    color: COLORS.textGreen,
  },
  statusRejectedText: {
    fontWeight: '600',
    color: COLORS.error,
  },

  // Contenedor de botones de acción (Approve/Reject)
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },

  // Estado vacío de solicitudes
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
  emptyRequestsText: {
    fontSize: FONTS.large,
    fontWeight: '600',
    color: COLORS.textGray,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyRequestsSubtext: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
    textAlign: 'center',
    lineHeight: 18,
  },
});
