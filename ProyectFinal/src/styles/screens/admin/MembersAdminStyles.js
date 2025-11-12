import { StyleSheet } from 'react-native';
import { COLORS, FONTS, RADIUS, SHADOWS } from '../../../components/constants/theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  bannerContainer: {
    width: '100%',
    height: 60,
    alignItems: 'center',
  },
  content: {
    flex: 1,
    width: '90%',
    alignSelf: 'center',
  },
  footerContainer: {
    backgroundColor: COLORS.backgroundWhite,
    width: '100%',
  },


  // Directory Card
  directoryCard: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    padding: 16,
    marginBottom: 16,
    ...SHADOWS.light,
  },
  directoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  directoryTitle: {
    fontSize: FONTS.large,
    fontWeight: '700',
    color: COLORS.textBlack,
  },
  filtersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
  },
  filtersButtonText: {
    fontSize: FONTS.small,
    color: COLORS.textBlack,
    fontWeight: '500',
  },

  // Search Row
  searchRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: FONTS.regular,
    color: COLORS.textBlack,
  },
  allRolesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    backgroundColor: COLORS.backgroundWhite,
  },
  allRolesText: {
    fontSize: FONTS.small,
    color: COLORS.textBlack,
    fontWeight: '500',
  },

  // Filters
  filtersContainer: {
    marginTop: 12,
  },
  filterLabel: {
    fontSize: FONTS.small,
    fontWeight: '600',
    color: COLORS.textBlack,
    marginBottom: 8,
  },
  groupFilters: {
    flexDirection: 'row',
  },
  groupFilterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    backgroundColor: COLORS.backgroundWhite,
    marginRight: 8,
  },
  groupFilterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  groupFilterText: {
    fontSize: FONTS.small,
    color: COLORS.textBlack,
    fontWeight: '500',
  },
  groupFilterTextActive: {
    color: COLORS.textWhite,
  },

  // Section Header
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: FONTS.large,
    fontWeight: '700',
    color: COLORS.textBlack,
  },
  manageGroupsButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.backgroundWhite,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
  },
  manageGroupsText: {
    fontSize: FONTS.small,
    color: COLORS.textBlack,
    fontWeight: '600',
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyStateText: {
    fontSize: FONTS.regular,
    color: COLORS.textGray,
    marginTop: 12,
  },

  // Member Card
  memberCard: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    padding: 16,
    marginBottom: 12,
    ...SHADOWS.light,
  },
  memberHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    gap: 12,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberDetails: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  memberName: {
    fontSize: FONTS.regular,
    fontWeight: '700',
    color: COLORS.textBlack,
  },
  memberGroup: {
    fontSize: FONTS.regular,
    fontWeight: '400',
    color: COLORS.textGray,
  },
  memberShift: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
    marginTop: 4,
  },
  memberExperience: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
    marginTop: 2,
  },
  moreButton: {
    padding: 4,
  },

  // Member Footer
  memberFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
  },
  statusAvailable: {
    backgroundColor: '#E8F5E9',
  },
  statusOff: {
    backgroundColor: '#F5F5F5',
  },
  statusLeave: {
    backgroundColor: '#FFF4E5',
  },
  statusDefault: {
    backgroundColor: COLORS.secondary,
  },
  statusText: {
    fontSize: FONTS.small,
    fontWeight: '600',
    color: COLORS.textBlack,
  },
  shiftsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  shiftsText: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
  },
  lastActiveText: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
    marginLeft: 'auto',
  },

  // Quick Actions Card
  quickActionsCard: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    padding: 16,
    marginTop: 8,
    marginBottom: 16,
    ...SHADOWS.light,
  },
  quickActionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  quickActionsTitle: {
    fontSize: FONTS.large,
    fontWeight: '700',
    color: COLORS.textBlack,
  },
  viewAllText: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
    fontWeight: '500',
  },
  quickActionsButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: RADIUS.sm,
    gap: 8,
    minHeight: 80,
  },
  quickActionPrimary: {
    backgroundColor: COLORS.primary,
  },
  quickActionSecondary: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
  },
  quickActionText: {
    color: COLORS.textWhite,
    fontSize: FONTS.small,
    fontWeight: '600',
    textAlign: 'center',
  },
  quickActionTextDark: {
    color: COLORS.textBlack,
    fontSize: FONTS.small,
    fontWeight: '600',
    textAlign: 'center',
  },

  // Distribution Card
  distributionCard: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    padding: 16,
    marginTop: 8,
    marginBottom: 24,
    ...SHADOWS.light,
  },
  distributionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  distributionTitle: {
    fontSize: FONTS.large,
    fontWeight: '700',
    color: COLORS.textBlack,
  },
  distributionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderGray,
  },
  groupName: {
    fontSize: FONTS.regular,
    color: COLORS.textBlack,
    fontWeight: '500',
  },
  groupCount: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
  },

  // Modal Styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    padding: 24,
    width: '85%',
    maxWidth: 400,
    ...SHADOWS.dark,
  },
  modalTitle: {
    fontSize: FONTS.large,
    fontWeight: '700',
    color: COLORS.textBlack,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: FONTS.regular,
    color: COLORS.textGray,
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 22,
  },
  modalInputContainer: {
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: FONTS.small,
    fontWeight: '600',
    color: COLORS.textBlack,
    marginBottom: 8,
  },
  modalInput: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.sm,
    padding: 12,
    fontSize: FONTS.regular,
    color: COLORS.textBlack,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonCancel: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
  },
  modalButtonConfirm: {
    backgroundColor: COLORS.primary,
  },
  modalButtonDelete: {
    backgroundColor: COLORS.error,
  },
  modalButtonTextCancel: {
    color: COLORS.textBlack,
    fontSize: FONTS.regular,
    fontWeight: '600',
  },
  modalButtonTextConfirm: {
    color: COLORS.textWhite,
    fontSize: FONTS.regular,
    fontWeight: '600',
  },

  // Group Select List
  groupSelectList: {
    maxHeight: 200,
    marginTop: 8,
  },
  groupSelectItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    marginBottom: 8,
    backgroundColor: COLORS.background,
  },
  groupSelectItemActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  groupSelectText: {
    fontSize: FONTS.regular,
    color: COLORS.textBlack,
    fontWeight: '500',
  },
  groupSelectTextActive: {
    color: COLORS.textWhite,
  },
  groupSelectCount: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
  },

  // Warning Box
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFE5E5',
    padding: 12,
    borderRadius: RADIUS.sm,
    marginTop: 12,
  },
  warningText: {
    flex: 1,
    fontSize: FONTS.small,
    color: COLORS.textRed,
    lineHeight: 18,
  },

  // Manage Groups Modal
  manageGroupsButtons: {
    gap: 12,
    marginTop: 12,
  },
  manageGroupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 16,
    borderRadius: RADIUS.sm,
    ...SHADOWS.light,
  },
  createButton: {
    backgroundColor: COLORS.primary,
  },
  editButton: {
    backgroundColor: '#4A90E2',
  },
  deleteButton: {
    backgroundColor: COLORS.error,
  },
  shareButton: {
    backgroundColor: '#7B68EE',
  },
  manageGroupButtonText: {
    color: COLORS.textWhite,
    fontSize: FONTS.regular,
    fontWeight: '600',
  },

  // Share Options
  shareOptions: {
    gap: 12,
    marginTop: 12,
  },
  shareOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
  },
  shareOptionText: {
    fontSize: FONTS.regular,
    color: COLORS.textBlack,
    fontWeight: '500',
  },
});
