// 1. Paquetes core de React/React Native
import { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, RefreshControl } from "react-native";

// 2. Bibliotecas de terceros
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// 3. Componentes propios
import MenuFooter from "../../components/MenuFooter";
import HeaderScreen from "../../components/HeaderScreen";
import NotificationsModal from "../../components/NotificationsModal";

// 4. Constantes y utilidades
import { COLORS } from '../../components/constants/theme';

// 5. Servicios de Firebase
import { getCurrentUser } from "../../services/authService";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { getHistorialByIds } from "../../services/peticionService";

// 6. Estilos
import styles from "../../styles/screens/user/HistoryStyles";

export default function History() {
  // ============================================
  // ESTADOS
  // ============================================
  
  const navigation = useNavigation();
  
  // Control de carga inicial de datos
  const [loading, setLoading] = useState(true);
  
  // Control del estado de pull-to-refresh
  const [refreshing, setRefreshing] = useState(false);
  
  // Array con todos los registros del historial del usuario
  const [historial, setHistorial] = useState([]);
  
  // Mapa de IDs de usuarios sustitutos a sus nombres (userId -> nombre completo)
  const [replacementUsers, setReplacementUsers] = useState({});
  
  // Control de visibilidad del modal de notificaciones
  const [notificationsVisible, setNotificationsVisible] = useState(false);

  // ============================================
  // EFECTOS
  // ============================================

  
  // Cargar historial al montar el componente
  useEffect(() => {
    loadHistorial();
  }, []);

  // ============================================
  // FUNCIONES DE CARGA DE DATOS
  // ============================================
  
  /**
   * Carga el historial completo del usuario desde Firebase
   * Obtiene los IDs de historial del perfil del usuario y luego carga los documentos completos
   */
  const loadHistorial = async () => {
    try {
      // Obtener usuario actualmente autenticado
      const user = getCurrentUser();
      if (!user) {
        console.error("No hay sesión activa");
        setLoading(false);
        return;
      }

      // Obtener documento del usuario desde Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const historialesIds = userData.historialesIds || [];

        if (historialesIds.length > 0) {
          // Cargar documentos completos del historial usando el servicio
          const historialData = await getHistorialByIds(historialesIds);
          setHistorial(historialData);

          // Cargar nombres de usuarios sustitutos
          await loadReplacementUsers(historialData);
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

  /**
   * Carga los nombres de los usuarios sustitutos para mostrarlos en el historial
   * @param {Array} historialData - Array de registros del historial
   */
  const loadReplacementUsers = async (historialData) => {
    try {
      // Extraer IDs únicos de usuarios sustitutos
      const userIds = [...new Set(
        historialData
          .filter(item => item.replacementUserId)
          .map(item => item.replacementUserId)
      )];

      if (userIds.length === 0) return;

      // Cargar datos de cada usuario sustituto
      const usersData = {};
      await Promise.all(
        userIds.map(async (userId) => {
          try {
            const userDoc = await getDoc(doc(db, "users", userId));
            if (userDoc.exists()) {
              const data = userDoc.data();
              usersData[userId] = `${data.name || 'Sin nombre'} ${data.lastName || ''}`.trim();
            } else {
              usersData[userId] = 'Usuario no encontrado';
            }
          } catch (error) {
            console.error(`Error al cargar usuario ${userId}:`, error);
            usersData[userId] = 'Error al cargar';
          }
        })
      );

      setReplacementUsers(usersData);
    } catch (error) {
      console.error("Error al cargar usuarios sustitutos:", error);
    }
  };

  // ============================================
  // HANDLERS DE EVENTOS
  // ============================================

  
  /**
   * Maneja el evento de pull-to-refresh
   * Recarga el historial completo desde Firebase
   */
  const onRefresh = () => {
    setRefreshing(true);
    loadHistorial();
  };

  // ============================================
  // FUNCIONES DE UTILIDAD
  // ============================================
  
  /**
   * Convierte un timestamp de Firebase a formato de fecha legible en español
   * @param {Timestamp} timestamp - Timestamp de Firestore
   * @returns {string} - Fecha formateada (ej: "22 de enero de 2025")
   */
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Fecha no disponible';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  /**
   * Retorna el color correspondiente según el estado de la petición
   * @param {string} status - Estado de la petición (Aprobada, Rechazada, Pendiente)
   * @returns {string} - Color del tema (verde, rojo, gris)
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
   * Retorna el nombre del icono correspondiente según el estado
   * @param {string} status - Estado de la petición
   * @returns {string} - Nombre del icono de Ionicons
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
  // RENDERIZADO
  // ============================================

  
  // Pantalla de carga mostrada mientras se obtienen los datos del historial
  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        {/* Header con botón de regreso y notificaciones */}
        <HeaderScreen
          title="Historial"
          leftIcon={<Ionicons name="arrow-back" size={24} color="black" />}
          rightIcon={<Ionicons name="notifications-outline" size={24} color="black" />}
          onLeftPress={() => navigation.goBack()}
          onRightPress={() => setNotificationsVisible(true)}
        />
        {/* Indicador de carga centrado */}
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={{ marginTop: 16, color: COLORS.textGray }}>
            Cargando historial...
          </Text>
        </View>
        {/* Footer con navegación */}
        <View style={styles.footerContainer}>
          <MenuFooter />
        </View>
      </SafeAreaView>
    );
  }

  // Pantalla principal con lista del historial
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header con botón de regreso y notificaciones */}
      <HeaderScreen
        title="Historial"
        leftIcon={<Ionicons name="arrow-back" size={24} color="black" />}
        rightIcon={<Ionicons name="notifications-outline" size={24} color="black" />}
        onLeftPress={() => navigation.goBack()}
        onRightPress={() => setNotificationsVisible(true)}
      />

      {/* ScrollView con pull-to-refresh para recargar el historial */}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Renderizado condicional: mostrar cards o mensaje vacío */}
        {historial.length > 0 ? (
          // Mapear cada registro del historial a una card
          historial.map((item) => (
            <View key={item.id} style={styles.card}>
              {/* Header de la card con estado y fecha */}
              <View style={styles.cardHeader}>
                <View style={styles.statusContainer}>
                  {/* Icono del estado (check, x, reloj) */}
                  <Ionicons
                    name={getStatusIcon(item.status)}
                    size={24}
                    color={getStatusColor(item.status)}
                  />
                  {/* Texto del estado con color dinámico */}
                  <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                    {item.status}
                  </Text>
                </View>
                {/* Fecha de aprobación/rechazo/creación */}
                <Text style={styles.cardDate}>
                  {formatDate(item.approvedAt || item.rejectedAt || item.createdAt)}
                </Text>
              </View>

              {/* Cuerpo de la card con todos los detalles de la petición */}
              <View style={styles.cardBody}>
                {/* Fila: Puesto del usuario */}
                <View style={styles.detailRow}>
                  <Ionicons name="briefcase-outline" size={16} color={COLORS.textGray} />
                  <Text style={styles.detailLabel}>Puesto:</Text>
                  <Text style={styles.detailValue}>{item.position}</Text>
                </View>

                {/* Fila: Fecha solicitada */}
                <View style={styles.detailRow}>
                  <Ionicons name="calendar-outline" size={16} color={COLORS.textGray} />
                  <Text style={styles.detailLabel}>Fecha solicitada:</Text>
                  <Text style={styles.detailValue}>{item.date}</Text>
                </View>

                {/* Fila: Hora de inicio */}
                <View style={styles.detailRow}>
                  <Ionicons name="time-outline" size={16} color={COLORS.textGray} />
                  <Text style={styles.detailLabel}>Hora:</Text>
                  <Text style={styles.detailValue}>{item.startTime}</Text>
                </View>

                {/* Fila: Motivo/razón de la petición */}
                <View style={styles.detailRow}>
                  <Ionicons name="information-circle-outline" size={16} color={COLORS.textGray} />
                  <Text style={styles.detailLabel}>Motivo:</Text>
                  <Text style={styles.detailValue}>{item.reason}</Text>
                </View>

                {/* Fila condicional: Usuario de reemplazo (si existe) */}
                {item.replacementUserId && (
                  <View style={styles.detailRow}>
                    <Ionicons name="person-outline" size={16} color={COLORS.textGray} />
                    <Text style={styles.detailLabel}>Cubierto por:</Text>
                    <Text style={styles.detailValue}>
                      {replacementUsers[item.replacementUserId] || 'Cargando...'}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          ))
        ) : (
          // Mensaje cuando no hay registros en el historial
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={64} color={COLORS.textGray} />
            <Text style={styles.emptyTitle}>No hay historial</Text>
            <Text style={styles.emptyText}>
              Tus solicitudes aprobadas y rechazadas aparecerán aquí
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Modal de notificaciones */}
      <NotificationsModal
        visible={notificationsVisible}
        onClose={() => setNotificationsVisible(false)}
      />

      {/* Footer con navegación */}
      <View style={styles.footerContainer}>
        <MenuFooter />
      </View>
    </SafeAreaView>
  );
}