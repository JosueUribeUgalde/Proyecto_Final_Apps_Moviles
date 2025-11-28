// 1. Paquetes core de React/React Native
import { useState, useEffect } from 'react';
import { Text, View, ScrollView, Pressable, Modal, FlatList, ActivityIndicator, TextInput } from "react-native";

// 2. Bibliotecas de terceros
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';

// 3. Componentes propios
import { HeaderScreen, MenuFooter } from "../../components";
import InfoModal from "../../components/InfoModal";

// 4. Constantes y utilidades
import { COLORS } from '../../components/constants/theme';

// 5. Servicios de Firebase
import { getCurrentUser } from "../../services/authService";
import { getUserProfile } from "../../services/userService";
import { joinGroupWithCode } from "../../services/groupService";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";

// 6. Estilos
import styles from "../../styles/screens/user/HomeStyles";
import CalendarAdminStyles from "../../styles/screens/admin/CalendarAdminStyles";

export default function Home({ navigation }) {
  // Estados para carga de datos
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  // Estado para el selector de grupos
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showGroupSelectModal, setShowGroupSelectModal] = useState(false);

  // Estado para grupos del usuario (cargados desde Firebase)
  const [groups, setGroups] = useState([]);

  // Estados para modal de unirse a grupo
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [joiningGroup, setJoiningGroup] = useState(false);

  // Estados para InfoModal
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoModalTitle, setInfoModalTitle] = useState('');
  const [infoModalMessage, setInfoModalMessage] = useState('');

  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    loadUserData();
  }, []);

  // Función para cargar datos del usuario y sus grupos
  const loadUserData = async () => {
    try {
      const user = getCurrentUser();
      if (!user) {
        console.error("No hay sesión activa");
        setLoading(false);
        return;
      }

      // Obtener datos del usuario
      const userProfile = await getUserProfile(user.uid);

      if (userProfile) {
        setUserData(userProfile);

        // Cargar grupos del usuario
        if (userProfile.groupIds && userProfile.groupIds.length > 0) {
          await loadUserGroups(userProfile.groupIds);
        } else {
          // Si no tiene grupos asignados, dejar el array vacío
          setGroups([]);
        }
      } else {
        console.error("No se encontraron datos del usuario");
      }
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Función para cargar los grupos del usuario desde Firestore
  const loadUserGroups = async (groupIds) => {
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

  const handleGroupSelect = (group) => {
    setSelectedGroup(group);
    setShowGroupSelectModal(false);
  };

  // Función para unirse a un grupo con código
  const handleJoinGroup = async () => {
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

      const result = await joinGroupWithCode(user.uid, inviteCode);

      if (result.success) {
        setInfoModalTitle('¡Éxito!');
        setInfoModalMessage(result.message);
        setShowInfoModal(true);
        setShowJoinModal(false);
        setInviteCode('');

        // Recargar datos del usuario para actualizar la lista de grupos
        await loadUserData();
      }
    } catch (error) {
      setInfoModalTitle('Error');
      setInfoModalMessage(error.message || 'Error al unirse al grupo');
      setShowInfoModal(true);
    } finally {
      setJoiningGroup(false);
    }
  };

  // Pantalla de carga mientras se obtienen los datos
  if (loading) {
    return (
      <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
        <HeaderScreen
          title="Home"
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
          <MenuFooter />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <HeaderScreen
        title="Home"
        rightIcon={<Ionicons name="notifications-outline" size={24} color={COLORS.textBlack} />}
        onRightPress={() => { }}
      />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Botón "Unirme a un grupo" */}
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
            {/* Información del grupo seleccionado */}
            <View style={styles.groupInfoCard}>
              <View style={styles.groupInfoHeader}>
                <Ionicons name="people" size={32} color={COLORS.primary} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.groupInfoName}>{selectedGroup.name}</Text>
                  <Text style={styles.groupInfoDescription}>
                    {selectedGroup.description || 'Sin descripción'}
                  </Text>
                </View>
              </View>

              <View style={styles.groupInfoStats}>
                <View style={styles.groupInfoStatItem}>
                  <Ionicons name="people-outline" size={20} color={COLORS.textGray} />
                  <Text style={styles.groupInfoStatLabel}>Miembros</Text>
                  <Text style={styles.groupInfoStatValue}>{selectedGroup.memberCount || 0}</Text>
                </View>
                <View style={styles.groupInfoStatItem}>
                  <Ionicons name="calendar-outline" size={20} color={COLORS.textGray} />
                  <Text style={styles.groupInfoStatLabel}>Turnos</Text>
                  <Text style={styles.groupInfoStatValue}>{selectedGroup.stats?.totalShifts || 0}</Text>
                </View>
                <View style={styles.groupInfoStatItem}>
                  <Ionicons name="star-outline" size={20} color={COLORS.textGray} />
                  <Text style={styles.groupInfoStatLabel}>Rating</Text>
                  <Text style={styles.groupInfoStatValue}>
                    {selectedGroup.stats?.averageRating?.toFixed(1) || '0.0'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Contenido adicional del grupo */}
            <View style={styles.contentCard}>
              <Text style={styles.contentCardTitle}>Próximos turnos</Text>
              <View style={styles.emptyState}>
                <Ionicons name="calendar-outline" size={48} color={COLORS.textGray} />
                <Text style={styles.emptyStateText}>
                  No hay turnos programados
                </Text>
              </View>
            </View>

            <View style={styles.contentCard}>
              <Text style={styles.contentCardTitle}>Actividad reciente</Text>
              <View style={styles.emptyState}>
                <Ionicons name="time-outline" size={48} color={COLORS.textGray} />
                <Text style={styles.emptyStateText}>
                  No hay actividad reciente
                </Text>
              </View>
            </View>
          </>
        ) : (
          <View style={CalendarAdminStyles.noGroupSelected}>
            <Ionicons name="people-outline" size={64} color={COLORS.textGray} />
            <Text style={CalendarAdminStyles.noGroupSelectedTitle}>No hay grupo seleccionado</Text>
            <Text style={CalendarAdminStyles.noGroupSelectedText}>
              Selecciona un grupo para ver información y turnos
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

      {/* Footer */}
      <View style={styles.footerContainer}>
        <MenuFooter />
      </View>
    </SafeAreaView>
  );
}