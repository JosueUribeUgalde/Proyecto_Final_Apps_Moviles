import { StyleSheet } from 'react-native';
import { COLORS } from '../../../components/constants/theme';

export default StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '95%',
    height: '90%',
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSecondary,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textBlack,
  },
  closeButton: {
    padding: 4,
  },
  
  // Options Container
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
    gap: 12,
  },
  optionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionIconContainerDisabled: {
    backgroundColor: COLORS.borderSecondary,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textBlack,
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 14,
    color: COLORS.textGray,
  },
  optionSubtitleDisabled: {
    fontStyle: 'italic',
  },

  // Selection Container
  selectionContainer: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 0,
    flexShrink: 1,
  },
  scrollContent: {
    paddingVertical: 8,
    paddingBottom: 20,
  },

  // Members Container
  membersContainer: {
    paddingBottom: 8,
  },
  membersTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textBlack,
    marginBottom: 12,
    marginTop: 8,
  },
  availabilityLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textGray,
    marginTop: 16,
    marginBottom: 12,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.textGray,
  },
  emptyMembersContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyMembersText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.textGray,
    textAlign: 'center',
  },

  // Member Card
  memberCard: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  memberCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textBlack,
    marginBottom: 4,
  },
  memberPosition: {
    fontSize: 14,
    color: COLORS.textGray,
  },
  memberStatus: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginLeft: 8,
  },
  memberStatusAvailable: {
    backgroundColor: '#E8F5E9',
  },
  memberStatusBusy: {
    backgroundColor: '#FFEBEE',
  },
  memberStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  memberStatusAvailableText: {
    color: '#2E7D32',
  },
  memberStatusBusyText: {
    color: '#C62828',
  },
  memberDetails: {
    marginBottom: 8,
    gap: 6,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textGray,
  },
  detailValue: {
    fontSize: 14,
    color: COLORS.textBlack,
    flex: 1,
  },
  detailValueUnavailable: {
    color: COLORS.textGray,
    fontStyle: 'italic',
  },

  // Request Substitution Button
  requestSubstitutionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
    marginTop: 4,
  },
  requestSubstitutionButtonDisabled: {
    backgroundColor: COLORS.borderSecondary,
    opacity: 0.6,
  },
  requestSubstitutionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.backgroundWhite,
  },

  // Actions Container
  actionsContainer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSecondary,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.backgroundWhite,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textGray,
  },

  // AI Suggestion Container
  aiContainer: {
    flex: 1,
    width: '100%',
  },
  aiSuggestionCard: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSecondary,
  },
  aiHeaderText: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.primary,
  },
  aiConfidenceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: COLORS.secondary,
    gap: 6,
    marginBottom: 16,
  },
  aiConfidenceText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textBlack,
  },
  aiMemberName: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textBlack,
    marginBottom: 16,
  },
  aiReasonContainer: {
    flexDirection: 'row',
    gap: 10,
    padding: 16,
    backgroundColor: COLORS.secondary,
    borderRadius: 12,
    marginBottom: 20,
  },
  aiReason: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.textBlack,
  },
  aiActionsContainer: {
    gap: 12,
  },
  backButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
    paddingVertical: 12,
  },
  backButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textGray,
  },
});
