// src/components/styles/EditProfileStyles.js
import { StyleSheet } from "react-native";
import { COLORS, FONTS, RADIUS } from "../constants/theme";

export default StyleSheet.create({
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: FONTS.small,
    color: COLORS.textBlack,
    marginBottom: 6,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
  },
  inputBoxDisabled: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
    opacity: 0.7,
  },
  input: {
    flex: 1,
    fontSize: FONTS.regular,
    color: COLORS.textBlack,
  },
  inputDisabled: {
    flex: 1,
    fontSize: FONTS.regular,
    color: COLORS.textGray,
  },
  rowNav: {
    justifyContent: "space-between",
    marginBottom: 10,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
  },
  rowTextWrap: {
    flexDirection: "column",
  },
  rowTitle: {
    fontSize: FONTS.regular,
    color: COLORS.textBlack,
  },
  rowSubtitle: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
    marginTop: 2,
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: 8,
    rowGap: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.secondary,
  },
  chipText: {
    fontSize: FONTS.small,
    color: COLORS.textBlack,
    fontWeight: "600",
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 12,
    marginHorizontal: 16,
    marginBottom: 24,
    marginTop: 8,
  },
  saveBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 8,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: 14,
  },
  saveBtnText: {
    color: COLORS.textWhite,
    fontSize: FONTS.regular,
    fontWeight: "bold",
  },
  removeBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 8,
    backgroundColor: COLORS.backgroundWhite,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
    borderRadius: RADIUS.md,
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  removeBtnText: {
    color: COLORS.error,
    fontSize: FONTS.regular,
    fontWeight: "bold",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  modalSheet: {
    width: "100%",
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.backgroundWhite,
    padding: 14,
  },
  modalTitle: {
    fontSize: FONTS.large,
    fontWeight: "bold",
    color: COLORS.textBlack,
    marginBottom: 8,
  },
  modalOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSecondary,
  },
  modalOptionText: {
    fontSize: FONTS.regular,
    color: COLORS.textBlack,
  },
  modalClose: {
    alignSelf: "flex-end",
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  modalCloseText: {
    fontSize: FONTS.regular,
    color: COLORS.textGreen,
    fontWeight: "600",
  },
  editBtn: {
  flexDirection: 'row',
  alignItems: 'center',
  borderRadius: 999,
  paddingHorizontal: 12,
  paddingVertical: 8,
  backgroundColor: COLORS.backgroundWhite,
  borderWidth: 1,
  borderColor: COLORS.borderSecondary,
},
editBtnText: {
  marginLeft: 6,
  fontSize: FONTS.regular,
  color: COLORS.textBlack,
  fontWeight: '600',
},
});
