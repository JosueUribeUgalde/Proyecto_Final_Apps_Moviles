// 1. Paquetes core de React/React Native
import { useState, useEffect } from 'react';
import { Text, View, ScrollView, Pressable, Modal, FlatList, ActivityIndicator } from "react-native";
// 2. Bibliotecas de terceros
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
// 3. Componentes propios
import { HeaderScreen, MenuFooterAdmin, ButtonRequest } from "../../components";
// 4. Constantes y utilidades
import { COLORS } from '../../components/constants/theme';
// 5. Servicios de Firebase
import { getCurrentUser } from "../../services/authService";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
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

  // Estado para las solicitudes de ausencia (mockup data - cambiar a [] para ver estado vacío)
  const [requests, setRequests] = useState([]);

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

  const handleApprove = (id) => {
    // TODO: Implementar lógica de aprobación con Firebase
    setRequests(requests.map(req =>
      req.id === id ? { ...req, status: 'Aprobado' } : req
    ));
  };

  const handleReject = (id) => {
    // TODO: Implementar lógica de rechazo con Firebase
    setRequests(requests.map(req =>
      req.id === id ? { ...req, status: 'Rechazado' } : req
    ));
  };

  const handleApproveAll = () => {
    // TODO: Implementar lógica de aprobación masiva
    setRequests(requests.map(req => ({ ...req, status: 'Aprobado' })));
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Pendiente':
        return styles.statusPending;
      case 'Aprobado':
        return styles.statusApproved;
      case 'Rechazado':
        return styles.statusRejected;
      default:
        return styles.statusPending;
    }
  };

  const handleGroupSelect = (group) => {
    setSelectedGroup(group);
    setShowGroupSelectModal(false);
    // Aquí se cargarán los datos específicos del grupo desde Firebase
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
                <Text style={styles.sectionTitle}>Solicitudes de Ausencia y Permisos</Text>
              </View>

              {/* Lista de solicitudes */}
              {requests.length > 0 ? (
                requests.map((request) => (
                  <View key={request.id} style={styles.requestCard}>
                    <View style={styles.requestHeader}>
                      <Text style={styles.requestName}>{request.name}</Text>
                      <View style={getStatusStyle(request.status)}>
                        <Text style={[
                          styles.statusText,
                          request.status === 'Pendiente' && styles.statusPendingText,
                          request.status === 'Aprobado' && styles.statusApprovedText,
                          request.status === 'Rechazado' && styles.statusRejectedText,
                        ]}>
                          {request.status}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.requestDetails}>
                      <View style={styles.detailRow}>
                        <Ionicons name="time-outline" size={16} color={COLORS.textGray} />
                        <Text style={styles.detailText}>{request.date}</Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Ionicons name="information-circle-outline" size={16} color={COLORS.textGray} />
                        <Text style={styles.detailText}>Motivo: {request.reason}</Text>
                      </View>
                    </View>

                    {request.status === 'Pendiente' && (
                      <View style={styles.actionButtons}>
                        <ButtonRequest
                          title="Aprobar"
                          icon="checkmark-circle-outline"
                          iconColor={COLORS.textGreen}
                          textColor={COLORS.textGreen}
                          backgroundColor={COLORS.backgroundBS}
                          borderColor={COLORS.borderSecondary}
                          onPress={() => handleApprove(request.id)}
                          style={{ flex: 1 }}
                        />

                        <ButtonRequest
                          title="Rechazar"
                          icon="close-circle-outline"
                          iconColor={COLORS.textRed}
                          textColor={COLORS.textRed}
                          backgroundColor={COLORS.backgroundWhite}
                          borderColor={COLORS.borderSecondary}
                          onPress={() => handleReject(request.id)}
                          style={{ flex: 1 }}
                        />
                      </View>
                    )}
                  </View>
                ))
              ) : (
                <View style={styles.emptyRequestsContainer}>
                  <Ionicons name="calendar-outline" size={64} color={COLORS.textGray} />
                  <Text style={styles.emptyRequestsText}>No hay solicitudes</Text>
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
    </SafeAreaView>
  );
}
