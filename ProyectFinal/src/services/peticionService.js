// Servicio para gestión de peticiones en Firebase
import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    getDoc,
    getDocs,
    query,
    where,
    serverTimestamp,
    arrayUnion,
    arrayRemove
} from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { updateGroupMetrics, getGroupById } from "./groupService";
import { notifyPetitionApproved, notifyPetitionRejected, notifySubstitutionRequest, notifyAdminNewPetition } from "./notificationService";

/**
 * Crea una nueva petición de ausencia/permiso
 * @param {Object} peticionData - Datos de la petición
 * @returns {Promise<string>} - ID de la petición creada
 */
export const createPeticion = async (peticionData) => {
    try {
        const {
            userId,
            userName,
            groupId,
            position,
            date,
            startTime,
            reason,
            replacementUserId = null
        } = peticionData;

        // Validaciones
        if (!userId || !userName || !groupId || !position || !date || !startTime || !reason) {
            throw new Error("Todos los campos son requeridos");
        }

        // Estructura de la petición
        const peticion = {
            userId: userId,
            userName: userName,
            groupId: groupId,
            position: position,
            date: date,
            startTime: startTime,
            reason: reason,
            status: "Pendiente", // Estado por defecto
            replacementUserId: replacementUserId,
            createdAt: serverTimestamp()
        };

        // Crear el documento en la colección "peticionesPendientes"
        const docRef = await addDoc(collection(db, "peticionesPendientes"), peticion);

        // Actualizar el array peticionesPendientesIds del grupo
        const groupRef = doc(db, "groups", groupId);
        await updateDoc(groupRef, {
            peticionesPendientesIds: arrayUnion(docRef.id),
            updatedAt: serverTimestamp()
        });

        // Notificar al administrador del grupo sobre la nueva petición
        try {
            console.log("🔔 Intentando notificar al admin...");
            const groupDoc = await getDoc(groupRef);
            if (groupDoc.exists()) {
                const groupData = groupDoc.data();
                const adminId = groupData.idAdmin;
                console.log("📋 Datos del grupo:", { groupId, adminId, groupName: groupData.name });
                
                if (adminId) {
                    console.log("✅ Enviando notificación al admin:", adminId);
                    await notifyAdminNewPetition(adminId, {
                        id: docRef.id,
                        userName: userName,
                        date: date,
                        reason: reason
                    });
                    console.log("✅ Notificación enviada exitosamente");
                } else {
                    console.log("⚠️ No se encontró adminId en el grupo");
                }
            } else {
                console.log("⚠️ El grupo no existe:", groupId);
            }
        } catch (notifError) {
            console.error("❌ Error al notificar al admin:", notifError);
            // No lanzar error - la petición ya fue creada exitosamente
        }

        return docRef.id;
    } catch (error) {
        console.error("Error al crear petición:", error);
        throw error;
    }
};

/**
 * Obtiene todas las peticiones pendientes de un grupo
 * @param {string} groupId - ID del grupo
 * @returns {Promise<Array>} - Array de peticiones pendientes
 */
export const getPeticionesByGroupId = async (groupId) => {
    try {
        if (!groupId) {
            throw new Error("ID del grupo requerido");
        }

        const peticionesRef = collection(db, "peticionesPendientes");
        const q = query(peticionesRef, where("groupId", "==", groupId));
        const querySnapshot = await getDocs(q);

        const peticiones = [];
        querySnapshot.forEach((doc) => {
            peticiones.push({
                id: doc.id,
                ...doc.data()
            });
        });

        return peticiones;
    } catch (error) {
        console.error("Error al obtener peticiones:", error);
        throw error;
    }
};

/**
 * Obtiene peticiones por array de IDs
 * @param {Array<string>} peticionIds - Array de IDs de peticiones
 * @returns {Promise<Array>} - Array de peticiones
 */
export const getPeticionesByIds = async (peticionIds) => {
    try {
        if (!peticionIds || peticionIds.length === 0) {
            return [];
        }

        const peticiones = [];
        for (const peticionId of peticionIds) {
            const peticionDoc = await getDoc(doc(db, "peticionesPendientes", peticionId));
            if (peticionDoc.exists()) {
                peticiones.push({
                    id: peticionDoc.id,
                    ...peticionDoc.data()
                });
            }
        }

        return peticiones;
    } catch (error) {
        console.error("Error al obtener peticiones por IDs:", error);
        throw error;
    }
};

/**
 * Crea una solicitud de sustitución en la colección peticionesSustitucion
 * @param {Object} sustitucionData - Datos de la solicitud de sustitución
 * @returns {Promise<string>} - ID de la solicitud creada
 */
