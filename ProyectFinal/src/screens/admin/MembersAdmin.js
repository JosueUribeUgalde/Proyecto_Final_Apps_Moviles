import { useState } from 'react';
import { Text, View, ScrollView, TextInput, Pressable, Modal, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { HeaderScreen, Banner, MenuFooterAdmin } from "../../components";
import { COLORS } from '../../components/constants/theme';
import styles from "../../styles/screens/admin/MembersAdminStyles";
import CalendarAdminStyles from "../../styles/screens/admin/CalendarAdminStyles";

// Mock data para desarrollo
const MOCK_GROUPS = [
  { id: 1, name: 'Recepción', memberCount: 12 },
  { id: 2, name: 'Cocina', memberCount: 8 },
  { id: 3, name: 'Turno Nocturno', memberCount: 5 },
  { id: 4, name: 'Limpieza', memberCount: 15 },
];

const MOCK_MEMBERS = [
  {
    id: 1,
    name: 'Alex Johnson',
    group: 'Recepción',
    groupId: 1,
    nextShift: 'Hoy, 2:00 PM - 10:00 PM',
    experience: '3 años',
    status: 'Disponible',
    shiftsThisWeek: 4,
    lastActive: '1h',
    avatar: null,
  },
  {
    id: 2,
    name: 'Priya Patel',
    group: 'Cocina',
    groupId: 2,
    nextShift: 'Mañana, 6:00 AM - 2:00 PM',
    experience: '5 años',
    status: 'Libre hoy',
    shiftsThisWeek: 3,
    lastActive: '3h',
    avatar: null,
  },
  {
    id: 3,
    name: 'Diego Ramos',
    group: 'Turno Nocturno',
    groupId: 3,
    nextShift: 'Viernes, 10:00 PM - 6:00 AM',
    experience: '2 años',
    status: 'Permiso solicitado',
    shiftsThisWeek: 2,
    lastActive: 'ayer',
    avatar: null,
  },
  {
    id: 4,
    name: 'María González',
    group: 'Limpieza',
    groupId: 4,
    nextShift: 'Hoy, 8:00 AM - 4:00 PM',
    experience: '4 años',
    status: 'Disponible',
    shiftsThisWeek: 5,
    lastActive: '30min',
    avatar: null,
  },
  {
    id: 5,
    name: 'John Smith',
    group: 'Recepción',
    groupId: 1,
    nextShift: 'Mañana, 10:00 AM - 6:00 PM',
    experience: '1 año',
    status: 'Disponible',
    shiftsThisWeek: 4,
    lastActive: '2h',
    avatar: null,
  },
];

export default function MembersAdmin({ navigation }) {
  // Estado para búsqueda y filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroupFilter, setSelectedGroupFilter] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showGroupSelectModal, setShowGroupSelectModal] = useState(false);

  // Estado para modales
  const [showManageGroupsModal, setShowManageGroupsModal] = useState(false);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [showEditGroupModal, setShowEditGroupModal] = useState(false);
  const [showDeleteGroupModal, setShowDeleteGroupModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Estado para formularios
  const [newGroupName, setNewGroupName] = useState('');
  const [editingGroup, setEditingGroup] = useState(null);
  const [deletingGroup, setDeletingGroup] = useState(null);

  // Estado para banner
  const [showBanner, setShowBanner] = useState(false);
  const [bannerMessage, setBannerMessage] = useState('');
  const [bannerType, setBannerType] = useState('success');

  // Estado para datos
  const [groups, setGroups] = useState(MOCK_GROUPS);
  const [members, setMembers] = useState(MOCK_MEMBERS);

  // Funciones de filtrado
  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.group.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Si hay búsqueda activa, solo filtrar por búsqueda
    if (searchQuery) {
      return matchesSearch;
    }
    
    // Si no hay búsqueda, filtrar por grupo seleccionado
    const matchesSelectedGroup = selectedGroup ? member.groupId === selectedGroup.id : true;
    return matchesSelectedGroup;
  });

  // CRUD de grupos
  const handleCreateGroup = () => {
    if (!newGroupName.trim()) {
      setBannerMessage('Por favor ingresa un nombre de grupo');
      setBannerType('error');
      setShowBanner(true);
      return;
    }

    // TODO: Implement Firebase create group logic
    const newGroup = {
      id: groups.length + 1,
      name: newGroupName,
      memberCount: 0,
    };

    setGroups([...groups, newGroup]);
    setNewGroupName('');
    setShowCreateGroupModal(false);
    setBannerMessage('Grupo creado exitosamente');
    setBannerType('success');
    setShowBanner(true);
  };

  const handleEditGroup = () => {
    if (!editingGroup || !editingGroup.name.trim()) {
      setBannerMessage('Por favor ingresa un nombre válido para el grupo');
      setBannerType('error');
      setShowBanner(true);
      return;
    }

    // TODO: Implement Firebase update group logic
    setGroups(groups.map(g => g.id === editingGroup.id ? editingGroup : g));

    // Actualizar miembros con el nuevo nombre de grupo
    setMembers(members.map(m =>
      m.groupId === editingGroup.id ? { ...m, group: editingGroup.name } : m
    ));

    setShowEditGroupModal(false);
    setEditingGroup(null);
    setBannerMessage('Grupo actualizado exitosamente');
    setBannerType('success');
    setShowBanner(true);
  };

  const handleDeleteGroup = () => {
    if (!deletingGroup) return;

    // TODO: Implement Firebase delete group logic
    const hasMembers = members.some(m => m.groupId === deletingGroup.id);

    if (hasMembers) {
      setBannerMessage('No se puede eliminar un grupo con miembros activos');
      setBannerType('error');
      setShowBanner(true);
      setShowDeleteGroupModal(false);
      setDeletingGroup(null);
      return;
    }

    setGroups(groups.filter(g => g.id !== deletingGroup.id));
    setShowDeleteGroupModal(false);
    setDeletingGroup(null);
    setBannerMessage('Grupo eliminado exitosamente');
    setBannerType('success');
    setShowBanner(true);
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    setShowShareModal(false);
    setBannerMessage('Enlace copiado al portapapeles');
    setBannerType('success');
    setShowBanner(true);
  };

  const getStatusStyle = (status) => {
    if (status === 'Disponible') return styles.statusAvailable;
    if (status === 'Libre hoy') return styles.statusOff;
    if (status === 'Permiso solicitado') return styles.statusLeave;
    return styles.statusDefault;
  };

  const handleGroupSelect = (group) => {
    setSelectedGroup(group);
    setShowGroupSelectModal(false);
    // Aquí se cargarán los datos específicos del grupo desde Firebase
  };

  // Render functions for FlatList
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
                <Text style={styles.memberShift}>Próximo turno: {member.nextShift}</Text>
                <Text style={styles.memberExperience}>Experiencia: {member.experience}</Text>
              </View>
            </View>
            <Pressable
              style={({pressed}) => [styles.moreButton, pressed && {opacity: 0.7}]}
              onPress={() => {
                setBannerMessage('Opciones de miembro próximamente');
                setBannerType('success');
                setShowBanner(true);
              }}
            >
              <Ionicons name="ellipsis-horizontal" size={20} color={COLORS.textBlack} />
            </Pressable>
          </View>

          <View style={styles.memberFooter}>
            <View style={[styles.statusBadge, getStatusStyle(member.status)]}>
              <Text style={styles.statusText}>{member.status}</Text>
            </View>
            <View style={styles.shiftsInfo}>
              <Ionicons name="calendar-outline" size={16} color={COLORS.textGray} />
              <Text style={styles.shiftsText}>Turnos esta semana: {member.shiftsThisWeek}</Text>
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
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={24} color={COLORS.primary} />
          </View>
          <View style={styles.memberDetails}>
            <View style={styles.nameRow}>
              <Text style={styles.memberName}>{member.name}</Text>
              <Text style={styles.memberGroup}> • {member.group}</Text>
            </View>
            <Text style={styles.memberShift}>Próximo turno: {member.nextShift}</Text>
            <Text style={styles.memberExperience}>Experiencia: {member.experience}</Text>
          </View>
        </View>
        <Pressable
          style={({pressed}) => [styles.moreButton, pressed && {opacity: 0.7}]}
          onPress={() => {
            setBannerMessage('Opciones de miembro próximamente');
            setBannerType('success');
            setShowBanner(true);
          }}
        >
          <Ionicons name="ellipsis-horizontal" size={20} color={COLORS.textBlack} />
        </Pressable>
      </View>

      <View style={styles.memberFooter}>
        <View style={[styles.statusBadge, getStatusStyle(member.status)]}>
          <Text style={styles.statusText}>{member.status}</Text>
        </View>
        <View style={styles.shiftsInfo}>
          <Ionicons name="calendar-outline" size={16} color={COLORS.textGray} />
          <Text style={styles.shiftsText}>Turnos esta semana: {member.shiftsThisWeek}</Text>
        </View>
      </View>
    </View>
    );
  };

  const renderListHeader = () => (
    <>
      {/* Team Directory Section */}
      <View style={styles.directoryCard}>
        <Text style={styles.directoryTitle}>Buscar a miembro</Text>

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
      </View>

      {!searchQuery && (
        <>
          {/* Selector de Grupos */}
          <View style={CalendarAdminStyles.groupSelectorContainer}>
            <Text style={CalendarAdminStyles.groupSelectorTitle}>Selecciona un grupo</Text>
            <Pressable
              style={({pressed}) => [
                CalendarAdminStyles.groupSelectorButton,
                pressed && {opacity: 0.7}
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
              style={({pressed}) => [styles.groupActionButton, styles.createGroupButton, pressed && {opacity: 0.7}]}
              onPress={() => setShowCreateGroupModal(true)}
            >
              <Ionicons name="add-circle-outline" size={20} color={COLORS.textGreen} />
              <Text style={styles.createGroupButtonText}>Crear Grupo</Text>
            </Pressable>
            
            {selectedGroup && (
              <>
                <Pressable
                  style={({pressed}) => [styles.groupActionButton, styles.editGroupButton, pressed && {opacity: 0.7}]}
                  onPress={() => {
                    if (groups.length === 0) {
                      setBannerMessage('No hay grupos disponibles para editar');
                      setBannerType('error');
                      setShowBanner(true);
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
                  style={({pressed}) => [styles.groupActionButton, styles.deleteGroupButton, pressed && {opacity: 0.7}]}
                  onPress={() => {
                    if (groups.length === 0) {
                      setBannerMessage('No hay grupos disponibles para eliminar');
                      setBannerType('error');
                      setShowBanner(true);
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
                  style={({pressed}) => [styles.groupActionButton, styles.shareGroupButton, pressed && {opacity: 0.7}]}
                  onPress={() => {
                    // TODO: Navigate to add member screen
                    setBannerMessage('Agregar miembro próximamente');
                    setBannerType('success');
                    setShowBanner(true);
                  }}
                >
                  <Ionicons name="person-add-outline" size={20} color={COLORS.textGreen} />
                  <Text style={styles.shareGroupButtonText}>Agregar Miembro</Text>
                </Pressable>
              </>
            )}
          </View>
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
          <Text style={styles.distributionTitle}>Distribución de Roles</Text>
        </View>
        {groups.length > 0 ? (
          groups.map(group => (
            <View key={group.id} style={styles.distributionRow}>
              <Text style={styles.groupName}>{group.name}</Text>
              <Text style={styles.groupCount}>
                {members.filter(m => m.groupId === group.id).length} miembros
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

    // Si no hay grupo seleccionado
    if (!selectedGroup) return null;
    
    return (
    <View style={styles.emptyState}>
      <Ionicons name="people-outline" size={48} color={COLORS.textGray} />
      <Text style={styles.emptyStateText}>No se encontraron miembros</Text>
    </View>
    );
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <HeaderScreen
        title="Miembros"
        leftIcon={<Ionicons name="arrow-back" size={24} color={COLORS.textBlack} />}
        onLeftPress={() => navigation.goBack()}
        rightIcon={<Ionicons name="notifications-outline" size={24} color={COLORS.textBlack} />}
        onRightPress={() => {
          // TODO: Navigate to notifications screen
          setBannerMessage('Notificaciones próximamente');
          setBannerType('success');
          setShowBanner(true);
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
                style={({pressed}) => [styles.manageGroupButton, styles.createButton, pressed && {opacity: 0.7}]}
                onPress={() => {
                  setShowManageGroupsModal(false);
                  setShowCreateGroupModal(true);
                }}
              >
                <Ionicons name="add-circle-outline" size={24} color={COLORS.textWhite} />
                <Text style={styles.manageGroupButtonText}>Crear Grupo</Text>
              </Pressable>
              <Pressable
                style={({pressed}) => [styles.manageGroupButton, styles.editButton, pressed && {opacity: 0.7}]}
                onPress={() => {
                  setShowManageGroupsModal(false);
                  if (groups.length === 0) {
                    setBannerMessage('No hay grupos para editar');
                    setBannerType('error');
                    setShowBanner(true);
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
                style={({pressed}) => [styles.manageGroupButton, styles.deleteButton, pressed && {opacity: 0.7}]}
                onPress={() => {
                  setShowManageGroupsModal(false);
                  if (groups.length === 0) {
                    setBannerMessage('No hay grupos para eliminar');
                    setBannerType('error');
                    setShowBanner(true);
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
                style={({pressed}) => [styles.manageGroupButton, styles.shareButton, pressed && {opacity: 0.7}]}
                onPress={() => {
                  setShowManageGroupsModal(false);
                  // TODO: Navigate to add member screen
                  setBannerMessage('Agregar miembro próximamente');
                  setBannerType('success');
                  setShowBanner(true);
                }}
              >
                <Ionicons name="person-add-outline" size={24} color={COLORS.textWhite} />
                <Text style={styles.manageGroupButtonText}>Agregar Miembro</Text>
              </Pressable>
            </View>
            <Pressable
              style={({pressed}) => [styles.modalButton, styles.modalButtonCancel, {marginTop: 16}, pressed && {opacity: 0.7}]}
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
            </View>
            <View style={styles.modalButtons}>
              <Pressable
                style={({pressed}) => [styles.modalButton, styles.modalButtonCancel, pressed && {opacity: 0.7}]}
                onPress={() => {
                  setShowCreateGroupModal(false);
                  setNewGroupName('');
                }}
              >
                <Ionicons name="close-circle-outline" size={20} color={COLORS.error} />
                <Text style={styles.modalButtonTextCancel}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={({pressed}) => [styles.modalButton, styles.modalButtonConfirm, pressed && {opacity: 0.7}]}
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
                    style={({pressed}) => [
                      styles.groupSelectItem,
                      editingGroup?.id === group.id && styles.groupSelectItemActive,
                      pressed && {opacity: 0.7}
                    ]}
                    onPress={() => setEditingGroup({...group})}
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
                  <Text style={[styles.modalLabel, {marginTop: 16}]}>Nuevo Nombre del Grupo</Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Ingresa el nuevo nombre del grupo"
                    value={editingGroup.name}
                    onChangeText={(text) => setEditingGroup({...editingGroup, name: text})}
                    placeholderTextColor={COLORS.textGray}
                  />
                </>
              )}
            </View>
            <View style={styles.modalButtons}>
              <Pressable
                style={({pressed}) => [styles.modalButton, styles.modalButtonCancel, pressed && {opacity: 0.7}]}
                onPress={() => {
                  setShowEditGroupModal(false);
                  setEditingGroup(null);
                }}
              >
                <Ionicons name="close-circle-outline" size={20} color={COLORS.error} />
                <Text style={styles.modalButtonTextCancel}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={({pressed}) => [styles.modalButton, styles.modalButtonConfirm, pressed && {opacity: 0.7}]}
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
                    style={({pressed}) => [
                      styles.groupSelectItem,
                      deletingGroup?.id === group.id && styles.groupSelectItemActive,
                      pressed && {opacity: 0.7}
                    ]}
                    onPress={() => setDeletingGroup(group)}
                  >
                    <Text style={[
                      styles.groupSelectText,
                      deletingGroup?.id === group.id && styles.groupSelectTextActive
                    ]}>{group.name}</Text>
                    <Text style={styles.groupSelectCount}>
                      {members.filter(m => m.groupId === group.id).length} miembros
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
                style={({pressed}) => [styles.modalButton, styles.modalButtonCancel, pressed && {opacity: 0.7}]}
                onPress={() => {
                  setShowDeleteGroupModal(false);
                  setDeletingGroup(null);
                }}
              >
                <Ionicons name="close-circle-outline" size={20} color={COLORS.error} />
                <Text style={styles.modalButtonTextCancel}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={({pressed}) => [styles.modalButton, styles.modalButtonDelete, pressed && {opacity: 0.7}]}
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
                style={({pressed}) => [styles.shareOption, pressed && {opacity: 0.7}]}
                onPress={handleShare}
              >
                <Ionicons name="link-outline" size={24} color={COLORS.primary} />
                <Text style={styles.shareOptionText}>Copiar Enlace</Text>
              </Pressable>
              <Pressable
                style={({pressed}) => [styles.shareOption, pressed && {opacity: 0.7}]}
                onPress={() => {
                  setShowShareModal(false);
                  setBannerMessage('Compartir por correo próximamente');
                  setBannerType('success');
                  setShowBanner(true);
                }}
              >
                <Ionicons name="mail-outline" size={24} color={COLORS.primary} />
                <Text style={styles.shareOptionText}>Enviar por Correo</Text>
              </Pressable>
            </View>
            <Pressable
              style={({pressed}) => [styles.shareCloseButton, pressed && {opacity: 0.7}]}
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
                  style={({pressed}) => [
                    CalendarAdminStyles.groupItem,
                    selectedGroup?.id === group.id && CalendarAdminStyles.groupItemSelected,
                    pressed && {opacity: 0.7}
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
              ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
              showsVerticalScrollIndicator={false}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
