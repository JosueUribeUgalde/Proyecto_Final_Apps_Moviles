// ============================================
// IMPORTS
// ============================================

// 1. Paquetes core de React/React Native
import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, Pressable, Modal, FlatList, ActivityIndicator } from "react-native";

// 2. Bibliotecas de terceros
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';

// 3. Componentes propios
import { HeaderScreen, MenuFooterAdmin, ButtonRequest } from "../../components";
import InfoModal from "../../components/InfoModal";
import ReplacementModal from "../../components/ReplacementModal";
import NotificationsModal from "../../components/NotificationsModal";

// 4. Constantes y utilidades
import { COLORS } from '../../components/constants/theme';

// 5. Servicios de Firebase
import { getCurrentUser } from "../../services/authService";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { getPeticionesByIds, rejectPeticion } from "../../services/peticionService";
import { calculateTotalShiftsWorked } from "../../services/groupService";
import { getAdminNotifications } from "../../services/notificationService";
import { setBadgeCount } from "../../services/pushNotificationService";

// 6. Estilos
import styles from "../../styles/screens/admin/DashboardAdminStyles";
import CalendarAdminStyles from "../../styles/screens/admin/CalendarAdminStyles";

/**
 * DashboardAdmin - Pantalla principal del administrador
 * 
 * Funcionalidades:
 * - Visualización de métricas del grupo (miembros, turnos, solicitudes)
 * - Selector de grupos asignados al administrador
 * - Lista de solicitudes de ausencia pendientes
 * - Aprobación/rechazo de solicitudes con asignación de reemplazo
 * - Actualización en tiempo real de estadísticas
 */
