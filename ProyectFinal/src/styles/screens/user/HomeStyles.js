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
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  footerContainer: {
    backgroundColor: COLORS.backgroundWhite,
    width: '100%',
  },
  // Estilos para la tarjeta de información del grupo
  groupInfoCard: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    padding: 16,
    marginTop: 16,
    ...SHADOWS.light,
  },
  groupInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  groupInfoName: {
    fontSize: FONTS.large,
    fontWeight: '700',
    color: COLORS.textBlack,
  },
  groupInfoDescription: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
    marginTop: 4,
  },
  groupInfoStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderGray,
  },
  groupInfoStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  groupInfoStatLabel: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
    marginTop: 4,
  },
  groupInfoStatValue: {
    fontSize: FONTS.large,
    fontWeight: '700',
    color: COLORS.textBlack,
    marginTop: 4,
  },
  // Estilos para tarjetas de contenido
  contentCard: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    padding: 16,
    marginTop: 16,
    ...SHADOWS.light,
  },
  contentCardTitle: {
    fontSize: FONTS.regular,
    fontWeight: '600',
    color: COLORS.textBlack,
    marginBottom: 12,
  },
  // Estado vacío
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  emptyStateText: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
    marginTop: 12,
    textAlign: 'center',
  },
  // Botón "Unirme a un grupo"
  joinGroupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
    ...SHADOWS.medium,
  },
  joinGroupButtonText: {
    fontSize: FONTS.regular,
    fontWeight: '600',
    color: COLORS.primary,
    marginLeft: 8,
  },
  // Modal de unirse a grupo
  joinModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  joinModalContainer: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.lg,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    ...SHADOWS.medium,
  },
  joinModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  joinModalTitle: {
    fontSize: FONTS.large,
    fontWeight: '700',
    color: COLORS.textBlack,
  },
  joinModalSubtitle: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
    marginBottom: 20,
    lineHeight: 20,
  },
  codeInput: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    padding: 16,
    fontSize: FONTS.large,
    fontWeight: '700',
    color: COLORS.textBlack,
    textAlign: 'center',
    letterSpacing: 4,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
    marginBottom: 20,
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    padding: 16,
    ...SHADOWS.medium,
  },
  joinButtonText: {
    fontSize: FONTS.regular,
    fontWeight: '700',
    color: COLORS.textWhite,
    marginLeft: 8,
  },
});