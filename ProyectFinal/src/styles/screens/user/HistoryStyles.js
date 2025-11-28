import { StyleSheet } from 'react-native';
import { COLORS, FONTS, RADIUS } from '../../../components/constants/theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  footerContainer: {
    backgroundColor: COLORS.backgroundWhite,
    width: '100%',
  },
  card: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.lg,
    borderColor: COLORS.borderSecondary,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSecondary,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusText: {
    fontSize: FONTS.medium,
    fontWeight: '600',
  },
  cardDate: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
  },
  cardBody: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailLabel: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: FONTS.small,
    color: COLORS.textBlack,
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: FONTS.large,
    fontWeight: '600',
    color: COLORS.textBlack,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: FONTS.regular,
    color: COLORS.textGray,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});