export const createSustitucionRequest = async (sustitucionData) => {
    try {
        const {
            idAdmin,
            idPeticion,
            idUserSolicitado,
            userName,
            userPosition,
            reason,
            date,
            startTime,
            groupId
        } = sustitucionData;

        // Validaciones
        if (!idAdmin || !idPeticion || !idUserSolicitado || !userName || !date || !groupId) {
            throw new Error("Todos los campos requeridos deben estar presentes");
        }

        // Estructura de la solicitud de sustitución
        const sustitucion = {
            idAdmin: idAdmin,
            idPeticion: idPeticion,
            idUserSolicitado: idUserSolicitado,
            userName: userName,
            userPosition: userPosition || "Sin posición",
            reason: reason || "No especificado",
            date: date,
            startTime: startTime || "N/A",
            groupId: groupId,
            status: "Pendiente",
            createdAt: serverTimestamp(),
            respondedAt: null
        };

        // Crear el documento en la colección "peticionesSustitucion"
        const docRef = await addDoc(collection(db, "peticionesSustitucion"), sustitucion);

        console.log("✅ Solicitud de sustitución creada con ID:", docRef.id);

        // Crear notificación de solicitud de sustitución para el usuario solicitado
        try {
            await notifySubstitutionRequest(idUserSolicitado, {
                id: docRef.id,
                petitionId: idPeticion,
                userName: userName,
                userPosition: userPosition || "Sin posición",
                date: date,
                startTime: startTime || "N/A",
                reason: reason || "No especificado"
            });
        } catch (notifError) {
            console.warn("⚠️ Advertencia al crear notificación de sustitución:", notifError);
            // No lanzar error, solo advertencia
        }

        return docRef.id;
    } catch (error) {
        console.error("❌ Error al crear solicitud de sustitución:", error);
        throw error;
    }
};

/**
 * Aprueba una petición - la mueve a historial y la elimina de pendientes
 * También actualiza las métricas del grupo
 * @param {string} peticionId - ID de la petición
 * @param {string} groupId - ID del grupo
 * @param {string} replacementUserId - ID del usuario que cubre (opcional)
 * @returns {Promise<void>}
 */
export const approvePeticion = async (peticionId, groupId, replacementUserId = null) => {
    try {
        // Obtener datos de la petición
        const peticionDoc = await getDoc(doc(db, "peticionesPendientes", peticionId));

        if (!peticionDoc.exists()) {
            throw new Error("Petición no encontrada");
        }

        const peticionData = peticionDoc.data();

        // Crear registro en historial
        const historialData = {
            ...peticionData,
            status: "Aprobada",
            replacementUserId: replacementUserId,
            approvedAt: serverTimestamp(),
            originalPeticionId: peticionId
        };

        const historialRef = await addDoc(collection(db, "historial"), historialData);

        // Agregar el ID del historial al array del usuario
        const userRef = doc(db, "users", peticionData.userId);
        await updateDoc(userRef, {
            historialesIds: arrayUnion(historialRef.id),
            updatedAt: serverTimestamp()
        });

        // Eliminar de peticionesPendientes
        await deleteDoc(doc(db, "peticionesPendientes", peticionId));

        // Remover ID del array del grupo
        const groupRef = doc(db, "groups", groupId);
        await updateDoc(groupRef, {
            peticionesPendientesIds: arrayRemove(peticionId),
            updatedAt: serverTimestamp()
        });

        // Actualizar métricas del grupo
        try {
            const groupData = await getGroupById(groupId);
            const historial = await getHistorialByGroupId(groupId);
            await updateGroupMetrics(groupId, historial, groupData.memberCount);
        } catch (metricsError) {
            console.warn("Advertencia al actualizar métricas del grupo:", metricsError);
            // No lanzar error, solo advertencia para no interrumpir el flujo
        }

        // Crear notificación de aprobación para el usuario
        try {
            await notifyPetitionApproved(peticionData.userId, {
                id: peticionId,
                userName: peticionData.userName,
                date: peticionData.date,
                startTime: peticionData.startTime,
                reason: peticionData.reason
            });
        } catch (notifError) {
            console.warn("Advertencia al crear notificación:", notifError);
            // No lanzar error, solo advertencia
        }

    } catch (error) {
        console.error("Error al aprobar petición:", error);
        throw error;
    }
};

/**
 * Rechaza una petición - la mueve a historial y la elimina de pendientes
 * También actualiza las métricas del grupo
 * @param {string} peticionId - ID de la petición
 * @param {string} groupId - ID del grupo
 * @returns {Promise<void>}
 */
