// 1. Paquetes core de React/React Native
import { useState, useEffect } from 'react';
import { Text, View, ScrollView, TextInput, Pressable, Modal, FlatList, StatusBar, ActivityIndicator } from "react-native";

// 2. Bibliotecas de terceros
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';

// 3. Componentes propios
import { HeaderScreen, MenuFooterAdmin, ButtonRequest } from "../../components";
import ReplacementModal from "../../components/ReplacementModal";
import NotificationsModal from "../../components/NotificationsModal";

// 4. Constantes y utilidades
import { COLORS } from '../../components/constants/theme';

// 5. Servicios de Firebase
import { getCurrentUser } from "../../services/authService";
import { getAdminProfile } from "../../services/companyService";
import { getGroupsByIds } from "../../services/groupService";
import { getPeticionesByIds, approvePeticion, rejectPeticion, getHistorialByGroupId } from "../../services/peticionService";
import { getAdminNotifications } from "../../services/notificationService";
import { setBadgeCount } from "../../services/pushNotificationService";

// 6. Estilos
import styles from "../../styles/screens/admin/RequestStyles";

export default function RequestScreen({ navigation }) {
  // Estados de UI
  const [selectedFilter, setSelectedFilter] = useState('Pendientes');
  const [searchQuery, setSearchQuery] = useState('');
  const [showThisWeek, setShowThisWeek] = useState(false);
  const [showDecisionsModal, setShowDecisionsModal] = useState(false);

  // Estados de datos Firebase
  const [loading, setLoading] = useState(true);
  const [adminData, setAdminData] = useState(null);
  const [groups, setGroups] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [recentDecisions, setRecentDecisions] = useState([]);
  const [allDecisions, setAllDecisions] = useState([]);
  const [processingRequest, setProcessingRequest] = useState(null);

  // Estados para ReplacementModal
  const [showReplacementModal, setShowReplacementModal] = useState(false);
  const [requestForReplacement, setRequestForReplacement] = useState(null);
  const [requestGroupId, setRequestGroupId] = useState(null);

  // Estados para notificaciones
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const filters = ['Pendientes', 'Aprobadas', 'Rechazadas', 'Todas'];

  // Cargar datos del admin y sus grupos
  useEffect(() => {
    loadAdminData();
    loadNotifications();
  }, []);

  // Función para cargar notificaciones
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

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const user = getCurrentUser();
      if (!user) {
        console.error("No hay sesión activa");
        setLoading(false);
        return;
      }

      // Obtener datos del admin
      const adminProfile = await getAdminProfile(user.uid);
      if (!adminProfile) {
        console.error("No se encontraron datos del admin");
        setLoading(false);
        return;
      }

      setAdminData(adminProfile);

      // Cargar grupos del admin
      if (adminProfile.groupIds && adminProfile.groupIds.length > 0) {
        const groupsData = await getGroupsByIds(adminProfile.groupIds);
        setGroups(groupsData);

        // Cargar peticiones de todos los grupos
        await loadAllPeticiones(groupsData);
      }
    } catch (error) {
      console.error("Error al cargar datos del admin:", error);

    } finally {
      setLoading(false);
    }
  };

  const loadAllPeticiones = async (groupsData) => {
    try {
      let allPeticiones = [];
      let allHistorial = [];

      // Obtener peticiones pendientes y historial de cada grupo
      for (const group of groupsData) {
        // Peticiones pendientes
        if (group.peticionesPendientesIds && group.peticionesPendientesIds.length > 0) {
          const peticiones = await getPeticionesByIds(group.peticionesPendientesIds);
          allPeticiones = [...allPeticiones, ...peticiones];
        }

        // Historial
        const historial = await getHistorialByGroupId(group.id);
        allHistorial = [...allHistorial, ...historial];
      }

      setPendingRequests(allPeticiones);

      // Ordenar historial por fecha (más reciente primero)
      const sortedHistorial = allHistorial.sort((a, b) => {
        const dateA = a.approvedAt || a.rejectedAt || a.createdAt;
        const dateB = b.approvedAt || b.rejectedAt || b.createdAt;
        return dateB?.seconds - dateA?.seconds;
      });

      setAllDecisions(sortedHistorial);
      // Mostrar solo las 3 más recientes en la sección principal
      setRecentDecisions(sortedHistorial.slice(0, 3));

    } catch (error) {
      console.error("Error al cargar peticiones:", error);
    }
  };

  // Formatear fecha de Firebase Timestamp
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Fecha no disponible';

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp.seconds * 1000);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return `Hoy ${date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      return 'Ayer';
    } else if (diffDays < 7) {
      return `Hace ${diffDays} días`;
    } else {
      return date.toLocaleDateString('es-ES');
    }
  };

  // Filter requests based on search query and selected filter
  const getFilteredRequests = () => {
    let filtered = [...pendingRequests];

    // Filter by search query (search by name)
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter((request) =>
        request.userName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    if (selectedFilter === 'Pendientes') {
      filtered = filtered.filter(req => req.status === 'Pendiente');
    } else if (selectedFilter === 'Aprobadas') {
      filtered = allDecisions.filter(req => req.status === 'Aprobada');
    } else if (selectedFilter === 'Rechazadas') {
      filtered = allDecisions.filter(req => req.status === 'Rechazada');
    } else if (selectedFilter === 'Todas') {
      filtered = [...pendingRequests, ...allDecisions];
    }

    return filtered;
  };

  const filteredRequests = getFilteredRequests();

  const handleApprove = async (request) => {
    if (processingRequest) return;

    try {
      console.log("👆 Clic en Aprobar - Petición:", {
        id: request.id,
        userName: request.userName,
        groupId: request.groupId
      });
      
      setProcessingRequest(request.id);
      // Mostrar modal de remplazo en lugar de aprobar directamente
      setRequestForReplacement(request);
      setRequestGroupId(request.groupId);
      
      console.log("🎯 Abriendo ReplacementModal...");
      setShowReplacementModal(true);
    } catch (error) {
      console.error("❌ Error:", error);
      setProcessingRequest(null);
    }
  };

  const handleReplacementSuccess = async (selectedMemberId) => {
    console.log("🎉 Remplazo procesado exitosamente:", selectedMemberId);
    try {
      // Recargar datos
      console.log("🔄 Recargando datos del admin...");
      await loadAdminData();
      setProcessingRequest(null);
      console.log("✅ Datos recargados");
    } catch (error) {
      console.error("❌ Error al recargar datos:", error);
      setProcessingRequest(null);
    }
  };

  const handleReject = async (request) => {
    if (processingRequest) return;

    try {
      setProcessingRequest(request.id);
      await rejectPeticion(request.id, request.groupId);



      // Recargar datos
      await loadAdminData();
    } catch (error) {
      console.error("Error al rechazar:", error);

    } finally {
      setProcessingRequest(null);
    }
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.background}
        translucent={false}
      />
      <HeaderScreen
        title="Solicitudes"
        leftIcon={<Ionicons name="arrow-back" size={24} color={COLORS.textBlack} />}
        rightIcon={<Ionicons name="notifications-outline" size={24} color="black" />}
        onLeftPress={() => navigation.goBack()}
        onRightPress={() => setShowNotifications(true)}
        badgeCount={unreadCount}
      />



      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={{ marginTop: 16, color: COLORS.textGray }}>
            Cargando solicitudes...
          </Text>
        </View>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Filters Section */}
          <View style={styles.filtersContainer}>
            <View style={styles.filtersHeader}>
              <Text style={styles.filtersTitle}>Filtros</Text>
            </View>

            <View style={styles.filterChipsContainer}>
              {filters.map((filter) => (
                <Pressable
                  key={filter}
                  style={[
                    styles.filterChip,
                    selectedFilter === filter && styles.filterChipActive,
                  ]}
                  onPress={() => setSelectedFilter(filter)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      selectedFilter === filter && styles.filterChipTextActive,
                    ]}
                  >
                    {filter}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Search */}
          <View style={styles.searchWeekContainer}>
            <View style={styles.searchContainer}>
              <Ionicons name="search-outline" size={20} color={COLORS.textGray} />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar por miembro"
                placeholderTextColor={COLORS.textGray}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>

          {/* Pending Absence Requests Section */}
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Solicitudes de Ausencia Pendientes</Text>
              <Text style={styles.sectionSubtitle}>Acciones Masivas</Text>
            </View>
          </View>

          {/* Request Cards */}
          {filteredRequests.length > 0 ? (
            filteredRequests.map((request) => (
              <View key={request.id} style={styles.requestCard}>
                <View style={styles.requestHeader}>
                  <View>
                    <Text style={styles.requestName}>{request.userName}</Text>
                    <Text style={styles.requestPosition}>{request.position}</Text>
                  </View>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>{request.status}</Text>
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

                {request.status === 'Pendiente' && (
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
                )}
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={48} color={COLORS.textGray} />
              <Text style={styles.emptyStateText}>No se encontraron solicitudes</Text>
              <Text style={styles.emptyStateSubtext}>
                {searchQuery.trim() !== ''
                  ? `No hay resultados para "${searchQuery}"`
                  : 'No hay solicitudes pendientes'}
              </Text>
            </View>
          )}

          {/* Recent Decisions Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Decisiones Recientes</Text>
            <Pressable
              style={styles.viewAllButton}
              onPress={() => setShowDecisionsModal(true)}
            >
              <Text style={styles.viewAllText}>Ver Todas</Text>
            </Pressable>
          </View>

          {/* Decision Cards */}
          {recentDecisions.map((decision) => (
            <View key={decision.id} style={styles.decisionCard}>
              <View style={styles.decisionHeader}>
                <Text style={styles.decisionStatus}>{decision.status}</Text>
                <Text style={styles.decisionRole}>{decision.position}</Text>
              </View>
              <Text style={styles.decisionName}>{decision.userName}</Text>
              <Text style={styles.decisionDate}>
                {formatDate(decision.approvedAt || decision.rejectedAt || decision.createdAt)}
              </Text>
            </View>
          ))}

          {recentDecisions.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="document-text-outline" size={48} color={COLORS.textGray} />
              <Text style={styles.emptyStateText}>No hay decisiones recientes</Text>
            </View>
          )}

          {/* Bottom spacing */}
          <View style={{ height: 30 }} />
        </ScrollView>
      )}

      {/* Decisions Modal */}
      <Modal
        transparent
        visible={showDecisionsModal}
        animationType="slide"
        onRequestClose={() => setShowDecisionsModal(false)}
        statusBarTranslucent
      >
        <StatusBar
          barStyle="light-content"
          backgroundColor="rgba(0, 0, 0, 0.5)"
          translucent={true}
        />
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalOverlayTouchable}
            onPress={() => setShowDecisionsModal(false)}
          />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Todas las Decisiones</Text>
              <Pressable onPress={() => setShowDecisionsModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.textBlack} />
              </Pressable>
            </View>

            <FlatList
              data={allDecisions}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalList}
              renderItem={({ item }) => (
                <View style={styles.modalDecisionCard}>
                  <View style={styles.modalDecisionHeader}>
                    <View style={styles.modalDecisionInfo}>
                      <Text style={styles.modalDecisionName}>{item.userName}</Text>
                      <Text style={styles.modalDecisionRole}>{item.position}</Text>
                    </View>
                    <View style={[
                      styles.modalStatusBadge,
                      item.status === 'Aprobada' && styles.statusApproved,
                      item.status === 'Rechazada' && styles.statusRejected,
                      item.status === 'Auto-reasignada' && styles.statusAuto,
                    ]}>
                      <Text style={[
                        styles.modalStatusText,
                        item.status === 'Aprobada' && styles.statusApprovedText,
                        item.status === 'Rechazada' && styles.statusRejectedText,
                        item.status === 'Auto-reasignada' && styles.statusAutoText,
                      ]}>
                        {item.status}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.modalDecisionDetails}>
                    <View style={styles.modalDetailRow}>
                      <Ionicons name="calendar-outline" size={14} color={COLORS.textGray} />
                      <Text style={styles.modalDetailText}>{item.date}</Text>
                    </View>
                    <View style={styles.modalDetailRow}>
                      <Ionicons name="time-outline" size={14} color={COLORS.textGray} />
                      <Text style={styles.modalDetailText}>
                        {formatDate(item.approvedAt || item.rejectedAt || item.createdAt)}
                      </Text>
                    </View>
                    <View style={styles.modalDetailRow}>
                      <Ionicons name="information-circle-outline" size={14} color={COLORS.textGray} />
                      <Text style={styles.modalDetailText}>{item.reason}</Text>
                    </View>
                  </View>
                </View>
              )}
              ListEmptyComponent={() => (
                <View style={styles.emptyState}>
                  <Ionicons name="document-text-outline" size={48} color={COLORS.textGray} />
                  <Text style={styles.emptyStateText}>No hay decisiones</Text>
                </View>
              )}
            />
          </View>
        </View>
      </Modal>

      <View style={styles.footerContainer}>
        <MenuFooterAdmin />
      </View>

      {/* Modal de Selección de Remplazo */}
      <ReplacementModal
        visible={showReplacementModal}
        onClose={() => {
          console.log("❌ ReplacementModal cerrado");
          setShowReplacementModal(false);
          setRequestForReplacement(null);
          setRequestGroupId(null);
          setProcessingRequest(null);
        }}
        request={requestForReplacement}
        groupId={requestGroupId}
        groupMembers={requestGroupId ? groups.find(g => g.id === requestGroupId)?.memberIds : []}
        onSuccess={handleReplacementSuccess}
      />

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
