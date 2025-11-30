import { StyleSheet } from 'react-native';
import { COLORS, FONTS, RADIUS, SHADOWS } from '../../../components/constants/theme';

/**
 * ============================================
 * ESTILOS DE LA PANTALLA MEMBERSADMIN
 * ============================================
 * 
 * Gestión de miembros del administrador con:
 * - Búsqueda y filtrado de miembros
 * - CRUD de grupos (crear, editar, eliminar)
 * - Edición de información de miembros
 * - Sistema de invitaciones
 * - Visualización de horarios y disponibilidad
 */

export default StyleSheet.create({
  // ============================================
  // CONTENEDORES PRINCIPALES
  // ============================================

  // Contenedor principal de toda la pantalla
  container: {
    flex: 1,
    backgroundColor: COLORS.background, // Fondo gris claro
  },

  // Contenedor del banner de notificaciones en la parte superior
  bannerContainer: {
    width: '100%',
    height: 60,
    alignItems: 'center',
  },

  // Contenedor del FlatList con padding lateral
  flatListContent: {
    width: '90%',
    alignSelf: 'center',
    paddingBottom: 16, // Espacio inferior para evitar que el footer tape contenido
  },

  // Contenedor del footer con el menú de navegación del administrador
  footerContainer: {
    backgroundColor: COLORS.backgroundWhite,
    width: '100%',
  },

  // ============================================
  // SECCIÓN DE BÚSQUEDA
  // ============================================

  // Tarjeta contenedora del directorio de búsqueda (no utilizada actualmente, pero definida)
  directoryCard: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
    ...SHADOWS.medium,
  },

  // Título principal "Buscar un miembro" centrado
  directoryTitle: {
    fontSize: FONTS.large,
    fontWeight: '700',
    color: COLORS.textBlack,
    textAlign: 'center',
    marginBottom: 12,
    marginTop: 8,
  },

  // Contenedor de la barra de búsqueda con ícono
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8, // Espacio entre ícono y texto
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
    marginBottom: 24,
    ...SHADOWS.medium,
  },

  // Campo de texto para buscar miembros por nombre
  searchInput: {
    flex: 1,
    fontSize: FONTS.regular,
    color: COLORS.textBlack,
  },

  // ============================================
  // ENCABEZADOS DE SECCIÓN
  // ============================================

  // Contenedor de encabezado centrado (usado para "Miembros Activos" y resultados de búsqueda)
  sectionHeaderCentered: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 12,
  },

  // Título de sección en negrita y centrado
  sectionTitleCentered: {
    fontSize: FONTS.large,
    fontWeight: '700',
    color: COLORS.textBlack,
    textAlign: 'center',
  },

  // ============================================
  // BOTONES DE ACCIONES DE GRUPOS
  // ============================================

  // Contenedor de botones que se distribuyen en filas (Crear, Editar, Eliminar, Agregar Miembro)
  groupActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Permite que los botones se envuelvan en múltiples líneas
    gap: 8,
    marginBottom: 16,
  },

  // Estilo base para todos los botones de acciones de grupo
  groupActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6, // Espacio entre ícono y texto
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: RADIUS.sm,
    flex: 1,
    minWidth: '48%', // Asegura que haya máximo 2 botones por fila
    ...SHADOWS.medium,
  },

  // Botón "Crear Grupo" - Fondo blanco con borde
  createGroupButton: {
    backgroundColor: COLORS.backgroundWhite,
    borderColor: COLORS.borderSecondary,
    borderWidth: 1,
  },

  // Texto verde del botón "Crear Grupo"
  createGroupButtonText: {
    color: COLORS.textGreen,
    fontSize: FONTS.regular,
    fontWeight: '600',
  },

  // Botón "Editar Grupo" - Aparece solo cuando hay grupo seleccionado
  editGroupButton: {
    backgroundColor: COLORS.backgroundWhite,
    borderColor: COLORS.borderSecondary,
    borderWidth: 1,
  },

  // Texto verde del botón "Editar Grupo"
  editGroupButtonText: {
    color: COLORS.textGreen,
    fontSize: FONTS.regular,
    fontWeight: '600',
  },

  // Botón "Eliminar Grupo" - Aparece solo cuando hay grupo seleccionado
  deleteGroupButton: {
    backgroundColor: COLORS.backgroundWhite,
    borderColor: COLORS.borderSecondary,
    borderWidth: 1,
  },

  // Texto rojo del botón "Eliminar Grupo"
  deleteGroupButtonText: {
    color: COLORS.error,
    fontSize: FONTS.regular,
    fontWeight: '600',
  },

  // Botón "Agregar Miembro" - Abre modal para compartir código de invitación
  shareGroupButton: {
    backgroundColor: COLORS.backgroundWhite,
    borderColor: COLORS.borderSecondary,
    borderWidth: 1,
  },

  // Texto verde del botón "Agregar Miembro"
  shareGroupButtonText: {
    color: COLORS.textGreen,
    fontSize: FONTS.regular,
    fontWeight: '600',
  },

  // ============================================
  // ESTADO VACÍO
  // ============================================

  // Contenedor centrado cuando no hay miembros en el grupo seleccionado
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },

  // Mensaje de texto cuando no hay miembros para mostrar
  emptyStateText: {
    fontSize: FONTS.regular,
    color: COLORS.textGray,
    marginTop: 12,
  },

  // ============================================
  // TARJETA DE MIEMBRO INDIVIDUAL
  // ============================================

  // Contenedor principal de cada tarjeta de miembro en la lista
  memberCard: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    borderColor: COLORS.borderSecondary,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
    ...SHADOWS.medium,
  },

  // Sección superior de la tarjeta con avatar, nombre y botón de opciones
  memberHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },

  // Contenedor que agrupa avatar circular y detalles del miembro
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    gap: 12,
  },

  // Avatar circular con iniciales del miembro (fondo verde claro)
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Contenedor de información textual (nombre, grupo, días, horario, experiencia)
  memberDetails: {
    flex: 1,
  },

  // Fila que contiene nombre y grupo del miembro en línea
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },

  // Nombre del miembro en negrita
  memberName: {
    fontSize: FONTS.regular,
    fontWeight: '700',
    color: COLORS.textBlack,
  },

  // Nombre del grupo al que pertenece (texto gris con separador "•")
  memberGroup: {
    fontSize: FONTS.regular,
    fontWeight: '400',
    color: COLORS.textGray,
  },

  // Días de disponibilidad del miembro (usado para mostrar "Días: ...")
  memberShift: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
    marginTop: 4,
  },

  // Horario de trabajo y años de experiencia del miembro
  memberExperience: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
    marginTop: 2,
  },

  // Botón de tres puntos (...) para abrir opciones de edición
  moreButton: {
    padding: 4,
  },

  // ============================================
  // PIE DE TARJETA DE MIEMBRO (BADGES DE ESTADO)
  // ============================================

  // Sección inferior de la tarjeta que muestra badge de estado
  memberFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },

  // Estilo base del badge de estado con bordes redondeados
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
    ...SHADOWS.medium,
  },

  // Estado "Disponible" - Fondo verde claro
  statusAvailable: {
    backgroundColor: '#E8F5E9',
  },

  // Estado "Libre hoy" - Fondo gris
  statusOff: {
    backgroundColor: '#F5F5F5',
  },

  // Estado "Permiso solicitado" - Fondo amarillo claro
  statusLeave: {
    backgroundColor: '#FFF4E5',
  },

  // Estado por defecto cuando no coincide con ninguno anterior
  statusDefault: {
    backgroundColor: COLORS.secondary,
  },

  // Texto del estado dentro del badge
  statusText: {
    fontSize: FONTS.small,
    fontWeight: '600',
    color: COLORS.textBlack,
  },

  // Contenedor para mostrar información de turnos (no utilizado actualmente)
  shiftsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  // Texto de turnos (no utilizado actualmente)
  shiftsText: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
  },

  // ============================================
  // TARJETA DE DISTRIBUCIÓN DE ROLES
  // ============================================

  // Tarjeta que muestra resumen de grupos y cantidad de miembros
  distributionCard: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    borderColor: COLORS.borderSecondary,
    borderWidth: 1,
    padding: 16,
    marginTop: 8,
    marginBottom: 24,
    ...SHADOWS.medium,
  },

  // Header de la tarjeta con título "Distribución de Roles"
  distributionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  // Título "Distribución de Roles" en negrita
  distributionTitle: {
    fontSize: FONTS.large,
    fontWeight: '700',
    color: COLORS.textBlack,
  },

  // Texto adicional "Reportes" (no utilizado actualmente)
  viewAllText: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
    fontWeight: '500',
  },

  // Fila individual de cada grupo con separador inferior
  distributionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderGray,
  },

  // Nombre del grupo (ej: "Recepción", "Cocina")
  groupName: {
    fontSize: FONTS.regular,
    color: COLORS.textBlack,
    fontWeight: '500',
  },

  // Cantidad de miembros en el grupo (ej: "12 miembros")
  groupCount: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
  },

  // ============================================
  // MODALES BÁSICOS (Crear, Editar, Eliminar Grupo)
  // ============================================

  // Fondo oscuro semitransparente que cubre toda la pantalla detrás del modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Negro con 50% de opacidad
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Contenedor blanco del modal con bordes redondeados
  modalContent: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    padding: 24,
    width: '85%',
    maxWidth: 400,
    ...SHADOWS.dark,
  },

  // Título del modal (ej: "Crear Nuevo Grupo", "Editar Grupo")
  modalTitle: {
    fontSize: FONTS.large,
    fontWeight: '700',
    color: COLORS.textBlack,
    marginBottom: 16,
    textAlign: 'center',
  },

  // Texto descriptivo debajo del título (usado en algunos modales)
  modalDescription: {
    fontSize: FONTS.regular,
    color: COLORS.textGray,
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 22,
  },

  // Contenedor que agrupa etiqueta e input en modales de formulario
  modalInputContainer: {
    marginBottom: 20,
  },

  // Etiqueta de campo (ej: "Nombre del Grupo", "Descripción")
  modalLabel: {
    fontSize: FONTS.small,
    fontWeight: '600',
    color: COLORS.textBlack,
    marginBottom: 8,
  },

  // Campo de texto del modal para ingresar información
  modalInput: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.sm,
    padding: 12,
    fontSize: FONTS.regular,
    color: COLORS.textBlack,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
  },

  // Contenedor de botones inferior (generalmente Cancelar y Confirmar)
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },

  // Estilo base para todos los botones del modal
  modalButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: RADIUS.sm,
  },

  // Botón "Cancelar" con fondo blanco y borde
  modalButtonCancel: {
    backgroundColor: COLORS.backgroundWhite,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
  },

  // Texto rojo del botón "Cancelar"
  modalButtonTextCancel: {
    color: COLORS.error,
    fontSize: FONTS.regular,
    fontWeight: '600',
  },

  // Botón "Confirmar" con fondo blanco y borde
  modalButtonConfirm: {
    backgroundColor: COLORS.backgroundWhite,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
  },

  // Texto verde del botón "Confirmar"
  modalButtonTextConfirm: {
    color: COLORS.textGreen,
    fontSize: FONTS.regular,
    fontWeight: '600',
  },

  // Botón "Eliminar" con fondo rojo (usado en modal de confirmación de eliminación)
  modalButtonDelete: {
    backgroundColor: COLORS.error,
  },

  // Texto blanco del botón "Eliminar"
  modalButtonTextDelete: {
    color: COLORS.textWhite,
    fontSize: FONTS.regular,
    fontWeight: '600',
  },

  // ============================================
  // LISTA DE SELECCIÓN DE GRUPOS (Modales Editar/Eliminar)
  // ============================================

  // ScrollView scrollable que contiene la lista de grupos disponibles
  groupSelectList: {
    maxHeight: 200, // Limita altura para permitir scroll si hay muchos grupos
    marginTop: 8,
  },

  // Línea separadora entre sección de título y lista de grupos
  groupSelectListSeparator: {
    height: 1,
    backgroundColor: COLORS.borderSecondary,
    marginVertical: 8,
  },

  // Tarjeta individual de cada grupo en la lista de selección
  groupSelectItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
    marginBottom: 8,
    backgroundColor: COLORS.backgroundWhite,
    ...SHADOWS.medium,
  },

  // Estado activo del grupo seleccionado (fondo azul)
  groupSelectItemActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  // Nombre del grupo en la lista
  groupSelectText: {
    fontSize: FONTS.regular,
    color: COLORS.textBlack,
    fontWeight: '500',
  },

  // Texto del grupo seleccionado (color blanco)
  groupSelectTextActive: {
    color: COLORS.textWhite,
  },

  // Contador de miembros (no visible cuando está activo)
  groupSelectCount: {
    fontSize: FONTS.small,
    color: COLORS.textWhite,
  },

  // ============================================
  // CAJAS DE ADVERTENCIA
  // ============================================

  // Caja de advertencia genérica con fondo rojo claro (usada en modales)
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFE5E5', // Rojo muy claro
    padding: 12,
    borderRadius: RADIUS.sm,
    marginTop: 12,
  },

  // Texto de advertencia en rojo
  warningText: {
    flex: 1,
    fontSize: FONTS.small,
    color: COLORS.textRed,
    lineHeight: 18,
  },

  // Banner prominente de advertencia (información incompleta de miembros)
  warningBannerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#faecd8ff', // Amarillo claro
    padding: 12,
    borderRadius: RADIUS.sm,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e63434a1', // Borde rojo semi-transparente
  },

  // Ícono de advertencia a la izquierda del banner
  warningIcon: {
    marginRight: 12,
  },

  // Contenedor del texto del banner (título + descripción)
  warningTextContainer: {
    flex: 1,
  },

  // Título del banner en rojo y negrita
  warningTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fc0000ff', // Rojo brillante
    marginBottom: 2,
  },

  // Descripción explicativa del banner
  warningDescription: {
    fontSize: FONTS.small,
    color: COLORS.textBlack,
    lineHeight: 16,
  },

  // ============================================
  // MODAL DE GESTIÓN DE GRUPOS
  // ============================================

  // Contenedor vertical de botones en modal "Gestionar Grupos"
  manageGroupsButtons: {
    gap: 12,
    marginTop: 12,
  },

  // Estilo base para botones del modal de gestión (con ícono + texto)
  manageGroupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12, // Espacio entre ícono y texto
    padding: 16,
    borderRadius: RADIUS.sm,
    ...SHADOWS.medium,
  },

  // Botón "Crear Grupo" con fondo azul primario
  createButton: {
    backgroundColor: COLORS.primary,
  },

  // Botón "Editar Grupo" con fondo azul claro
  editButton: {
    backgroundColor: '#4A90E2',
  },

  // Botón "Eliminar Grupo" con fondo rojo
  deleteButton: {
    backgroundColor: COLORS.error,
  },

  // Botón "Agregar Miembro" con fondo morado
  shareButton: {
    backgroundColor: '#7B68EE',
  },

  // Texto blanco de todos los botones de gestión
  manageGroupButtonText: {
    color: COLORS.textWhite,
    fontSize: FONTS.regular,
    fontWeight: '600',
  },

  // ============================================
  // MODAL DE COMPARTIR (Agregar Miembro)
  // ============================================

  // Contenedor de opciones en el modal de compartir
  shareOptions: {
    gap: 12,
  },

  // Tarjeta individual de cada opción (Compartir Código, Ver Código)
  shareOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12, // Espacio entre ícono y texto
    padding: 16,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.backgroundWhite,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
    ...SHADOWS.medium,
  },

  // Texto de la opción de compartir
  shareOptionText: {
    fontSize: FONTS.regular,
    color: COLORS.textBlack,
    fontWeight: '500',
  },

  // Botón "Cerrar" en la parte inferior del modal de compartir
  shareCloseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.backgroundWhite,
    marginTop: 16,
    borderColor: COLORS.borderSecondary,
    borderWidth: 1,
    ...SHADOWS.medium,
  },

  // Texto rojo del botón "Cerrar"
  shareCloseButtonText: {
    fontSize: FONTS.regular,
    color: COLORS.error,
    fontWeight: '600',
  },

  // ============================================
  // MODAL DE CÓDIGO DE INVITACIÓN
  // ============================================

  // Contenedor centrado del ícono superior del modal de invitación
  inviteModalIconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },

  // Caja destacada que contiene el código de invitación alfanumérico
  inviteCodeContainer: {
    backgroundColor: COLORS.backgroundGray,
    padding: 20,
    borderRadius: RADIUS.md,
    marginVertical: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
    borderStyle: 'solid',
  },

  // Código de invitación en fuente monoespaciada grande y azul
  inviteCodeText: {
    fontSize: FONTS.big,
    fontWeight: 'bold',
    color: COLORS.primary,
    letterSpacing: 4, // Espaciado entre letras para mayor legibilidad
    fontFamily: 'monospace',
  },

  // Contenedor de información con fondo azul claro (instrucciones de uso)
  inviteInfoContainer: {
    backgroundColor: COLORS.backgroundLightBlue,
    padding: 12,
    borderRadius: RADIUS.sm,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Texto de instrucciones para compartir el código
  inviteInfoText: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
    flex: 1,
  },

  // Botón azul para cerrar el modal de invitación
  inviteCloseButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: RADIUS.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Texto blanco del botón de cerrar
  inviteCloseButtonText: {
    color: COLORS.textWhite,
    fontSize: FONTS.regular,
    fontWeight: '600',
  },

  // ============================================
  // MODAL DE EDICIÓN DE MIEMBRO (Full Screen)
  // ============================================

  // Fondo oscuro semitransparente del modal de edición
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Contenedor principal del modal de edición (ocupa 90% de la pantalla)
  modalContainer: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    padding: 20,
    width: '90%',
    maxHeight: '85%', // Permite scroll si el contenido es muy largo
    ...SHADOWS.dark,
  },

  // Header con título y botón de cerrar (X)
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  // Título del modal (ej: "Editar Información de Juan Pérez")
  modalTitleLarge: {
    fontSize: FONTS.large,
    fontWeight: '700',
    color: COLORS.textBlack,
    flex: 1,
  },

  // Contenido scrolleable del modal con formularios
  modalScrollContent: {
    paddingBottom: 16,
  },

  // Tarjeta blanca que agrupa cada sección (Información Laboral, Horarios, etc.)
  sectionCard: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
    ...SHADOWS.medium,
  },

  // Título de cada sección (ej: "Información laboral", "Horarios de trabajo")
  sectionTitle: {
    fontSize: FONTS.large,
    fontWeight: '700',
    color: COLORS.textBlack,
    marginBottom: 16,
  },

  // Etiqueta de cada campo de formulario (ej: "Puesto", "Experiencia")
  fieldLabel: {
    fontSize: FONTS.small,
    fontWeight: '600',
    color: COLORS.textBlack,
    marginTop: 12,
    marginBottom: 8,
  },

  // Campo de texto editable para ingresar información
  fieldInput: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.sm,
    padding: 12,
    fontSize: FONTS.regular,
    color: COLORS.textBlack,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
  },

  // Fila que contiene múltiples campos uno al lado del otro
  fieldRow: {
    flexDirection: 'row',
    gap: 12, // Espacio entre columnas
  },

  // Columna individual dentro de una fila (flex: 1 para distribución equitativa)
  fieldColumn: {
    flex: 1,
  },

  // Contenedor de chips seleccionables (días de la semana)
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Permite que los chips se envuelvan en múltiples líneas
    gap: 8,
  },

  // Chip individual (ej: "Lun", "Mar", "Mié")
  areaChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999, // Bordes completamente redondeados
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
    backgroundColor: COLORS.backgroundWhite,
  },

  // Chip seleccionado con fondo azul
  areaChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  // Texto del chip no seleccionado
  areaChipText: {
    fontSize: FONTS.small,
    color: COLORS.textBlack,
    fontWeight: '500',
  },

  // Texto del chip seleccionado (color blanco)
  areaChipTextActive: {
    color: COLORS.textWhite,
  },

  // Contenedor de botones apilados verticalmente al final del modal
  modalButtonsColumn: {
    gap: 12,
    marginTop: 16,
  },

  // Botón primario azul ("Guardar Cambios")
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.primary,
    ...SHADOWS.medium,
  },

  // Texto blanco del botón primario
  primaryButtonText: {
    color: COLORS.textWhite,
    fontSize: FONTS.regular,
    fontWeight: '600',
  },

  // Botón rojo para remover miembro del grupo
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.error,
    ...SHADOWS.medium,
  },

  // Texto blanco del botón de remover
  removeButtonText: {
    color: COLORS.textWhite,
    fontSize: FONTS.regular,
    fontWeight: '600',
  },
});