export default function DashboardAdmin({ navigation }) {
  // ============================================
  // ESTADOS
  // ============================================

  // Control de carga inicial de datos
  const [loading, setLoading] = useState(true);
  
  // Datos del administrador logueado (perfil completo desde Firebase)
  const [adminData, setAdminData] = useState(null);

  // Grupo actualmente seleccionado por el administrador
  const [selectedGroup, setSelectedGroup] = useState(null);
  
  // Control de visibilidad del modal de selección de grupos
  const [showGroupSelectModal, setShowGroupSelectModal] = useState(false);

  // Lista de todos los grupos asignados al administrador
  const [groups, setGroups] = useState([]);

  // Lista de solicitudes de ausencia con estado "Pendiente" del grupo seleccionado
  const [pendingRequests, setPendingRequests] = useState([]);
  
  // ID de la solicitud que se está procesando actualmente (para deshabilitar botones)
  const [processingRequest, setProcessingRequest] = useState(null);

  // Estados para el modal de información general (confirmaciones/errores)
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoModalTitle, setInfoModalTitle] = useState('');
  const [infoModalMessage, setInfoModalMessage] = useState('');

  // Estados para el modal de selección de reemplazo
  const [showReplacementModal, setShowReplacementModal] = useState(false);
  const [requestForReplacement, setRequestForReplacement] = useState(null);

  // Estados para notificaciones
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // ============================================
  // EFECTOS
  // ============================================

  /**
   * Carga los datos del administrador al montar el componente
   */
  useEffect(() => {
    loadAdminData();
    loadNotifications();
  }, []);

  // ============================================
  // FUNCIONES DE NOTIFICACIONES
  // ============================================

  /**
   * Carga las notificaciones del administrador
   */
  const loadNotifications = async () => {
    try {
      const user = getCurrentUser();
      if (user) {
        const notifications = await getAdminNotifications(user.uid);
        const unread = notifications.filter(n => !n.read).length;
        setUnreadCount(unread);
        await setBadgeCount(unread);
      }
    } catch (error) {
      console.error('Error al cargar notificaciones:', error);
    }
  };

  // ============================================
  // FUNCIONES DE CARGA DE DATOS
  // ============================================

  /**
   * Carga los datos principales del administrador:
   * 1. Obtiene el perfil del administrador desde Firebase
   * 2. Carga todos los grupos asignados al administrador
   */
  const loadAdminData = async () => {
    try {
      // Obtener usuario actualmente autenticado
      const user = getCurrentUser();
      if (!user) {
        console.error("No hay sesión activa");
        setLoading(false);
        return;
      }

      // Obtener documento del administrador desde Firestore
      const adminDoc = await getDoc(doc(db, "admins", user.uid));

      if (adminDoc.exists()) {
        const data = adminDoc.data();
        setAdminData(data);

        // Cargar grupos asignados si existen
        if (data.groupIds && data.groupIds.length > 0) {
          await loadAdminGroups(data.groupIds);
        } else {
          // Si no tiene grupos, inicializar array vacío
          setGroups([]);
        }
      } else {
        console.error("No se encontraron datos del administrador");
      }
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Carga los grupos asignados al administrador
   * @param {Array<string>} groupIds - IDs de los grupos a cargar
   */
  const loadAdminGroups = async (groupIds) => {
    try {
      if (!groupIds || groupIds.length === 0) {
        setGroups([]);
        return;
      }

      // Obtener datos completos de cada grupo desde Firestore
      const groupsData = [];
      for (const groupId of groupIds) {
        const groupDoc = await getDoc(doc(db, "groups", groupId));
        if (groupDoc.exists()) {
          groupsData.push({
            id: groupDoc.id,
            ...groupDoc.data()
          });
        }
      }

      setGroups(groupsData);
    } catch (error) {
      console.error("Error al cargar grupos:", error);
      setGroups([]);
    }
  };

  /**
   * Carga las peticiones pendientes y estadísticas de un grupo específico
   * @param {string} groupId - ID del grupo seleccionado
   * 
   * Funcionalidades:
   * - Obtiene solicitudes de ausencia pendientes del grupo
   * - Calcula turnos totales trabajados por todos los miembros
   * - Actualiza estadísticas del grupo en tiempo real
   */
  const loadGroupPeticiones = async (groupId) => {
    try {
      // Obtener documento actualizado del grupo
      const groupDoc = await getDoc(doc(db, "groups", groupId));
      if (!groupDoc.exists()) return;

      const groupData = groupDoc.data();

      // Cargar y filtrar peticiones pendientes
      if (groupData.peticionesPendientesIds && groupData.peticionesPendientesIds.length > 0) {
        const peticiones = await getPeticionesByIds(groupData.peticionesPendientesIds);
        // Solo mostrar las que tienen estado "Pendiente"
        const pendientes = peticiones.filter(p => p.status === 'Pendiente');
        setPendingRequests(pendientes);
      } else {
        setPendingRequests([]);
      }
    } catch (error) {
      console.error("Error al cargar peticiones del grupo:", error);
      setPendingRequests([]);
    }
  };

  // ============================================
  // HANDLERS DE EVENTOS
  // ============================================

  /**
   * Maneja el clic en el botón "Aprobar" de una solicitud
   * Abre el modal de selección de reemplazo en lugar de aprobar directamente
   * @param {Object} request - Solicitud de ausencia a aprobar
   */
  const handleApprove = async (request) => {
    // Prevenir múltiples clics simultáneos
    if (processingRequest) return;

    try {
      setProcessingRequest(request.id);
      // Guardar solicitud y abrir modal para seleccionar reemplazo
      setRequestForReplacement(request);
      setShowReplacementModal(true);
    } catch (error) {
      console.error("Error:", error);
      setInfoModalTitle('Error');
      setInfoModalMessage('Error al procesar la solicitud. Inténtalo de nuevo.');
      setShowInfoModal(true);
      setProcessingRequest(null);
    }
  };

  /**
   * Callback ejecutado cuando se aprueba exitosamente una solicitud con/sin reemplazo
   * @param {string|null} selectedMemberId - ID del miembro seleccionado como reemplazo (null si no hay)
   * 
   * Acciones:
   * - Recarga peticiones pendientes del grupo
   * - Actualiza estadísticas del grupo
   * - Muestra mensaje de confirmación
   */
  const handleReplacementSuccess = async (selectedMemberId) => {
    try {
      // Recargar datos actualizados del grupo
      if (selectedGroup) {
        await loadGroupPeticiones(selectedGroup.id);
        
        // Actualizar contadores del grupo seleccionado
        const groupDoc = await getDoc(doc(db, "groups", selectedGroup.id));
        if (groupDoc.exists()) {
          setSelectedGroup({
            id: groupDoc.id,
            ...groupDoc.data()
          });
        }
      }

      // Mostrar mensaje de éxito
      setInfoModalTitle('¡Aprobada!');
      setInfoModalMessage(
        selectedMemberId
          ? 'Solicitud aprobada. Solicitud de sustitución enviada.'
          : 'Solicitud aprobada sin asignar remplazo.'
      );
      setShowInfoModal(true);
    } catch (error) {
      console.error("Error al recargar datos:", error);
      setInfoModalTitle('Error');
      setInfoModalMessage('Error al procesar la solicitud. Inténtalo de nuevo.');
      setShowInfoModal(true);
    }
  };

  /**
   * Maneja el rechazo de una solicitud de ausencia
   * @param {Object} request - Solicitud a rechazar
   * 
   * Acciones:
   * - Actualiza estado de la petición a "Rechazada" en Firestore
   * - Elimina la petición de la lista de pendientes del grupo
   * - Recarga datos actualizados
   * - Muestra mensaje de confirmación
   */
  const handleReject = async (request) => {
    // Prevenir múltiples clics simultáneos
    if (processingRequest) return;

    try {
      setProcessingRequest(request.id);
      // Rechazar petición en Firestore
      await rejectPeticion(request.id, request.groupId);

      setInfoModalTitle('Rechazada');
      setInfoModalMessage('Solicitud rechazada correctamente');
      setShowInfoModal(true);

      // Recargar datos actualizados del grupo
      if (selectedGroup) {
        await loadGroupPeticiones(selectedGroup.id);
        
        // Actualizar contadores del grupo
        const groupDoc = await getDoc(doc(db, "groups", selectedGroup.id));
        if (groupDoc.exists()) {
          setSelectedGroup({
            id: groupDoc.id,
            ...groupDoc.data()
          });
        }
      }
    } catch (error) {
      console.error("Error al rechazar:", error);
      setInfoModalTitle('Error');
      setInfoModalMessage('Error al rechazar la solicitud. Inténtalo de nuevo.');
      setShowInfoModal(true);
    } finally {
      setProcessingRequest(null);
    }
  };

  /**
   * Maneja la selección de un grupo desde el modal
   * @param {Object} group - Grupo seleccionado
   * 
   * Acciones:
   * - Actualiza grupo seleccionado
   * - Cierra modal de selección
   * - Carga peticiones pendientes del nuevo grupo
   */
  const handleGroupSelect = async (group) => {
    setSelectedGroup(group);
    setShowGroupSelectModal(false);
    // Cargar peticiones del grupo recién seleccionado
    await loadGroupPeticiones(group.id);
  };

  // ============================================
  // RENDERIZADO - PANTALLA DE CARGA
  // ============================================

  /**
   * Muestra indicador de carga mientras se obtienen los datos iniciales
   */
  if (loading) {
    return (
      <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
        <HeaderScreen
          title="Admin Dashboard"
          rightIcon={<Ionicons name="notifications-outline" size={24} color={COLORS.textBlack} />}
          onRightPress={() => setShowNotifications(true)}
          badgeCount={unreadCount}
        />
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={{ marginTop: 16, color: COLORS.textGray }}>
            Cargando datos...
          </Text>
        </View>
        <View style={styles.footerContainer}>
          <MenuFooterAdmin />
        </View>
      </SafeAreaView>
    );
  }

  // ============================================
  // RENDERIZADO PRINCIPAL
  // ============================================

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <HeaderScreen
        title="Admin Dashboard"
        rightIcon={<Ionicons name="notifications-outline" size={24} color={COLORS.textBlack} />}
        onRightPress={() => setShowNotifications(true)}
        badgeCount={unreadCount}
      />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ========================================
            SELECTOR DE GRUPOS
            Permite al administrador cambiar entre los grupos asignados
            ======================================== */}
        <View style={CalendarAdminStyles.groupSelectorContainer}>
          <Text style={CalendarAdminStyles.groupSelectorTitle}>Selecciona un grupo</Text>
          <Pressable
            style={({ pressed }) => [
              CalendarAdminStyles.groupSelectorButton,
              pressed && { opacity: 0.7 }
            ]}
            onPress={() => setShowGroupSelectModal(true)}
          >
            <Ionicons name="people-outline" size={24} color={COLORS.primary} />
            <Text style={[
              CalendarAdminStyles.groupSelectorButtonText,
              selectedGroup && { color: COLORS.textBlack, fontWeight: '600' }
            ]}>
              {selectedGroup ? selectedGroup.name : 'No hay grupo seleccionado'}
            </Text>
            <Ionicons name="chevron-down" size={20} color={COLORS.textGray} />
          </Pressable>
        </View>

        {selectedGroup ? (
          <React.Fragment>
            {/* ========================================
                DESCRIPCIÓN DEL GRUPO
                Muestra la descripción si existe
                ======================================== */}
            {selectedGroup.description && selectedGroup.description.trim() !== '' && (
              <View style={styles.descriptionContainer}>
                <Text style={styles.descriptionLabel}>Descripción del Grupo</Text>
                <Text style={styles.descriptionText}>{selectedGroup.description}</Text>
              </View>
            )}

            {/* ========================================
                MÉTRICAS DEL GRUPO
                Cards con estadísticas principales
                ======================================== */}
            <View style={styles.metricsContainer}>
              {/* Card: Total de Miembros */}
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Total de Miembros</Text>
                <Text style={styles.metricValue}>{selectedGroup.memberCount || 0}</Text>
                <Text style={styles.metricSub}>
                  {selectedGroup.memberIds?.length > 0 ? 'Miembros activos' : 'Sin miembros'}
                </Text>
              </View>

              {/* Card: Turnos Totales Trabajados */}
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Turnos Totales</Text>
                <Text style={styles.metricValue}>{selectedGroup.stats?.totalShifts || 0}</Text>
                <Text style={styles.metricSub}>Acumulados</Text>
              </View>
            </View>

            {/* Card: Solicitudes Pendientes */}
            <View style={styles.metricsContainer}>
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Solicitudes Pendientes</Text>
                <Text style={styles.metricValue}>
                  {selectedGroup.peticionesPendientesIds?.length || 0}
                </Text>
                <Text style={styles.metricSub}>Esperando revisión</Text>
              </View>
            </View>

            {/* ========================================
                LISTA DE SOLICITUDES PENDIENTES
                Muestra todas las peticiones de ausencia pendientes
                ======================================== */}
            <View style={styles.requestsSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Solicitudes de Ausencia Pendientes</Text>
              </View>

              {/* Lista con cards de solicitudes */}
              {pendingRequests.length > 0 ? (
                pendingRequests.map((request) => (
                  <View key={request.id} style={styles.requestCard}>
                    {/* Header del card: Nombre, posición y badge de estado */}
                    <View style={styles.requestHeader}>
                      <View>
                        <Text style={styles.requestName}>{request.userName}</Text>
                        <Text style={styles.requestPosition}>{request.position}</Text>
                      </View>
                      <View style={styles.statusPending}>
                        <Text style={styles.statusPendingText}>{request.status}</Text>
                      </View>
                    </View>

                    {/* Detalles de la solicitud: fecha, hora y motivo */}
                    <View style={styles.requestDetails}>
                      <View style={styles.detailRow}>
                        <Ionicons name="calendar-outline" size={16} color={COLORS.textGray} />
                        <Text style={styles.detailText}>{request.date}</Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Ionicons name="time-outline" size={16} color={COLORS.textGray} />
                        <Text style={styles.detailText}>{request.startTime}</Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Ionicons name="information-circle-outline" size={16} color={COLORS.textGray} />
                        <Text style={styles.detailText}>{request.reason}</Text>
                      </View>
                    </View>

                    {/* Botones de acción: Aprobar / Rechazar */}
                    <View style={styles.actionButtons}>
                      {/* Botón Aprobar: Abre modal de selección de reemplazo */}
                      <ButtonRequest
                        title={processingRequest === request.id ? "Procesando..." : "Aprobar"}
                        icon="checkmark-circle-outline"
                        iconColor={COLORS.textGreen}
                        textColor={COLORS.textGreen}
                        backgroundColor={COLORS.backgroundBS}
                        borderColor={COLORS.borderSecondary}
                        onPress={() => handleApprove(request)}
                        style={{ flex: 1 }}
                        disabled={processingRequest !== null}
                      />

                      {/* Botón Rechazar: Rechaza directamente la solicitud */}
                      <ButtonRequest
                        title={processingRequest === request.id ? "Procesando..." : "Rechazar"}
                        icon="close-circle-outline"
                        iconColor={COLORS.textRed}
                        textColor={COLORS.textRed}
                        backgroundColor={COLORS.backgroundWhite}
                        borderColor={COLORS.borderSecondary}
                        onPress={() => handleReject(request)}
                        style={{ flex: 1 }}
                        disabled={processingRequest !== null}
                      />
                    </View>
                  </View>
                ))
              ) : (
                /* Estado vacío: No hay solicitudes pendientes */
                <View style={styles.emptyRequestsContainer}>
                  <Ionicons name="calendar-outline" size={64} color={COLORS.textGray} />
                  <Text style={styles.emptyRequestsText}>No hay solicitudes pendientes</Text>
                  <Text style={styles.emptyRequestsSubtext}>
                    Las solicitudes de ausencia y permisos aparecerán aquí
                  </Text>
                </View>
              )}
            </View>
          </React.Fragment>
        ) : (
          /* Estado: No hay grupo seleccionado */
          <View style={CalendarAdminStyles.noGroupSelected}>
            <Ionicons name="people-outline" size={64} color={COLORS.textGray} />
            <Text style={CalendarAdminStyles.noGroupSelectedTitle}>No hay grupo seleccionado</Text>
            <Text style={CalendarAdminStyles.noGroupSelectedText}>
              Selecciona un grupo para ver el dashboard con métricas y solicitudes
            </Text>
          </View>
        )}
      </ScrollView>

      {/* ========================================
          MODALES
          ======================================== */}
      {/* Modal: Selección de Grupo */}
      <Modal
        visible={showGroupSelectModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowGroupSelectModal(false)}
      >
        <Pressable
          style={CalendarAdminStyles.modalOverlay}
          onPress={() => setShowGroupSelectModal(false)}
        >
          <Pressable style={CalendarAdminStyles.groupModalContainer} onPress={(e) => e.stopPropagation()}>
            {/* Header del modal */}
            <View style={CalendarAdminStyles.groupModalHeader}>
              <Text style={CalendarAdminStyles.groupModalTitle}>Seleccione un grupo</Text>
              <Pressable onPress={() => setShowGroupSelectModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.textBlack} />
              </Pressable>
            </View>
            
            {/* Lista de grupos asignados al administrador */}
            <FlatList
              data={groups}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item: group }) => (
                <Pressable
                  style={({ pressed }) => [
                    CalendarAdminStyles.groupItem,
                    selectedGroup?.id === group.id && CalendarAdminStyles.groupItemSelected,
                    pressed && { opacity: 0.7 }
                  ]}
                  onPress={() => handleGroupSelect(group)}
                >
                  <Ionicons name="people" size={20} color={COLORS.primary} />
                  <Text style={[
                    CalendarAdminStyles.groupItemText,
                    selectedGroup?.id === group.id && CalendarAdminStyles.groupItemTextSelected
                  ]}>
                    {group.name}
                  </Text>
                  {/* Checkmark si es el grupo actualmente seleccionado */}
                  {selectedGroup?.id === group.id && (
                    <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
                  )}
                </Pressable>
              )}
              ListEmptyComponent={() => (
                /* Estado vacío: Sin grupos asignados */
                <View style={{ padding: 20, alignItems: 'center' }}>
                  <Ionicons name="folder-open-outline" size={48} color={COLORS.textGray} />
                  <Text style={{
                    marginTop: 12,
                    fontSize: 16,
                    color: COLORS.textGray,
                    textAlign: 'center'
                  }}>
                    No tienes grupos asignados
                  </Text>
                </View>
              )}
              ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
              showsVerticalScrollIndicator={false}
            />
          </Pressable>
        </Pressable>
      </Modal>

      {/* ========================================
          MODALES DE INFORMACIÓN Y REEMPLAZO
          ======================================== */}
      
      {/* Modal: Información (confirmaciones y errores) */}
      <InfoModal
        visible={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        title={infoModalTitle}
        message={infoModalMessage}
      />

      {/* Modal: Selección de Reemplazo 
          Se abre al aprobar una solicitud para elegir quién sustituirá al empleado */}
      <ReplacementModal
        visible={showReplacementModal}
        onClose={() => {
          setShowReplacementModal(false);
          setRequestForReplacement(null);
          setProcessingRequest(null);
        }}
        request={requestForReplacement}
        groupId={selectedGroup?.id}
        groupMembers={selectedGroup?.memberIds}
        onSuccess={handleReplacementSuccess}
      />

      {/* ========================================
          FOOTER CON MENÚ DE NAVEGACIÓN
          ======================================== */}
      <View style={styles.footerContainer}>
        <MenuFooterAdmin />
      </View>

      {/* Modal de Notificaciones */}
      <NotificationsModal
        visible={showNotifications}
        onClose={() => {
          setShowNotifications(false);
          loadNotifications();
        }}
        userRole="admin"
      />
    </SafeAreaView>
  );
}
