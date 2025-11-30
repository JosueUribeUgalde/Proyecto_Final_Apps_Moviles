import { StyleSheet } from 'react-native';
import { COLORS, FONTS, RADIUS,SHADOWS } from '../../../components/constants/theme';

export default StyleSheet.create({
  // ============================================
  // CONTENEDORES PRINCIPALES
  // ============================================
  
  // Contenedor principal de la pantalla
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  // Contenedor del contenido scrolleable con padding
  content: {
    flex: 1,
    padding: 16,
  },
  
  // Contenedor del footer (MenuFooter)
  footerContainer: {
    backgroundColor: COLORS.backgroundWhite,
    width: '100%',
  },

  // ============================================
  // CARDS DEL HISTORIAL
  // ============================================
  
  // Card individual de cada registro del historial
  card: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.lg,
    borderColor: COLORS.borderSecondary,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
...SHADOWS.medium
  },
  
  // Header de la card (estado y fecha)
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSecondary,
  },
  
  // Contenedor del icono y texto del estado
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  
  // Texto del estado (Aprobada, Rechazada, Pendiente)
  statusText: {
    fontSize: FONTS.medium,
    fontWeight: '600',
  },
  
  // Fecha mostrada en el header de la card
  cardDate: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
  },
  
  // Cuerpo de la card con todos los detalles
  cardBody: {
    gap: 12,
  },

  // ============================================
  // FILAS DE DETALLES
  // ============================================
  
  // Fila individual de detalle (icono + label + valor)
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  
  // Label del detalle ("Puesto:", "Fecha:", etc.)
  detailLabel: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
    fontWeight: '500',
  },
  
  // Valor del detalle (información dinámica)
  detailValue: {
    fontSize: FONTS.small,
    color: COLORS.textBlack,
    flex: 1,
  },

  // ============================================
  // ESTADO VACÍO
  // ============================================
  
  // Contenedor del mensaje cuando no hay historial
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  
  // Título del mensaje vacío
  emptyTitle: {
    fontSize: FONTS.large,
    fontWeight: '600',
    color: COLORS.textBlack,
    marginTop: 16,
    marginBottom: 8,
  },
  
  // Texto descriptivo del mensaje vacío
  emptyText: {
    fontSize: FONTS.regular,
    color: COLORS.textGray,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});