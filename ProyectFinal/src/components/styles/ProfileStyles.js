import { StyleSheet } from 'react-native';
import { COLORS, FONTS, RADIUS, SHADOWS, AVATAR } from '../constants/theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  /* ================== (EXISTENTE) ================== */
  profileContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.backgroundWhite,
    ...SHADOWS.light
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  userName: {
    fontSize: FONTS.big,
    fontWeight: 'bold',
    color: COLORS.textBlack,
    marginBottom: 5,
  },
  jobTitle: {
    fontSize: FONTS.regular,
    color: COLORS.textGray,
    marginBottom: 10,
  },
  contactInfo: {
    alignItems: 'center',
  },
  userEmail: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
    marginBottom: 5,
  },
  userPhone: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
  },
  preferencesSection: {
    marginTop: 20,
  },
  accountSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: FONTS.regular,
    fontWeight: 'bold',
    marginLeft: 15,
    marginBottom: 10,
    color: COLORS.textBlack,
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.backgroundWhite,
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderGray,
  },
  preferenceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  preferenceTextContainer: {
    marginLeft: 15,
  },
  preferenceTitle: {
    fontSize: FONTS.regular,
    color: COLORS.textBlack,
    marginBottom: 4,
  },
  preferenceSubtitle: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundWhite,
    padding: 15,
    marginTop: 20,
  },
  helpButtonText: {
    marginLeft: 15,
    fontSize: FONTS.regular,
    color: COLORS.textBlack,
  },
  signOutButton: {
    padding: 15,
    marginTop: 20,
    marginBottom: 30,
    alignItems: 'center',
  },
  signOutText: {
    color: COLORS.error,
    fontSize: FONTS.regular,
  },

  /* ================== (NUEVO) Tarjeta con layout solicitado ================== */
  profileCard: {
    margin: 16,
    padding: 14,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.backgroundWhite,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
    ...SHADOWS.light,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 12,
    marginBottom: 12,
  },
  avatar: {
    width: AVATAR.sizeMd,
    height: AVATAR.sizeMd,
    borderRadius: AVATAR.sizeMd / 2,
  },
  nameAndRole: {
    flex: 1,
  },
  cardName: {
    fontSize: FONTS.large,
    fontWeight: 'bold',
    color: COLORS.textBlack,
  },
  cardRole: {
    marginTop: 2,
    fontSize: FONTS.regular,
    color: COLORS.textGray,
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
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.secondary,
  },
  badgeText: {
    fontSize: FONTS.small,
    color: COLORS.textBlack,
    fontWeight: '600',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.backgroundWhite,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
    marginBottom: 10,
  },
  infoText: {
    flex: 1,
    fontSize: FONTS.regular,
    color: COLORS.textGray,
  },
});
