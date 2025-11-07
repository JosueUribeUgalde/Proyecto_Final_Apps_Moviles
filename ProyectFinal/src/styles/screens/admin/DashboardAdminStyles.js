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
    width: '100%',
  },
  scrollContent: {
    paddingHorizontal: '7.5%',
    paddingBottom: 20,
  },
  footerContainer: {
    backgroundColor: COLORS.backgroundWhite,
    width: '100%',
  },

  // Métricas
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 12,
  },
  metricCard: {
    flex: 1,
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    padding: 16,
    ...SHADOWS.light,
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

  // Sección de solicitudes
  requestsSection: {
    marginTop: 24,
    marginBottom: 16,
  },
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
  approveAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: COLORS.secondary,
    borderRadius: RADIUS.sm,
  },
  approveAllText: {
    fontSize: FONTS.small,
    color: COLORS.primary,
    fontWeight: '600',
  },

  // Tarjetas de solicitud
  requestCard: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    padding: 16,
    marginBottom: 12,
    ...SHADOWS.light,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  requestName: {
    fontSize: FONTS.regular,
    fontWeight: 'bold',
    color: COLORS.textBlack,
  },
  requestDate: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
    marginBottom: 4,
  },
  requestReason: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
    marginBottom: 12,
  },

  // Estados de solicitud
  statusPending: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    backgroundColor: '#FFF4E5',
  },
  statusApproved: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.secondary,
  },
  statusRejected: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    backgroundColor: '#FFE5E5',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },

  // Botones de acción
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
  },
  rejectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  rejectText: {
    fontSize: FONTS.small,
    color: COLORS.error,
    fontWeight: '600',
  },
  approveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.primary,
  },
  approveText: {
    fontSize: FONTS.small,
    color: COLORS.textWhite,
    fontWeight: '600',
  },
});
