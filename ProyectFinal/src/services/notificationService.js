/**
 * notificationService.js
 * 
 * Servicio central para la gestión de notificaciones de la aplicación.
 * Funcionalidades principales:
 * - Obtener notificaciones por usuario / administrador
 * - Marcar notificaciones como leídas
 * - Responder solicitudes de sustitución (actualiza petición + notificación)
 * - Generar distintos tipos de notificaciones (petición aprobada/rechazada, sustitución, nuevas ausencias)
 * - Enviar notificación local (push interno) como complemento visual
 * 
 * Convenciones:
 * - Todas las notificaciones se guardan en la colección 'notifications'
 * - Campos clave: userId, type, title, message, read, createdAt
 * - Las peticiones de sustitución se gestionan en 'peticionesSustitucion'
 * - Se evita spam de logs: únicamente se lanzan errores mediante throw
 */

import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { sendLocalNotification } from './pushNotificationService'

/**
 * Obtiene todas las notificaciones de un usuario
 * @param {string} userId - ID del usuario
 * @returns {Promise<Array>} Lista de notificaciones ordenadas por fecha descendente
 */
export const getUserNotifications = async (userId) => {
  try {
    const notificationsRef = collection(db, 'notifications');
    // Se omite orderBy hasta disponer del índice compuesto en Firestore
    const q = query(
      notificationsRef,
      where('userId', '==', userId)
    );

    const querySnapshot = await getDocs(q);
    const notifications = [];

    // Construcción del array de notificaciones
    querySnapshot.forEach((docSnap) => {
      notifications.push({
        id: docSnap.id,
        ...docSnap.data(),
      });
    });

    // Orden manual (fallback) mientras se crea índice: más reciente primero
    notifications.sort((a, b) => {
      const dateA = a.createdAt?.toMillis?.() || 0;
      const dateB = b.createdAt?.toMillis?.() || 0;
      return dateB - dateA;
    });

    return notifications;
  } catch (error) {
    // Escalar error para manejarlo en nivel superior (UI / lógica)
    throw error;
  }
};

/**
 * Obtiene todas las notificaciones de un administrador
 * @param {string} adminId - ID del administrador
 * @returns {Promise<Array>} Lista de notificaciones ordenadas por fecha descendente
 */
export const getAdminNotifications = async (adminId) => {
  try {
    const notificationsRef = collection(db, 'notifications');
    const q = query(
      notificationsRef,
      where('userId', '==', adminId)
    );

    const querySnapshot = await getDocs(q);
    const notifications = [];

    querySnapshot.forEach((docSnap) => {
      notifications.push({
        id: docSnap.id,
        ...docSnap.data(),
      });
    });

    notifications.sort((a, b) => {
      const dateA = a.createdAt?.toMillis?.() || 0;
      const dateB = b.createdAt?.toMillis?.() || 0;
      return dateB - dateA;
    });

    return notifications;
  } catch (error) {
    throw error;
  }
};

/**
 * Marca una notificación como leída
 * @param {string} notificationId - ID de la notificación
 */
