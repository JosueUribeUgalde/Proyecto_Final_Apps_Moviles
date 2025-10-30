import { StyleSheet } from 'react-native';
import { COLORS, FONTS, RADIUS } from '../constants/theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    width: '100%',
  },
  content: {
    flexGrow: 1,
    width: '85%',
    alignSelf: 'center',
    paddingBottom: 24,
  },
  bannerContainer: {
    width: '100%',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerContainer: {
    backgroundColor: COLORS.backgroundWhite,
    width: '100%',
  },
  section: {
    marginBottom: 18,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: FONTS.large,
    fontWeight: '700',
    color: COLORS.textBlack,
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
  // Filter Section
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
  // Chart Section
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
  // Button Row
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  // Top Metrics Section
  topMetricsContainer: {
    marginTop: 10,
  },
  topMetricsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
});
