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

  // Filters Section
  filtersContainer: {
    marginTop: 16,
    marginBottom: 12,
  },
  filtersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  filtersTitle: {
    fontSize: FONTS.regular,
    fontWeight: '600',
    color: COLORS.textBlack,
  },
  adjustButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  adjustText: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
  },
  filterChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    backgroundColor: COLORS.backgroundWhite,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterChipText: {
    fontSize: FONTS.small,
    color: COLORS.textBlack,
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: COLORS.textWhite,
  },

  // Search and Week Toggle
  searchWeekContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: FONTS.regular,
    color: COLORS.textBlack,
  },
  weekToggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundWhite,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    gap: 4,
  },
  weekToggleText: {
    fontSize: FONTS.small,
    color: COLORS.textBlack,
    fontWeight: '500',
  },

  // Section Headers
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: FONTS.large,
    fontWeight: '700',
    color: COLORS.textBlack,
  },
  sectionSubtitle: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
    fontWeight: '500',
  },
  viewAllButton: {
    paddingVertical: 4,
  },
  viewAllText: {
    fontSize: FONTS.small,
    color: COLORS.primary,
    fontWeight: '600',
  },

  // Request Card
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
  
  // Botones de acción (ahora manejados por ButtonRequest component)
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },

  // Decision Card (Recent Decisions)
  decisionCard: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
  },
  decisionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  decisionStatus: {
    fontSize: FONTS.regular,
    fontWeight: '700',
    color: COLORS.textBlack,
  },
  decisionRole: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
  },
  decisionDate: {
    fontSize: FONTS.small - 1,
    color: COLORS.textGray,
    marginTop: 2,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: FONTS.regular,
    color: COLORS.textGray,
    textAlign: 'center',
  },
});
