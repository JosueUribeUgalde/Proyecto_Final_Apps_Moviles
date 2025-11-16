// 1. Paquetes core de React/React Native
import { useState } from 'react';
import { Text, View, ScrollView, TextInput, Pressable, Modal, FlatList, StatusBar } from "react-native";

// 2. Bibliotecas de terceros
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';

// 3. Componentes propios
import { HeaderScreen, Banner, MenuFooterAdmin, ButtonRequest } from "../../components";

// 4. Constantes y utilidades
import { COLORS } from '../../components/constants/theme';

// 5. Estilos
import styles from "../../styles/screens/admin/RequestStyles";

export default function RequestScreen({ navigation }) {
  const [showBanner, setShowBanner] = useState(false);
  const [bannerMessage, setBannerMessage] = useState('');
  const [bannerType, setBannerType] = useState('success');
  const [selectedFilter, setSelectedFilter] = useState('Pendientes');
  const [searchQuery, setSearchQuery] = useState('');
  const [showThisWeek, setShowThisWeek] = useState(false);
  const [showDecisionsModal, setShowDecisionsModal] = useState(false);

  // Mock data - Solicitudes de Ausencia Pendientes
  const pendingRequests = [
    {
      id: 1,
      name: 'Alex Johnson',
      position: 'Recepción',
      date: 'Lun, 9:00 AM - 1:00 PM',
      reason: 'Motivo: Enfermedad',
    },
    {
      id: 2,
      name: 'Priya Patel',
      position: 'Mesero',
      date: 'Mié, 12:00 PM - 8:00 PM',
      reason: 'Motivo: Personal',
    },
    {
      id: 3,
      name: 'Diego Ramos',
      position: 'Anfitrión',
      date: 'Vie, 10:00 AM - 6:00 PM',
      reason: 'Motivo: Vacaciones',
    },
  ];

  // Mock data - Decisiones Recientes
  const recentDecisions = [
    {
      id: 1,
      status: 'Aprobada',
      name: 'Alex Johnson',
      role: 'Barr Lee',
      date: 'Hoy 8:10 AM',
      reason: 'Permiso médico',
    },
    {
      id: 2,
      status: 'Rechazada',
      name: 'Maria Garcia',
      role: 'Chef',
      date: 'Hoy 7:45 AM',
      reason: 'Solicitud de vacaciones',
    },
    {
      id: 3,
      status: 'Auto-reasignada',
      name: 'John Smith',
      role: 'Recepción',
      date: 'Ayer',
      reason: 'Asunto personal',
    },
  ];

  // Mock data - Todas las Decisiones (para modal)
  const allDecisions = [
    ...recentDecisions,
    {
      id: 4,
      status: 'Aprobada',
      name: 'Priya Patel',
      role: 'Mesero',
      date: 'Ayer 6:30 PM',
      reason: 'Cita médica',
    },
    {
      id: 5,
      status: 'Rechazada',
      name: 'Carlos Martinez',
      role: 'Anfitrión',
      date: 'Ayer 2:15 PM',
      reason: 'Aviso insuficiente',
    },
    {
      id: 6,
      status: 'Aprobada',
      name: 'Sarah Williams',
      role: 'Bartender',
      date: 'Hace 2 días',
      reason: 'Emergencia familiar',
    },
    {
      id: 7,
      status: 'Auto-reasignada',
      name: 'Michael Brown',
      role: 'Mesero',
      date: 'Hace 2 días',
      reason: 'Cobertura disponible',
    },
    {
      id: 8,
      status: 'Aprobada',
      name: 'Lisa Anderson',
      role: 'Personal de Cocina',
      date: 'Hace 3 días',
      reason: 'Vacaciones pre-aprobadas',
    },
  ];

  const filters = ['Pendientes', 'Aprobadas', 'Rechazadas', 'Todas'];

  // Filter requests based on search query and selected filter
  const getFilteredRequests = () => {
    let filtered = pendingRequests;

    // Filter by search query (search by name)
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter((request) =>
        request.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // TODO: When connected to Firebase, also filter by selectedFilter status
    // For now, we're showing all pending requests

    return filtered;
  };

  const filteredRequests = getFilteredRequests();

  const handleApprove = (requestId) => {
    setBannerMessage('Solicitud aprobada exitosamente');
    setBannerType('success');
    setShowBanner(true);
    // TODO: Implementar lógica de aprobación con Firebase
  };

  const handleReject = (requestId) => {
    setBannerMessage('Solicitud rechazada');
    setBannerType('error');
    setShowBanner(true);
    // TODO: Implementar lógica de rechazo con Firebase
  };

  const handleMessage = (requestId) => {
    // TODO: Navigate to messaging screen or open message modal
    console.log('Message user for request:', requestId);
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
         onRightPress={() => {
        //   AQUI SE VA A REDIRECCIONAR A NOTIFICACIONES (proxima de crear)
         }}
      />

      {showBanner && (
        <View style={styles.bannerContainer}>
          <Banner
            message={bannerMessage}
            type={bannerType}
            visible={showBanner}
            onHide={() => setShowBanner(false)}
          />
        </View>
      )}

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
                  <Text style={styles.requestName}>{request.name}</Text>
                  <Text style={styles.requestPosition}>{request.position}</Text>
                </View>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>Pendiente</Text>
                </View>
              </View>
              
              <View style={styles.requestDetails}>
                <View style={styles.detailRow}>
                  <Ionicons name="time-outline" size={16} color={COLORS.textGray} />
                  <Text style={styles.detailText}>{request.date}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="information-circle-outline" size={16} color={COLORS.textGray} />
                  <Text style={styles.detailText}>{request.reason}</Text>
                </View>
              </View>

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
              <Text style={styles.decisionRole}>{decision.role}</Text>
            </View>
            {decision.date && (
              <Text style={styles.decisionDate}>{decision.date}</Text>
            )}
          </View>
        ))}

        {/* Bottom spacing */}
        <View style={{ height: 30 }} />
      </ScrollView>

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
                      <Text style={styles.modalDecisionName}>{item.name}</Text>
                      <Text style={styles.modalDecisionRole}>{item.role}</Text>
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
                      <Ionicons name="time-outline" size={14} color={COLORS.textGray} />
                      <Text style={styles.modalDetailText}>{item.date}</Text>
                    </View>
                    <View style={styles.modalDetailRow}>
                      <Ionicons name="information-circle-outline" size={14} color={COLORS.textGray} />
                      <Text style={styles.modalDetailText}>{item.reason}</Text>
                    </View>
                  </View>
                </View>
              )}
            />
          </View>
        </View>
      </Modal>

      <View style={styles.footerContainer}>
        <MenuFooterAdmin />
      </View>
    </SafeAreaView>
  );
}
