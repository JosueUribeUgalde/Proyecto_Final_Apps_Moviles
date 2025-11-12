import { useState } from 'react';
import { Text, View, ScrollView, TextInput, Pressable, Modal, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { HeaderScreen, Banner, MenuFooterAdmin } from "../../components";
import { COLORS } from '../../components/constants/theme';
import styles from "../../styles/screens/admin/MembersAdminStyles";

// Mock data para desarrollo
const MOCK_GROUPS = [
  { id: 1, name: 'Front Desk', memberCount: 12 },
  { id: 2, name: 'Kitchen', memberCount: 8 },
  { id: 3, name: 'Night Ops', memberCount: 5 },
  { id: 4, name: 'Housekeeping', memberCount: 15 },
];

const MOCK_MEMBERS = [
  {
    id: 1,
    name: 'Alex Johnson',
    group: 'Front Desk',
    groupId: 1,
    nextShift: 'Today, 2:00 PM - 10:00 PM',
    experience: '3 yrs',
    status: 'Available',
    shiftsThisWeek: 4,
    lastActive: '1h',
    avatar: null,
  },
  {
    id: 2,
    name: 'Priya Patel',
    group: 'Kitchen',
    groupId: 2,
    nextShift: 'Tomorrow, 6:00 AM - 2:00 PM',
    experience: '5 yrs',
    status: 'Off today',
    shiftsThisWeek: 3,
    lastActive: '3h',
    avatar: null,
  },
  {
    id: 3,
    name: 'Diego Ramos',
    group: 'Night Ops',
    groupId: 3,
    nextShift: 'Fri, 10:00 PM - 6:00 AM',
    experience: '2 yrs',
    status: 'On leave request',
    shiftsThisWeek: 2,
    lastActive: 'yesterday',
    avatar: null,
  },
  {
    id: 4,
    name: 'María González',
    group: 'Housekeeping',
    groupId: 4,
    nextShift: 'Today, 8:00 AM - 4:00 PM',
    experience: '4 yrs',
    status: 'Available',
    shiftsThisWeek: 5,
    lastActive: '30min',
    avatar: null,
  },
  {
    id: 5,
    name: 'John Smith',
    group: 'Front Desk',
    groupId: 1,
    nextShift: 'Tomorrow, 10:00 AM - 6:00 PM',
    experience: '1 yr',
    status: 'Available',
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
    const matchesGroup = selectedGroupFilter ? member.groupId === selectedGroupFilter : true;
    return matchesSearch && matchesGroup;
  });

  // CRUD de grupos
  const handleCreateGroup = () => {
    if (!newGroupName.trim()) {
      setBannerMessage('Please enter a group name');
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
    setBannerMessage('Group created successfully');
    setBannerType('success');
    setShowBanner(true);
  };

  const handleEditGroup = () => {
    if (!editingGroup || !editingGroup.name.trim()) {
      setBannerMessage('Please enter a valid group name');
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
    setBannerMessage('Group updated successfully');
    setBannerType('success');
    setShowBanner(true);
  };

  const handleDeleteGroup = () => {
    if (!deletingGroup) return;

    // TODO: Implement Firebase delete group logic
    const hasMembers = members.some(m => m.groupId === deletingGroup.id);

    if (hasMembers) {
      setBannerMessage('Cannot delete group with active members');
      setBannerType('error');
      setShowBanner(true);
      setShowDeleteGroupModal(false);
      setDeletingGroup(null);
      return;
    }

    setGroups(groups.filter(g => g.id !== deletingGroup.id));
    setShowDeleteGroupModal(false);
    setDeletingGroup(null);
    setBannerMessage('Group deleted successfully');
    setBannerType('success');
    setShowBanner(true);
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    setShowShareModal(false);
    setBannerMessage('Share link copied to clipboard');
    setBannerType('success');
    setShowBanner(true);
  };

  const getStatusStyle = (status) => {
    if (status === 'Available') return styles.statusAvailable;
    if (status === 'Off today') return styles.statusOff;
    if (status === 'On leave request') return styles.statusLeave;
    return styles.statusDefault;
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <HeaderScreen
        title="Members"
        leftIcon={<Ionicons name="arrow-back" size={24} color={COLORS.textBlack} />}
        onLeftPress={() => navigation.goBack()}
        rightIcon={<Ionicons name="person-add-outline" size={24} color={COLORS.textBlack} />}
        onRightPress={() => {
          // TODO: Navigate to add member screen
          setBannerMessage('Add member feature coming soon');
          setBannerType('success');
          setShowBanner(true);
        }}
      />

      <View style={styles.bannerContainer}>
        <Banner
          message={bannerMessage}
          type={bannerType}
          visible={showBanner}
          onHide={() => setShowBanner(false)}
        />
      </View>

      <ScrollView style={styles.content}>
        {/* Team Directory Section */}
        <View style={styles.directoryCard}>
          <View style={styles.directoryHeader}>
            <Text style={styles.directoryTitle}>Team Directory</Text>
            <Pressable
              style={({pressed}) => [styles.filtersButton, pressed && {opacity: 0.7}]}
              onPress={() => setShowFilters(!showFilters)}
            >
              <Ionicons name="options-outline" size={18} color={COLORS.textBlack} />
              <Text style={styles.filtersButtonText}>Filters</Text>
            </Pressable>
          </View>

          {/* Search Bar and All Roles Button */}
          <View style={styles.searchRow}>
            <View style={styles.searchContainer}>
              <Ionicons name="search-outline" size={20} color={COLORS.textGray} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search members"
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor={COLORS.textGray}
              />
            </View>
            <Pressable
              style={({pressed}) => [styles.allRolesButton, pressed && {opacity: 0.7}]}
              onPress={() => {
                // TODO: Implement all roles filter
                setBannerMessage('All roles filter coming soon');
                setBannerType('success');
                setShowBanner(true);
              }}
            >
              <Ionicons name="people-outline" size={18} color={COLORS.textBlack} />
              <Text style={styles.allRolesText}>All roles</Text>
            </Pressable>
          </View>

          {/* Filter by Groups */}
          {showFilters && (
            <View style={styles.filtersContainer}>
              <Text style={styles.filterLabel}>Filter by Group:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.groupFilters}>
                <Pressable
                  style={({pressed}) => [
                    styles.groupFilterChip,
                    !selectedGroupFilter && styles.groupFilterChipActive,
                    pressed && {opacity: 0.7}
                  ]}
                  onPress={() => setSelectedGroupFilter(null)}
                >
                  <Text style={[
                    styles.groupFilterText,
                    !selectedGroupFilter && styles.groupFilterTextActive
                  ]}>All Groups</Text>
                </Pressable>
                {groups.map(group => (
                  <Pressable
                    key={group.id}
                    style={({pressed}) => [
                      styles.groupFilterChip,
                      selectedGroupFilter === group.id && styles.groupFilterChipActive,
                      pressed && {opacity: 0.7}
                    ]}
                    onPress={() => setSelectedGroupFilter(group.id)}
                  >
                    <Text style={[
                      styles.groupFilterText,
                      selectedGroupFilter === group.id && styles.groupFilterTextActive
                    ]}>{group.name}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Active Members Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active Members</Text>
          <Pressable
            style={({pressed}) => [styles.manageGroupsButton, pressed && {opacity: 0.7}]}
            onPress={() => setShowManageGroupsModal(true)}
          >
            <Text style={styles.manageGroupsText}>Manage Groups</Text>
          </Pressable>
        </View>

        {/* Members List */}
        {filteredMembers.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={48} color={COLORS.textGray} />
            <Text style={styles.emptyStateText}>No members found</Text>
          </View>
        ) : (
          filteredMembers.map(member => (
            <View key={member.id} style={styles.memberCard}>
              <View style={styles.memberHeader}>
                <View style={styles.memberInfo}>
                  <View style={styles.avatarPlaceholder}>
                    <Ionicons name="person" size={24} color={COLORS.textWhite} />
                  </View>
                  <View style={styles.memberDetails}>
                    <View style={styles.nameRow}>
                      <Text style={styles.memberName}>{member.name}</Text>
                      <Text style={styles.memberGroup}> • {member.group}</Text>
                    </View>
                    <Text style={styles.memberShift}>Next shift: {member.nextShift}</Text>
                    <Text style={styles.memberExperience}>Experience: {member.experience}</Text>
                  </View>
                </View>
                <Pressable
                  style={({pressed}) => [styles.moreButton, pressed && {opacity: 0.7}]}
                  onPress={() => {
                    // TODO: Show member options menu
                    setBannerMessage('Member options coming soon');
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
                  <Text style={styles.shiftsText}>Shifts this week: {member.shiftsThisWeek}</Text>
                </View>
                <Text style={styles.lastActiveText}>Last active {member.lastActive}</Text>
              </View>
            </View>
          ))
        )}

        {/* Quick Actions Section */}
        <View style={styles.quickActionsCard}>
          <View style={styles.quickActionsHeader}>
            <Text style={styles.quickActionsTitle}>Quick Actions</Text>
            <Pressable
              style={({pressed}) => [pressed && {opacity: 0.7}]}
              onPress={() => {
                // TODO: Navigate to view all quick actions
                setBannerMessage('View all quick actions coming soon');
                setBannerType('success');
                setShowBanner(true);
              }}
            >
              <Text style={styles.viewAllText}>View All</Text>
            </Pressable>
          </View>
          <View style={styles.quickActionsButtons}>
            <Pressable
              style={({pressed}) => [styles.quickActionButton, styles.quickActionPrimary, pressed && {opacity: 0.7}]}
              onPress={() => {
                // TODO: Implement reassign shift
                setBannerMessage('Reassign shift feature coming soon');
                setBannerType('success');
                setShowBanner(true);
              }}
            >
              <Ionicons name="swap-horizontal-outline" size={20} color={COLORS.textWhite} />
              <Text style={styles.quickActionText}>Reassign{'\n'}Shift</Text>
            </Pressable>
            <Pressable
              style={({pressed}) => [styles.quickActionButton, styles.quickActionSecondary, pressed && {opacity: 0.7}]}
              onPress={() => {
                // TODO: Implement group codes
                setBannerMessage('Group codes feature coming soon');
                setBannerType('success');
                setShowBanner(true);
              }}
            >
              <Ionicons name="code-outline" size={20} color={COLORS.textBlack} />
              <Text style={styles.quickActionTextDark}>Group{'\n'}Codes</Text>
            </Pressable>
            <Pressable
              style={({pressed}) => [styles.quickActionButton, styles.quickActionSecondary, pressed && {opacity: 0.7}]}
              onPress={() => {
                // TODO: Implement export list
                setBannerMessage('Export list feature coming soon');
                setBannerType('success');
                setShowBanner(true);
              }}
            >
              <Ionicons name="document-outline" size={20} color={COLORS.textBlack} />
              <Text style={styles.quickActionTextDark}>Export{'\n'}List</Text>
            </Pressable>
          </View>
        </View>

        {/* Role Distribution Section */}
        <View style={styles.distributionCard}>
          <View style={styles.distributionHeader}>
            <Text style={styles.distributionTitle}>Role Distribution</Text>
            <Pressable
              style={({pressed}) => [pressed && {opacity: 0.7}]}
              onPress={() => {
                // TODO: Navigate to reports
                setBannerMessage('Reports feature coming soon');
                setBannerType('success');
                setShowBanner(true);
              }}
            >
              <Text style={styles.viewAllText}>Reports</Text>
            </Pressable>
          </View>
          {groups.map(group => (
            <View key={group.id} style={styles.distributionRow}>
              <Text style={styles.groupName}>{group.name}</Text>
              <Text style={styles.groupCount}>
                {members.filter(m => m.groupId === group.id).length} members
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

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
            <Text style={styles.modalTitle}>Manage Groups</Text>
            <Text style={styles.modalDescription}>
              Create, edit, delete groups, or share your team directory.
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
                <Text style={styles.manageGroupButtonText}>Create Group</Text>
              </Pressable>
              <Pressable
                style={({pressed}) => [styles.manageGroupButton, styles.editButton, pressed && {opacity: 0.7}]}
                onPress={() => {
                  setShowManageGroupsModal(false);
                  if (groups.length === 0) {
                    setBannerMessage('No groups to edit');
                    setBannerType('error');
                    setShowBanner(true);
                    return;
                  }
                  setEditingGroup(groups[0]);
                  setShowEditGroupModal(true);
                }}
              >
                <Ionicons name="create-outline" size={24} color={COLORS.textWhite} />
                <Text style={styles.manageGroupButtonText}>Edit Group</Text>
              </Pressable>
              <Pressable
                style={({pressed}) => [styles.manageGroupButton, styles.deleteButton, pressed && {opacity: 0.7}]}
                onPress={() => {
                  setShowManageGroupsModal(false);
                  if (groups.length === 0) {
                    setBannerMessage('No groups to delete');
                    setBannerType('error');
                    setShowBanner(true);
                    return;
                  }
                  setDeletingGroup(groups[0]);
                  setShowDeleteGroupModal(true);
                }}
              >
                <Ionicons name="trash-outline" size={24} color={COLORS.textWhite} />
                <Text style={styles.manageGroupButtonText}>Delete Group</Text>
              </Pressable>
              <Pressable
                style={({pressed}) => [styles.manageGroupButton, styles.shareButton, pressed && {opacity: 0.7}]}
                onPress={() => {
                  setShowManageGroupsModal(false);
                  setShowShareModal(true);
                }}
              >
                <Ionicons name="share-social-outline" size={24} color={COLORS.textWhite} />
                <Text style={styles.manageGroupButtonText}>Share Directory</Text>
              </Pressable>
            </View>
            <Pressable
              style={({pressed}) => [styles.modalButton, styles.modalButtonCancel, {marginTop: 16}, pressed && {opacity: 0.7}]}
              onPress={() => setShowManageGroupsModal(false)}
            >
              <Text style={styles.modalButtonTextCancel}>Close</Text>
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
            <Text style={styles.modalTitle}>Create New Group</Text>
            <View style={styles.modalInputContainer}>
              <Text style={styles.modalLabel}>Group Name</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Enter group name"
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
                <Text style={styles.modalButtonTextCancel}>Cancel</Text>
              </Pressable>
              <Pressable
                style={({pressed}) => [styles.modalButton, styles.modalButtonConfirm, pressed && {opacity: 0.7}]}
                onPress={handleCreateGroup}
              >
                <Text style={styles.modalButtonTextConfirm}>Create</Text>
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
            <Text style={styles.modalTitle}>Edit Group</Text>
            <View style={styles.modalInputContainer}>
              <Text style={styles.modalLabel}>Select Group</Text>
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
                  <Text style={[styles.modalLabel, {marginTop: 16}]}>New Group Name</Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Enter new group name"
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
                <Text style={styles.modalButtonTextCancel}>Cancel</Text>
              </Pressable>
              <Pressable
                style={({pressed}) => [styles.modalButton, styles.modalButtonConfirm, pressed && {opacity: 0.7}]}
                onPress={handleEditGroup}
              >
                <Text style={styles.modalButtonTextConfirm}>Save</Text>
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
            <Text style={styles.modalTitle}>Delete Group</Text>
            <View style={styles.modalInputContainer}>
              <Text style={styles.modalLabel}>Select Group to Delete</Text>
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
                      {members.filter(m => m.groupId === group.id).length} members
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
              {deletingGroup && (
                <View style={styles.warningBox}>
                  <Ionicons name="warning-outline" size={20} color={COLORS.textRed} />
                  <Text style={styles.warningText}>
                    This action cannot be undone. Groups with members cannot be deleted.
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
                <Text style={styles.modalButtonTextCancel}>Cancel</Text>
              </Pressable>
              <Pressable
                style={({pressed}) => [styles.modalButton, styles.modalButtonDelete, pressed && {opacity: 0.7}]}
                onPress={handleDeleteGroup}
              >
                <Text style={styles.modalButtonTextConfirm}>Delete</Text>
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
            <Text style={styles.modalTitle}>Share Team Directory</Text>
            <Text style={styles.modalDescription}>
              Generate a shareable link to the team directory. Recipients will have read-only access.
            </Text>
            <View style={styles.shareOptions}>
              <Pressable
                style={({pressed}) => [styles.shareOption, pressed && {opacity: 0.7}]}
                onPress={handleShare}
              >
                <Ionicons name="link-outline" size={24} color={COLORS.primary} />
                <Text style={styles.shareOptionText}>Copy Link</Text>
              </Pressable>
              <Pressable
                style={({pressed}) => [styles.shareOption, pressed && {opacity: 0.7}]}
                onPress={() => {
                  setShowShareModal(false);
                  setBannerMessage('Email sharing coming soon');
                  setBannerType('success');
                  setShowBanner(true);
                }}
              >
                <Ionicons name="mail-outline" size={24} color={COLORS.primary} />
                <Text style={styles.shareOptionText}>Send via Email</Text>
              </Pressable>
            </View>
            <Pressable
              style={({pressed}) => [styles.modalButton, styles.modalButtonCancel, {marginTop: 16}, pressed && {opacity: 0.7}]}
              onPress={() => setShowShareModal(false)}
            >
              <Text style={styles.modalButtonTextCancel}>Close</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
