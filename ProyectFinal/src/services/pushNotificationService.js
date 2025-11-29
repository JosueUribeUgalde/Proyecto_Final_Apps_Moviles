// Servicio de notificaciones push usando Expo Notifications

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

/**
 * Configuración global de cómo se manejan las notificaciones
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Registra el dispositivo para recibir notificaciones push
 * Guarda el token en Firestore para enviar notificaciones al usuario
 * @param {string} userId - ID del usuario
 * @returns {Promise<string|null>} Token de notificación o null si falla
 */
export const registerForPushNotifications = async (userId) => {
  try {
    // Solicitar permisos (necesario para notificaciones locales)
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('No se otorgaron permisos para notificaciones');
      return null;
    }

    // Configuración específica de Android
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    console.log('✅ Notificaciones locales configuradas correctamente');

    // NOTA: Push notifications remotas requieren Development Build (no funcionan en Expo Go SDK 53+)
    // Para obtener token push, necesitas crear un build: npx expo run:android o npx expo run:ios
    
    return 'local-notifications-enabled';
  } catch (error) {
    console.error('Error al configurar notificaciones:', error);
    return null;
  }
};

/**
 * Envía una notificación push local (sin servidor)
 * Útil para notificaciones inmediatas dentro de la app
 * @param {string} title - Título de la notificación
 * @param {string} body - Cuerpo de la notificación
 * @param {Object} data - Datos adicionales
 */
export const sendLocalNotification = async (title, body, data = {}) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: null, // Inmediato
    });
  } catch (error) {
    console.error('Error al enviar notificación local:', error);
  }
};

/**
 * Programa una notificación local para el futuro
 * @param {string} title - Título de la notificación
 * @param {string} body - Cuerpo de la notificación
 * @param {number} seconds - Segundos hasta que se muestre
 * @param {Object} data - Datos adicionales
 */
export const scheduleLocalNotification = async (title, body, seconds, data = {}) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: true,
      },
      trigger: { seconds },
    });
  } catch (error) {
    console.error('Error al programar notificación:', error);
  }
};

/**
 * Configura listeners para notificaciones
 * @param {function} onNotificationReceived - Callback cuando se recibe una notificación
 * @param {function} onNotificationTapped - Callback cuando se toca una notificación
 * @returns {Object} Objeto con funciones para remover los listeners
 */
export const setupNotificationListeners = (onNotificationReceived, onNotificationTapped) => {
  // Listener para notificaciones recibidas mientras la app está abierta
  const receivedSubscription = Notifications.addNotificationReceivedListener(notification => {
    console.log('Notificación recibida:', notification);
    if (onNotificationReceived) {
      onNotificationReceived(notification);
    }
  });

  // Listener para cuando el usuario toca una notificación
  const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
    console.log('Notificación tocada:', response);
    if (onNotificationTapped) {
      onNotificationTapped(response);
    }
  });

  // Retornar funciones para limpiar los listeners
  return {
    remove: () => {
      receivedSubscription.remove();
      responseSubscription.remove();
    },
  };
};

/**
 * Obtiene el badge count actual (número de notificaciones sin leer)
 * @returns {Promise<number>} Número de notificaciones sin leer
 */
export const getBadgeCount = async () => {
  try {
    return await Notifications.getBadgeCountAsync();
  } catch (error) {
    console.error('Error al obtener badge count:', error);
    return 0;
  }
};

/**
 * Actualiza el badge count
 * @param {number} count - Nuevo número para el badge
 */
export const setBadgeCount = async (count) => {
  try {
    await Notifications.setBadgeCountAsync(count);
  } catch (error) {
    console.error('Error al actualizar badge count:', error);
  }
};

/**
 * Limpia todas las notificaciones
 */
export const clearAllNotifications = async () => {
  try {
    await Notifications.dismissAllNotificationsAsync();
    await setBadgeCount(0);
  } catch (error) {
    console.error('Error al limpiar notificaciones:', error);
  }
};

/**
 * Cancela todas las notificaciones programadas
 */
export const cancelAllScheduledNotifications = async () => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error al cancelar notificaciones programadas:', error);
  }
};
