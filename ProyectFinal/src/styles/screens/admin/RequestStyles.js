import { StyleSheet } from 'react-native';
import { COLORS, FONTS, RADIUS } from '../../../components/constants/theme';

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
    fontSize: FONTS.large,
    fontWeight: 'bold',
    color: COLORS.textBlack,
  },
  filterChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  filterChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
  },
  filterChipActive: {
    backgroundColor: COLORS.backgroundBS,
    borderColor: COLORS.primary,
  },
  filterChipText: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: COLORS.textGreen,
    fontWeight: '600',
  },

  // Search
  searchWeekContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
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
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: FONTS.regular,
    color: COLORS.textBlack,
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
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyStateText: {
    fontSize: FONTS.large,
    fontWeight: 'bold',
    color: COLORS.textBlack,
    marginTop: 16,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: FONTS.medium,
    color: COLORS.textGray,
    marginTop: 8,
    textAlign: 'center',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalOverlayTouchable: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: COLORS.backgroundWhite,
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
    maxHeight: '80%',
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSecondary,
  },
  modalTitle: {
    fontSize: FONTS.large + 2,
    fontWeight: 'bold',
    color: COLORS.textBlack,
  },
  modalList: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },

  // Modal Decision Card
  modalDecisionCard: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
  },
  modalDecisionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  modalDecisionInfo: {
    flex: 1,
  },
  modalDecisionName: {
    fontSize: FONTS.regular,
    fontWeight: '600',
    color: COLORS.textBlack,
    marginBottom: 2,
  },
  modalDecisionRole: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
  },
  modalStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    marginLeft: 8,
  },
  statusApproved: {
    backgroundColor: COLORS.backgroundBS,
  },
  statusRejected: {
    backgroundColor: '#FDE8E8',
  },
  statusAuto: {
    backgroundColor: '#E8F4FD',
  },
  modalStatusText: {
    fontSize: FONTS.small - 1,
    fontWeight: '600',
  },
  statusApprovedText: {
    color: COLORS.textGreen,
  },
  statusRejectedText: {
    color: COLORS.error,
  },
  statusAutoText: {
    color: '#1E88E5',
  },
  modalDecisionDetails: {
    gap: 6,
  },
  modalDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  modalDetailText: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
  },
});
