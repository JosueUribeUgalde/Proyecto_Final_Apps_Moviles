import { useMemo, useState } from 'react';
import {Text, View, TextInput, Pressable, FlatList, Modal, ScrollView, Switch, Platform} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, {DateTimePickerAndroid} from '@react-native-community/datetimepicker';
import { HeaderScreen, Banner, MenuFooterCompany } from '../../components';
import { COLORS } from '../../components/constants/theme';
import styles from '../../styles/screens/company/MembersCompanyStyles';

// Datos simulados
const MOCK_MEMBERS = [
  {
    id: '1',
    name: 'María González',
    email: 'maria.g@acme.com',
    phone: '+56 9 5555 5555',
    role: 'Admin',
    position: 'Supervisora de caja',
    experience: '5 años en retail y manejo de equipos',
    availableDays: 'Lun • Mar • Jue • Sáb',
    startTime: '08:00',
    endTime: '17:00',
    maxHoursPerWeek: '40',
    mealTime: '14:00',
    daysOff: 'Mié • Dom',
    replacementAvailable: true,
    preferredAreas: 'Caja, Atención al cliente',
  },
  {
    id: '2',
    name: 'Luis Pérez',
    email: 'l.perez@acme.com',
    phone: '+56 9 4444 4444',
    role: 'Usuario',
    position: 'Encargado de bodega',
    experience: '3 años en inventarios y logística ligera',
    availableDays: 'Lun • Mié • Vie',
    startTime: '09:00',
    endTime: '18:00',
    maxHoursPerWeek: '36',
    mealTime: '13:30',
    daysOff: 'Jue • Sáb • Dom',
    replacementAvailable: false,
    preferredAreas: 'Bodega',
  },
  {
    id: '3',
    name: 'Damian Elias Nieto',
    email: 'mamian@gmail.com',
    phone: '+56 12345698744',
    role: 'Usuario',
    position: 'Carnicero',
    experience: '3 años filiando carne y atención al cliente',
    availableDays: 'Lun • Mar • Mié • Vie • Sáb • Dom',
    startTime: '09:00',
    endTime: '18:00',
    maxHoursPerWeek: '36',
    mealTime: '13:30',
    daysOff: 'Jue',
    replacementAvailable: false,
    preferredAreas: 'Bodega',
  },
  {
    id: '4',
    name: 'Diego López',
    email: 'd.lopez@acme.com',
    phone: '+56 9 2222 2222',
    role: 'Usuario',
    position: 'Responsable de piso de venta',
    experience: 'Más de 7 años gestionando equipos de piso',
    availableDays: 'Lun • Mar • Mié • Jue • Vie',
    startTime: '07:00',
    endTime: '15:00',
    maxHoursPerWeek: '40',
    mealTime: '12:00',
    daysOff: 'Sáb • Dom',
    replacementAvailable: true,
    preferredAreas: 'Bodega, Atención al cliente',
  },
  {
    id: '5',
    name: 'Ana Torres',
    email: 'ana.t@acme.com',
    phone: '+56 9 1111 1111',
    role: 'Admin',
    position: 'Gerente de tienda',
    experience: '10 años en liderazgo de tiendas y operaciones',
    availableDays: 'Lun • Mar • Mié • Jue • Vie',
    startTime: '09:00',
    endTime: '18:00',
    maxHoursPerWeek: '40',
    mealTime: '14:00',
    daysOff: 'Sáb • Dom',
    replacementAvailable: false,
    preferredAreas: 'Supervisión',
  },
];

// Áreas disponibles para selección seguin los grupos creados por el admibnistrador
const AREA_GROUPS = [
  'Caja',
  'Atención al cliente',
  'Bodega',
  'Supervisión',
  'Mostrador',
  'Ventas en línea',
];

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

const formatTime = (date) => {
  if (!date) return '';
  const h = date.getHours().toString().padStart(2, '0');
  const m = date.getMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
};

// Formulario vacío
const createEmptyForm = () => ({
  name: '',
  email: '',
  phone: '',
  role: 'Admin',
  position: '',
  experience: '',
  availableDays: '',
  startTime: '08:00',
  endTime: '17:00',
  maxHoursPerWeek: '40',
  mealTime: '',
  daysOff: '',
  replacementAvailable: true,
  preferredAreas: '',
});

