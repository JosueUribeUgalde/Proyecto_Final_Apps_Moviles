// 1. Paquetes core de React/React Native
import { useState, useEffect } from 'react';
import { Text, View, ScrollView, Pressable, Modal, FlatList, ActivityIndicator } from "react-native";
// 2. Bibliotecas de terceros
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
// 3. Componentes propios
import { HeaderScreen, MenuFooterAdmin, ButtonRequest } from "../../components";
import InfoModal from "../../components/InfoModal";
// 4. Constantes y utilidades
import { COLORS } from '../../components/constants/theme';
// 5. Servicios de Firebase
import { getCurrentUser } from "../../services/authService";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { getPeticionesByIds, approvePeticion, rejectPeticion } from "../../services/peticionService";
// 6. Estilos
import styles from "../../styles/screens/admin/DashboardAdminStyles";
import CalendarAdminStyles from "../../styles/screens/admin/CalendarAdminStyles";

export default function DashboardAdmin({ navigation }) {
  // Estados para carga de datos
  const [loading, setLoading] = useState(true);
  const [adminData, setAdminData] = useState(null);

  // Estado para el selector de grupos
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showGroupSelectModal, setShowGroupSelectModal] = useState(false);

  // Estado para grupos del administrador (cargados desde Firebase)
  const [groups, setGroups] = useState([]);

  // Estado para las solicitudes de ausencia pendientes
  const [pendingRequests, setPendingRequests] = useState([]);
  const [processingRequest, setProcessingRequest] = useState(null);

  // Estados para InfoModal
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoModalTitle, setInfoModalTitle] = useState('');
  const [infoModalMessage, setInfoModalMessage] = useState('');

  // Cargar datos del admin al montar el componente
  useEffect(() => {
    loadAdminData();
  }, []);

  // Función para cargar datos del administrador y sus grupos
  const loadAdminData = async () => {
    try {
      const user = getCurrentUser();
      if (!user) {
        console.error("No hay sesión activa");
        setLoading(false);
        return;
      }

      // Obtener datos del administrador
      const adminDoc = await getDoc(doc(db, "admins", user.uid));

      if (adminDoc.exists()) {
        const data = adminDoc.data();
        setAdminData(data);

        // Cargar grupos del administrador
        if (data.groupIds && data.groupIds.length > 0) {
          await loadAdminGroups(data.groupIds);
        } else {
          // Si no tiene grupos asignados, dejar el array vacío
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

  // Función para cargar los grupos del administrador desde Firestore
  const loadAdminGroups = async (groupIds) => {
    try {
      if (!groupIds || groupIds.length === 0) {
        setGroups([]);
        return;
      }

      // Obtener los documentos de los grupos
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

  // Función para cargar peticiones pendientes de un grupo específico
  const loadGroupPeticiones = async (groupId) => {
    try {
      // Obtener el grupo actualizado para tener los IDs de peticiones
      const groupDoc = await getDoc(doc(db, "groups", groupId));
      if (!groupDoc.exists()) return;

      const groupData = groupDoc.data();
      
      // Cargar peticiones pendientes
      if (groupData.peticionesPendientesIds && groupData.peticionesPendientesIds.length > 0) {
        const peticiones = await getPeticionesByIds(groupData.peticionesPendientesIds);
        // Filtrar solo las pendientes
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

  const handleApprove = async (request) => {
    if (processingRequest) return;
    
    try {
      setProcessingRequest(request.id);
      await approvePeticion(request.id, request.groupId);
      
      setInfoModalTitle('¡Aprobada!');
      setInfoModalMessage('Solicitud aprobada exitosamente');
      setShowInfoModal(true);
      
      // Recargar peticiones del grupo
      if (selectedGroup) {
        await loadGroupPeticiones(selectedGroup.id);
        // Recargar datos del grupo para actualizar contadores
        const groupDoc = await getDoc(doc(db, "groups", selectedGroup.id));
        if (groupDoc.exists()) {
          setSelectedGroup({
            id: groupDoc.id,
            ...groupDoc.data()
          });
        }
      }
    } catch (error) {
      console.error("Error al aprobar:", error);
      setInfoModalTitle('Error');
      setInfoModalMessage('Error al aprobar la solicitud. Inténtalo de nuevo.');
      setShowInfoModal(true);
    } finally {
      setProcessingRequest(null);
    }
  };

  const handleReject = async (request) => {
    if (processingRequest) return;
    
    try {
      setProcessingRequest(request.id);
      await rejectPeticion(request.id, request.groupId);
      
      setInfoModalTitle('Rechazada');
      setInfoModalMessage('Solicitud rechazada correctamente');
      setShowInfoModal(true);
      
      // Recargar peticiones del grupo
      if (selectedGroup) {
        await loadGroupPeticiones(selectedGroup.id);
        // Recargar datos del grupo para actualizar contadores
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

  const handleGroupSelect = async (group) => {
    setSelectedGroup(group);
    setShowGroupSelectModal(false);
    // Cargar peticiones pendientes del grupo
    await loadGroupPeticiones(group.id);
  };

  // Pantalla de carga mientras se obtienen los datos
  if (loading) {
    return (
      <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
        <HeaderScreen
          title="Admin Dashboard"
          rightIcon={<Ionicons name="notifications-outline" size={24} color={COLORS.textBlack} />}
          onRightPress={() => { }}
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

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <HeaderScreen
        title="Admin Dashboard"
        rightIcon={<Ionicons name="notifications-outline" size={24} color={COLORS.textBlack} />}
        onRightPress={() => { }}
      />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Selector de Grupos */}
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
          <>
            {/* Métricas principales */}
            <View style={styles.metricsContainer}>
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Total de Miembros</Text>
                <Text style={styles.metricValue}>{selectedGroup.memberCount || 0}</Text>
                <Text style={styles.metricSub}>
                  {selectedGroup.memberIds?.length > 0 ? 'Miembros activos' : 'Sin miembros'}
                </Text>
              </View>

              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Turnos Totales</Text>
                <Text style={styles.metricValue}>{selectedGroup.stats?.totalShifts || 0}</Text>
                <Text style={styles.metricSub}>Acumulados</Text>
              </View>
            </View>

            <View style={styles.metricsContainer}>
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Solicitudes Pendientes</Text>
                <Text style={styles.metricValue}>
                  {selectedGroup.peticionesPendientesIds?.length || 0}
                </Text>
                <Text style={styles.metricSub}>Esperando revisión</Text>
              </View>
            </View>

            {/* Descripción del grupo */}
            {selectedGroup.description && selectedGroup.description.trim() !== '' && (
              <View style={styles.descriptionContainer}>
                <Text style={styles.descriptionLabel}>Descripción del Grupo</Text>
                <Text style={styles.descriptionText}>{selectedGroup.description}</Text>
              </View>
            )}

            {/* Sección de solicitudes */}
            <View style={styles.requestsSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Solicitudes de Ausencia Pendientes</Text>
              </View>

              {/* Lista de solicitudes */}
              {pendingRequests.length > 0 ? (
                pendingRequests.map((request) => (
                  <View key={request.id} style={styles.requestCard}>
                    <View style={styles.requestHeader}>
                      <View>
                        <Text style={styles.requestName}>{request.userName}</Text>
                        <Text style={styles.requestPosition}>{request.position}</Text>
                      </View>
                      <View style={styles.statusPending}>
                        <Text style={styles.statusPendingText}>{request.status}</Text>
                      </View>
                    </View>

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

                    <View style={styles.actionButtons}>
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
                <View style={styles.emptyRequestsContainer}>
                  <Ionicons name="calendar-outline" size={64} color={COLORS.textGray} />
                  <Text style={styles.emptyRequestsText}>No hay solicitudes pendientes</Text>
                  <Text style={styles.emptyRequestsSubtext}>
                    Las solicitudes de ausencia y permisos aparecerán aquí
                  </Text>
                </View>
              )}
            </View>
          </>
        ) : (
          <View style={CalendarAdminStyles.noGroupSelected}>
            <Ionicons name="people-outline" size={64} color={COLORS.textGray} />
            <Text style={CalendarAdminStyles.noGroupSelectedTitle}>No hay grupo seleccionado</Text>
            <Text style={CalendarAdminStyles.noGroupSelectedText}>
              Selecciona un grupo para ver el dashboard con métricas y solicitudes
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Modal de Selección de Grupo */}
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
            <View style={CalendarAdminStyles.groupModalHeader}>
              <Text style={CalendarAdminStyles.groupModalTitle}>Seleccione un grupo</Text>
              <Pressable onPress={() => setShowGroupSelectModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.textBlack} />
              </Pressable>
            </View>
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
                  {selectedGroup?.id === group.id && (
                    <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
                  )}
                </Pressable>
              )}
              ListEmptyComponent={() => (
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

      <View style={styles.footerContainer}>
        <MenuFooterAdmin />
      </View>

      {/* Modal de Información */}
      <InfoModal
        visible={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        title={infoModalTitle}
        message={infoModalMessage}
      />
    </SafeAreaView>
  );
}
