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
});