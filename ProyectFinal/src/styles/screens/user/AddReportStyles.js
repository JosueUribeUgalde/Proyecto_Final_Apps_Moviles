import { StyleSheet } from 'react-native';
import { COLORS, RADIUS, FONTS,SHADOWS } from '../../../components/constants/theme';

export default StyleSheet.create({
  // ============================================
  // CONTENEDORES PRINCIPALES
  // ============================================
  
  // Contenedor principal de la pantalla
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    width: '100%',
  },
  
  // Contenedor del contenido scrolleable (85% del ancho)
  content: {
    flex: 1,
    width: '85%',
    alignSelf: 'center',
  },
  
  // Contenedor del footer (MenuFooter)
  footerContainer: {
    backgroundColor: COLORS.backgroundWhite,
    width: '100%',
  },

  // ============================================
  // SECCIÓN DE FECHA Y HORA
  // ============================================
  
  // Contenedor principal de la sección de fecha y hora
  containerFecha: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
    padding: 10,
    marginTop: 20, 
    ...SHADOWS.medium
  },
  
  // Label "Fecha seleccionada:" y "Hora seleccionada:"
  textoFecha: {
    fontSize: FONTS.large,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  
  // Botón selector de fecha/hora (muestra la fecha u hora actual)
  containerSelectorFecha: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
    padding: 10,
    marginVertical: 15,
  },

  // ============================================
  // SECCIÓN DE RAZONES
  // ============================================
  
  // Contenedor de la lista de razones (Enfermedad, Transporte, etc.)
  containerRazones: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
    padding: 10,
    marginVertical: 15,
    ...SHADOWS.medium
  },
  
  // Título de sección ("Reason", "Detalles")
  tituloSeccion: {
    fontSize: FONTS.large,
    fontWeight: '600',
  },

  // ============================================
  // SECCIÓN DE DETALLES
  // ============================================
  
  // Contenedor de la sección de detalles
  containerDetalles: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
    padding: 16,
    marginVertical: 15,
    ...SHADOWS.medium
  },
  
  // TextInput multilinea para descripción del incidente
  textAreaDetalles: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    padding: 12,
    fontSize: FONTS.regular,
    color: COLORS.textBlack,
    minHeight: 120, // Altura mínima para mostrar varias líneas
    maxHeight: 150, // Altura máxima para permitir scroll en el ScrollView principal
    marginBottom: 12,
  },

  

  // ============================================
  // BOTÓN DE ENVÍO
  // ============================================
  
  // Contenedor del botón "Enviar Reporte"
  botonEnviarContainer: {
    marginVertical: 20,
    width: '100%',
    alignItems: 'center',
  },
});