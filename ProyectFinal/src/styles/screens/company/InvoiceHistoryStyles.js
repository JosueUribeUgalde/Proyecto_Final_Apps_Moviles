// ================= InvoiceHistoryStyles.js =================
// Estilos para Historial de facturas (chips, resumen, lista y modales)
// ===========================================================

import { StyleSheet } from 'react-native';
import { COLORS, FONTS, RADIUS, SHADOWS } from '../../../components/constants/theme';

export default StyleSheet.create({
  // ----- Layout base -----
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // ----- Barra de filtros -----
  filtersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
    paddingHorizontal: 14,
    paddingTop: 10,
  },

  // Buscador (más largo)
  searchChip: {
    flex: 1.6,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8,
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    ...SHADOWS.light,
  },
  searchInput: {
    flex: 1,
    fontSize: FONTS.regular,
    color: COLORS.textBlack,
    paddingVertical: 0,
  },

  // Chips de filtro (Periodo / Estado)
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 6,
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    ...SHADOWS.light,
  },
  chipText: {
    fontSize: FONTS.small,
    color: COLORS.textBlack,
  },
  chipPressed: { opacity: 0.7 },

  // ----- Modal de periodo -----
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.backgroundWhite,
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
  },
  modalTitle: {
    fontSize: FONTS.large,
    fontWeight: '700',
    color: COLORS.textGray, // menos saturado
    marginBottom: 8,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: RADIUS.sm,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  modalOptionActive: {
    backgroundColor: COLORS.secondary,
  },
  modalOptionText: {
    fontSize: FONTS.regular,
    color: COLORS.textBlack,
  },
  modalOptionTextActive: {
    fontWeight: '700',
    color: COLORS.textGreen,
  },

  // ----- Resumen -----
  summaryCard: {
    marginTop: 10,
    marginHorizontal: 14,
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    ...SHADOWS.light,
  },
  summaryCol: { rowGap: 4 },
  summaryLabel: { fontSize: FONTS.small, color: COLORS.textGray },
  summaryValue: { fontSize: FONTS.large, fontWeight: '700', color: COLORS.textBlack },
  summaryValuePending: { fontSize: FONTS.large, fontWeight: '700', color: COLORS.textRed },

  // ----- Lista -----
  listContent: {
    paddingHorizontal: 14,
    paddingBottom: 100,
  },
  sectionHeader: {
    marginTop: 12,
    marginBottom: 8,
    fontSize: FONTS.large,
    fontWeight: '700',
    color: COLORS.textGray, // títulos menos saturados
  },
  separator: { height: 10 },

  // ----- Tarjeta de factura -----
  card: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    padding: 12,
    ...SHADOWS.light,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8,
  },
  invTitle: {
    fontSize: FONTS.large,
    fontWeight: '700',
    color: COLORS.textGray, // menos saturado para reducir contraste duro
  },

  // Metadatos (emitida / vence / pagada)
  metaRow: {
    flexDirection: 'row',
    columnGap: 16,
    marginTop: 2,
  },
  metaPair: {
    flexDirection: 'row',
    columnGap: 6,
  },
  metaLabel: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
  },
  metaValue: {
    fontSize: FONTS.small,
    color: COLORS.textBlack,
  },

  failNote: {
    marginTop: 4,
    fontSize: FONTS.small,
    color: COLORS.textGray,
  },

  // Acciones (PDF / Reintentar)
  actionsRow: {
    flexDirection: 'row',
    columnGap: 10,
    marginTop: 10,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 6,
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 12,
    height: 36,
    borderRadius: RADIUS.sm,
  },
  actionPressed: { opacity: 0.7 },
  actionText: { fontSize: FONTS.small, fontWeight: '600', color: COLORS.textBlack },
  actionGhost: {
    backgroundColor: COLORS.backgroundWhite,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
  },
  actionGhostText: { fontSize: FONTS.small, fontWeight: '600', color: COLORS.textGray },

  // ----- Badges de estado -----
  badge: {
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderWidth: 1,
  },
  badgeText: { fontSize: 12, fontWeight: '700' },

  // Pagada
  badge_pagada: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.borderSecondary,
  },
  badgeText_pagada: { color: COLORS.textGreen },

  // Próximo mes (antes "pendiente")
  badge_proximo: {
    backgroundColor: '#F9E7B0',
    borderColor: 'rgba(255, 193, 7, 0.35)',
  },
  badgeText_proximo: { color: '#8A5A00' },

  // Fallida
  badge_fallida: {
    backgroundColor: 'rgba(208, 52, 44, 0.12)',
    borderColor: 'rgba(208, 52, 44, 0.35)',
  },
  badgeText_fallida: { color: COLORS.textRed },
});
