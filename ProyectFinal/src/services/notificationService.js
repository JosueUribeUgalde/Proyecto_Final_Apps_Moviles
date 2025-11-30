// Servicios de notificaciones para gestionar notificaciones de usuarios

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
import { sendLocalNotification } from './pushNotificationService';

/**
 * Obtiene todas las notificaciones de un usuario
 * @param {string} userId - ID del usuario
 * @returns {Promise<Array>} Lista de notificaciones ordenadas por fecha descendente
 */
export const getUserNotifications = async (userId) => {
  try {
    const notificationsRef = collection(db, 'notifications');
    const q = query(
      notificationsRef,
      where('userId', '==', userId)
      // Removido temporalmente orderBy hasta crear el índice en Firestore
      // orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const notifications = [];

    querySnapshot.forEach((doc) => {
      notifications.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    // Ordenar manualmente en JavaScript mientras se crea el índice
    notifications.sort((a, b) => {
      const dateA = a.createdAt?.toMillis() || 0;
      const dateB = b.createdAt?.toMillis() || 0;
      return dateB - dateA; // Descendente (más reciente primero)
    });

    return notifications;
  } catch (error) {
    console.error('Error al obtener notificaciones:', error);
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
      // Removido temporalmente orderBy hasta crear el índice en Firestore
      // orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const notifications = [];

    querySnapshot.forEach((doc) => {
      notifications.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    // Ordenar manualmente en JavaScript mientras se crea el índice
    notifications.sort((a, b) => {
      const dateA = a.createdAt?.toMillis() || 0;
      const dateB = b.createdAt?.toMillis() || 0;
      return dateB - dateA; // Descendente (más reciente primero)
    });

    return notifications;
  } catch (error) {
    console.error('Error al obtener notificaciones del admin:', error);
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
    console.error('Error al marcar notificación como leída:', error);
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
    // Obtener datos de la petición para notificar al admin
    const petitionRef = doc(db, 'peticionesSustitucion', petitionId);
    const petitionDoc = await getDoc(petitionRef);
    
    if (!petitionDoc.exists()) {
      throw new Error('Petición de sustitución no encontrada');
    }
    
    const petitionData = petitionDoc.data();
    
    // Actualizar estado de la petición de sustitución (solo campos permitidos)
    await updateDoc(petitionRef, {
      status: response === 'aceptada' ? 'Aceptada' : 'Rechazada',
      respondedAt: serverTimestamp(),
    });

    // Actualizar la notificación en Firestore para que el cambio persista
    const notificationRef = doc(db, 'notifications', notificationId);
    const newStatus = response === 'aceptada' ? 'aceptada' : 'rechazada';
    const newTitle = response === 'aceptada' ? 'Sustitución Aceptada' : 'Sustitución Rechazada';
    
    // Obtener el mensaje original para extraer la fecha
    const notificationDoc = await getDoc(notificationRef);
    const originalMessage = notificationDoc.data()?.message || '';
    const dateMatch = originalMessage.match(/el (.+)\./);
    const dateText = dateMatch ? dateMatch[1] : 'día indicado';
    
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

    // Crear notificación para el administrador
    if (response === 'aceptada') {
      await notifySubstitutionAccepted(petitionData.idAdmin, {
        id: petitionId,
        userName: petitionData.userName,
        date: petitionData.date,
        startTime: petitionData.startTime,
        reason: petitionData.reason
      });
    } else {
      await notifySubstitutionRejected(petitionData.idAdmin, {
        id: petitionId,
        userName: petitionData.userName,
        date: petitionData.date,
        startTime: petitionData.startTime,
        reason: petitionData.reason
      });
    }

    return { 
      success: true, 
      message: `Petición ${response}`,
      newStatus: newStatus
    };
  } catch (error) {
    console.error('Error al responder petición de sustitución:', error);
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
    console.log("📝 Creando notificación:", { userId, type, title, message });
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
    console.log("✅ Notificación guardada en Firestore con ID:", notificationDoc.id);

    // Enviar notificación push local
    try {
      await sendLocalNotification(title, message, { type, ...data });
      console.log("✅ Notificación push local enviada");
    } catch (pushError) {
      console.log('⚠️ No se pudo enviar notificación push local:', pushError);
    }
  } catch (error) {
    console.error('❌ Error al crear notificación:', error);
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
  console.log("🔔 notifyAdminNewPetition llamada con:", { adminId, petitionData });
  try {
    await createNotification(
      adminId,
      'nuevaPeticion',
      'Nueva Petición de Ausencia',
      `${petitionData.userName || 'Un empleado'} ha solicitado ausencia para el ${petitionData.date || 'día indicado'}.`,
      { petitionId: petitionData.id }
    );
    console.log("✅ Notificación creada exitosamente para admin:", adminId);
  } catch (error) {
    console.error("❌ Error al crear notificación para admin:", error);
    throw error;
  }
};
