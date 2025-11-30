import { StyleSheet } from 'react-native';
import { COLORS } from '../../../components/constants/theme';

export default StyleSheet.create({
  // Fondo oscuro del modal
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Contenedor principal del modal
  modalContainer: {
    width: '95%',
    height: '90%',
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  
  // Header del modal con título y botón cerrar
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSecondary,
  },
  
  // Título del modal
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textBlack,
  },
  
  // Botón X para cerrar modal
  closeButton: {
    padding: 4,
  },
  
  // Contenedor de las 3 opciones iniciales
  optionsContainer: {
    gap: 12,
  },
  
  // Botón de cada opción (Manual, IA, Sin asignar)
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
    gap: 12,
  },
  
  // Círculo con ícono de cada opción
  optionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Estilo cuando la opción está deshabilitada
  optionIconContainerDisabled: {
    backgroundColor: COLORS.borderSecondary,
  },
  
  // Contenedor de título y subtítulo de cada opción
  optionTextContainer: {
    flex: 1,
  },
  
  // Título de cada opción
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textBlack,
    marginBottom: 4,
  },
  
  // Subtítulo de cada opción
  optionSubtitle: {
    fontSize: 14,
    color: COLORS.textGray,
  },
  
  // Subtítulo cuando la opción está deshabilitada
  optionSubtitleDisabled: {
    fontStyle: 'italic',
  },

  // Contenedor de selección manual de miembros
  selectionContainer: {
    flex: 1,
  },
  
  // ScrollView para lista de miembros
  scrollView: {
    flex: 1,
  },
  
  // Contenido del ScrollView con padding
  scrollContent: {
    paddingTop: 8,
    paddingBottom: 100,
    paddingHorizontal: 4,
  },

  // Contenedor de la lista de miembros
  membersContainer: {
    paddingBottom: 20,
  },
  
  // Título "Miembros Disponibles"
  membersTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textBlack,
    marginBottom: 12,
    marginTop: 8,
  },
  
  // Título "Otros Miembros"
  availabilityLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textGray,
    marginTop: 16,
    marginBottom: 12,
  },
  
  // Contenedor de loading (spinner)
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Texto de cargando
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.textGray,
  },
  
  // Contenedor cuando no hay miembros
  emptyMembersContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Texto de "No hay miembros disponibles"
  emptyMembersText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.textGray,
    textAlign: 'center',
  },

  // Card de cada miembro
  memberCard: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  
  // Header de la card (nombre + badge de estado)
  memberCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  
  // Contenedor de nombre y posición del miembro
  memberInfo: {
    flex: 1,
  },
  
  // Nombre del miembro
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textBlack,
    marginBottom: 4,
  },
  
  // Posición del miembro
  memberPosition: {
    fontSize: 14,
    color: COLORS.textGray,
  },
  
  // Badge de estado (Disponible/Ocupado)
  memberStatus: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginLeft: 8,
  },
  
  // Badge verde cuando está disponible
  memberStatusAvailable: {
    backgroundColor: '#E8F5E9',
  },
  
  // Badge rojo cuando está ocupado
  memberStatusBusy: {
    backgroundColor: '#FFEBEE',
  },
  
  // Texto del badge de estado
  memberStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  
  // Texto verde del badge disponible
  memberStatusAvailableText: {
    color: '#2E7D32',
  },
  
  // Texto rojo del badge ocupado
  memberStatusBusyText: {
    color: '#C62828',
  },
  
  // Contenedor de detalles del miembro (horario, días)
  memberDetails: {
    marginBottom: 8,
    gap: 6,
  },
  
  // Fila de cada detalle
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  
  // Label del detalle (ej: "Horario:")
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textGray,
  },
  
  // Valor del detalle
  detailValue: {
    fontSize: 14,
    color: COLORS.textBlack,
    flex: 1,
  },
  
  // Valor cuando no está disponible (N/A)
  detailValueUnavailable: {
    color: COLORS.textGray,
    fontStyle: 'italic',
  },

  // Botón "Pedir Sustitución" dentro de cada card
  requestSubstitutionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
    marginTop: 4,
  },
  
  // Botón deshabilitado cuando el miembro no está disponible
  requestSubstitutionButtonDisabled: {
    backgroundColor: COLORS.borderSecondary,
    opacity: 0.6,
  },
  
  // Texto del botón "Pedir Sustitución"
  requestSubstitutionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.backgroundWhite,
  },

  // Contenedor de botones de acción en el footer
  actionsContainer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSecondary,
    gap: 12,
  },
  
  // Estilo base para todos los botones de acción
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
  },
  
  // Botón confirmar (verde)
  confirmButton: {
    backgroundColor: COLORS.primary,
  },
  
  // Texto del botón confirmar
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textWhite,
  },
  
  // Botón cancelar/secundario (borde)
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
  },
  
  // Texto del botón cancelar
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textGreen,
  },

  // Contenedor principal de la sugerencia de IA
  aiContainer: {
    flex: 1,
  },
  
  // Card de la sugerencia de IA con borde destacado
  aiSuggestionCard: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  
  // Header de la sugerencia con ícono de sparkles
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSecondary,
  },
  
  // Texto "Recomendación"
  aiHeaderText: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.primary,
  },
  
  // Badge de nivel de confianza (Alta/Media/Baja)
  aiConfidenceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: COLORS.secondary,
    gap: 6,
    marginBottom: 16,
  },
  
  // Texto del badge de confianza
  aiConfidenceText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textBlack,
  },
  
  // Nombre del miembro sugerido (grande y destacado)
  aiMemberName: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textBlack,
    marginBottom: 16,
  },
  
  // Contenedor de la explicación de la IA
  aiReasonContainer: {
    flexDirection: 'row',
    gap: 10,
    padding: 16,
    backgroundColor: COLORS.secondary,
    borderRadius: 12,
    marginBottom: 20,
  },
  
  // Texto de la razón/explicación de la IA
  aiReason: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.textBlack,
  },
  
  // Contenedor de botones de acción de IA
  aiActionsContainer: {
    gap: 12,
  },
  
  // Botón "Volver"
  backButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
    paddingVertical: 12,
  },
  
  // Texto del botón "Volver"
  backButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textGreen,
  },
});
