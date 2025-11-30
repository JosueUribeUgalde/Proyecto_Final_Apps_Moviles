import { useMemo, useState, useEffect } from 'react';
import {Text, View, TextInput, Pressable, FlatList, Modal, ScrollView, Switch, Platform, ActivityIndicator, Linking} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, {DateTimePickerAndroid} from '@react-native-community/datetimepicker';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove, collection, query, where, getDocs } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { HeaderScreen, MenuFooterCompany } from '../../components';
import InfoModal from '../../components/InfoModal';
import { COLORS } from '../../components/constants/theme';
import styles from '../../styles/screens/company/MembersCompanyStyles';
import { getCurrentUser, registerUser, loginCompany } from '../../services/authService';
import { db, auth } from '../../config/firebaseConfig';

// Días de la semana para los chips
const WEEK_DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

const parseDays = (value) => {
  if (!value) return [];
  return value
    .split('•')
    .map((d) => d.trim())
    .filter(Boolean);
};

const formatDays = (days) => {
  if (!days || !days.length) return '';
  return days.join(' • ');
};

const parseTimeParts = (value, fallbackHour = null, fallbackMinutes = null) => {
  if (!value) return { hours: fallbackHour, minutes: fallbackMinutes };

  let raw = value.trim().toUpperCase();
  let period = null;

  if (raw.endsWith('AM') || raw.endsWith('PM')) {
    period = raw.slice(-2);
    raw = raw.slice(0, -2).trim();
  }

  const base = raw.split('-')[0].trim();
  const [h, m = '0'] = base.split(':');
  let hours = parseInt(h, 10);
  let minutes = parseInt(m, 10);

  const hasValidHours = !Number.isNaN(hours);
  const hasValidMinutes = !Number.isNaN(minutes);

  if (period === 'PM' && hasValidHours && hours < 12) hours += 12;
  if (period === 'AM' && hasValidHours && hours === 12) hours = 0;

  if (!hasValidHours) hours = fallbackHour;
  if (!hasValidMinutes) minutes = fallbackMinutes;

  return { hours, minutes };
};

const parseTimeToDate = (value, fallbackHour = 8) => {
  const date = new Date();
  const { hours, minutes } = parseTimeParts(value, fallbackHour, 0);
  date.setHours(hours, minutes, 0, 0);
  return date;
};

const formatTime = (date) => {
  if (!date) return '';
  const h = date.getHours().toString().padStart(2, '0');
  const m = date.getMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
};

const timeToMinutes = (value) => {
  const { hours, minutes } = parseTimeParts(value, null, null);
  if (hours === null || minutes === null || Number.isNaN(hours) || Number.isNaN(minutes)) return null;
  return hours * 60 + minutes;
};

const formatTimeWithPeriod = (value) => {
  const { hours, minutes } = parseTimeParts(value, null, null);
  if (hours === null || minutes === null || Number.isNaN(hours) || Number.isNaN(minutes)) return value || '';

  const displayHour = hours % 12 === 0 ? 12 : hours % 12;
  const period = hours >= 12 ? 'PM' : 'AM';
  return `${displayHour.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')} ${period}`;
};

// Formulario vacío
const createEmptyForm = () => ({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  role: 'Admin',
  position: '',
  experience: '',
  availableDays: '',
  startTime: '08:00',
  endTime: '17:00',
  mealTime: '',
  daysOff: '',
});

