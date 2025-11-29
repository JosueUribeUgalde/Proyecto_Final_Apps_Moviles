// 1. Paquetes core de React/React Native
import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
} from 'react-native';

// 2. Bibliotecas de terceros
import { Ionicons } from '@expo/vector-icons';

// 3. Constantes y utilidades
import { COLORS } from './constants/theme';

// 4. Servicios de Firebase
import { getCurrentUser } from '../services/authService';
import { 
  getUserNotifications, 
  markNotificationAsRead,
  respondToSubstitutionRequest 
} from '../services/notificationService';
import { setBadgeCount } from '../services/pushNotificationService';

// 5. Estilos
import styles from '../styles/components/NotificationsModalStyles';

/**
 * Modal de notificaciones que muestra todas las notificaciones del usuario
 * Permite aceptar/rechazar peticiones de sustitución
 * @param {boolean} visible - Control de visibilidad del modal
 * @param {function} onClose - Función para cerrar el modal
 */
export default function NotificationsModal({ visible, onClose }) {
  // ============================================
  // ESTADOS
  // ============================================

  // Lista de notificaciones del usuario
  const [notifications, setNotifications] = useState([]);

  // Control de carga de notificaciones
  const [loading, setLoading] = useState(true);

  // Control de acciones en progreso (aceptar/rechazar)
  const [processing, setProcessing] = useState(null);

  // ============================================
  // EFECTOS
  // ============================================

  /**
   * Cargar notificaciones cada vez que el modal se abre
   */
  useEffect(() => {
    if (visible) {
      loadNotifications();
    }
  }, [visible]);

  // ============================================
  // FUNCIONES DE CARGA DE DATOS
  // ============================================

  /**
   * Carga todas las notificaciones del usuario desde Firestore
   * Ordena por fecha descendente (más recientes primero)
   */
  const loadNotifications = async () => {
    try {
      setLoading(true);
      const user = getCurrentUser();
      if (!user) return;

      const userNotifications = await getUserNotifications(user.uid);
      setNotifications(userNotifications);

      // Actualizar badge con notificaciones no leídas
      const unreadCount = userNotifications.filter(n => !n.read).length;
      await setBadgeCount(unreadCount);
    } catch (error) {
      console.error('Error al cargar notificaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Marca una notificación como leída
   * @param {string} notificationId - ID de la notificación
   */
  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      
      // Actualizar lista local
      setNotifications(prev => {
        const updated = prev.map(notif =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        );
        
        // Actualizar badge
        const unreadCount = updated.filter(n => !n.read).length;
        setBadgeCount(unreadCount);
        
        return updated;
      });
    } catch (error) {
      console.error('Error al marcar como leída:', error);
    }
  };

  /**
   * Responde a una petición de sustitución (aceptar/rechazar)
   * @param {string} notificationId - ID de la notificación
   * @param {string} petitionId - ID de la petición de sustitución
   * @param {string} response - 'aceptada' o 'rechazada'
   */
  const handleRespondToSubstitution = async (notificationId, petitionId, response) => {
    try {
      setProcessing(notificationId);
      const user = getCurrentUser();
      if (!user) return;

      // Actualizar estado de la petición de sustitución en Firestore
      const result = await respondToSubstitutionRequest(notificationId, petitionId, response, user.uid);

      // Actualizar la notificación localmente para feedback inmediato
      setNotifications(prev =>
        prev.map(notif => {
          if (notif.id === notificationId) {
            const newMessage = response === 'aceptada'
              ? `Has aceptado sustituir el ${notif.message.split('el ')[1]}`
              : `Has rechazado la sustitución del ${notif.message.split('el ')[1]}`;
            
            return {
              ...notif,
              petitionStatus: result.newStatus,
              message: newMessage,
              read: true,
              title: response === 'aceptada' ? 'Sustitución Aceptada' : 'Sustitución Rechazada'
            };
          }
          return notif;
        })
      );
    } catch (error) {
      console.error('Error al responder petición:', error);
      // Recargar notificaciones en caso de error
      await loadNotifications();
    } finally {
      setProcessing(null);
    }
  };

  /**
   * Cierra el modal
   */
  const handleClose = () => {
    onClose();
  };

  // ============================================
  // FUNCIONES DE UTILIDAD
  // ============================================

  /**
   * Formatea la fecha de la notificación
   * @param {any} timestamp - Timestamp de Firebase
   * @returns {string} Fecha formateada
   */
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Ahora';
    if (minutes < 60) return `Hace ${minutes}m`;
    if (hours < 24) return `Hace ${hours}h`;
    if (days < 7) return `Hace ${days}d`;
    
    return date.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' });
  };

  /**
   * Obtiene el icono según el tipo de notificación
   * @param {string} type - Tipo de notificación
   * @returns {string} Nombre del icono
   */
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'peticionAprobada':
        return 'checkmark-circle';
      case 'peticionRechazada':
        return 'close-circle';
      case 'solicitudSustitucion':
        return 'swap-horizontal';
      case 'sustitucionAceptada':
        return 'checkmark-done-circle';
      case 'sustitucionRechazada':
        return 'close-circle';
      default:
        return 'notifications';
    }
  };

  /**
   * Obtiene el color del icono según el tipo de notificación
   * @param {string} type - Tipo de notificación
   * @returns {string} Color del icono
   */
  const getNotificationColor = (type) => {
    switch (type) {
      case 'peticionAprobada':
      case 'sustitucionAceptada':
        return COLORS.textGreen;
      case 'peticionRechazada':
      case 'sustitucionRechazada':
        return COLORS.textRed;
      case 'solicitudSustitucion':
        return COLORS.primary;
      default:
        return COLORS.textGray;
    }
  };

  // ============================================
  // RENDERIZADO
  // ============================================

  /**
   * Renderiza cada item de notificación
   */
  const renderNotificationItem = ({ item }) => {
    const isSubstitutionRequest = item.type === 'solicitudSustitucion';
    const isPending = item.petitionStatus === 'pendiente';
    const isProcessing = processing === item.id;

    return (
      <Pressable
        style={({ pressed }) => [
          styles.notificationItem,
          !item.read && styles.notificationUnread,
          pressed && { opacity: 0.7 }
        ]}
        onPress={() => !item.read && handleMarkAsRead(item.id)}
      >
        {/* Icono de tipo de notificación */}
        <View style={[styles.iconContainer, { backgroundColor: getNotificationColor(item.type) + '20' }]}>
          <Ionicons
            name={getNotificationIcon(item.type)}
            size={24}
            color={getNotificationColor(item.type)}
          />
        </View>

        {/* Contenido de la notificación */}
        <View style={styles.contentContainer}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          <Text style={styles.notificationMessage}>{item.message}</Text>

          {/* Botones de aceptar/rechazar para solicitudes de sustitución pendientes */}
          {isSubstitutionRequest && isPending && (
            <View style={styles.actionsRow}>
              <Pressable
                style={({ pressed }) => [
                  styles.actionButton,
                  styles.acceptButton,
                  pressed && { opacity: 0.7 },
                  isProcessing && { opacity: 0.5 }
                ]}
                onPress={() => handleRespondToSubstitution(item.id, item.petitionId, 'aceptada')}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <ActivityIndicator size="small" color={COLORS.textWhite} />
                ) : (
                  <>
                    <Ionicons name="checkmark" size={16} color={COLORS.textWhite} />
                    <Text style={styles.actionButtonText}>Aceptar</Text>
                  </>
                )}
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.actionButton,
                  styles.rejectButton,
                  pressed && { opacity: 0.7 },
                  isProcessing && { opacity: 0.5 }
                ]}
                onPress={() => handleRespondToSubstitution(item.id, item.petitionId, 'rechazada')}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <ActivityIndicator size="small" color={COLORS.textWhite} />
                ) : (
                  <>
                    <Ionicons name="close" size={16} color={COLORS.textWhite} />
                    <Text style={styles.actionButtonText}>Rechazar</Text>
                  </>
                )}
              </Pressable>
            </View>
          )}

          {/* Fecha de la notificación */}
          <Text style={styles.notificationDate}>{formatDate(item.createdAt)}</Text>
        </View>

        {/* Indicador de no leída */}
        {!item.read && <View style={styles.unreadDot} />}
      </Pressable>
    );
  };

  /**
   * Renderiza el estado vacío
   */
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="notifications-off-outline" size={64} color={COLORS.textGray} />
      <Text style={styles.emptyTitle}>Sin notificaciones</Text>
      <Text style={styles.emptyMessage}>No tienes notificaciones nuevas</Text>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header del modal */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Notificaciones</Text>
            <Pressable
              style={({ pressed }) => [
                styles.closeButton,
                pressed && { opacity: 0.5 }
              ]}
              onPress={handleClose}
            >
              <Ionicons name="close" size={24} color={COLORS.textBlack} />
            </Pressable>
          </View>

          {/* Lista de notificaciones */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>Cargando notificaciones...</Text>
            </View>
          ) : (
            <FlatList
              data={notifications}
              renderItem={renderNotificationItem}
              keyExtractor={(item) => item.id}
              ListEmptyComponent={renderEmptyState}
              contentContainerStyle={notifications.length === 0 && styles.emptyList}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}
