// 1. Paquetes core de React/React Native
import { useState } from 'react';
import { Text, View, ScrollView, Pressable } from "react-native";
// 2. Bibliotecas de terceros
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
// 3. Componentes propios
import { HeaderScreen, MenuFooterAdmin } from "../../components";
// 4. Constantes y utilidades
import { COLORS } from '../../components/constants/theme';
// 5. Estilos
import styles from "../../styles/screens/admin/DashboardAdminStyles";

export default function DashboardAdmin({ navigation }) {
  // Estado para las solicitudes de ausencia (mockup data)
  const [requests, setRequests] = useState([
    {
      id: 1,
      name: 'Alex Murphy',
      date: 'Sep 22, 9:00-17:00',
      reason: 'Vacation - Doctor',
      status: 'Pending'
    },
    {
      id: 2,
      name: 'Priya Singh',
      date: 'Sep 23, 13:00-18:00',
      reason: 'Doctor - Family',
      status: 'Approved'
    },
    {
      id: 3,
      name: 'Marco Chen',
      date: 'Sep 24, 8:00-12:00',
      reason: 'Personal',
      status: 'Rejected'
    }
  ]);

  const handleApprove = (id) => {
    // TODO: Implementar lógica de aprobación con Firebase
    setRequests(requests.map(req =>
      req.id === id ? { ...req, status: 'Approved' } : req
    ));
  };

  const handleReject = (id) => {
    // TODO: Implementar lógica de rechazo con Firebase
    setRequests(requests.map(req =>
      req.id === id ? { ...req, status: 'Rejected' } : req
    ));
  };

  const handleApproveAll = () => {
    // TODO: Implementar lógica de aprobación masiva
    setRequests(requests.map(req => ({ ...req, status: 'Approved' })));
  };

  const getStatusStyle = (status) => {
    switch(status) {
      case 'Pending':
        return styles.statusPending;
      case 'Approved':
        return styles.statusApproved;
      case 'Rejected':
        return styles.statusRejected;
      default:
        return styles.statusPending;
    }
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <HeaderScreen
        title="Admin Dashboard"
        leftIcon={<Ionicons name="menu-outline" size={24} color={COLORS.textBlack} />}
        rightIcon={<Ionicons name="notifications-outline" size={24} color={COLORS.textBlack} />}
        onLeftPress={() => navigation.openDrawer ? navigation.openDrawer() : {}}
        onRightPress={() => {}}
      />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Métricas principales */}
        <View style={styles.metricsContainer}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Total Members</Text>
            <Text style={styles.metricValue}>128</Text>
            <Text style={styles.metricSub}>+6 this week</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Active Shifts</Text>
            <Text style={styles.metricValue}>23</Text>
            <Text style={styles.metricSub}>Across 5 teams</Text>
          </View>
        </View>

        <View style={styles.metricsContainer}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Pending Absence Requests</Text>
            <Text style={styles.metricValue}>23</Text>
            <Text style={styles.metricSub}>Awaiting review</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Open Replacements</Text>
            <Text style={styles.metricValue}>4</Text>
            <Text style={styles.metricSub}>All matching in progress</Text>
          </View>
        </View>

        {/* Sección de solicitudes */}
        <View style={styles.requestsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Absence & Permission Requests</Text>
            <Pressable
              onPress={handleApproveAll}
              style={({ pressed }) => [
                styles.approveAllButton,
                pressed && { opacity: 0.7 }
              ]}
            >
              <Ionicons name="checkmark-circle-outline" size={20} color={COLORS.primary} />
              <Text style={styles.approveAllText}>Approve All</Text>
            </Pressable>
          </View>

          {/* Lista de solicitudes */}
          {requests.map((request) => (
            <View key={request.id} style={styles.requestCard}>
              <View style={styles.requestHeader}>
                <Text style={styles.requestName}>{request.name}</Text>
                <View style={getStatusStyle(request.status)}>
                  <Text style={styles.statusText}>{request.status}</Text>
                </View>
              </View>

              <Text style={styles.requestDate}>{request.date}</Text>
              <Text style={styles.requestReason}>• Reason: {request.reason}</Text>

              {request.status === 'Pending' && (
                <View style={styles.actionButtons}>
                  <Pressable
                    onPress={() => handleReject(request.id)}
                    style={({ pressed }) => [
                      styles.rejectButton,
                      pressed && { opacity: 0.7 }
                    ]}
                  >
                    <Ionicons name="close" size={20} color={COLORS.error} />
                    <Text style={styles.rejectText}>Reject</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => handleApprove(request.id)}
                    style={({ pressed }) => [
                      styles.approveButton,
                      pressed && { opacity: 0.7 }
                    ]}
                  >
                    <Ionicons name="checkmark" size={20} color={COLORS.textWhite} />
                    <Text style={styles.approveText}>Approve</Text>
                  </Pressable>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footerContainer}>
        <MenuFooterAdmin />
      </View>
    </SafeAreaView>
  );
}
