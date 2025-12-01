// 1. Paquetes core de React/React Native
import { useState, useEffect } from 'react';
import { Text, View, ScrollView, Pressable, Modal, FlatList, ActivityIndicator, TextInput } from "react-native";

// 2. Bibliotecas de terceros
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';

// 3. Componentes propios
import { HeaderScreen, MenuFooter } from "../../components";
import InfoModal from "../../components/InfoModal";
import NotificationsModal from "../../components/NotificationsModal";

// 4. Constantes y utilidades
import { COLORS } from '../../components/constants/theme';

// 5. Servicios de Firebase
import { getCurrentUser } from "../../services/authService";
import { getUserProfile } from "../../services/userService";
import { joinGroupWithCode } from "../../services/groupService";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { registerForPushNotifications, setBadgeCount } from "../../services/pushNotificationService";
import { getUserNotifications } from "../../services/notificationService";

// 6. Estilos
import styles from "../../styles/screens/user/HomeStyles";
import CalendarAdminStyles from "../../styles/screens/admin/CalendarAdminStyles";

export default function Home({ navigation }) {
  // ============================================
  // ESTADOS
  // ============================================
  
  // Control de carga inicial de datos
  const [loading, setLoading] = useState(true);
  
  // Datos del usuario logueado (perfil completo desde Firebase)
  const [userData, setUserData] = useState(null);

  // Grupo actualmente seleccionado por el usuario
  const [selectedGroup, setSelectedGroup] = useState(null);
  
  // Control de visibilidad del modal de selección de grupos
  const [showGroupSelectModal, setShowGroupSelectModal] = useState(false);

  // Lista de todos los grupos a los que pertenece el usuario
  const [groups, setGroups] = useState([]);

  // Control de visibilidad del modal para unirse a un grupo
  const [showJoinModal, setShowJoinModal] = useState(false);
  
  // Código de invitación ingresado por el usuario
  const [inviteCode, setInviteCode] = useState('');
  
  // Estado de carga mientras se procesa la unión al grupo
  const [joiningGroup, setJoiningGroup] = useState(false);

  // Control del modal de información general
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoModalTitle, setInfoModalTitle] = useState('');
  const [infoModalMessage, setInfoModalMessage] = useState('');
  
  // Control de visibilidad del modal de notificaciones
  const [notificationsVisible, setNotificationsVisible] = useState(false);

  // Últimos 3 registros del historial del usuario
  const [recentHistory, setRecentHistory] = useState([]);

  // Cargar todos los datos del usuario al montar el componente
  useEffect(() => {
    loadUserData();
  }, []);

  // Registrar notificaciones push y actualizar badge
  useEffect(() => {
    const setupPushNotifications = async () => {
      const user = getCurrentUser();
      if (user) {
        // Registrar para notificaciones push
        await registerForPushNotifications(user.uid);
        
        // Actualizar badge con notificaciones no leídas
        await updateNotificationBadge(user.uid);
      }
    };

    setupPushNotifications();
  }, []);

  // ============================================
  // FUNCIONES DE CARGA DE DATOS
  // ============================================

  /**
   * Actualiza el badge del ícono con el número de notificaciones no leídas
   */
  const updateNotificationBadge = async (userId) => {
    try {
      const { getUserNotifications } = await import('../../services/notificationService');
      const notifications = await getUserNotifications(userId);
      const unreadCount = notifications.filter(n => !n.read).length;
      await setBadgeCount(unreadCount);
    } catch (error) {
      console.error('Error al actualizar badge:', error);
    }
  };
  
  /**
   * Carga los datos principales del usuario:
   * 1. Perfil del usuario desde Firebase
   * 2. Grupos a los que pertenece
   * 3. Historial reciente de peticiones
   */
  const loadUserData = async () => {
    try {
      // Obtener usuario actualmente autenticado
      const user = getCurrentUser();
      if (!user) {
        console.error("No hay sesión activa");
        setLoading(false);
        return;
      }

      // Obtener perfil completo del usuario desde Firestore
      const userProfile = await getUserProfile(user.uid);

      if (userProfile) {
        setUserData(userProfile);

        // Cargar grupos del usuario si tiene groupIds en su perfil
        if (userProfile.groupIds && userProfile.groupIds.length > 0) {
          await loadUserGroups(userProfile.groupIds);
        } else {
          // Si no tiene grupos, inicializar array vacío
          setGroups([]);
        }

        // Cargar los últimos 3 registros del historial
        await loadRecentHistory(userProfile);
      } else {
        console.error("No se encontraron datos del usuario");
      }
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      // Finalizar estado de carga
      setLoading(false);
    }
  };

  /**
   * Carga la información completa de los grupos del usuario
   * Recibe array de IDs y consulta Firestore para obtener los datos completos
   */
  const loadUserGroups = async (groupIds) => {
    try {
      if (!groupIds || groupIds.length === 0) {
        setGroups([]);
        return;
      }

      // Obtener documentos completos de cada grupo desde Firestore
      const groupsData = [];
      for (const groupId of groupIds) {
        const groupDoc = await getDoc(doc(db, "groups", groupId));
        if (groupDoc.exists()) {
          // Agregar ID y datos del grupo al array
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
   * Carga los últimos 3 registros del historial del usuario
   * Usa import dinámico para evitar dependencias circulares
   */
  const loadRecentHistory = async (userProfile) => {
    try {
      const historialesIds = userProfile.historialesIds || [];

      if (historialesIds.length > 0) {
        // Importar dinámicamente la función de obtener historial
        const { getHistorialByIds } = await import("../../services/peticionService");
        
        // Obtener todos los historiales del usuario
        const historialData = await getHistorialByIds(historialesIds);

        // Tomar solo los primeros 3 registros (más recientes)
        const recentRecords = historialData.slice(0, 3);
        setRecentHistory(recentRecords);
      } else {
        setRecentHistory([]);
      }
    } catch (error) {
      console.error("Error al cargar historial reciente:", error);
      setRecentHistory([]);
    }
  };

  // ============================================
  // FUNCIONES DE UTILIDAD
  // ============================================
  
  /**
   * Formatea un timestamp de Firebase a formato de fecha legible en español
   * Ejemplo: "28 de noviembre de 2025"
   */
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Fecha no disponible';
    // Convertir timestamp de Firebase a objeto Date
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  /**
   * Retorna el color apropiado según el status de la petición
   */
  const getStatusColor = (status) => {
    switch (status) {
      case 'Aprobada':
        return COLORS.textGreen;
      case 'Rechazada':
        return COLORS.textRed;
      default:
        return COLORS.textGray;
    }
  };

  /**
   * Retorna el nombre del ícono apropiado según el status de la petición
   */
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Aprobada':
        return 'checkmark-circle';
      case 'Rechazada':
        return 'close-circle';
      default:
        return 'time';
    }
  };

  // ============================================
  // HANDLERS DE EVENTOS
  // ============================================

  
  /**
   * Maneja la selección de un grupo del modal
   * Establece el grupo seleccionado y cierra el modal
   */
  const handleGroupSelect = (group) => {
    setSelectedGroup(group);
    setShowGroupSelectModal(false);
  };

  /**
   * Procesa la unión del usuario a un grupo mediante código de invitación
   * Valida el código, llama al servicio y actualiza los datos
   */
  const handleJoinGroup = async () => {
    // Validar que el código no esté vacío
    if (!inviteCode.trim()) {
      setInfoModalTitle('Error');
      setInfoModalMessage('Por favor ingresa un código de invitación');
      setShowInfoModal(true);
      return;
    }

    setJoiningGroup(true);

    try {
      const user = getCurrentUser();
      if (!user) {
        throw new Error('No hay sesión activa');
      }

      // Intentar unirse al grupo con el código proporcionado
      const result = await joinGroupWithCode(user.uid, inviteCode);

      if (result.success) {
        // Mostrar mensaje de éxito
        setInfoModalTitle('¡Éxito!');
        setInfoModalMessage(result.message);
        setShowInfoModal(true);
        
        // Cerrar modal y limpiar código
        setShowJoinModal(false);
        setInviteCode('');

        // Recargar datos para mostrar el nuevo grupo
        await loadUserData();
      }
    } catch (error) {
      // Mostrar mensaje de error
      setInfoModalTitle('Error');
      setInfoModalMessage(error.message || 'Error al unirse al grupo');
      setShowInfoModal(true);
    } finally {
      setJoiningGroup(false);
    }
  };

  // ============================================
  // RENDERIZADO
  // ============================================

  
  // Pantalla de carga mostrada mientras se obtienen los datos iniciales
  if (loading) {
    return (
      <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
        <HeaderScreen
          title="Home"
          rightIcon={<Ionicons name="notifications-outline" size={24} color={COLORS.textBlack} />}
          onRightPress={() => setNotificationsVisible(true)}
        />
        {/* Indicador de carga centrado */}
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={{ marginTop: 16, color: COLORS.textGray }}>
            Cargando datos...
          </Text>
        </View>
        <View style={styles.footerContainer}>
          <MenuFooter />
        </View>
      </SafeAreaView>
    );
  }

  // Pantalla principal con todos los datos cargados
  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      {/* Header con título y botón de notificaciones */}
      <HeaderScreen
        title="Home"
        rightIcon={<Ionicons name="notifications-outline" size={24} color={COLORS.textBlack} />}
        onRightPress={() => setNotificationsVisible(true)}
      />

      {/* Contenido scrolleable de la pantalla */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Botón para abrir modal de unión a grupo */}
        <Pressable
          style={({ pressed }) => [
            styles.joinGroupButton,
            pressed && { opacity: 0.7 }
          ]}
          onPress={() => setShowJoinModal(true)}
        >
          <Ionicons name="add-circle-outline" size={20} color={COLORS.primary} />
          <Text style={styles.joinGroupButtonText}>Unirme a un grupo</Text>
        </Pressable>

        {/* Selector de grupos - muestra el grupo actual o mensaje por defecto */}
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

        {/* Contenido condicional: se muestra solo si hay un grupo seleccionado */}
        {selectedGroup ? (
          <>
            {/* Card con información general del grupo seleccionado */}
            <View style={styles.groupInfoCard}>
              {/* Header: nombre, descripción e ícono */}
              <View style={styles.groupInfoHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.groupInfoTitle}>{selectedGroup.name}</Text>
                  <Text style={styles.groupInfoDescription}>{selectedGroup.description}</Text>
                </View>
                {/* Ícono del grupo */}
                <View style={styles.groupInfoIcon}>
                  <Ionicons name="people" size={32} color={COLORS.primary} />
                </View>
              </View>
              
              {/* Estadísticas: Miembros y Mis Turnos */}
              <View style={styles.groupInfoStats}>
                {/* Contador de miembros del grupo */}
                <View style={styles.groupInfoStatItem}>
                  <Ionicons name="people-outline" size={20} color={COLORS.textGray} />
                  <Text style={styles.groupInfoStatLabel}>Miembros</Text>
                  <Text style={styles.groupInfoStatValue}>{selectedGroup.memberCount || 0}</Text>
                </View>
                
                {/* Contador de turnos del usuario (calculado desde availableDays) */}
                <View style={styles.groupInfoStatItem}>
                  <Ionicons name="calendar-outline" size={20} color={COLORS.textGray} />
                  <Text style={styles.groupInfoStatLabel}>Mis Turnos</Text>
                  <Text style={styles.groupInfoStatValue}>
                    {/* Contar días separados por '•' en availableDays, excluyendo 'n/a' y 'N/A' */}
                    {userData?.availableDays && userData.availableDays !== 'n/a' && userData.availableDays !== 'N/A'
                      ? userData.availableDays.split('•').filter(d => d.trim() && d.trim().toLowerCase() !== 'n/a').length 
                      : 0}
                  </Text>
                </View>
              </View>
            </View>

            {/* Sección de actividad reciente (muestra últimos 3 historiales) */}
            <View style={styles.contentCard}>
              <Text style={styles.contentCardTitle}>Actividad reciente</Text>
              
              {/* Renderizar cards de historial si existen registros */}
              {recentHistory.length > 0 ? (
                // Mapear cada registro del historial a una card
                recentHistory.map((item) => (
                  <View key={item.id} style={styles.historyCard}>
                    {/* Header de la card: status y fecha */}
                    <View style={styles.historyCardHeader}>
                      {/* Status con ícono y texto */}
                      <View style={styles.historyStatusContainer}>
                        <Ionicons
                          name={getStatusIcon(item.status)}
                          size={24}
                          color={getStatusColor(item.status)}
                        />
                        <Text style={[styles.historyStatusText, { color: getStatusColor(item.status) }]}>
                          {item.status}
                        </Text>
                      </View>
                      {/* Fecha formateada */}
                      <Text style={styles.historyCardDate}>
                        {formatDate(item.approvedAt || item.rejectedAt || item.createdAt)}
                      </Text>
                    </View>

                    {/* Cuerpo de la card: detalles de la petición */}
                    <View style={styles.historyCardBody}>
                      {/* Puesto solicitado */}
                      <View style={styles.historyDetailRow}>
                        <Ionicons name="briefcase-outline" size={16} color={COLORS.textGray} />
                        <Text style={styles.historyDetailLabel}>Puesto:</Text>
                        <Text style={styles.historyDetailValue}>{item.position}</Text>
                      </View>

                      {/* Fecha de la petición */}
                      <View style={styles.historyDetailRow}>
                        <Ionicons name="calendar-outline" size={16} color={COLORS.textGray} />
                        <Text style={styles.historyDetailLabel}>Fecha solicitada:</Text>
                        <Text style={styles.historyDetailValue}>{item.date}</Text>
                      </View>

                      {/* Hora de inicio */}
                      <View style={styles.historyDetailRow}>
                        <Ionicons name="time-outline" size={16} color={COLORS.textGray} />
                        <Text style={styles.historyDetailLabel}>Hora:</Text>
                        <Text style={styles.historyDetailValue}>{item.startTime}</Text>
                      </View>

                      {/* Motivo de la petición */}
                      <View style={styles.historyDetailRow}>
                        <Ionicons name="information-circle-outline" size={16} color={COLORS.textGray} />
                        <Text style={styles.historyDetailLabel}>Motivo:</Text>
                        <Text style={styles.historyDetailValue}>{item.reason}</Text>
                      </View>

                      {/* Mostrar remplazo si existe */}
                      {item.replacementUserId && (
                        <View style={styles.historyDetailRow}>
                          <Ionicons name="person-outline" size={16} color={COLORS.textGray} />
                          <Text style={styles.historyDetailLabel}>Cubierto por:</Text>
                          <Text style={styles.historyDetailValue}>Usuario asignado</Text>
                        </View>
                      )}
                    </View>
                  </View>
                ))
              ) : (
                // Estado vacío cuando no hay historial
                <View style={styles.emptyState}>
                  <Ionicons name="time-outline" size={48} color={COLORS.textGray} />
                  <Text style={styles.emptyStateText}>
                    No hay actividad reciente
                  </Text>
                </View>
              )}
            </View>
          </>
        ) : (
          // Mensaje cuando no hay grupo seleccionado
          <View style={CalendarAdminStyles.noGroupSelected}>
            <Ionicons name="people-outline" size={64} color={COLORS.textGray} />
            <Text style={CalendarAdminStyles.noGroupSelectedTitle}>No hay grupo seleccionado</Text>
            <Text style={CalendarAdminStyles.noGroupSelectedText}>
              Selecciona un grupo para ver información y turnos
            </Text>
          </View>
        )}
      </ScrollView>

      {/* ============================================ */}
      {/* MODALES */}
      {/* ============================================ */}
      
      {/* Modal para seleccionar un grupo de la lista */}
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
                    No perteneces a ningún grupo
                  </Text>
                  <Text style={{
                    marginTop: 8,
                    fontSize: 14,
                    color: COLORS.textGray,
                    textAlign: 'center'
                  }}>
                    Usa el botón "Unirme a un grupo" para ingresar un código
                  </Text>
                </View>
              )}
              ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
              showsVerticalScrollIndicator={false}
            />
          </Pressable>
        </Pressable>
      </Modal>

      {/* Modal para Unirse a un Grupo */}
      <Modal
        visible={showJoinModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowJoinModal(false)}
      >
        <Pressable
          style={styles.joinModalOverlay}
          onPress={() => setShowJoinModal(false)}
        >
          <Pressable style={styles.joinModalContainer} onPress={(e) => e.stopPropagation()}>
            <View style={styles.joinModalHeader}>
              <Text style={styles.joinModalTitle}>Unirme a un grupo</Text>
              <Pressable onPress={() => setShowJoinModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.textBlack} />
              </Pressable>
            </View>

            <Text style={styles.joinModalSubtitle}>
              Ingresa el código de invitación proporcionado por tu administrador
            </Text>

            <TextInput
              style={styles.codeInput}
              placeholder="Ej: ABC123"
              placeholderTextColor={COLORS.textGray}
              value={inviteCode}
              onChangeText={(text) => setInviteCode(text.toUpperCase())}
              maxLength={6}
              autoCapitalize="characters"
              editable={!joiningGroup}
            />

            <Pressable
              style={({ pressed }) => [
                styles.joinButton,
                pressed && { opacity: 0.8 },
                joiningGroup && { opacity: 0.5 }
              ]}
              onPress={handleJoinGroup}
              disabled={joiningGroup}
            >
              {joiningGroup ? (
                <ActivityIndicator size="small" color={COLORS.textWhite} />
              ) : (
                <>
                  <Ionicons name="checkmark-circle-outline" size={20} color={COLORS.textWhite} />
                  <Text style={styles.joinButtonText}>Unirme</Text>
                </>
              )}
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      {/* InfoModal para mensajes */}
      <InfoModal
        visible={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        title={infoModalTitle}
        message={infoModalMessage}
      />
      
      {/* Modal de Notificaciones */}
      <NotificationsModal
        visible={notificationsVisible}
        onClose={() => setNotificationsVisible(false)}
      />

      {/* Footer */}
      <View style={styles.footerContainer}>
        <MenuFooter />
      </View>
    </SafeAreaView>
  );
}