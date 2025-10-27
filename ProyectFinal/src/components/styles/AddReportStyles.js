import { StyleSheet } from 'react-native';
import { COLORS,RADIUS,FONTS } from '../constants/theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    width: '100%',
  },
  content: {
    flex: 1,
    width: '85%',
    alignSelf: 'center',

  },
//   bannerContainer: {
//     width: '100%',
//     height: 20,
//     alignItems: 'center',
//   },
  footerContainer: {
    backgroundColor: COLORS.backgroundWhite,
    width: '100%',
  },
  containerFecha: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
    padding: 10,
  },
  containerRazones: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
    padding: 10,
    marginVertical: 15,
  },
  textoFecha: {
    fontSize: FONTS.large,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  tituloSeccion: {
    fontSize: FONTS.large,
    fontWeight: '600',
  },
  containerSelectorFecha: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
    padding: 10,
    marginVertical: 15,
  },
  containerDetalles: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
    padding: 16,
    marginVertical: 15,
  },
  textAreaDetalles: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    padding: 12,
    fontSize: FONTS.regular,
    color: COLORS.textBlack,
    minHeight: 120,
    marginBottom: 12,
  },
  opcionesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  botonAdjuntar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  textoBotonAdjuntar: {
    fontSize: FONTS.regular,
    color: COLORS.textBlack,
    marginLeft: 8,
    fontWeight: '500',
  },
  textoOpcional: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
    marginLeft: 4,
  },
  botonVisibilidad: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
  },
  botonVisibilidadActivo: {
    backgroundColor: COLORS.backgroundSuccess,
    borderColor: COLORS.primary,
  },
  textoVisibilidad: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
    marginLeft: 6,
  },
  textoVisibilidadActivo: {
    color: COLORS.primary,
    fontWeight: '500',
  },
  documentoAdjuntoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: RADIUS.sm,
    marginTop: 12,
    gap: 8,
  },
  nombreDocumento: {
    flex: 1,
    fontSize: FONTS.regular,
    color: COLORS.textBlack,
  },
});