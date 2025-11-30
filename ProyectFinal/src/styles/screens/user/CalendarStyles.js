import { StyleSheet } from 'react-native';
import { COLORS, FONTS, RADIUS, SHADOWS } from '../../../components/constants/theme';

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

  // Estilos del calendario
  calendarContainer: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    marginVertical: 16,
    ...SHADOWS.light,
  },
  calendar: {
    borderRadius: RADIUS.md,
    paddingBottom: 10,
  },

  // Sección de turnos
  appointmentsSection: {
    marginTop: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: FONTS.large,
    fontWeight: 'bold',
    color: COLORS.textBlack,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  appointmentsList: {
    flexGrow: 0,
  },

  // Tarjeta de turno
  appointmentCard: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    padding: 16,
    marginBottom: 12,
    ...SHADOWS.light,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  appointmentTitle: {
    fontSize: FONTS.regular,
    fontWeight: '600',
    color: COLORS.textBlack,
    flex: 1,
  },
  appointmentTime: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
    marginTop: 4,
  },

  // Badge de estado
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    minWidth: 80,
    alignItems: 'center',
  },
  statusText: {
    fontSize: FONTS.small,
    fontWeight: '600',
    color: COLORS.textWhite,
  },

  // Estado sin turnos
  noAppointments: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    padding: 24,
    alignItems: 'center',
    ...SHADOWS.light,
  },
  noAppointmentsText: {
    fontSize: FONTS.regular,
    color: COLORS.textGray,
    textAlign: 'center',
    fontStyle: 'italic',
  },

  // ========== ESTILOS PARA TURNOS ASIGNADOS ==========

  // Sección de turnos asignados
  shiftsSection: {
    marginTop: 20,
    marginBottom: 30,
  },

  // Tarjeta de turno asignado
  shiftCard: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
    ...SHADOWS.light,
  },
  shiftCardToday: {
    borderColor: COLORS.primary,
    borderWidth: 2,
    backgroundColor: COLORS.backgroundBS,
  },

  // Encabezado de tarjeta de turno
  shiftCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  shiftCardDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  shiftCardDay: {
    fontSize: FONTS.large,
    fontWeight: '700',
    color: COLORS.textBlack,
  },
  shiftCardDayToday: {
    color: COLORS.primary,
  },
  shiftCardDate: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
    marginBottom: 12,
    paddingLeft: 28,
  },

  // Badge "HOY"
  todayBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
  },
  todayBadgeText: {
    fontSize: FONTS.small,
    fontWeight: '700',
    color: COLORS.textWhite,
  },

  // Información del turno
  shiftCardInfo: {
    gap: 8,
  },
  shiftInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  shiftInfoLabel: {
    fontSize: FONTS.regular,
    fontWeight: '600',
    color: COLORS.textBlack,
    minWidth: 70,
  },
  shiftInfoValue: {
    fontSize: FONTS.regular,
    color: COLORS.textGray,
    flex: 1,
  },

  // Sin turno hoy
  noShiftCard: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    padding: 24,
    alignItems: 'center',
    ...SHADOWS.light,
  },
  noShiftText: {
    fontSize: FONTS.regular,
    color: COLORS.textGray,
    marginTop: 12,
    fontStyle: 'italic',
  },

  // ========== ESTILOS PARA TURNOS CONFIGURADOS ==========

  // Sin turnos configurados
  noShiftsConfigured: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    padding: 32,
    alignItems: 'center',
    ...SHADOWS.light,
  },
  noShiftsConfiguredTitle: {
    fontSize: FONTS.large,
    fontWeight: '600',
    color: COLORS.textBlack,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  noShiftsConfiguredText: {
    fontSize: FONTS.regular,
    color: COLORS.textGray,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 8,
  },

  // Tarjeta de turno del día
  shiftHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  shiftTitle: {
    fontSize: FONTS.large,
    fontWeight: '600',
    color: COLORS.textBlack,
  },
  shiftDetails: {
    gap: 12,
  },
  shiftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  shiftTime: {
    fontSize: FONTS.regular,
    color: COLORS.textBlack,
  },
  shiftMeal: {
    fontSize: FONTS.regular,
    color: COLORS.textBlack,
  },

  // ========== ESTILOS PARA PRÓXIMOS TURNOS ==========

  // Sección de próximos turnos
  upcomingSection: {
    marginTop: 24,
    marginBottom: 30,
  },
  upcomingList: {
    flexGrow: 0,
  },

  // Tarjeta de próximo turno
  upcomingShiftCard: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
    ...SHADOWS.light,
  },
  upcomingShiftHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  upcomingShiftDate: {
    fontSize: FONTS.regular,
    fontWeight: '600',
    color: COLORS.textBlack,
  },
  upcomingShiftDetails: {
    gap: 8,
  },
  upcomingShiftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  upcomingShiftTime: {
    fontSize: FONTS.regular,
    color: COLORS.textGray,
  },
  upcomingShiftMeal: {
    fontSize: FONTS.regular,
    color: COLORS.textGray,
  },

  // Sin próximos turnos
  noUpcomingShifts: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    padding: 24,
    alignItems: 'center',
    ...SHADOWS.light,
  },
  noUpcomingShiftsText: {
    fontSize: FONTS.regular,
    color: COLORS.textGray,
    marginTop: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});