export default function MembersCompany({ navigation }) {
  // Estados principales
  const [members, setMembers] = useState(MOCK_MEMBERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [adminsOnly, setAdminsOnly] = useState(false);

  // Estado de banner
  const [showBanner, setShowBanner] = useState(false);
  const [bannerMessage, setBannerMessage] = useState('');
  const [bannerType, setBannerType] = useState('success');

  // Estado de formulario / modal
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState(createEmptyForm());

  // Time picker para iOS
  const [timePickerIOS, setTimePickerIOS] = useState({
    field: null,
    value: new Date(),
    visible: false,
  });

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
    setEditingMember(member);
    setFormData({
      ...createEmptyForm(),
      ...member,
    });
    setShowFormModal(true);
  };

  const handleDeleteMember = (member) => {
    setMembers((prev) => prev.filter((m) => m.id !== member.id));
    setBannerMessage('Miembro eliminado');
    setBannerType('success');
    setShowBanner(true);
  };

  const handleSaveMember = () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      setBannerMessage('Nombre y correo son obligatorios');
      setBannerType('error');
      setShowBanner(true);
      return;
    }
    // Agregar o actualizar miembro
    if (editingMember) {
      const updated = {
        ...editingMember,
        ...formData,
        role: editingMember.role || 'Admin',
      };
      setMembers((prev) =>
        prev.map((m) => (m.id === editingMember.id ? updated : m)),
      );
      setBannerMessage('Miembro actualizado');
    } else {
      const newMember = {
        ...createEmptyForm(),
        ...formData,
        id: Date.now().toString(),
        role: 'Admin',
      };
      setMembers((prev) => [newMember, ...prev]);
      setBannerMessage('Miembro agregado');
    }

    setBannerType('success');
    setShowBanner(true);
    setShowFormModal(false);
    setEditingMember(null);
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

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <HeaderScreen title="Miembros" leftIcon={
          <Ionicons name="arrow-back" size={24} color={COLORS.textBlack} />
        }
        onLeftPress={() => navigation.goBack?.()}
        rightIcon={
          <Ionicons name="settings-outline" size={24} color={COLORS.textBlack}/>
        }
        onRightPress={() => {
          setBannerMessage('Configuración de miembros próximamente');
          setBannerType('success');
          setShowBanner(true);
        }}/>

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
                <View style={styles.inputWithIcon}>
                  <TextInput style={styles.fieldInput} placeholder="Nombre completo" value={formData.name}
                    onChangeText={(text) =>
                      setFormData((prev) => ({ ...prev, name: text }))
                    }
                    placeholderTextColor={COLORS.textGray}/>
                  <Ionicons name="person-circle-outline" size={20} color={COLORS.textGray}/>
                </View>

                <Text style={styles.fieldLabel}>Correo</Text>
                <TextInput style={styles.fieldInput} placeholder="correo@empresa.com" value={formData.email}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, email: text }))
                  }
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor={COLORS.textGray}/>

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
                        <TextInput style={styles.fieldInput} placeholder="08:00" value={formData.startTime} editable={false}
                          placeholderTextColor={COLORS.textGray}/>
                      </View>
                    </Pressable>
                  </View>
                  <View style={styles.fieldColumn}>
                    <Text style={styles.fieldLabel}>Horario fin</Text>
                    <Pressable onPress={() => openTimePicker('endTime')}>
                      <View pointerEvents="none">
                        <TextInput style={styles.fieldInput} placeholder="17:00" value={formData.endTime} editable={false}
                          placeholderTextColor={COLORS.textGray}/>
                      </View>
                    </Pressable>
                  </View>
                </View>

                <Text style={styles.fieldLabel}>Horario de comida</Text>
                <Pressable onPress={() => openTimePicker('mealTime')}>
                  <View pointerEvents="none">
                    <TextInput style={styles.fieldInput} placeholder="Ej. 14:00" value={formData.mealTime} editable={false}
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

                <Text style={styles.fieldLabel}>Horas máximas por semana</Text>
                <TextInput
                  style={styles.fieldInput}
                  placeholder="48"
                  value={formData.maxHoursPerWeek}
                  onChangeText={(text) =>
                    setFormData((prev) => ({
                      ...prev,
                      maxHoursPerWeek: text,
                    }))
                  }
                  keyboardType="numeric"
                  placeholderTextColor={COLORS.textGray}/>
              </View>

              {/* Preferencias de reemplazo */}
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Preferencias de reemplazo</Text>

                <View style={styles.toggleRow}>
                  <View style={styles.toggleInfo}>
                    <Text style={styles.toggleTitle}>
                      Disponible para reemplazos
                    </Text>
                    <Text style={styles.toggleSubtitle}>
                      Puede ser sugerido cuando falten turnos
                    </Text>
                  </View>
                  <Switch
                    value={formData.replacementAvailable}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        replacementAvailable: value,
                      }))
                    }/>
                </View>

                <Text style={styles.fieldLabel}>Áreas preferidas</Text>
                <View style={styles.chipGroup}>
                  {AREA_GROUPS.map((area) => {
                    const selectedAreas = formData.preferredAreas
                      ? formData.preferredAreas
                          .split(',')
                          .map((s) => s.trim())
                          .filter(Boolean)
                      : [];
                    const isSelected = selectedAreas.includes(area);

                    return (
                      <Pressable
                        key={area}
                        style={({ pressed }) => [
                          styles.areaChip,
                          isSelected && styles.areaChipActive,
                          pressed && { opacity: 0.85 },
                        ]}
                        onPress={() => {
                          setFormData((prev) => {
                            const current = prev.preferredAreas
                              ? prev.preferredAreas
                                  .split(',')
                                  .map((s) => s.trim())
                                  .filter(Boolean)
                              : [];
                            const exists = current.includes(area);
                            const next = exists
                              ? current.filter((a) => a !== area)
                              : [...current, area];

                            return {
                              ...prev,
                              preferredAreas: next.join(', '),
                            };
                          });
                        }}>
                        <Text
                          style={[
                            styles.areaChipText,
                            isSelected && styles.areaChipTextActive,
                          ]}>
                          {area}
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
                <Ionicons name="send-outline" size={20} color={COLORS.textWhite}/>
                <Text style={styles.primaryButtonText}>
                  {editingMember ? 'Guardar cambios' : 'Invitar y agregar'}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}