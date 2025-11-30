import { StyleSheet } from 'react-native';
import { COLORS, FONTS, RADIUS, SHADOWS } from '../../../components/constants/theme';

/**
 * CalendarStyles (Usuario)
 * 
 * Estilos para la pantalla de calendario del usuario
 * Incluye estilos para:
 * - Calendario interactivo con marcadores de turnos
 * - Turnos del día seleccionado
 * - Próximos turnos programados
 * - Estados vacíos cuando no hay turnos configurados
 */

export default StyleSheet.create({
  // ===========================
  // CONTENEDORES PRINCIPALES
  // ===========================
  
  // Contenedor principal de la pantalla
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    width: '100%',
  },
  
  // Contenedor del contenido con scroll
  content: {
    flex: 1,
    width: '90%',
    alignSelf: 'center',
  },
  
  // Contenedor del banner de notificaciones
  bannerContainer: {
    width: '100%',
    height: 60,
    alignItems: 'center',
  },
  
  // Contenedor del footer con menú de navegación
  footerContainer: {
    backgroundColor: COLORS.backgroundWhite,
    width: '100%',
  },

  // ===========================
  // CALENDARIO
  // ===========================
  
  // Contenedor del componente de calendario
  calendarContainer: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    marginVertical: 16,
    ...SHADOWS.light,
  },
  
  // Estilos del calendario (react-native-calendars)
  calendar: {
    borderRadius: RADIUS.md,
    paddingBottom: 10,
  },

  // ===========================
  // SECCIÓN DE TURNOS (LEGACY)
  // ===========================
  // Nota: Estos estilos se mantienen por compatibilidad
  
  // Sección principal de turnos
  appointmentsSection: {
    marginTop: 20,
    marginBottom: 30,
  },
  
  // Título de sección ("Turno de Hoy", "Próximos Turnos")
  sectionTitle: {
    fontSize: FONTS.large,
    fontWeight: 'bold',
    color: COLORS.textBlack,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  
  // Lista de turnos (FlatList)
  appointmentsList: {
    flexGrow: 0,
  },

  // Card individual de turno (versión legacy)
  appointmentCard: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    padding: 16,
    marginBottom: 12,
    ...SHADOWS.light,
  },
  
  // Header de la card de turno
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  
  // Título del turno
  appointmentTitle: {
    fontSize: FONTS.regular,
    fontWeight: '600',
    color: COLORS.textBlack,
    flex: 1,
  },
  
  // Hora del turno
  appointmentTime: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
    marginTop: 4,
  },

  // ===========================
  // BADGES DE ESTADO
  // ===========================
  
  // Badge de estado del turno (legacy)
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    minWidth: 80,
    alignItems: 'center',
  },
  
  // Texto del badge de estado
  statusText: {
    fontSize: FONTS.small,
    fontWeight: '600',
    color: COLORS.textWhite,
  },

  // ===========================
  // ESTADO SIN TURNOS HOY
  // ===========================
  
  // Contenedor cuando no hay turnos para el día seleccionado
  noAppointments: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    padding: 24,
    alignItems: 'center',
    ...SHADOWS.light,
  },
  
  // Texto "No tienes turnos programados para hoy"
  noAppointmentsText: {
    fontSize: FONTS.regular,
    color: COLORS.textGray,
    textAlign: 'center',
    fontStyle: 'italic',
  },

  // ===========================
  // TURNOS ASIGNADOS (VERSIÓN MEJORADA)
  // ===========================
  
  // Sección principal de turnos asignados
  shiftsSection: {
    marginTop: 20,
    marginBottom: 30,
  },

  // Card de turno asignado (versión mejorada)
  shiftCard: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
    ...SHADOWS.light,
  },
  
  // Card cuando el turno es hoy (destacado)
  shiftCardToday: {
    borderColor: COLORS.primary,
    borderWidth: 2,
    backgroundColor: COLORS.backgroundBS,
  },

  // Header de la card con día y badge
  shiftCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  
  // Contenedor del día con ícono
  shiftCardDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  
  // Nombre del día de la semana
  shiftCardDay: {
    fontSize: FONTS.large,
    fontWeight: '700',
    color: COLORS.textBlack,
  },
  
  // Día de la semana cuando es hoy (color primario)
  shiftCardDayToday: {
    color: COLORS.primary,
  },
  
  // Fecha completa del turno (ej: "30 de noviembre")
  shiftCardDate: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
    marginBottom: 12,
    paddingLeft: 28,
  },

  // ===========================
  // BADGE "HOY"
  // ===========================
  
  // Badge indicador de que el turno es hoy
  todayBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
  },
  
  // Texto del badge "HOY"
  todayBadgeText: {
    fontSize: FONTS.small,
    fontWeight: '700',
    color: COLORS.textWhite,
  },

  // ===========================
  // INFORMACIÓN DEL TURNO
  // ===========================
  
  // Contenedor de información del turno (hora, comida, etc.)
  shiftCardInfo: {
    gap: 8,
  },
  
  // Fila individual de información (ícono + etiqueta + valor)
  shiftInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  
  // Etiqueta de la información (ej: "Hora:", "Comida:")
  shiftInfoLabel: {
    fontSize: FONTS.regular,
    fontWeight: '600',
    color: COLORS.textBlack,
    minWidth: 70,
  },
  
  // Valor de la información (ej: "09:00 - 17:00")
  shiftInfoValue: {
    fontSize: FONTS.regular,
    color: COLORS.textGray,
    flex: 1,
  },

  // ===========================
  // SIN TURNO HOY (LEGACY)
  // ===========================
  
  // Card cuando no hay turno programado para hoy (legacy)
  noShiftCard: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    padding: 24,
    alignItems: 'center',
    ...SHADOWS.light,
  },
  
  // Texto "No tienes turno hoy" (legacy)
  noShiftText: {
    fontSize: FONTS.regular,
    color: COLORS.textGray,
    marginTop: 12,
    fontStyle: 'italic',
  },

  // ===========================
  // SIN TURNOS CONFIGURADOS
  // ===========================
  
  // Card cuando el usuario no tiene turnos configurados
  noShiftsConfigured: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    padding: 32,
    alignItems: 'center',
    ...SHADOWS.light,
  },
  
  // Título "Sin turnos configurados"
  noShiftsConfiguredTitle: {
    fontSize: FONTS.large,
    fontWeight: '600',
    color: COLORS.textBlack,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  
  // Texto explicativo para contactar al administrador
  noShiftsConfiguredText: {
    fontSize: FONTS.regular,
    color: COLORS.textGray,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 8,
  },

  // ===========================
  // DETALLES DE TURNO DEL DÍA
  // ===========================
  
  // Header del turno con ícono y título
  shiftHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  
  // Título "Tienes turno hoy"
  shiftTitle: {
    fontSize: FONTS.large,
    fontWeight: '600',
    color: COLORS.textBlack,
  },
  
  // Contenedor de detalles del turno (hora y comida)
  shiftDetails: {
    gap: 12,
  },
  
  // Fila de detalle con ícono y texto
  shiftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  
  // Texto de horario (ej: "09:00 - 17:00")
  shiftTime: {
    fontSize: FONTS.regular,
    color: COLORS.textBlack,
  },
  
  // Texto de hora de comida (ej: "Comida: 13:00 - 14:00")
  shiftMeal: {
    fontSize: FONTS.regular,
    color: COLORS.textBlack,
  },

  // ===========================
  // PRÓXIMOS TURNOS
  // ===========================
  
  // Sección de próximos turnos programados
  upcomingSection: {
    marginTop: 24,
    marginBottom: 30,
  },
  
  // Lista horizontal de próximos turnos
  upcomingList: {
    flexGrow: 0,
  },

  // Card de próximo turno
  upcomingShiftCard: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
    ...SHADOWS.light,
  },
  
  // Header de la card con ícono y fecha
  upcomingShiftHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  
  // Fecha del próximo turno (ej: "Lunes, 01 de diciembre")
  upcomingShiftDate: {
    fontSize: FONTS.regular,
    fontWeight: '600',
    color: COLORS.textBlack,
  },
  
  // Contenedor de detalles (hora y comida)
  upcomingShiftDetails: {
    gap: 8,
  },
  
  // Fila de detalle con ícono
  upcomingShiftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  
  // Horario del próximo turno
  upcomingShiftTime: {
    fontSize: FONTS.regular,
    color: COLORS.textGray,
  },
  
  // Hora de comida del próximo turno
  upcomingShiftMeal: {
    fontSize: FONTS.regular,
    color: COLORS.textGray,
  },

  // ===========================
  // SIN PRÓXIMOS TURNOS
  // ===========================
  
  // Card cuando no hay más turnos programados
  noUpcomingShifts: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    padding: 24,
    alignItems: 'center',
    ...SHADOWS.light,
  },
  
  // Texto "No hay próximos turnos programados"
  noUpcomingShiftsText: {
    fontSize: FONTS.regular,
    color: COLORS.textGray,
    marginTop: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});