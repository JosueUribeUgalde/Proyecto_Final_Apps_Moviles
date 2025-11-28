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
 * Aprueba una petición - la mueve a historial y la elimina de pendientes
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

        await addDoc(collection(db, "historial"), historialData);

        // Eliminar de peticionesPendientes
        await deleteDoc(doc(db, "peticionesPendientes", peticionId));

        // Remover ID del array del grupo
        const groupRef = doc(db, "groups", groupId);
        await updateDoc(groupRef, {
            peticionesPendientesIds: arrayRemove(peticionId),
            updatedAt: serverTimestamp()
        });

    } catch (error) {
        console.error("Error al aprobar petición:", error);
        throw error;
    }
};

/**
 * Rechaza una petición - la mueve a historial y la elimina de pendientes
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

        await addDoc(collection(db, "historial"), historialData);

        // Eliminar de peticionesPendientes
        await deleteDoc(doc(db, "peticionesPendientes", peticionId));

        // Remover ID del array del grupo
        const groupRef = doc(db, "groups", groupId);
        await updateDoc(groupRef, {
            peticionesPendientesIds: arrayRemove(peticionId),
            updatedAt: serverTimestamp()
        });

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
