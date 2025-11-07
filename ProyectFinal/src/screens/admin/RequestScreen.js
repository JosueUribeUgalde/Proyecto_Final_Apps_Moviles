// 1. Paquetes core de React/React Native
import { useState } from 'react';
import { Text, View, ScrollView, TextInput, Pressable } from "react-native";

// 2. Bibliotecas de terceros
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';

// 3. Componentes propios
import { HeaderScreen, Banner, MenuFooterAdmin } from "../../components";

// 4. Constantes y utilidades
import { COLORS } from '../../components/constants/theme';

// 5. Estilos
import styles from "../../styles/screens/admin/RequestStyles";

export default function RequestScreen({ navigation }) {
  const [showBanner, setShowBanner] = useState(false);
  const [bannerMessage, setBannerMessage] = useState('');
  const [bannerType, setBannerType] = useState('success');
  const [selectedFilter, setSelectedFilter] = useState('Pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [showThisWeek, setShowThisWeek] = useState(false);

  // Mock data - Pending Absence Requests
  const pendingRequests = [
    {
      id: 1,
      name: 'Alex Johnson',
      position: 'Front Desk',
      date: 'Mon, 9:00 AM - 1:00 PM',
      reason: 'Reason: Sick',
    },
    {
      id: 2,
      name: 'Priya Patel',
      position: 'Waiter',
      date: 'Wed, 12:00 PM - 8:00 PM',
      reason: 'Reason: Personal',
    },
    {
      id: 3,
      name: 'Diego Ramos',
      position: 'Host / Hos',
      date: 'Fri, 10:00 AM - 6:00 PM',
      reason: 'Reason: Vacation',
    },
  ];

  // Mock data - Recent Decisions
  const recentDecisions = [
    {
      id: 1,
      status: 'Approved',
      role: 'Barr Lee',
      date: 'Today 8:10 AM',
    },
    {
      id: 2,
      status: 'Rejected',
      role: 'Chef',
    },
    {
      id: 3,
      status: 'Auto-reassigned',
      role: 'Front Desk',
      date: 'Yesterday',
    },
  ];

  const filters = ['Pending', 'Approved', 'Rejected', 'All'];

  const handleApprove = (requestId) => {
    setBannerMessage('Request approved successfully');
    setBannerType('success');
    setShowBanner(true);
    // TODO: Implement approve logic with Firebase
  };

  const handleReject = (requestId) => {
    setBannerMessage('Request rejected');
    setBannerType('error');
    setShowBanner(true);
    // TODO: Implement reject logic with Firebase
  };

  const handleMessage = (requestId) => {
    // TODO: Navigate to messaging screen or open message modal
    console.log('Message user for request:', requestId);
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <HeaderScreen
        title="Requests"
        leftIcon={<Ionicons name="arrow-back" size={24} color={COLORS.textBlack} />}
        // rightIcon={<Ionicons name="add" size={28} color={COLORS.textBlack} />}
        onLeftPress={() => navigation.goBack()}
        // onRightPress={() => {
        //   // TODO: Navigate to add request screen
        //   console.log('Add new request');
        // }}
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
            <Text style={styles.filtersTitle}>Filters</Text>
            <Pressable
              style={styles.adjustButton}
              onPress={() => {
                // TODO: Open adjust filters modal
                console.log('Adjust filters');
              }}
            >
              <Ionicons name="options-outline" size={18} color={COLORS.textGray} />
              <Text style={styles.adjustText}>Adjust</Text>
            </Pressable>
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

        {/* Search and Week Toggle */}
        <View style={styles.searchWeekContainer}>
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color={COLORS.textGray} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by member or date"
              placeholderTextColor={COLORS.textGray}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <Pressable
            style={styles.weekToggleButton}
            onPress={() => setShowThisWeek(!showThisWeek)}
          >
            <Ionicons
              name={showThisWeek ? "calendar" : "calendar-outline"}
              size={18}
              color={COLORS.textBlack}
            />
            <Text style={styles.weekToggleText}>This week</Text>
          </Pressable>
        </View>

        {/* Pending Absence Requests Section */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Pending Absence Requests</Text>
            <Text style={styles.sectionSubtitle}>Bulk Actions</Text>
          </View>
        </View>

        {/* Request Cards */}
        {pendingRequests.map((request) => (
          <View key={request.id} style={styles.requestCard}>
            <View style={styles.requestHeader}>
              <View style={styles.requestUserInfo}>
                <Text style={styles.requestUserName}>{request.name}</Text>
                <Text style={styles.requestPosition}>{request.position}</Text>
                <Text style={styles.requestDateTime}>{request.date}</Text>
                <Text style={styles.requestDateTime}>{request.reason}</Text>
              </View>
              <View style={styles.requestActions}>
                <Pressable
                  style={[styles.actionButton, styles.approveButton]}
                  onPress={() => handleApprove(request.id)}
                >
                  <Text style={styles.actionButtonText}>Approve</Text>
                </Pressable>
                <Pressable
                  style={[styles.actionButton, styles.rejectButton]}
                  onPress={() => handleReject(request.id)}
                >
                  <Text style={styles.actionButtonText}>Reject</Text>
                </Pressable>
                <Pressable
                  style={[styles.actionButton, styles.messageButton]}
                  onPress={() => handleMessage(request.id)}
                >
                  <Text style={styles.actionButtonText}>Message</Text>
                </Pressable>
              </View>
            </View>
          </View>
        ))}

        {/* Recent Decisions Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Decisions</Text>
          <Pressable
            style={styles.viewAllButton}
            onPress={() => {
              // TODO: Navigate to view all decisions
              console.log('View all decisions');
            }}
          >
            <Text style={styles.viewAllText}>View All</Text>
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

      <View style={styles.footerContainer}>
        <MenuFooterAdmin />
      </View>
    </SafeAreaView>
  );
}