export const rejectPeticion = async (peticionId, groupId) => {
    try {
        // Obtener datos de la petición
        const peticionDoc = await getDoc(doc(db, "peticionesPendientes", peticionId));

        if (!peticionDoc.exists()) {
            throw new Error("Petición no encontrada");
        }

        const peticionData = peticionDoc.data();

        // Crear registro en historial
        const historialData = {
            ...peticionData,
            status: "Rechazada",
            rejectedAt: serverTimestamp(),
            originalPeticionId: peticionId
        };

        const historialRef = await addDoc(collection(db, "historial"), historialData);

        // Agregar el ID del historial al array del usuario
        const userRef = doc(db, "users", peticionData.userId);
        await updateDoc(userRef, {
            historialesIds: arrayUnion(historialRef.id),
            updatedAt: serverTimestamp()
        });

        // Eliminar de peticionesPendientes
        await deleteDoc(doc(db, "peticionesPendientes", peticionId));

        // Remover ID del array del grupo
        const groupRef = doc(db, "groups", groupId);
        await updateDoc(groupRef, {
            peticionesPendientesIds: arrayRemove(peticionId),
            updatedAt: serverTimestamp()
        });

        // Actualizar métricas del grupo
        try {
            const groupData = await getGroupById(groupId);
            const historial = await getHistorialByGroupId(groupId);
            await updateGroupMetrics(groupId, historial, groupData.memberCount);
        } catch (metricsError) {
            console.warn("Advertencia al actualizar métricas del grupo:", metricsError);
            // No lanzar error, solo advertencia para no interrumpir el flujo
        }

        // Crear notificación de rechazo para el usuario
        try {
            await notifyPetitionRejected(peticionData.userId, {
                id: peticionId,
                userName: peticionData.userName,
                date: peticionData.date,
                startTime: peticionData.startTime,
                reason: peticionData.reason
            });
        } catch (notifError) {
            console.warn("Advertencia al crear notificación:", notifError);
            // No lanzar error, solo advertencia
        }

    } catch (error) {
        console.error("Error al rechazar petición:", error);
        throw error;
    }
};

/**
 * Obtiene el historial de decisiones de un grupo
 * @param {string} groupId - ID del grupo
 * @returns {Promise<Array>} - Array de decisiones históricas
 */
export const getHistorialByGroupId = async (groupId) => {
    try {
        if (!groupId) {
            throw new Error("ID del grupo requerido");
        }

        const historialRef = collection(db, "historial");
        const q = query(historialRef, where("groupId", "==", groupId));
        const querySnapshot = await getDocs(q);

        const historial = [];
        querySnapshot.forEach((doc) => {
            historial.push({
                id: doc.id,
                ...doc.data()
            });
        });

        return historial;
    } catch (error) {
        console.error("Error al obtener historial:", error);
        throw error;
    }
};

/**
 * Obtiene el historial de un usuario específico por sus IDs de historial
 * @param {Array<string>} historialIds - Array de IDs de historial del usuario
 * @returns {Promise<Array>} - Array de decisiones históricas del usuario
 */
export const getHistorialByIds = async (historialIds) => {
    try {
        if (!historialIds || historialIds.length === 0) {
            return [];
        }

        const historial = [];
        for (const historialId of historialIds) {
            const historialDoc = await getDoc(doc(db, "historial", historialId));
            if (historialDoc.exists()) {
                historial.push({
                    id: historialDoc.id,
                    ...historialDoc.data()
                });
            }
        }

        // Ordenar por fecha (más reciente primero)
        historial.sort((a, b) => {
            const dateA = a.approvedAt || a.rejectedAt || a.createdAt;
            const dateB = b.approvedAt || b.rejectedAt || b.createdAt;
            if (!dateA || !dateB) return 0;
            return dateB.seconds - dateA.seconds;
        });

        return historial;
    } catch (error) {
        console.error("Error al obtener historial por IDs:", error);
        throw error;
    }
};

/**
 * Calcula el estado de peticiones (pendientes, aprobadas, rechazadas)
 * Filtra por últimos 7 días si se especifica daysFilter
 * @param {Array} historial - Array de decisiones del historial
 * @param {number} pendingCount - Total de peticiones pendientes actuales
 * @param {number} daysFilter - Filtrar últimos N días (default: 7)
 * @returns {Object} - { pending, approved, rejected, total }
 */
export const calculatePeticionStatus = (historial, pendingCount = 0, daysFilter = 7) => {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - daysFilter);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        // Filtrar registros de los últimos 7 días
        const recentRecords = historial.filter(record => {
            const recordDate = record.approvedAt?.toDate?.() || 
                             record.rejectedAt?.toDate?.() || 
                             record.createdAt?.toDate?.() || 
                             new Date(record.approvedAt || record.rejectedAt || record.createdAt);
            return recordDate >= sevenDaysAgo;
        });

        // Contar por estado
        const approved = recentRecords.filter(r => r.status === 'Aprobada').length;
        const rejected = recentRecords.filter(r => r.status === 'Rechazada').length;
        const total = pendingCount + approved + rejected;

        const result = {
            pending: pendingCount,
            approved: approved,
            rejected: rejected,
            total: total,
            pendingPercent: total > 0 ? Math.round((pendingCount / total) * 100) : 0,
            approvedPercent: total > 0 ? Math.round((approved / total) * 100) : 0,
            rejectedPercent: total > 0 ? Math.round((rejected / total) * 100) : 0
        };

        console.log("📋 Estado de Peticiones (Últimos 7 días):", result);
        return result;
    } catch (error) {
        console.error("Error al calcular estado de peticiones:", error);
        return {
            pending: pendingCount,
            approved: 0,
            rejected: 0,
            total: pendingCount,
            pendingPercent: 100,
            approvedPercent: 0,
            rejectedPercent: 0
        };
    }
};