export const markNotificationAsRead = async (notificationId) => {
  try {
    const notificationRef = doc(db, 'notifications', notificationId);
    await updateDoc(notificationRef, {
      read: true,
      readAt: serverTimestamp(),
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Responde a una petición de sustitución (aceptar/rechazar)
 * Actualiza el estado en Firestore y crea notificación para el admin
 * @param {string} notificationId - ID de la notificación a actualizar
 * @param {string} petitionId - ID de la petición de sustitución
 * @param {string} response - 'aceptada' o 'rechazada'
 * @param {string} userId - ID del usuario que responde
 */
export const respondToSubstitutionRequest = async (notificationId, petitionId, response, userId) => {
  try {
    // 1. Obtener petición original
    const petitionRef = doc(db, 'peticionesSustitucion', petitionId);
    const petitionSnap = await getDoc(petitionRef);
    if (!petitionSnap.exists()) throw new Error('Petición de sustitución no encontrada');
    const petitionData = petitionSnap.data();

    // 2. Actualizar estado de la petición (Aceptada / Rechazada)
    await updateDoc(petitionRef, {
      status: response === 'aceptada' ? 'Aceptada' : 'Rechazada',
      respondedAt: serverTimestamp(),
    });

    // 3. Actualizar la notificación original
    const notificationRef = doc(db, 'notifications', notificationId);
    const notificationSnap = await getDoc(notificationRef);
    const originalMessage = notificationSnap.data()?.message || '';
    const dateMatch = originalMessage.match(/el (.+)\./);
    const dateText = dateMatch ? dateMatch[1] : 'día indicado';
    const newStatus = response === 'aceptada' ? 'aceptada' : 'rechazada';
    const newTitle = response === 'aceptada' ? 'Sustitución Aceptada' : 'Sustitución Rechazada';
    const newMessage = response === 'aceptada'
      ? `Has aceptado sustituir el ${dateText}.`
      : `Has rechazado la sustitución del ${dateText}.`;

    await updateDoc(notificationRef, {
      petitionStatus: newStatus,
      title: newTitle,
      message: newMessage,
      read: true,
      readAt: serverTimestamp(),
    });

    // 4. Notificar al administrador del resultado
    const notifyPayload = {
      id: petitionId,
      userName: petitionData.userName,
      date: petitionData.date,
      startTime: petitionData.startTime,
      reason: petitionData.reason
    };
    if (response === 'aceptada') {
      await notifySubstitutionAccepted(petitionData.idAdmin, notifyPayload);
    } else {
      await notifySubstitutionRejected(petitionData.idAdmin, notifyPayload);
    }

    return {
      success: true,
      message: `Petición ${response}`,
      newStatus
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Crea una notificación para un usuario
 * @param {string} userId - ID del usuario destinatario
 * @param {string} type - Tipo de notificación
 * @param {string} title - Título de la notificación
 * @param {string} message - Mensaje de la notificación
 * @param {Object} data - Datos adicionales (petitionId, etc.)
 */
export const createNotification = async (userId, type, title, message, data = {}) => {
  try {
    // Persistir notificación en Firestore
    const notificationsRef = collection(db, 'notifications');
    const notificationDoc = await addDoc(notificationsRef, {
      userId,
      type,
      title,
      message,
      ...data,
      read: false,
      createdAt: serverTimestamp(),
    });

    // Intentar enviar notificación local (no crítico)
    try {
      await sendLocalNotification(title, message, { type, ...data });
    } catch (_) {
      // Silenciar errores de push local para no interrumpir flujo principal
    }
    return notificationDoc.id;
  } catch (error) {
    throw error;
  }
};

/**
 * Crea notificación cuando se aprueba una petición
 * @param {string} userId - ID del usuario
 * @param {Object} petitionData - Datos de la petición
 */
export const notifyPetitionApproved = async (userId, petitionData) => {
  await createNotification(
    userId,
    'peticionAprobada',
    'Petición Aprobada',
    `Tu petición de ${petitionData.reason || 'ausencia'} para el ${petitionData.date || 'día solicitado'} ha sido aprobada.`,
    { petitionId: petitionData.id }
  );
};

/**
 * Crea notificación cuando se rechaza una petición
 * @param {string} userId - ID del usuario
 * @param {Object} petitionData - Datos de la petición
 */
export const notifyPetitionRejected = async (userId, petitionData) => {
  await createNotification(
    userId,
    'peticionRechazada',
    'Petición Rechazada',
    `Tu petición de ${petitionData.reason || 'ausencia'} para el ${petitionData.date || 'día solicitado'} ha sido rechazada.`,
    { petitionId: petitionData.id }
  );
};

/**
 * Crea notificación de solicitud de sustitución
 * @param {string} userId - ID del usuario que debe sustituir
 * @param {Object} substitutionData - Datos de la sustitución
 */
export const notifySubstitutionRequest = async (userId, substitutionData) => {
  await createNotification(
    userId,
    'solicitudSustitucion',
    'Solicitud de Sustitución',
    `Se te ha solicitado sustituir a ${substitutionData.userName || 'un compañero'} el ${substitutionData.date || 'día indicado'}.`,
    { 
      petitionId: substitutionData.id,
      petitionStatus: 'pendiente',
    }
  );
};

/**
 * Crea notificación cuando se acepta una sustitución (para el admin)
 * @param {string} adminId - ID del administrador
 * @param {Object} substitutionData - Datos de la sustitución
 */
export const notifySubstitutionAccepted = async (adminId, substitutionData) => {
  await createNotification(
    adminId,
    'sustitucionAceptada',
    'Sustitución Aceptada',
    `La solicitud de sustitución para ${substitutionData.userName || 'el empleado'} ha sido aceptada.`,
    { petitionId: substitutionData.id }
  );
};

/**
 * Crea notificación cuando se rechaza una sustitución (para el admin)
 * @param {string} adminId - ID del administrador
 * @param {Object} substitutionData - Datos de la sustitución
 */
export const notifySubstitutionRejected = async (adminId, substitutionData) => {
  await createNotification(
    adminId,
    'sustitucionRechazada',
    'Sustitución Rechazada',
    `La solicitud de sustitución para ${substitutionData.userName || 'el empleado'} ha sido rechazada.`,
    { petitionId: substitutionData.id }
  );
};

/**
 * Crea notificación para el admin cuando un usuario envía una petición de ausencia
 * @param {string} adminId - ID del administrador
 * @param {Object} petitionData - Datos de la petición
 */
export const notifyAdminNewPetition = async (adminId, petitionData) => {
  try {
    await createNotification(
      adminId,
      'nuevaPeticion',
      'Nueva Petición de Ausencia',
      `${petitionData.userName || 'Un empleado'} ha solicitado ausencia para el ${petitionData.date || 'día indicado'}.`,
      { petitionId: petitionData.id }
    );
  } catch (error) {
    throw error;
  }
};
