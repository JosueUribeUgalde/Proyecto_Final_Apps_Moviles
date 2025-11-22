import { StyleSheet } from 'react-native';
import { COLORS, FONTS, RADIUS, SHADOWS } from '../../../components/constants/theme';

export default StyleSheet.create({
  // Contenedor principal
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  bannerContainer: {
    width: '100%',
    height: 60,
    alignItems: 'center',
  },
  listContent: {
    width: '90%',
    alignSelf: 'center',
    paddingBottom: 16,
  },
  footerContainer: {
    backgroundColor: COLORS.backgroundWhite,
    width: '100%',
  },
  // Buscador
  searchCard: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    padding: 16,
    marginTop: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
    ...SHADOWS.medium,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
    columnGap: 8,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
  },
  searchInput: {
    flex: 1,
    fontSize: FONTS.regular,
    color: COLORS.textBlack,
  },
  // Encabezado de lista
  listHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  listTitle: {
    fontSize: FONTS.large,
    fontWeight: '700',
    color: COLORS.textBlack,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
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
  // Estado vacío
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    marginTop: 8,
    fontSize: FONTS.regular,
    color: COLORS.textGray,
  },
  // Tarjeta de miembro
  memberCard: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
    padding: 12,
    marginBottom: 10,
    ...SHADOWS.medium,
  },
  memberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  memberLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    columnGap: 10,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: FONTS.regular,
    fontWeight: '700',
    color: COLORS.textBlack,
  },
  memberEmail: {
    marginTop: 2,
    fontSize: FONTS.small,
    color: COLORS.textGray,
  },
  // Puesto / meta del miembro
  memberMeta: {
    marginTop: 2,
    fontSize: FONTS.small,
    color: COLORS.textGray,
  },
  memberRight: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 6,
    marginLeft: 8,
  },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  roleBadgeText: {
    fontSize: FONTS.small,
    fontWeight: '600',
    color: COLORS.textBlack,
  },
  // Badges de rol Admin / Usuario
  roleBadgeAdmin: {
    backgroundColor: '#E0ECFF',
    borderColor: COLORS.primary,
  },
  roleBadgeUser: {
    backgroundColor: '#E0F7F1',
    borderColor: COLORS.secondary,
  },
  roleBadgeDefault: {
    backgroundColor: COLORS.background,
    borderColor: COLORS.borderSecondary,
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.backgroundWhite,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
    ...SHADOWS.medium,
  },
  iconButtonDanger: {
    backgroundColor: '#FFE5E5',
    borderColor: '#FFE5E5',
  },
  // Botón Agregar miembro
  addMemberWrapper: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderGray,
    backgroundColor: COLORS.backgroundWhite,
  },
  addMemberButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: 8,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
    ...SHADOWS.medium,
  },
  addMemberText: {
    fontSize: FONTS.regular,
    fontWeight: '600',
    color: COLORS.textWhite,
  },
  // Modal agregar / editar
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    maxHeight: '90%',
    backgroundColor: COLORS.background,
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    ...SHADOWS.dark,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: FONTS.large,
    fontWeight: '700',
    color: COLORS.textBlack,
  },
  modalScrollContent: {
    paddingBottom: 16,
    rowGap: 12,
  },
  // Secciones del formulario
  sectionCard: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
    padding: 14,
    marginBottom: 10,
    ...SHADOWS.light,
  },
  sectionTitle: {
    fontSize: FONTS.regular,
    fontWeight: '700',
    color: COLORS.textBlack,
    marginBottom: 10,
  },
  fieldLabel: {
    fontSize: FONTS.small,
    fontWeight: '600',
    color: COLORS.textBlack,
    marginBottom: 4,
    marginTop: 6,
  },
  fieldInput: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: FONTS.regular,
    color: COLORS.textBlack,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
  },
  fieldRow: {
    flexDirection: 'row',
    columnGap: 8,
    marginTop: 6,
  },
  fieldColumn: {
    flex: 1,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  // Toggle reemplazos
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  toggleInfo: {
    flex: 1,
    marginRight: 12,
  },
  toggleTitle: {
    fontSize: FONTS.regular,
    fontWeight: '600',
    color: COLORS.textBlack,
  },
  toggleSubtitle: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
    marginTop: 2,
  },
  // Chips de áreas preferidas
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 8,
    rowGap: 8,
    marginTop: 8,
  },
  areaChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
    backgroundColor: COLORS.backgroundWhite,
  },
  areaChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  areaChipText: {
    fontSize: FONTS.small,
    color: COLORS.textBlack,
  },
  areaChipTextActive: {
    color: COLORS.textWhite,
  },

  // Botones del modal vebs jeje
  modalButtonsRow: {
    flexDirection: 'row',
    columnGap: 10,
    marginTop: 8,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: 8,
    paddingVertical: 11,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.backgroundWhite,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
  },
  secondaryButtonText: {
    fontSize: FONTS.regular,
    fontWeight: '600',
    color: COLORS.primary,
  },
  primaryButton: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: 8,
    paddingVertical: 11,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
  },
  primaryButtonText: {
    fontSize: FONTS.regular,
    fontWeight: '700',
    color: COLORS.textWhite,
  },
});