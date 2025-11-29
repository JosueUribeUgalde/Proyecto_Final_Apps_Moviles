import { StyleSheet } from 'react-native';
import { COLORS, FONTS, RADIUS, SHADOWS } from '../../../components/constants/theme';

export default StyleSheet.create({
  // Contenedor principal de la pantalla
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    width: '100%',
  },
  
  // Contenedor del ScrollView
  content: {
    flex: 1,
  },
  
  // Contenido interno del ScrollView con padding horizontal
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  
  // Contenedor del footer (MenuFooter)
  footerContainer: {
    backgroundColor: COLORS.backgroundWhite,
    width: '100%',
  },

  // ============================================
  // TARJETA DE INFORMACIÓN DEL GRUPO
  // ============================================
  
  // Card principal que muestra la información del grupo seleccionado
  groupInfoCard: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    borderColor: COLORS.borderSecondary,
    borderWidth: 1,
    padding: 16,
    marginTop: 16,
    ...SHADOWS.medium,
  },
  
  // Header de la card: contiene el título, descripción e ícono del grupo
  groupInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  
  // Título del grupo (nombre)
  groupInfoTitle: {
    fontSize: FONTS.large,
    fontWeight: '700',
    color: COLORS.textBlack,
  },
  
  // Descripción del grupo (debajo del título)
  groupInfoDescription: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
    marginTop: 4,
  },
  
  // Contenedor del ícono del grupo (círculo con fondo gris)
  groupInfoIcon: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  
  // Contenedor de las estadísticas del grupo (Miembros y Mis Turnos)
  groupInfoStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderGray,
  },
  
  // Cada estadística individual (ícono + label + valor)
  groupInfoStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  
  // Label de la estadística ("Miembros", "Mis Turnos")
  groupInfoStatLabel: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
    marginTop: 4,
  },
  
  // Valor numérico de la estadística
  groupInfoStatValue: {
    fontSize: FONTS.large,
    fontWeight: '700',
    color: COLORS.textBlack,
    marginTop: 4,
  },

  // ============================================
  // TARJETA DE CONTENIDO (Actividad Reciente)
  // ============================================
  
  // Card que contiene la sección "Actividad reciente"
  contentCard: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    borderColor: COLORS.borderSecondary,
    borderWidth: 1,
    padding: 16,
    marginTop: 16,
    ...SHADOWS.medium,
  },
  
  // Título de la sección dentro de la card ("Actividad reciente")
  contentCardTitle: {
    fontSize: FONTS.regular,
    fontWeight: '600',
    color: COLORS.textBlack,
    marginBottom: 12,
  },
  
  // Contenedor para el estado vacío (cuando no hay datos)
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  
  // Texto del estado vacío
  emptyStateText: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
    marginTop: 12,
    textAlign: 'center',
  },

  // ============================================
  // BOTÓN "UNIRME A UN GRUPO"
  // ============================================
  
  // Botón principal para unirse a un grupo mediante código
  joinGroupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
    ...SHADOWS.medium,
  },
  
  // Texto del botón "Unirme a un grupo"
  joinGroupButtonText: {
    fontSize: FONTS.regular,
    fontWeight: '600',
    color: COLORS.primary,
    marginLeft: 8,
  },

  // ============================================
  // MODAL DE UNIRSE A GRUPO
  // ============================================
  
  // Overlay oscuro del modal (fondo semitransparente)
  joinModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  
  // Contenedor principal del modal (card blanca)
  joinModalContainer: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.lg,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    ...SHADOWS.medium,
  },
  
  // Header del modal (título + botón cerrar)
  joinModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  
  // Título del modal "Unirme a un grupo"
  joinModalTitle: {
    fontSize: FONTS.large,
    fontWeight: '700',
    color: COLORS.textBlack,
  },
  
  // Subtítulo descriptivo del modal
  joinModalSubtitle: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
    marginBottom: 20,
    lineHeight: 20,
  },
  
  // Input para ingresar el código de invitación
  codeInput: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    padding: 16,
    fontSize: FONTS.large,
    fontWeight: '700',
    color: COLORS.textBlack,
    textAlign: 'center',
    letterSpacing: 4, // Espaciado entre letras del código
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
    marginBottom: 20,
  },
  
  // Botón de confirmar dentro del modal
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    padding: 16,
  },
  
  // Texto del botón de confirmar
  joinButtonText: {
    fontSize: FONTS.regular,
    fontWeight: '700',
    color: COLORS.textWhite,
    marginLeft: 8,
  },

  // ============================================
  // CARDS DE HISTORIAL RECIENTE
  // ============================================
  
  // Card individual de historial (últimos 3 registros)
  // Diseño idéntico a History.js
  historyCard: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.lg,
    borderColor: COLORS.borderSecondary,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12, // Sombra en Android
  },
  
  // Header de la card: status + fecha
  historyCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSecondary,
  },
  
  // Contenedor del status (ícono + texto)
  historyStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  
  // Texto del status ("Aprobada", "Rechazada", "Pendiente")
  historyStatusText: {
    fontSize: FONTS.medium,
    fontWeight: '600',
  },
  
  // Fecha de la petición (lado derecho del header)
  historyCardDate: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
  },
  
  // Cuerpo de la card con los detalles de la petición
  historyCardBody: {
    gap: 12, // Espacio entre cada fila de detalle
  },
  
  // Cada fila de detalle (ícono + label + valor)
  historyDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  
  // Label del detalle ("Puesto:", "Fecha solicitada:", etc.)
  historyDetailLabel: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
    fontWeight: '500',
  },
  
  // Valor del detalle (información específica)
  historyDetailValue: {
    fontSize: FONTS.small,
    color: COLORS.textBlack,
    flex: 1, // Ocupa el espacio restante
  },
});