export default function MembersCompany({ navigation }) {
  // Estados principales
  const [members, setMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [adminsOnly, setAdminsOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [companyId, setCompanyId] = useState(null);

  // Estado de banner
  const [showBanner, setShowBanner] = useState(false);
  const [bannerMessage, setBannerMessage] = useState('');
  const [bannerType, setBannerType] = useState('success');

  // Estado de formulario / modal
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState(createEmptyForm());
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [shareTarget, setShareTarget] = useState(null);
  const [sharePassword, setSharePassword] = useState('');

  // Time picker para iOS
  const [timePickerIOS, setTimePickerIOS] = useState({
    field: null,
    value: new Date(),
    visible: false,
  });

  // Estado para mostrar/ocultar passwords
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Cargar administradores al montar
  useEffect(() => {
    loadMembersData();
  }, []);

  const loadMembersData = async () => {
    try {
      const user = getCurrentUser();
      if (!user) {
        setLoading(false);
        return;
      }

      setCompanyId(user.uid);
      // 1) Cargar administradores por companyId
      const adminsQuery = query(collection(db, 'admins'), where('companyId', '==', user.uid));
      const adminsSnap = await getDocs(adminsQuery);
      const adminsData = adminsSnap.docs.map((docItem) => ({
        id: docItem.id,
        ...docItem.data(),
        role: docItem.data()?.role || 'Admin',
        isAdmin: true,
      }));
      const adminIds = adminsData.map((a) => a.id);

      // 2) Cargar miembros (usuarios) de todos los grupos ligados a la empresa
      const memberIdSet = new Set();

      // 2a) Por companyId en grupos
      const groupsByCompany = query(collection(db, 'groups'), where('companyId', '==', user.uid));
      const groupsCompanySnap = await getDocs(groupsByCompany);
      groupsCompanySnap.forEach((docItem) => {
        const members = docItem.data()?.memberIds;
        if (Array.isArray(members)) {
          members.forEach((m) => memberIdSet.add(m));
        }
      });

      // 2b) Por adminId en grupos (para grupos que no tengan companyId grabado)
      const chunkSize = 10;
      for (let i = 0; i < adminIds.length; i += chunkSize) {
        const slice = adminIds.slice(i, i + chunkSize);
        const groupsByAdmin = query(collection(db, 'groups'), where('adminId', 'in', slice));
        const groupsAdminSnap = await getDocs(groupsByAdmin);
        groupsAdminSnap.forEach((docItem) => {
          const members = docItem.data()?.memberIds;
          if (Array.isArray(members)) {
            members.forEach((m) => memberIdSet.add(m));
          }
        });
      }

      const memberIds = Array.from(memberIdSet);

      // 3) Traer info básica de los usuarios (en grupos) en chunks de 10
      const usersData = [];
      // Filtramos por companyId para respetar reglas de Firestore y luego cruzamos con memberIds
      const usersByCompany = query(collection(db, 'users'), where('companyId', '==', user.uid));
      const usersSnap = await getDocs(usersByCompany);
      usersSnap.forEach((docItem) => {
        if (!memberIdSet.has(docItem.id)) return;
        const data = docItem.data() || {};
        usersData.push({
          id: docItem.id,
          name: data.name || data.fullName || 'Sin nombre',
          email: data.email || 'Sin email',
          position: data.position || data.title || '',
          role: data.role || 'Usuario',
          isAdmin: false,
        });
      });

      // 4) Unir admins + usuarios (sin duplicar por si algún id coincide)
      const combined = [...adminsData];
      const adminIdSet = new Set(adminIds);
      usersData.forEach((u) => {
        if (!adminIdSet.has(u.id)) combined.push(u);
      });

      setMembers(combined);
    } catch (error) {
      console.error('Error al cargar miembros:', error);
      setBannerMessage('Error al cargar miembros');
      setBannerType('error');
      setShowBanner(true);
    } finally {
      setLoading(false);
    }
  };

  // Días seleccionados (derivados del formulario)
  const selectedWorkDays = useMemo(
    () => parseDays(formData.availableDays),
    [formData.availableDays],
  );
  const selectedOffDays = useMemo(
    () => parseDays(formData.daysOff),
    [formData.daysOff],
  );

  // Filtro de miembros
  const filteredMembers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return members.filter((m) => {
      const matchesSearch =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q);

      const matchesRole = adminsOnly ? m.role === 'Admin' : true;

      return matchesSearch && matchesRole;
    });
  }, [members, searchQuery, adminsOnly]);

  // Funciones de manejo de miembros
  const getRoleBadgeStyle = (role) => {
    if (role === 'Admin') return styles.roleBadgeAdmin;
    if (role === 'Usuario') return styles.roleBadgeUser;
    return styles.roleBadgeDefault;
  };

  const openAddMember = () => {
    setEditingMember(null);
    setFormData(createEmptyForm());
    setShowFormModal(true);
  };

  const openEditMember = (member) => {
    if (!member?.isAdmin) {
      setBannerMessage('Solo puedes editar administradores');
      setBannerType('error');
      setShowBanner(true);
      return;
    }
    setEditingMember(member);
    setFormData({
      ...createEmptyForm(),
      ...member,
    });
    setShowFormModal(true);
  };

  const handleDeleteMember = async (member) => {
    if (!member?.isAdmin) {
      setBannerMessage('Solo puedes eliminar administradores desde esta pantalla');
      setBannerType('error');
      setShowBanner(true);
      return;
    }
    try {
      // Aquí podrías implementar la eliminación del array administradores
      // Por ahora solo actualizamos el estado local
      setMembers((prev) => prev.filter((m) => m.id !== member.id));
      setBannerMessage('Miembro eliminado');
      setBannerType('success');
      setShowBanner(true);
    } catch (error) {
      console.error('Error al eliminar miembro:', error);
      setBannerMessage('Error al eliminar miembro');
      setBannerType('error');
      setShowBanner(true);
    }
  };

  const sendCredentialsEmail = async (email, password) => {
    const subject = encodeURIComponent('Tus credenciales de acceso');
    const body = encodeURIComponent(
      `Hola,\n\nTu cuenta ha sido creada.\n\nCorreo: ${email}\nContraseña: ${password}\n\nPor favor cambia tu contraseña al iniciar sesión.`
    );
    const mailtoUrl = `mailto:${email}?subject=${subject}&body=${body}`;

    try {
      const supported = await Linking.canOpenURL(mailtoUrl);
      if (supported) {
        await Linking.openURL(mailtoUrl);
      } else {
        setBannerMessage('No se pudo abrir el cliente de correo para enviar las credenciales');
        setBannerType('error');
        setShowBanner(true);
      }
    } catch (err) {
      console.error('Error al enviar correo con credenciales:', err);
      setBannerMessage('Error al preparar el correo de credenciales');
      setBannerType('error');
      setShowBanner(true);
    }
  };

  const handleShareMember = (member) => {
    setShareTarget(member);
    setSharePassword('');
    setShareModalVisible(true);
  };

  const submitShare = async () => {
    if (!shareTarget) return;
    if (!sharePassword.trim()) {
      setBannerMessage('Ingresa la contrase�a que quieres compartir');
      setBannerType('error');
      setShowBanner(true);
      return;
    }

    const subject = encodeURIComponent('Credenciales de acceso');
    const body = encodeURIComponent(
      `Correo: ${shareTarget.email}\nContrase�a: ${sharePassword.trim()}\n\nEste mensaje es solo para el correo registrado.`
    );
    const mailtoUrl = `mailto:${shareTarget.email}?subject=${subject}&body=${body}`;

    try {
      const supported = await Linking.canOpenURL(mailtoUrl);
      if (supported) {
        await Linking.openURL(mailtoUrl);
      } else {
        setBannerMessage('No se pudo abrir el cliente de correo');
        setBannerType('error');
        setShowBanner(true);
      }
    } catch (err) {
      console.error('Error al compartir credenciales:', err);
      setBannerMessage('Error al compartir credenciales');
      setBannerType('error');
      setShowBanner(true);
    } finally {
      setShareModalVisible(false);
      setShareTarget(null);
      setSharePassword('');
    }
  };

  const handleSaveMember = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneDigits = formData.phone.replace(/\\D/g, '');
    const workDays = parseDays(formData.availableDays);
    const offDays = parseDays(formData.daysOff);

    if (!formData.name.trim()) {
      setBannerMessage('El nombre es obligatorio');
      setBannerType('error');
      setShowBanner(true);
      return;
    }

    if (!formData.email.trim() || !emailRegex.test(formData.email.trim().toLowerCase())) {
      setBannerMessage('Ingresa un correo válido');
      setBannerType('error');
      setShowBanner(true);
      return;
    }

    if (!formData.phone.trim() || phoneDigits.length < 8) {
      setBannerMessage('Ingresa un teléfono válido (mínimo 8 dígitos)');
      setBannerType('error');
      setShowBanner(true);
      return;
    }

    if (!workDays.length) {
      setBannerMessage('Selecciona al menos un día de trabajo');
      setBannerType('error');
      setShowBanner(true);
      return;
    }

    if (offDays.some((d) => workDays.includes(d))) {
      setBannerMessage('Los días libres no pueden coincidir con los días de trabajo');
      setBannerType('error');
      setShowBanner(true);
      return;
    }

    if (!formData.startTime || !formData.endTime) {
      setBannerMessage('Horarios de inicio y fin son obligatorios');
      setBannerType('error');
      setShowBanner(true);
      return;
    }

    const startMinutes = timeToMinutes(formData.startTime);
    const endMinutes = timeToMinutes(formData.endTime);
    const mealMinutes = formData.mealTime ? timeToMinutes(formData.mealTime) : null;

    if (startMinutes === null || endMinutes === null) {
      setBannerMessage('Formato de horario inválido');
      setBannerType('error');
      setShowBanner(true);
      return;
    }

    if (formData.mealTime && mealMinutes === null) {
      setBannerMessage('Formato de horario de comida inv�lido');
      setBannerType('error');
      setShowBanner(true);
      return;
    }

    if (startMinutes >= endMinutes) {
      setBannerMessage('El horario de inicio debe ser menor al de fin');
      setBannerType('error');
      setShowBanner(true);
      return;
    }

    if (mealMinutes !== null && (mealMinutes <= startMinutes || mealMinutes >= endMinutes)) {
      setBannerMessage('El horario de comida debe estar dentro de la jornada');
      setBannerType('error');
      setShowBanner(true);
      return;
    }

    // Validaciones adicionales para nuevo miembro
    if (!editingMember) {
      if (!formData.password || !formData.confirmPassword) {
        setBannerMessage('Las contraseñas son obligatorias');
        setBannerType('error');
        setShowBanner(true);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setBannerMessage('Las contraseñas no coinciden');
        setBannerType('error');
        setShowBanner(true);
        return;
      }

      if (formData.password.length < 6) {
        setBannerMessage('La contraseña debe tener al menos 6 caracteres');
        setBannerType('error');
        setShowBanner(true);
        return;
      }
    }

    try {
      if (editingMember) {
        // Actualizar administrador existente
        const { password, confirmPassword, ...updateData } = formData;
        await updateDoc(doc(db, 'admins', editingMember.id), updateData);
        
        setMembers((prev) =>
          prev.map((m) => (m.id === editingMember.id ? { ...m, ...updateData } : m))
        );
        setBannerMessage('Miembro actualizado');
      } else {
        // 1. PRIMERO crear la cuenta de autenticación en Firebase
        const authResult = await registerUser(formData.email, formData.password);
        
        if (!authResult.success) {
          setBannerMessage(authResult.message || 'Error al crear cuenta de autenticación');
          setBannerType('error');
          setShowBanner(true);
          return;
        }

        const newAdminId = authResult.user.uid;

        // 2. Crear documento en colección admins con el UID real (sin passwords)
        const { password, confirmPassword, ...adminData } = formData;
        const newAdmin = {
          ...adminData,
          role: 'Admin',
          companyId: companyId,
          photo: null,
          createdAt: new Date().toISOString(),
          region: {
            code: 'MX',
            name: 'México'
          },
          preferences: {
            notificationsEnabled: true
          },
          groupIds: []
        };

        await setDoc(doc(db, 'admins', newAdminId), newAdmin);

        // 3. Actualizar el array de administradores de la empresa con el UID real
        // Nota: registerUser() cambió la sesión al nuevo admin, pero las reglas de Firestore
        // permiten que un admin actualice la empresa a la que pertenece (companyId)
        await updateDoc(doc(db, 'companies', companyId), {
          administradores: arrayUnion(newAdminId)
        });
        
        setMembers((prev) => [{ id: newAdminId, ...newAdmin }, ...prev]);
        setBannerMessage('Miembro agregado exitosamente');
        setBannerType('success');
        setShowBanner(true);
        await sendCredentialsEmail(formData.email, formData.password);
        
        // Cerrar el modal
        setShowFormModal(false);
        setEditingMember(null);

        // Mostrar aviso de cierre de sesi�n por seguridad
        setShowSecurityModal(true);
      }

      setBannerType('success');
      setShowBanner(true);
      setShowFormModal(false);
      setEditingMember(null);
    } catch (error) {
      console.error('Error al guardar miembro:', error);
      setBannerMessage('Error al guardar miembro: ' + error.message);
      setBannerType('error');
      setShowBanner(true);
    }
  };

  // Time picker genérico (inicio, fin, comida)
  const openTimePicker = (field) => {
    const currentValue = formData[field];
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
          if (event.type !== 'set' || !selectedDate) return;
          const newTime = formatTime(selectedDate);
          setFormData((prev) => ({
            ...prev,
            [field]: newTime,
          }));
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

  // Renderizado de ítems de la lista
  const renderMemberItem = ({ item }) => (
    <View style={styles.memberCard}>
      <View style={styles.memberRow}>
        <View style={styles.memberLeft}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={22} color={COLORS.primary} />
          </View>
          <View style={styles.memberInfo}>
            <Text style={styles.memberName}>{item.name}</Text>
            <Text style={styles.memberEmail}>{item.email}</Text>
            {item.position ? (
              <Text style={styles.memberMeta}>{item.position}</Text>
            ) : null}
          </View>
        </View>

        <View style={styles.memberRight}>
          <View style={[styles.roleBadge, getRoleBadgeStyle(item.role)]}>
            <Text style={styles.roleBadgeText}>{item.role}</Text>
          </View>

          {item.isAdmin ? (
            <>
              <Pressable
                style={({ pressed }) => [
                  styles.iconButton,
                  pressed && { opacity: 0.7 },
                ]}
                onPress={() => openEditMember(item)}>
                <Ionicons
                  name="create-outline"
                  size={18}
                  color={COLORS.textBlack}
                />
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.iconButton,
                  styles.iconButtonDanger,
                  pressed && { opacity: 0.7 },
                ]}
                onPress={() => handleDeleteMember(item)}>
                <Ionicons name="trash-outline" size={18} color={COLORS.error} />
              </Pressable>
            </>
          ) : null}
        </View>
      </View>
    </View>
  );

  // Renderizado de estado vacío
  const renderEmptyComponent = () => (
    <View style={styles.emptyState}>
      <Ionicons name="people-outline" size={40} color={COLORS.textGray} />
      <Text style={styles.emptyStateText}>No hay miembros</Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
        <HeaderScreen title="Miembros" />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={{ marginTop: 16, color: COLORS.textGray }}>Cargando miembros...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <HeaderScreen title="Miembros" leftIcon={
          <Ionicons name="arrow-back" size={24} color={COLORS.textBlack} />
        }
        onLeftPress={() => navigation.goBack?.()}
        onRightPress={() => {
          setBannerMessage('Configuración de miembros próximamente');
          setBannerType('success');
          setShowBanner(true);
        }}/>

      {/* Buscador + encabezado de lista */}
      <FlatList
        data={filteredMembers}
        renderItem={renderMemberItem}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          <>
            <View style={styles.searchCard}>
              <View style={styles.searchContainer}>
                <Ionicons
                  name="search-outline"
                  size={20}
                  color={COLORS.textGray}
                />
                <TextInput style={styles.searchInput} placeholder="Buscar nombre o correo" value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoCorrect={false}
                  autoCapitalize="none"
                  placeholderTextColor={COLORS.textGray}/>
              </View>
            </View>

            <View style={styles.listHeaderRow}>
              <Text style={styles.listTitle}>Lista de miembros</Text>
              <Pressable
                style={({ pressed }) => [styles.filterChip, adminsOnly && styles.filterChipActive,
                  pressed && { opacity: 0.8 },
                ]}
                onPress={() => setAdminsOnly((prev) => !prev)}>
                <Text style={[styles.filterChipText, adminsOnly && styles.filterChipTextActive,]}>
                  Administradores
                </Text>
              </Pressable>
            </View>
          </>
        }
        ListEmptyComponent={renderEmptyComponent}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />

      <View style={styles.footerContainer}>
        <View style={styles.addMemberWrapper}>
          <Pressable style={({ pressed }) => [styles.addMemberButton,
              pressed && { opacity: 0.8 },
            ]}
            onPress={openAddMember}>
            <Ionicons name="person-add-outline" size={20} color={COLORS.textWhite}/>
            <Text style={styles.addMemberText}>Agregar miembro</Text>
          </Pressable>
        </View>
        <MenuFooterCompany />
      </View>

      {/* Modal Agregar / Editar Miembro */}
            {/* Modal Agregar / Editar Miembro */}
      <Modal visible={showFormModal} transparent animationType="slide"
        onRequestClose={() => setShowFormModal(false)}>
        <View style={styles.modalOverlay}>
          {/* Capa clickeable para cerrar al tocar fuera */}
          <Pressable
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
            onPress={() => setShowFormModal(false)}/>

          {/* Contenedor real del modal (aquí SÍ se puede hacer scroll) */}
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingMember ? 'Editar miembro' : 'Agregar miembro'}
              </Text>
              <Pressable onPress={() => setShowFormModal(false)}>
                <Ionicons name="close" size={22} color={COLORS.textBlack} />
              </Pressable>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.modalScrollContent}>
              {/* Información básica */}
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Información básica</Text>

                <Text style={styles.fieldLabel}>Nombre completo</Text>
                <TextInput style={styles.fieldInput} placeholder="Nombre completo" value={formData.name}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, name: text }))
                  }
                  placeholderTextColor={COLORS.textGray}/>

                <Text style={styles.fieldLabel}>Correo</Text>
                <TextInput style={styles.fieldInput} placeholder="correo@empresa.com" value={formData.email}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, email: text }))
                  }
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor={COLORS.textGray}/>

                {!editingMember && (
                  <>
                    <Text style={styles.fieldLabel}>Contraseña</Text>
                    <View style={styles.inputWithIcon}>
                      <TextInput
                        style={[styles.fieldInput, { flex: 1, borderWidth: 0 }]}
                        placeholder="Mínimo 6 caracteres"
                        value={formData.password}
                        onChangeText={(text) =>
                          setFormData((prev) => ({ ...prev, password: text }))
                        }
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                        placeholderTextColor={COLORS.textGray}
                      />
                      <Pressable onPress={() => setShowPassword(!showPassword)}>
                        <Ionicons
                          name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                          size={20}
                          color={COLORS.textGray}
                        />
                      </Pressable>
                    </View>

                    <Text style={styles.fieldLabel}>Confirmar contraseña</Text>
                    <View style={styles.inputWithIcon}>
                      <TextInput
                        style={[styles.fieldInput, { flex: 1, borderWidth: 0 }]}
                        placeholder="Repite la contraseña"
                        value={formData.confirmPassword}
                        onChangeText={(text) =>
                          setFormData((prev) => ({ ...prev, confirmPassword: text }))
                        }
                        secureTextEntry={!showConfirmPassword}
                        autoCapitalize="none"
                        placeholderTextColor={COLORS.textGray}
                      />
                      <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                        <Ionicons
                          name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                          size={20}
                          color={COLORS.textGray}
                        />
                      </Pressable>
                    </View>
                  </>
                )}

                <Text style={styles.fieldLabel}>Teléfono</Text>
                <TextInput style={styles.fieldInput} placeholder="+56 9 0000 0000" value={formData.phone}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, phone: text }))
                  }
                  keyboardType="phone-pad"
                  placeholderTextColor={COLORS.textGray}/>

                <Text style={styles.fieldLabel}>Puesto</Text>
                <TextInput style={styles.fieldInput} placeholder="Ej. Supervisor de piso" value={formData.position}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, position: text }))
                  }
                  placeholderTextColor={COLORS.textGray}/>

                <Text style={styles.fieldLabel}>Experiencia</Text>
                <TextInput style={styles.fieldInput} placeholder="Años o breve descripción" value={formData.experience}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, experience: text }))
                  }
                  placeholderTextColor={COLORS.textGray}
                  multiline/>
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
                          setFormData((prev) => {
                            const current = parseDays(prev.availableDays);
                            const exists = current.includes(day);
                            const next = exists
                              ? current.filter((d) => d !== day)
                              : [...current, day];
                            return {
                              ...prev,
                              availableDays: formatDays(next),
                            };
                          });
                        }}>
                        <Text
                          style={[
                            styles.areaChipText,
                            isSelected && styles.areaChipTextActive,
                          ]}>
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
                          placeholder="08:00 AM"
                          value={formatTimeWithPeriod(formData.startTime)}
                          editable={false}
                          placeholderTextColor={COLORS.textGray}/>
                      </View>
                    </Pressable>
                  </View>
                  <View style={styles.fieldColumn}>
                    <Text style={styles.fieldLabel}>Horario fin</Text>
                    <Pressable onPress={() => openTimePicker('endTime')}>
                      <View pointerEvents="none">
                        <TextInput
                          style={styles.fieldInput}
                          placeholder="05:00 PM"
                          value={formatTimeWithPeriod(formData.endTime)}
                          editable={false}
                          placeholderTextColor={COLORS.textGray}/>
                      </View>
                    </Pressable>
                  </View>
                </View>

                <Text style={styles.fieldLabel}>Horario de comida</Text>
                <Pressable onPress={() => openTimePicker('mealTime')}>
                  <View pointerEvents="none">
                    <TextInput
                      style={styles.fieldInput}
                      placeholder="Ej. 02:00 PM"
                      value={formatTimeWithPeriod(formData.mealTime)}
                      editable={false}
                      placeholderTextColor={COLORS.textGray}/>
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
                          setFormData((prev) => {
                            const current = parseDays(prev.daysOff);
                            const exists = current.includes(day);
                            const next = exists
                              ? current.filter((d) => d !== day)
                              : [...current, day];
                            return {
                              ...prev,
                              daysOff: formatDays(next),
                            };
                          });
                        }}>
                        <Text
                          style={[
                            styles.areaChipText,
                            isSelected && styles.areaChipTextActive,
                          ]}>
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
                  <DateTimePicker value={timePickerIOS.value} mode="time"
                    is24Hour
                    display="spinner"
                    onChange={(event, selectedDate) => {
                      if (selectedDate && timePickerIOS.field) {
                        const newTime = formatTime(selectedDate);
                        const field = timePickerIOS.field;
                        setFormData((prev) => ({
                          ...prev,
                          [field]: newTime,
                        }));
                      }
                      setTimePickerIOS((prev) => ({
                        ...prev,
                        visible: false,
                      }));
                    }}/>
                </View>
              )}
            </ScrollView>

            {/* Botones del modal */}
            <View style={styles.modalButtonsRow}>
              <Pressable style={({ pressed }) => [ styles.primaryButton,
                  pressed && { opacity: 0.9 },
                ]}
                onPress={handleSaveMember}>
                <Ionicons name="add-circle-outline" size={20} color={COLORS.textWhite}/>
                <Text style={styles.primaryButtonText}>
                  {editingMember ? 'Guardar cambios' : 'Agregar'}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <InfoModal
        visible={showSecurityModal}
        title="Se cerrara la sesión"
        message={
          'Por medidas de seguridad cerraremos tu sesión para proteger la cuenta.\n\n' +
          'Presiona "Entendido" para salir y vuelve a iniciar sesión con tus credenciales.'
        }
        onClose={async () => {
          setShowSecurityModal(false);
          try {
            await signOut(auth);
          } catch (err) {
            console.error('Error al cerrar sesión:', err);
          }
          navigation.reset?.({
            index: 0,
            routes: [{ name: 'LoginCompany' }],
          });
        }}
      />

      <InfoModal
        visible={showBanner}
        title={bannerType === 'error' ? 'Error' : bannerType === 'success' ? 'Listo' : 'Aviso'}
        message={bannerMessage}
        onClose={() => setShowBanner(false)}
      />

    </SafeAreaView>
  );
}
