// ===========================
// IMPORTACIONES
// ===========================

// Hooks de React
import { useState, useEffect, useMemo } from 'react';

// Componentes nativos de React Native
import { Text, View, ScrollView, TextInput, Pressable, Modal, FlatList, ActivityIndicator, Image, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Iconos y herramientas
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import DateTimePicker from '@react-native-community/datetimepicker';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

// Componentes personalizados
import { HeaderScreen, InfoModal, MenuFooterAdmin } from "../../components";
import NotificationsModal from "../../components/NotificationsModal";

// Estilos y tema
import { COLORS } from '../../components/constants/theme';
import styles from "../../styles/screens/admin/MembersAdminStyles";
import CalendarAdminStyles from "../../styles/screens/admin/CalendarAdminStyles";

// ===========================
// SERVICIOS DE FIREBASE
// ===========================
import { getCurrentUser } from "../../services/authService";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { createGroup, getGroupsByIds, updateGroup, deleteGroup, removeMemberFromGroup } from "../../services/groupService";
import { removeUserFromGroup } from "../../services/userService";
import { getAdminNotifications } from "../../services/notificationService";
import { setBadgeCount } from "../../services/pushNotificationService";

// ===========================
// CONSTANTES
// ===========================

// Días de la semana para selección de disponibilidad
const WEEK_DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

const parseDays = (value) => {
  if (!value) return [];
  return value
    .split('•')
    .map((d) => d.trim())
    .filter(d => d && d !== 'N/A');
};

/**
 * Formatea un array de días a una cadena separada por ' • '
 * Ejemplo: ['Lun', 'Mar', 'Mié'] → "Lun • Mar • Mié"
 */
const formatDays = (days) => {
  if (!days || !days.length) return '';
  return days.join(' • ');
};

/**
 * Convierte una cadena de tiempo (HH:MM) a un objeto Date
 * Se usa para los time pickers
 */
const parseTimeToDate = (value, fallbackHour = 8) => {
  const date = new Date();
  let hours = fallbackHour;
  let minutes = 0;

  if (value) {
    const base = value.split('-')[0].trim();
    const [h, m] = base.split(':');
    const parsedH = parseInt(h, 10);
    const parsedM = parseInt(m || '0', 10);

    if (!Number.isNaN(parsedH)) hours = parsedH;
    if (!Number.isNaN(parsedM)) minutes = parsedM;
  }

  date.setHours(hours, minutes, 0, 0);
  return date;
};

/**
 * Formatea un objeto Date a una cadena HH:MM
 */
const formatTime = (date) => {
  if (!date) return '';
  const h = date.getHours().toString().padStart(2, '0');
  const m = date.getMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
};

/**
 * Convierte una hora (HH:MM) a minutos desde medianoche
 * Se usa para validar que el horario de inicio sea menor al de fin
 */
const timeToMinutes = (value) => {
  if (!value) return null;
  const [h, m = '0'] = value.split(':');
  const hours = parseInt(h, 10);
  const minutes = parseInt(m, 10);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
  return hours * 60 + minutes;
};

// ===========================
// COMPONENTE PRINCIPAL
// ===========================

/**
 * MembersAdmin: Pantalla de gestión de miembros del grupo
 * 
 * Permite al administrador:
 * - Ver lista de miembros de un grupo seleccionado
 * - Buscar miembros por nombre o grupo
 * - Crear, editar y eliminar grupos
 * - Editar información de miembros (horarios, puesto, experiencia)
 * - Remover miembros de un grupo
 * - Compartir código de invitación del grupo
 * - Ver advertencias de datos incompletos
 */
export default function MembersAdmin({ navigation }) {
  // ===========================
  // ESTADOS
  // ===========================

  // Estados para carga de datos desde Firebase
  const [loading, setLoading] = useState(true); // Indica si se están cargando datos iniciales
  const [adminData, setAdminData] = useState(null); // Datos del administrador logueado

  // Estados para búsqueda y filtros
  const [searchQuery, setSearchQuery] = useState(''); // Texto de búsqueda de miembros
  const [selectedGroup, setSelectedGroup] = useState(null); // Grupo actualmente seleccionado
  const [showGroupSelectModal, setShowGroupSelectModal] = useState(false); // Modal de selección de grupo // Modal de selección de grupo

  // Estados para control de modales
  const [showManageGroupsModal, setShowManageGroupsModal] = useState(false); // Modal de gestión general de grupos (con 4 opciones)
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false); // Modal para crear nuevo grupo
  const [showEditGroupModal, setShowEditGroupModal] = useState(false); // Modal para editar grupo existente
  const [showDeleteGroupModal, setShowDeleteGroupModal] = useState(false); // Modal para eliminar grupo
  const [showShareModal, setShowShareModal] = useState(false); // Modal para compartir directorio del equipo
  const [showInviteCodeModal, setShowInviteCodeModal] = useState(false); // Modal con código de invitación // Modal con código de invitación

  // Estados para formularios de grupos
  const [newGroupName, setNewGroupName] = useState(''); // Nombre del nuevo grupo a crear
  const [newGroupDescription, setNewGroupDescription] = useState(''); // Descripción del nuevo grupo
  const [editingGroup, setEditingGroup] = useState(null); // Grupo que se está editando
  const [deletingGroup, setDeletingGroup] = useState(null); // Grupo que se va a eliminar

  // Estados para modal de información general (InfoModal)
  const [showModal, setShowModal] = useState(false); // Controla visibilidad del modal
  const [modalTitle, setModalTitle] = useState(''); // Título del mensaje (Éxito/Error)
  const [modalMessage, setModalMessage] = useState(''); // Mensaje detallado

  // Estados para datos cargados desde Firebase
  const [groups, setGroups] = useState([]); // Lista de grupos del administrador
  const [members, setMembers] = useState([]); // Lista de miembros del grupo seleccionado // Lista de miembros del grupo seleccionado

  // Estados para edición de miembros
  const [showEditMemberModal, setShowEditMemberModal] = useState(false); // Modal de edición de miembro
  const [editingMember, setEditingMember] = useState(null); // Miembro que se está editando
  const [editFormData, setEditFormData] = useState({ // Datos del formulario de edición
    position: '', // Puesto del miembro
    experience: '', // Años de experiencia
    availableDays: '', // Días disponibles (formato: "Lun • Mar • Mié")
    startTime: '08:00', // Hora de inicio de jornada
    endTime: '17:00', // Hora de fin de jornada
    mealTime: '', // Hora de comida
    daysOff: '', // Días libres
  });
  const [timePickerIOS, setTimePickerIOS] = useState({ // Estado para time picker en iOS
    field: null, // Campo que se está editando ('startTime', 'endTime', 'mealTime')
    value: new Date(), // Valor actual del picker
    visible: false, // Visibilidad del picker
  });

  // Estados para notificaciones
  const [showNotifications, setShowNotifications] = useState(false); // Modal de notificaciones
  const [unreadCount, setUnreadCount] = useState(0); // Cantidad de notificaciones no leídas // Cantidad de notificaciones no leídas

  // ===========================
  // VALORES COMPUTADOS (useMemo)
  // ===========================

  // Días de trabajo seleccionados (parsea availableDays para mostrarlo en chips)
  const selectedWorkDays = useMemo(
    () => parseDays(editFormData.availableDays),
    [editFormData.availableDays],
  );
  
  // Días libres seleccionados (parsea daysOff para mostrarlo en chips)
  const selectedOffDays = useMemo(
    () => parseDays(editFormData.daysOff),
    [editFormData.daysOff],
  );

  // ===========================
  // EFECTOS (useEffect)
  // ===========================

  // Cargar datos del admin al montar el componente
  useEffect(() => {
    loadAdminData(); // Cargar grupos del admin
    loadNotifications(); // Cargar notificaciones no leídas
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

  /**
   * Carga los datos del administrador y sus grupos desde Firebase
   * Se ejecuta al montar el componente
   */
  const loadAdminData = async () => {
    try {
      const user = getCurrentUser();
      if (!user) {
        setModalTitle("Error");
        setModalMessage("No hay sesión activa");
        setShowModal(true);
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
          const groupsData = await getGroupsByIds(data.groupIds);
          setGroups(groupsData);
        } else {
          // Si no tiene grupos asignados, dejar el array vacío
          setGroups([]);
        }
      } else {
        setModalTitle("Error");
        setModalMessage("No se encontraron datos del administrador");
        setShowModal(true);
      }
    } catch (error) {
      setModalTitle("Error");
      setModalMessage("Error al cargar datos del administrador");
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Carga los miembros de un grupo específico desde Firebase
   * @param {string} groupId - ID del grupo a cargar
   */
  const loadGroupMembers = async (groupId) => {
    try {
      // Obtener el grupo para acceder a su array de memberIds
      const groupDoc = await getDoc(doc(db, "groups", groupId));

      if (!groupDoc.exists()) {
        setMembers([]);
        return;
      }

      const groupData = groupDoc.data();
      const memberIds = groupData.memberIds || [];

      if (memberIds.length === 0) {
        setMembers([]);
        return;
      }

      // Cargar datos de cada miembro
      const membersData = [];
      for (const memberId of memberIds) {
        try {
          const userDoc = await getDoc(doc(db, "users", memberId));
          if (userDoc.exists()) {
            const userData = userDoc.data();

            // Compatibilidad con formato antiguo y nuevo
            // Si los datos están en availability.*, usarlos; si no, usar los del nivel raíz
            const availableDays = userData.availableDays ||
              (userData.availability?.availableDays ?
                userData.availability.availableDays.join(' • ') : '');
            const startTime = userData.startTime || userData.availability?.startTime || '';
            const endTime = userData.endTime || userData.availability?.endTime || '';
            const mealTime = userData.mealTime || userData.availability?.mealTime || '';
            const daysOff = userData.daysOff ||
              (userData.availability?.daysOff ?
                userData.availability.daysOff.join(' • ') : '');

            membersData.push({
              id: userDoc.id,
              name: userData.name || 'Sin nombre',
              group: selectedGroup?.name || 'Sin grupo',
              groupId: groupId,
              nextShift: 'Sin turno asignado',
              experience: userData.experience || 'N/A',
              status: userData.status || 'Disponible',
              shiftsThisWeek: userData.stats?.shiftsThisWeek || 0,
              lastActive: 'Reciente',
              avatar: userData.avatar || userData.photo || null,
              phone: userData.phone || '',
              position: userData.position || '',
              // Campos adicionales para mostrar en la card
              availableDays,
              startTime,
              endTime,
              mealTime,
              daysOff,
            });
          }
        } catch (error) {
          console.error(`Error al cargar usuario ${memberId}:`, error);
        }
      }

      setMembers(membersData);
    } catch (error) {
      console.error("Error al cargar miembros del grupo:", error);
      setMembers([]);
    }
  };

  // ===========================
  // FUNCIONES DE FILTRADO
  // ===========================

  /**
   * Filtra los miembros según el texto de búsqueda
   * Si no hay búsqueda activa, muestra todos los miembros del grupo seleccionado
   */
  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (member.group && member.group.toLowerCase().includes(searchQuery.toLowerCase()));

    // Si hay búsqueda activa, solo filtrar por búsqueda
    if (searchQuery) {
      return matchesSearch;
    }

    // Si no hay búsqueda, mostrar todos los miembros del grupo seleccionado
    // (ya están filtrados por grupo en loadGroupMembers)
    return true;
  });

  // ===========================
  // FUNCIONES CRUD DE GRUPOS
  // ===========================

  /**
   * Crea un nuevo grupo en Firebase
   * Valida que el nombre no esté vacío
   */
  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) {
      setModalTitle('Error');
      setModalMessage('Por favor ingresa un nombre de grupo');
      setShowModal(true);
      return;
    }

    try {
      const user = getCurrentUser();
      if (!user) {
        setModalTitle('Error');
        setModalMessage('No hay sesión activa');
        setShowModal(true);
        return;
      }

      // Crear grupo en Firebase con descripción
      const groupId = await createGroup(newGroupName, user.uid, newGroupDescription);

      // Recargar grupos para reflejar el cambio
      await loadAdminData();

      setNewGroupName('');
      setNewGroupDescription('');
      setShowCreateGroupModal(false);
      setModalTitle('Éxito');
      setModalMessage('Grupo creado exitosamente');
      setShowModal(true);
    } catch (error) {
      setModalTitle('Error');
      setModalMessage('Error al crear el grupo: ' + error.message);
      setShowModal(true);
    }
  };

  /**
   * Actualiza un grupo existente en Firebase
   * Permite cambiar nombre y descripción
   */
  const handleEditGroup = async () => {
    if (!editingGroup || !editingGroup.name.trim()) {
      setModalTitle('Error');
      setModalMessage('Por favor ingresa un nombre válido para el grupo');
      setShowModal(true);
      return;
    }

    try {
      // Actualizar grupo en Firebase incluyendo descripción
      await updateGroup(editingGroup.id, {
        name: editingGroup.name,
        description: editingGroup.description || ''
      });

      // Recargar grupos para reflejar el cambio
      await loadAdminData();

      // Actualizar miembros con el nuevo nombre de grupo (mock data)
      setMembers(members.map(m =>
        m.groupId === editingGroup.id ? { ...m, group: editingGroup.name } : m
      ));

      setShowEditGroupModal(false);
      setEditingGroup(null);
      setModalTitle('Éxito');
      setModalMessage('Grupo actualizado exitosamente');
      setShowModal(true);
    } catch (error) {
      setModalTitle('Error');
      setModalMessage('Error al actualizar el grupo: ' + error.message);
      setShowModal(true);
    }
  };

  /**
   * Elimina un grupo de Firebase
   * Valida que el grupo no tenga miembros antes de eliminar
   */
  const handleDeleteGroup = async () => {
    if (!deletingGroup) return;

    try {
      const user = getCurrentUser();
      if (!user) {
        setModalTitle('Error');
        setModalMessage('No hay sesión activa');
        setShowModal(true);
        return;
      }

      // Verificar si tiene miembros (mock data)
      const hasMembers = members.some(m => m.groupId === deletingGroup.id);

      if (hasMembers) {
        setModalTitle('Error');
        setModalMessage('No se puede eliminar un grupo con miembros activos');
        setShowModal(true);
        setShowDeleteGroupModal(false);
        setDeletingGroup(null);
        return;
      }

      // Eliminar grupo en Firebase
      await deleteGroup(deletingGroup.id, user.uid);

      // Recargar grupos para reflejar el cambio
      await loadAdminData();

      setShowDeleteGroupModal(false);
      setDeletingGroup(null);
      setModalTitle('Éxito');
      setModalMessage('Grupo eliminado exitosamente');
      setShowModal(true);
    } catch (error) {
      setModalTitle('Error');
      setModalMessage('Error al eliminar el grupo: ' + error.message);
      setShowModal(true);
      setShowDeleteGroupModal(false);
      setDeletingGroup(null);
    }
  };

  /**
   * Función placeholder para compartir directorio
   * TODO: Implementar funcionalidad completa de compartir
   */
  const handleShare = () => {
    // TODO: Implement share functionality
    setShowShareModal(false);
    setModalTitle('Éxito');
    setModalMessage('Enlace copiado al portapapeles');
    setShowModal(true);
  };

  /**
   * Copia el código de invitación del grupo al portapapeles
   */
  const handleCopyInviteCode = async () => {
    if (selectedGroup?.inviteCode) {
      await Clipboard.setStringAsync(selectedGroup.inviteCode);
      setModalTitle('Éxito');
      setModalMessage('Código copiado al portapapeles');
      setShowModal(true);
    }
  };

  // ===========================
  // FUNCIONES DE EDICIÓN DE MIEMBROS
  // ===========================

  /**
   * Verifica si un miembro tiene datos incompletos
   * Se usa para mostrar el icono de advertencia en la card
   */
  const hasIncompleteData = (member) => {
    return !member.position ||
      !member.experience ||
      !member.startTime || member.startTime === 'N/A' ||
      !member.endTime || member.endTime === 'N/A' ||
      !member.availableDays || member.availableDays === 'N/A';
  };

  /**
   * Abre el modal de edición de miembro
   * Pre-carga el formulario con los datos actuales del miembro
   */
  const handleOpenEditMember = (member) => {
    setEditingMember(member);
    setEditFormData({
      position: member.position || '',
      experience: member.experience || '',
      availableDays: member.availableDays || '',
      startTime: member.startTime || '08:00',
      endTime: member.endTime || '17:00',
      mealTime: member.mealTime || '',
      daysOff: member.daysOff || '',
    });
    setShowEditMemberModal(true);
  };

  /**
   * Guarda los cambios del miembro en Firebase
   * Valida:
   * - Puesto no vacío
   * - Al menos un día de trabajo seleccionado
   * - Días libres no coincidan con días de trabajo
   * - Horarios válidos (inicio < fin)
   * - Horario de comida dentro de la jornada
   */
  const handleSaveEditMember = async () => {
    const workDays = parseDays(editFormData.availableDays);
    const offDays = parseDays(editFormData.daysOff);

    if (!editFormData.position.trim()) {
      setModalTitle('Error');
      setModalMessage('El puesto es obligatorio');
      setShowModal(true);
      return;
    }

    if (!workDays.length) {
      setModalTitle('Error');
      setModalMessage('Selecciona al menos un día de trabajo');
      setShowModal(true);
      return;
    }

    if (offDays.some((d) => workDays.includes(d))) {
      setModalTitle('Error');
      setModalMessage('Los días libres no pueden coincidir con los días de trabajo');
      setShowModal(true);
      return;
    }

    if (!editFormData.startTime || !editFormData.endTime) {
      setModalTitle('Error');
      setModalMessage('Horarios de inicio y fin son obligatorios');
      setShowModal(true);
      return;
    }

    const startMinutes = timeToMinutes(editFormData.startTime);
    const endMinutes = timeToMinutes(editFormData.endTime);
    const mealMinutes = editFormData.mealTime ? timeToMinutes(editFormData.mealTime) : null;

    if (startMinutes === null || endMinutes === null) {
      setModalTitle('Error');
      setModalMessage('Formato de horario inválido');
      setShowModal(true);
      return;
    }

    if (editFormData.mealTime && mealMinutes === null) {
      setModalTitle('Error');
      setModalMessage('Formato de horario de comida inválido');
      setShowModal(true);
      return;
    }

    if (startMinutes >= endMinutes) {
      setModalTitle('Error');
      setModalMessage('El horario de inicio debe ser menor al de fin');
      setShowModal(true);
      return;
    }

    if (mealMinutes !== null && (mealMinutes <= startMinutes || mealMinutes >= endMinutes)) {
      setModalTitle('Error');
      setModalMessage('El horario de comida debe estar dentro de la jornada');
      setShowModal(true);
      return;
    }

    try {
      // Actualizar el documento del usuario en Firebase
      const userRef = doc(db, 'users', editingMember.id);
      await updateDoc(userRef, {
        position: editFormData.position,
        experience: editFormData.experience,
        availableDays: editFormData.availableDays,
        startTime: editFormData.startTime,
        endTime: editFormData.endTime,
        mealTime: editFormData.mealTime,
        daysOff: editFormData.daysOff,
      });

      // Actualizar el estado local
      setMembers((prev) =>
        prev.map((m) => (m.id === editingMember.id ? { ...m, ...editFormData } : m))
      );

      setModalTitle('Éxito');
      setModalMessage('Datos del miembro actualizados correctamente');
      setShowModal(true);
      setShowEditMemberModal(false);
      setEditingMember(null);
    } catch (error) {
      console.error('Error al actualizar miembro:', error);
      setModalTitle('Error');
      setModalMessage('Error al actualizar los datos del miembro');
      setShowModal(true);
    }
  };

  /**
   * Remueve un miembro del grupo actual
   * Actualiza tanto la colección 'groups' como 'users'
   */
  const handleRemoveMemberFromGroup = async () => {
    if (!editingMember || !selectedGroup) return;

    try {
      // Remover del grupo
      await removeMemberFromGroup(selectedGroup.id, editingMember.id);

      // Remover del usuario
      await removeUserFromGroup(editingMember.id, selectedGroup.id);

      // Actualizar el estado local
      setMembers((prev) => prev.filter((m) => m.id !== editingMember.id));

      setModalTitle('Éxito');
      setModalMessage(`${editingMember.name} ha sido removido del grupo ${selectedGroup.name}`);
      setShowModal(true);
      setShowEditMemberModal(false);
      setEditingMember(null);

      // Recargar datos del grupo
      if (selectedGroup) {
        await loadGroupMembers(selectedGroup.id);
      }
    } catch (error) {
      console.error('Error al remover miembro del grupo:', error);
      setModalTitle('Error');
      setModalMessage(`Error al remover el miembro del grupo: ${error.message}`);
      setShowModal(true);
    }
  };

  // ===========================
  // FUNCIONES DE UI Y UTILIDADES
  // ===========================

  /**
   * Abre el time picker nativo según la plataforma (Android/iOS)
   * @param {string} field - Campo a editar ('startTime', 'endTime', 'mealTime')
   */
  const openTimePicker = (field) => {
    const currentValue = editFormData[field];
    const initialDate = parseTimeToDate(
      currentValue,
      field === 'endTime' ? 17 : 8,
    );

    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: initialDate,
        mode: 'time',
        is24Hour: true,
        onChange: (event, selectedDate) => {
          if (event.type === 'set' && selectedDate) {
            const newTime = formatTime(selectedDate);
            setEditFormData((prev) => ({ ...prev, [field]: newTime }));
          }
        },
      });
    } else {
      setTimePickerIOS({
        field,
        value: initialDate,
        visible: true,
      });
    }
  };

  /**
   * Retorna el estilo correspondiente según el estado del miembro
   */
  const getStatusStyle = (status) => {
    if (status === 'Disponible') return styles.statusAvailable;
    if (status === 'Libre hoy') return styles.statusOff;
    if (status === 'Permiso solicitado') return styles.statusLeave;
    return styles.statusDefault;
  };

  /**
   * Maneja la selección de un grupo desde el modal
   * Carga automáticamente los miembros del grupo
   */
  const handleGroupSelect = (group) => {
    setSelectedGroup(group);
    setShowGroupSelectModal(false);
    // Cargar miembros del grupo seleccionado
    loadGroupMembers(group.id);
  };

  // ===========================
  // FUNCIONES DE RENDERIZADO (FlatList)
  // ===========================

  /**
   * Renderiza una card de miembro
   * Muestra diferentes layouts según si hay búsqueda activa o no
   */
  const renderMemberCard = ({ item: member }) => {
    // Si hay búsqueda activa, mostrar todos los resultados
    if (searchQuery) {
      return (
        <View style={styles.memberCard}>
          <View style={styles.memberHeader}>
            <View style={styles.memberInfo}>
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={24} color={COLORS.primary} />
              </View>
              <View style={styles.memberDetails}>
                <View style={styles.nameRow}>
                  <Text style={styles.memberName}>{member.name}</Text>
                  <Text style={styles.memberGroup}> • {member.group}</Text>
                </View>
                <Text style={styles.memberShift}>Días: {member.availableDays || 'No especificado'}</Text>
                <Text style={styles.memberExperience}>Horario: {member.startTime && member.endTime ? `${member.startTime} - ${member.endTime}` : 'No especificado'}</Text>
                <Text style={styles.memberExperience}>Experiencia: {member.experience}</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              {hasIncompleteData(member) && (
                <Ionicons name="warning" size={20} color={COLORS.error} />
              )}
              <Pressable
                style={({ pressed }) => [styles.moreButton, pressed && { opacity: 0.7 }]}
                onPress={() => handleOpenEditMember(member)}
              >
                <Ionicons name="ellipsis-horizontal" size={20} color={COLORS.textBlack} />
              </Pressable>
            </View>
          </View>

          <View style={styles.memberFooter}>
            <View style={[styles.statusBadge, getStatusStyle(member.status)]}>
              <Text style={styles.statusText}>{member.status}</Text>
            </View>
          </View>
        </View>
      );
    }

    // Si no hay búsqueda, solo mostrar si hay grupo seleccionado
    if (!selectedGroup) return null;

    return (
      <View style={styles.memberCard}>
        <View style={styles.memberHeader}>
          <View style={styles.memberInfo}>
            {member.avatar ? (
              <Image
                source={{ uri: member.avatar }}
                style={styles.avatarPlaceholder}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={24} color={COLORS.primary} />
              </View>
            )}
            <View style={styles.memberDetails}>
              <View style={styles.nameRow}>
                <Text style={styles.memberName}>{member.name}</Text>
                <Text style={styles.memberGroup}> • {member.group}</Text>
              </View>
              <Text style={styles.memberShift}>Días: {member.availableDays || 'No especificado'}</Text>
              <Text style={styles.memberExperience}>Horario: {member.startTime && member.endTime ? `${member.startTime} - ${member.endTime}` : 'No especificado'}</Text>
              <Text style={styles.memberExperience}>Experiencia: {member.experience}</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            {hasIncompleteData(member) && (
              <Ionicons name="warning" size={20} color={COLORS.error} />
            )}
            <Pressable
              style={({ pressed }) => [styles.moreButton, pressed && { opacity: 0.7 }]}
              onPress={() => handleOpenEditMember(member)}
            >
              <Ionicons name="ellipsis-horizontal" size={20} color={COLORS.textBlack} />
            </Pressable>
          </View>
        </View>

        <View style={styles.memberFooter}>
          <View style={[styles.statusBadge, getStatusStyle(member.status)]}>
            <Text style={styles.statusText}>{member.status}</Text>
          </View>
        </View>
      </View>
    );
  };

  /**
   * Renderiza el header de la lista
   * Incluye:
   * - Barra de búsqueda
   * - Selector de grupo
   * - Botones de acción (Crear, Editar, Eliminar, Agregar Miembro)
   * - Banner de advertencia si hay datos incompletos
   */
  const renderListHeader = () => (
    <>
      {/* Team Directory Section */}
      {/* Team Directory Section */}
      <Text style={styles.directoryTitle}>Buscar un miembro</Text>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color={COLORS.textGray} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={COLORS.textGray}
        />
      </View>

      {!searchQuery && (
        <>
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

          {/* Active Members Section Header */}
          <View style={styles.sectionHeaderCentered}>
            <Text style={styles.sectionTitleCentered}>Miembros Activos</Text>
          </View>

          {/* Group Management Actions */}
          <View style={styles.groupActionsContainer}>
            <Pressable
              style={({ pressed }) => [styles.groupActionButton, styles.createGroupButton, pressed && { opacity: 0.7 }]}
              onPress={() => setShowCreateGroupModal(true)}
            >
              <Ionicons name="add-circle-outline" size={20} color={COLORS.textGreen} />
              <Text style={styles.createGroupButtonText}>Crear Grupo</Text>
            </Pressable>

            {selectedGroup && (
              <>
                <Pressable
                  style={({ pressed }) => [styles.groupActionButton, styles.editGroupButton, pressed && { opacity: 0.7 }]}
                  onPress={() => {
                    if (groups.length === 0) {
                      setModalTitle('Error');
                      setModalMessage('No hay grupos disponibles para editar');
                      setShowModal(true);
                      return;
                    }
                    setEditingGroup(groups[0]);
                    setShowEditGroupModal(true);
                  }}
                >
                  <Ionicons name="create-outline" size={20} color={COLORS.textGreen} />
                  <Text style={styles.editGroupButtonText}>Editar Grupo</Text>
                </Pressable>

                <Pressable
                  style={({ pressed }) => [styles.groupActionButton, styles.deleteGroupButton, pressed && { opacity: 0.7 }]}
                  onPress={() => {
                    if (groups.length === 0) {
                      setModalTitle('Error');
                      setModalMessage('No hay grupos disponibles para eliminar');
                      setShowModal(true);
                      return;
                    }
                    setDeletingGroup(groups[0]);
                    setShowDeleteGroupModal(true);
                  }}
                >
                  <Ionicons name="trash-outline" size={20} color={COLORS.error} />
                  <Text style={styles.deleteGroupButtonText}>Eliminar Grupo</Text>
                </Pressable>

                <Pressable
                  style={({ pressed }) => [styles.groupActionButton, styles.shareGroupButton, pressed && { opacity: 0.7 }]}
                  onPress={() => {
                    if (selectedGroup && selectedGroup.inviteCode) {
                      setShowInviteCodeModal(true);
                    } else {
                      setModalTitle('Error');
                      setModalMessage('No se pudo obtener el código de invitación del grupo');
                      setShowModal(true);
                    }
                  }}
                >
                  <Ionicons name="person-add-outline" size={20} color={COLORS.textGreen} />
                  <Text style={styles.shareGroupButtonText}>Agregar Miembro</Text>
                </Pressable>
              </>
            )}
          </View>

          {/* Warning Explanation Banner */}
          {selectedGroup && members.some(m => hasIncompleteData(m)) && (
            <View style={styles.warningBannerContainer}>
              <Ionicons name="warning" size={24} color="#b60000ff" style={styles.warningIcon} />
              <View style={styles.warningTextContainer}>
                <Text style={styles.warningTitle}>
                  Información Incompleta Detectada
                </Text>
                <Text style={styles.warningDescription}>
                  El icono de advertencia indica miembros con horarios o puesto sin asignar. Pulse los tres puntos (...) para actualizar su información.
                </Text>
              </View>
            </View>
          )}
        </>
      )}

      {searchQuery && (
        <View style={styles.sectionHeaderCentered}>
          <Text style={styles.sectionTitleCentered}>
            Resultados de búsqueda ({filteredMembers.length})
          </Text>
        </View>
      )}
    </>
  );

  /**
   * Renderiza el footer de la lista
   * Muestra la distribución de roles por grupo
   * Si no hay grupo seleccionado, muestra mensaje informativo
   */
  const renderListFooter = () => {
    // Si hay búsqueda activa, no mostrar distribución
    if (searchQuery) {
      return null;
    }

    if (!selectedGroup) {
      return (
        <View style={CalendarAdminStyles.noGroupSelected}>
          <Ionicons name="people-outline" size={64} color={COLORS.textGray} />
          <Text style={CalendarAdminStyles.noGroupSelectedTitle}>No hay grupo seleccionado</Text>
          <Text style={CalendarAdminStyles.noGroupSelectedText}>
            Selecciona un grupo para ver los miembros activos y la distribución de roles
          </Text>
        </View>
      );
    }

    // Verificar si el grupo seleccionado tiene miembros
    const groupHasMembers = members.some(m => m.groupId === selectedGroup.id);

    // Si el grupo está vacío, no mostrar distribución
    if (!groupHasMembers) {
      return null;
    }

    return (
      <>
        {/* Role Distribution Section */}
        <View style={styles.distributionCard}>
          <View style={styles.distributionHeader}>
            <Text style={styles.distributionTitle}>Distribucion de miembros en grupos</Text>
          </View>
          {groups.length > 0 ? (
            groups.map(group => (
              <View key={group.id} style={styles.distributionRow}>
                <Text style={styles.groupName}>{group.name}</Text>
                <Text style={styles.groupCount}>
                  {group.memberCount || 0} miembros
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyStateText}>No hay datos disponibles</Text>
          )}
        </View>
      </>
    );
  };

  /**
   * Renderiza el componente cuando la lista está vacía
   * Muestra mensajes diferentes según el contexto:
   * - Búsqueda sin resultados
   * - Grupo sin miembros
   * - Sin grupo seleccionado
   */
  const renderEmptyComponent = () => {
    // Si hay búsqueda activa y no hay resultados
    if (searchQuery) {
      return (
        <View style={styles.emptyState}>
          <Ionicons name="search-outline" size={48} color={COLORS.textGray} />
          <Text style={styles.emptyStateText}>No se encontraron miembros que coincidan con "{searchQuery}"</Text>
        </View>
      );
    }

    // Si hay grupo seleccionado pero no tiene miembros
    if (selectedGroup) {
      return (
        <View style={styles.emptyState}>
          <Ionicons name="people-outline" size={48} color={COLORS.textGray} />
          <Text style={styles.emptyStateText}>Este grupo aún no tiene miembros</Text>
          <Text style={[styles.emptyStateText, { fontSize: 14, marginTop: 8 }]}>
            Comparte el código de invitación para agregar miembros
          </Text>
        </View>
      );
    }

    // Si no hay grupo seleccionado, no mostrar nada (ya se muestra el mensaje en renderListFooter)
    return null;
  };

  // ===========================
  // RENDERIZADO PRINCIPAL
  // ===========================

  // Pantalla de carga mientras se cargan los datos iniciales
  if (loading) {
    return (
      <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
        <HeaderScreen
          title="Miembros"
          leftIcon={<Ionicons name="arrow-back" size={24} color={COLORS.textBlack} />}
          onLeftPress={() => navigation.goBack()}
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
        title="Miembros"
        leftIcon={<Ionicons name="arrow-back" size={24} color={COLORS.textBlack} />}
        onLeftPress={() => navigation.goBack()}
        rightIcon={<Ionicons name="notifications-outline" size={24} color={COLORS.textBlack} />}
        onRightPress={() => setShowNotifications(true)}
        badgeCount={unreadCount}
      />



      <FlatList
        data={filteredMembers}
        renderItem={renderMemberCard}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderListHeader}
        ListFooterComponent={renderListFooter}
        ListEmptyComponent={renderEmptyComponent}
        contentContainerStyle={styles.flatListContent}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.footerContainer}>
        <MenuFooterAdmin />
      </View>

      {/* Manage Groups Modal */}
      <Modal
        visible={showManageGroupsModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowManageGroupsModal(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setShowManageGroupsModal(false)}
        >
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>Gestionar Grupos</Text>
            <Text style={styles.modalDescription}>
              Crea, edita, elimina grupos o comparte tu directorio de equipo.
            </Text>
            <View style={styles.manageGroupsButtons}>
              <Pressable
                style={({ pressed }) => [styles.manageGroupButton, styles.createButton, pressed && { opacity: 0.7 }]}
                onPress={() => {
                  setShowManageGroupsModal(false);
                  setShowCreateGroupModal(true);
                }}
              >
                <Ionicons name="add-circle-outline" size={24} color={COLORS.textWhite} />
                <Text style={styles.manageGroupButtonText}>Crear Grupo</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [styles.manageGroupButton, styles.editButton, pressed && { opacity: 0.7 }]}
                onPress={() => {
                  setShowManageGroupsModal(false);
                  if (groups.length === 0) {
                    setModalTitle('Error');
                    setModalMessage('No hay grupos para editar');
                    setShowModal(true);
                    return;
                  }
                  setEditingGroup(groups[0]);
                  setShowEditGroupModal(true);
                }}
              >
                <Ionicons name="create-outline" size={24} color={COLORS.textWhite} />
                <Text style={styles.manageGroupButtonText}>Editar Grupo</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [styles.manageGroupButton, styles.deleteButton, pressed && { opacity: 0.7 }]}
                onPress={() => {
                  setShowManageGroupsModal(false);
                  if (groups.length === 0) {
                    setModalTitle('Error');
                    setModalMessage('No hay grupos para eliminar');
                    setShowModal(true);
                    return;
                  }
                  setDeletingGroup(groups[0]);
                  setShowDeleteGroupModal(true);
                }}
              >
                <Ionicons name="trash-outline" size={24} color={COLORS.textWhite} />
                <Text style={styles.manageGroupButtonText}>Eliminar Grupo</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [styles.manageGroupButton, styles.shareButton, pressed && { opacity: 0.7 }]}
                onPress={() => {
                  setShowManageGroupsModal(false);
                  if (selectedGroup && selectedGroup.inviteCode) {
                    setShowInviteCodeModal(true);
                  } else {
                    setModalTitle('Error');
                    setModalMessage('No se pudo obtener el código de invitación del grupo');
                    setShowModal(true);
                  }
                }}
              >
                <Ionicons name="person-add-outline" size={24} color={COLORS.textWhite} />
                <Text style={styles.manageGroupButtonText}>Agregar Miembro</Text>
              </Pressable>
            </View>
            <Pressable
              style={({ pressed }) => [styles.modalButton, styles.modalButtonCancel, { marginTop: 16 }, pressed && { opacity: 0.7 }]}
              onPress={() => setShowManageGroupsModal(false)}
            >
              <Ionicons name="close-circle-outline" size={20} color={COLORS.error} />
              <Text style={styles.modalButtonTextCancel}>Cerrar</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Create Group Modal */}
      <Modal
        visible={showCreateGroupModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCreateGroupModal(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setShowCreateGroupModal(false)}
        >
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>Crear Nuevo Grupo</Text>
            <View style={styles.modalInputContainer}>
              <Text style={styles.modalLabel}>Nombre del Grupo</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Ingresa el nombre del grupo"
                value={newGroupName}
                onChangeText={setNewGroupName}
                placeholderTextColor={COLORS.textGray}
              />
              <Text style={[styles.modalLabel, { marginTop: 16 }]}>Descripción (Opcional)</Text>
              <TextInput
                style={[styles.modalInput, { minHeight: 80, textAlignVertical: 'top' }]}
                placeholder="Describe el propósito del grupo"
                value={newGroupDescription}
                onChangeText={setNewGroupDescription}
                placeholderTextColor={COLORS.textGray}
                multiline
                numberOfLines={3}
              />
            </View>
            <View style={styles.modalButtons}>
              <Pressable
                style={({ pressed }) => [styles.modalButton, styles.modalButtonCancel, pressed && { opacity: 0.7 }]}
                onPress={() => {
                  setShowCreateGroupModal(false);
                  setNewGroupName('');
                  setNewGroupDescription('');
                }}
              >
                <Ionicons name="close-circle-outline" size={20} color={COLORS.error} />
                <Text style={styles.modalButtonTextCancel}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [styles.modalButton, styles.modalButtonConfirm, pressed && { opacity: 0.7 }]}
                onPress={handleCreateGroup}
              >
                <Ionicons name="checkmark-circle-outline" size={20} color={COLORS.textGreen} />
                <Text style={styles.modalButtonTextConfirm}>Crear</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Edit Group Modal */}
      <Modal
        visible={showEditGroupModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowEditGroupModal(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setShowEditGroupModal(false)}
        >
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>Editar Grupo</Text>
            <View style={styles.modalInputContainer}>
              <Text style={styles.modalLabel}>Seleccionar Grupo</Text>
              <View style={styles.groupSelectListSeparator} />
              <ScrollView style={styles.groupSelectList}>
                {groups.map(group => (
                  <Pressable
                    key={group.id}
                    style={({ pressed }) => [
                      styles.groupSelectItem,
                      editingGroup?.id === group.id && styles.groupSelectItemActive,
                      pressed && { opacity: 0.7 }
                    ]}
                    onPress={() => setEditingGroup({ ...group })}
                  >
                    <Text style={[
                      styles.groupSelectText,
                      editingGroup?.id === group.id && styles.groupSelectTextActive
                    ]}>{group.name}</Text>
                  </Pressable>
                ))}
              </ScrollView>
              {editingGroup && (
                <>
                  <View style={styles.groupSelectListSeparator} />
                  <Text style={[styles.modalLabel, { marginTop: 16 }]}>Nuevo Nombre del Grupo</Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Ingresa el nuevo nombre del grupo"
                    value={editingGroup.name}
                    onChangeText={(text) => setEditingGroup({ ...editingGroup, name: text })}
                    placeholderTextColor={COLORS.textGray}
                  />
                  <Text style={[styles.modalLabel, { marginTop: 16 }]}>Descripción (Opcional)</Text>
                  <TextInput
                    style={[styles.modalInput, { minHeight: 80, textAlignVertical: 'top' }]}
                    placeholder="Describe el propósito del grupo"
                    value={editingGroup.description || ''}
                    onChangeText={(text) => setEditingGroup({ ...editingGroup, description: text })}
                    placeholderTextColor={COLORS.textGray}
                    multiline
                    numberOfLines={3}
                  />
                </>
              )}
            </View>
            <View style={styles.modalButtons}>
              <Pressable
                style={({ pressed }) => [styles.modalButton, styles.modalButtonCancel, pressed && { opacity: 0.7 }]}
                onPress={() => {
                  setShowEditGroupModal(false);
                  setEditingGroup(null);
                }}
              >
                <Ionicons name="close-circle-outline" size={20} color={COLORS.error} />
                <Text style={styles.modalButtonTextCancel}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [styles.modalButton, styles.modalButtonConfirm, pressed && { opacity: 0.7 }]}
                onPress={handleEditGroup}
              >
                <Ionicons name="checkmark-circle-outline" size={20} color={COLORS.textGreen} />
                <Text style={styles.modalButtonTextConfirm}>Guardar</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Delete Group Modal */}
      <Modal
        visible={showDeleteGroupModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteGroupModal(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setShowDeleteGroupModal(false)}
        >
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>Eliminar Grupo</Text>
            <View style={styles.modalInputContainer}>
              <Text style={styles.modalLabel}>Seleccionar Grupo a Eliminar</Text>
              <View style={styles.groupSelectListSeparator} />
              <ScrollView style={styles.groupSelectList}>
                {groups.map(group => (
                  <Pressable
                    key={group.id}
                    style={({ pressed }) => [
                      styles.groupSelectItem,
                      deletingGroup?.id === group.id && styles.groupSelectItemActive,
                      pressed && { opacity: 0.7 }
                    ]}
                    onPress={() => setDeletingGroup(group)}
                  >
                    <Text style={[
                      styles.groupSelectText,
                      deletingGroup?.id === group.id && styles.groupSelectTextActive
                    ]}>{group.name}</Text>
                    <Text style={styles.groupSelectCount}>
                      {group.memberCount || 0} miembros
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
              {deletingGroup && (
                <View style={styles.warningBox}>
                  <Ionicons name="warning-outline" size={20} color={COLORS.textRed} />
                  <Text style={styles.warningText}>
                    Esta acción no se puede deshacer. Los grupos con miembros no pueden ser eliminados.
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.modalButtons}>
              <Pressable
                style={({ pressed }) => [styles.modalButton, styles.modalButtonCancel, pressed && { opacity: 0.7 }]}
                onPress={() => {
                  setShowDeleteGroupModal(false);
                  setDeletingGroup(null);
                }}
              >
                <Ionicons name="close-circle-outline" size={20} color={COLORS.error} />
                <Text style={styles.modalButtonTextCancel}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [styles.modalButton, styles.modalButtonDelete, pressed && { opacity: 0.7 }]}
                onPress={handleDeleteGroup}
              >
                <Ionicons name="trash-outline" size={20} color={COLORS.textWhite} />
                <Text style={styles.modalButtonTextDelete}>Eliminar</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Share Modal */}
      <Modal
        visible={showShareModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowShareModal(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setShowShareModal(false)}
        >
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>Compartir Directorio de Equipo</Text>
            <Text style={styles.modalDescription}>
              Genera un enlace compartible al directorio del equipo. Los destinatarios tendrán acceso de solo lectura.
            </Text>
            <View style={styles.shareOptions}>
              <Pressable
                style={({ pressed }) => [styles.shareOption, pressed && { opacity: 0.7 }]}
                onPress={handleShare}
              >
                <Ionicons name="link-outline" size={24} color={COLORS.primary} />
                <Text style={styles.shareOptionText}>Copiar Enlace</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [styles.shareOption, pressed && { opacity: 0.7 }]}
                onPress={() => {
                  setShowShareModal(false);
                  setModalTitle('Información');
                  setModalMessage('Compartir por correo próximamente');
                  setShowModal(true);
                }}
              >
                <Ionicons name="mail-outline" size={24} color={COLORS.primary} />
                <Text style={styles.shareOptionText}>Enviar por Correo</Text>
              </Pressable>
            </View>
            <Pressable
              style={({ pressed }) => [styles.shareCloseButton, pressed && { opacity: 0.7 }]}
              onPress={() => setShowShareModal(false)}
            >
              <Ionicons name="close-circle" size={20} color={COLORS.error} />
              <Text style={styles.shareCloseButtonText}>Cerrar</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

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

      {/* Modal de Código de Invitación */}
      <Modal
        visible={showInviteCodeModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowInviteCodeModal(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setShowInviteCodeModal(false)}
        >
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <View style={styles.inviteModalIconContainer}>
              <Ionicons name="key-outline" size={48} color={COLORS.primary} />
            </View>
            <Text style={styles.modalTitle}>Código de Invitación</Text>
            <Text style={styles.modalDescription}>
              Comparte este código con los miembros para que puedan unirse al grupo "{selectedGroup?.name}"
            </Text>

            <Pressable
              style={styles.inviteCodeContainer}
              onPress={handleCopyInviteCode}
            >
              <Text style={styles.inviteCodeText}>
                {selectedGroup?.inviteCode || 'N/A'}
              </Text>
              <View style={{ marginTop: 8, flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="copy-outline" size={16} color={COLORS.textBlack} style={{ marginRight: 4 }} />
                <Text style={{ fontSize: 12, color: COLORS.textBlack, fontWeight: '600' }}>
                  Toca para copiar
                </Text>
              </View>
            </Pressable>

            <View style={styles.inviteInfoContainer}>
              <Ionicons name="information-circle-outline" size={20} color={COLORS.primary} style={{ marginRight: 8 }} />
              <Text style={styles.inviteInfoText}>
                Los miembros pueden usar este código en la opción "Unirme a un grupo" desde su pantalla de inicio
              </Text>
            </View>

            <Pressable
              style={({ pressed }) => [styles.inviteCloseButton, pressed && { opacity: 0.7 }]}
              onPress={() => setShowInviteCodeModal(false)}
            >
              <Ionicons name="checkmark-circle-outline" size={20} color={COLORS.textWhite} style={{ marginRight: 8 }} />
              <Text style={styles.inviteCloseButtonText}>Cerrar</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Modal de edición de miembro */}
      <Modal
        visible={showEditMemberModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEditMemberModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
            onPress={() => setShowEditMemberModal(false)}
          />

          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitleLarge}>
                Editar: {editingMember?.name}
              </Text>
              <Pressable onPress={() => setShowEditMemberModal(false)}>
                <Ionicons name="close" size={22} color={COLORS.textBlack} />
              </Pressable>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.modalScrollContent}
            >
              {/* Información laboral */}
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Información laboral</Text>

                <Text style={styles.fieldLabel}>Puesto</Text>
                <TextInput
                  style={styles.fieldInput}
                  placeholder="Ej. Supervisor de piso"
                  value={editFormData.position}
                  onChangeText={(text) =>
                    setEditFormData((prev) => ({ ...prev, position: text }))
                  }
                  placeholderTextColor={COLORS.textGray}
                />

                <Text style={styles.fieldLabel}>Experiencia</Text>
                <TextInput
                  style={styles.fieldInput}
                  placeholder="Años o breve descripción"
                  value={editFormData.experience}
                  onChangeText={(text) =>
                    setEditFormData((prev) => ({ ...prev, experience: text }))
                  }
                  placeholderTextColor={COLORS.textGray}
                  multiline
                />
              </View>

              {/* Disponibilidad y jornada */}
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Disponibilidad y jornada</Text>

                <Text style={styles.fieldLabel}>Días de trabajo</Text>
                <View style={styles.chipGroup}>
                  {WEEK_DAYS.map((day) => {
                    const isSelected = selectedWorkDays.includes(day);
                    return (
                      <Pressable
                        key={day}
                        style={({ pressed }) => [
                          styles.areaChip,
                          isSelected && styles.areaChipActive,
                          pressed && { opacity: 0.85 },
                        ]}
                        onPress={() => {
                          setEditFormData((prev) => {
                            const current = parseDays(prev.availableDays);
                            const updated = isSelected
                              ? current.filter((d) => d !== day)
                              : [...current, day];
                            return { ...prev, availableDays: formatDays(updated) };
                          });
                        }}
                      >
                        <Text
                          style={[
                            styles.areaChipText,
                            isSelected && styles.areaChipTextActive,
                          ]}
                        >
                          {day}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                <View style={styles.fieldRow}>
                  <View style={styles.fieldColumn}>
                    <Text style={styles.fieldLabel}>Horario inicio</Text>
                    <Pressable onPress={() => openTimePicker('startTime')}>
                      <View pointerEvents="none">
                        <TextInput
                          style={styles.fieldInput}
                          placeholder="08:00"
                          value={editFormData.startTime}
                          editable={false}
                          placeholderTextColor={COLORS.textGray}
                        />
                      </View>
                    </Pressable>
                  </View>
                  <View style={styles.fieldColumn}>
                    <Text style={styles.fieldLabel}>Horario fin</Text>
                    <Pressable onPress={() => openTimePicker('endTime')}>
                      <View pointerEvents="none">
                        <TextInput
                          style={styles.fieldInput}
                          placeholder="17:00"
                          value={editFormData.endTime}
                          editable={false}
                          placeholderTextColor={COLORS.textGray}
                        />
                      </View>
                    </Pressable>
                  </View>
                </View>

                <Text style={styles.fieldLabel}>Horario de comida</Text>
                <Pressable onPress={() => openTimePicker('mealTime')}>
                  <View pointerEvents="none">
                    <TextInput
                      style={styles.fieldInput}
                      placeholder="Ej. 14:00"
                      value={editFormData.mealTime}
                      editable={false}
                      placeholderTextColor={COLORS.textGray}
                    />
                  </View>
                </Pressable>

                <Text style={styles.fieldLabel}>Días libres</Text>
                <View style={styles.chipGroup}>
                  {WEEK_DAYS.map((day) => {
                    const isSelected = selectedOffDays.includes(day);
                    return (
                      <Pressable
                        key={day}
                        style={({ pressed }) => [
                          styles.areaChip,
                          isSelected && styles.areaChipActive,
                          pressed && { opacity: 0.85 },
                        ]}
                        onPress={() => {
                          setEditFormData((prev) => {
                            const current = parseDays(prev.daysOff);
                            const updated = isSelected
                              ? current.filter((d) => d !== day)
                              : [...current, day];
                            return { ...prev, daysOff: formatDays(updated) };
                          });
                        }}
                      >
                        <Text
                          style={[
                            styles.areaChipText,
                            isSelected && styles.areaChipTextActive,
                          ]}
                        >
                          {day}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              {/* Picker de hora para iOS */}
              {timePickerIOS.visible && Platform.OS === 'ios' && (
                <View style={{ marginTop: 8 }}>
                  <DateTimePicker
                    value={timePickerIOS.value}
                    mode="time"
                    is24Hour
                    display="spinner"
                    onChange={(event, selectedDate) => {
                      if (selectedDate && timePickerIOS.field) {
                        const newTime = formatTime(selectedDate);
                        const field = timePickerIOS.field;
                        setEditFormData((prev) => ({
                          ...prev,
                          [field]: newTime,
                        }));
                      }
                      setTimePickerIOS((prev) => ({
                        ...prev,
                        visible: false,
                      }));
                    }}
                  />
                </View>
              )}
            </ScrollView>

            {/* Botones del modal */}
            <View style={styles.modalButtonsColumn}>
              <Pressable
                style={({ pressed }) => [
                  styles.primaryButton,
                  pressed && { opacity: 0.9 },
                ]}
                onPress={handleSaveEditMember}
              >
                <Ionicons name="checkmark-circle-outline" size={20} color={COLORS.textWhite} />
                <Text style={styles.primaryButtonText}>Guardar cambios</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.removeButton,
                  pressed && { opacity: 0.9 },
                ]}
                onPress={handleRemoveMemberFromGroup}
              >
                <Ionicons name="person-remove-outline" size={20} color={COLORS.textWhite} />
                <Text style={styles.removeButtonText}>Remover del grupo</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Info Modal */}
      <InfoModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        title={modalTitle}
        message={modalMessage}
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

