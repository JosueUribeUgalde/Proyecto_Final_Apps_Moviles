import { StyleSheet } from "react-native";
import { COLORS, FONTS, RADIUS, SHADOWS } from "../../../components/constants/theme";

const ACCENT_PRO = { border: COLORS.backgroundBP, head: COLORS.background };

export default StyleSheet.create({
  screen: { flex: 1, 
    backgroundColor: COLORS.background 
  },
    header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.backgroundWhite,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSecondary,
  },
  headerBtn: {
    position: "absolute",
    left: 16,
    width: 36,
    height: 36,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: FONTS.large,
    fontWeight: "700",
    color: COLORS.textBlack,
  },
  selector: {
    flexDirection: "row",
    margin: 16,
    padding: 4,
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
  },
  segmentBtn: { 
    flex: 1, 
    paddingVertical: 10, 
    borderRadius: 999, 
    alignItems: "center" 
  },
  segmentBtnActive: { 
    backgroundColor: COLORS.secondary 
  },
  segmentText: { 
    fontSize: FONTS.regular, 
    color: COLORS.textGray, 
    fontWeight: "600" 
  },
  segmentTextActive: { 
    color: COLORS.textGreen, 
    fontWeight: "700" 
  },
  scrollPad: { 
    padding: 16, 
    paddingBottom: 32 
  },
  listGap: { 
    gap: 14 
  },
  card: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
    padding: 14,
    gap: 10,
    ...SHADOWS.light,
  },
  card_pro: { 
    borderColor: ACCENT_PRO.border 
  },
  cardTop: {
    backgroundColor: ACCENT_PRO.head,
    padding: 10,
    borderRadius: RADIUS.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  planTierRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    gap: 8 
  },
  planTier: { 
    fontSize: FONTS.large, 
    fontWeight: "800", 
    color: COLORS.textBlack 
  },
  planBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.secondary,
  },
  planBadgeText: { 
    fontSize: FONTS.small, 
    color: COLORS.textGreen, 
    fontWeight: "800" 
  },
  planTagline: { 
    fontSize: FONTS.small, 
    color: COLORS.textGray 
  },
  priceRow: { 
    flexDirection: "row", 
    alignItems: "flex-end", 
    gap: 6 
  },
  price: { 
    fontSize: FONTS.xl || 30, 
    fontWeight: "900", 
    color: COLORS.textBlack 
  },
  pricePeriod: { 
    fontSize: FONTS.small, 
    color: COLORS.textGray, 
    marginBottom: 3 
  },
  featureGroup: { 
    gap: 6 
  },
  featureHeader: { 
    fontSize: FONTS.small, 
    color: COLORS.textGray, 
    fontWeight: "700", 
    marginTop: 4 
  },
  features: { 
    gap: 6 
  },
  featureRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    gap: 8 
  },
  featureIcon: { 
    color: COLORS.primary 
  },
  featureText: { 
    fontSize: FONTS.regular, 
    color: COLORS.textBlack 
  },
  limitRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    gap: 8 
  },
  limitIcon: { 
    color: COLORS.textGray 
  },
  limitText: { 
    fontSize: FONTS.small, 
    color: COLORS.textGray 
  },
  ctaBtn: {
    height: 48,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  ctaBtnText: { 
    color: COLORS.textWhite, 
    fontWeight: "800", 
    fontSize: FONTS.regular 
  },
  sectionTitle: { 
    fontSize: FONTS.large, 
    fontWeight: "800", 
    color: COLORS.textBlack, 
    marginBottom: 8 
  },
  payHero: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
    ...SHADOWS.light,
    gap: 8,
  },
  payHeroTitle: { 
    fontSize: FONTS.regular, 
    fontWeight: "800", 
    color: COLORS.textBlack 
  },
  payHeroSubtitle: { 
    fontSize: FONTS.small, 
    color: COLORS.textGray 
  },
  methodsList: { 
    gap: 12 
  },
  methodCard: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
    padding: 12,
    gap: 8,
  },
  methodTitleRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    gap: 8 
  },
  methodTitle: { 
    fontSize: FONTS.regular, 
    fontWeight: "700", 
    color: COLORS.textBlack 
  },
  defaultChip: {
    marginLeft: "auto",
    borderRadius: RADIUS.md,
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: COLORS.secondary,
  },
  defaultChipText: { 
    fontSize: FONTS.small, 
    color: COLORS.textGreen, 
    fontWeight: "800" 
  },
  methodMetaRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    gap: 10 
  },
  metaText: { 
    fontSize: FONTS.small, 
    color: COLORS.textGray 
  },
  rowActions: { 
    flexDirection: "row", 
    gap: 8 
  },
  ghostBtn: {
    flex: 1,
    height: 44,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.backgroundButtonBack,
    alignItems: "center",
    justifyContent: "center",
  },
  ghostText: { 
    color: COLORS.textBlack, 
    fontWeight: "700", 
    textAlign: "center", 
    textAlignVertical: "center" 
  },
  outlineBtn: {
    flex: 1,
    height: 44,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.backgroundWhite,
  },
  outlineText: { 
    color: COLORS.textBlack, 
    fontWeight: "700" 
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: FONTS.regular,
    color: COLORS.textBlack,
  },
  row2: { 
    flexDirection: "row", 
    gap: 10 
  },
  rowItem: { 
    flex: 1 
  },
  saveBtn: {
    height: 48,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  saveBtnText: { 
    color: COLORS.textWhite, 
    fontWeight: "800", 
    fontSize: FONTS.regular 
  },

  /* ============= MODAL CHECKOUT ============= */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    padding: 16,
  },
  modalCard: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.lg,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalTitle: {
    fontSize: FONTS.large,
    fontWeight: "800",
    color: COLORS.textBlack,
  },
  modalCloseBtn: {
    padding: 6,
  },
  modalSubtitle: {
    fontSize: FONTS.regular,
    color: COLORS.textGray,
  },
  modalPrice: {
    fontSize: FONTS.big || 28,
    fontWeight: "900",
    color: COLORS.textBlack,
  },
  modalField: {
    gap: 6,
    marginTop: 4,
  },
  modalLabel: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
    fontWeight: "600",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: FONTS.regular,
    color: COLORS.textBlack,
  },
  modalRow: {
    flexDirection: "row",
    gap: 10,
  },
  modalPayBtn: {
    height: 48,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  modalPayText: {
    color: COLORS.textWhite,
    fontWeight: "800",
    fontSize: FONTS.regular,
  },
  successText: {
    color: COLORS.textGreen,
    fontWeight: "700",
  },
});
