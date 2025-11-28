import { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import styles from "../../styles/screens/user/HistoryStyles";
import MenuFooter from "../../components/MenuFooter";
import HeaderScreen from "../../components/HeaderScreen";
import { COLORS } from '../../components/constants/theme';
import { getCurrentUser } from "../../services/authService";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { getHistorialByIds } from "../../services/peticionService";

export default function History() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    loadHistorial();
  }, []);

  const loadHistorial = async () => {
    try {
      const user = getCurrentUser();
      if (!user) {
        console.error("No hay sesión activa");
        setLoading(false);
        return;
      }

      // Obtener datos del usuario
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const historialesIds = userData.historialesIds || [];

        if (historialesIds.length > 0) {
          // Cargar historial del usuario
          const historialData = await getHistorialByIds(historialesIds);
          setHistorial(historialData);
        } else {
          setHistorial([]);
        }
      }
    } catch (error) {
      console.error("Error al cargar historial:", error);
      setHistorial([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadHistorial();
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Fecha no disponible';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <HeaderScreen
          title="Historial"
          leftIcon={<Ionicons name="arrow-back" size={24} color="black" />}
          rightIcon={<Ionicons name="notifications-outline" size={24} color="black" />}
          onLeftPress={() => navigation.goBack()}
          onRightPress={() => { }}
        />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={{ marginTop: 16, color: COLORS.textGray }}>
            Cargando historial...
          </Text>
        </View>
        <View style={styles.footerContainer}>
          <MenuFooter />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <HeaderScreen
        title="Historial"
        leftIcon={<Ionicons name="arrow-back" size={24} color="black" />}
        rightIcon={<Ionicons name="notifications-outline" size={24} color="black" />}
        onLeftPress={() => navigation.goBack()}
        onRightPress={() => { }}
      />

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {historial.length > 0 ? (
          historial.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.statusContainer}>
                  <Ionicons
                    name={getStatusIcon(item.status)}
                    size={24}
                    color={getStatusColor(item.status)}
                  />
                  <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                    {item.status}
                  </Text>
                </View>
                <Text style={styles.cardDate}>
                  {formatDate(item.approvedAt || item.rejectedAt || item.createdAt)}
                </Text>
              </View>

              <View style={styles.cardBody}>
                <View style={styles.detailRow}>
                  <Ionicons name="briefcase-outline" size={16} color={COLORS.textGray} />
                  <Text style={styles.detailLabel}>Puesto:</Text>
                  <Text style={styles.detailValue}>{item.position}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Ionicons name="calendar-outline" size={16} color={COLORS.textGray} />
                  <Text style={styles.detailLabel}>Fecha solicitada:</Text>
                  <Text style={styles.detailValue}>{item.date}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Ionicons name="time-outline" size={16} color={COLORS.textGray} />
                  <Text style={styles.detailLabel}>Hora:</Text>
                  <Text style={styles.detailValue}>{item.startTime}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Ionicons name="information-circle-outline" size={16} color={COLORS.textGray} />
                  <Text style={styles.detailLabel}>Motivo:</Text>
                  <Text style={styles.detailValue}>{item.reason}</Text>
                </View>

                {item.replacementUserId && (
                  <View style={styles.detailRow}>
                    <Ionicons name="person-outline" size={16} color={COLORS.textGray} />
                    <Text style={styles.detailLabel}>Cubierto por:</Text>
                    <Text style={styles.detailValue}>Usuario asignado</Text>
                  </View>
                )}
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={64} color={COLORS.textGray} />
            <Text style={styles.emptyTitle}>No hay historial</Text>
            <Text style={styles.emptyText}>
              Tus solicitudes aprobadas y rechazadas aparecerán aquí
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footerContainer}>
        <MenuFooter />
      </View>
    </SafeAreaView>
  );
}