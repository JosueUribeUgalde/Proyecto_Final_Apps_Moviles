// Servicio para gestión de usuarios en Firebase
import {
    doc,
    setDoc,
    getDoc,
    updateDoc,
    serverTimestamp
} from "firebase/firestore";
import { db } from "../config/firebaseConfig";

/**
 * Crea un nuevo usuario en Firestore con la estructura completa
 * @param {string} userId - ID del usuario (generado por Firebase Auth)
 * @param {Object} userData - Datos básicos del usuario (name, email, phone)
 * @returns {Promise<void>}
 */
export const createUserProfile = async (userId, userData) => {
    try {
        if (!userId) {
            throw new Error("El ID del usuario es requerido");
        }

        if (!userData.name || !userData.email) {
            throw new Error("El nombre y email son requeridos");
        }

        // Estructura completa del usuario con valores por defecto
        const userProfile = {
            name: userData.name.trim(),
            email: userData.email.trim().toLowerCase(),
            phone: userData.phone || "",
            role: "user", // Rol por defecto
            position: "", // Se asignará posteriormente
            experience: "", // Se completará en el perfil
            companyId: userData.companyId || "", // Se asignará cuando se una a una empresa
            groupIds: [], // Grupos a los que pertenece
            historialesIds: [], // IDs de peticiones en historial
            avatar: "", // URL de foto de perfil
            region: {
                name: "México", // Región por defecto
                code: "MX"
            },
            preferences: {
                notificationsEnabled: true // Notificaciones habilitadas por defecto
            },
            // Campos de disponibilidad en el nivel raíz para fácil acceso
            availableDays: "Lun • Mar • Mié • Jue • Vie", // Días disponibles por defecto
            startTime: "08:00",
            endTime: "17:00",
            mealTime: "14:00",
            daysOff: "Sáb • Dom", // Días libres por defecto
            stats: {
                shiftsThisWeek: 0,
                totalShifts: 0,
                lastActive: serverTimestamp()
            },
            status: "Disponible", // Estado por defecto
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        };

        // Crear el documento en la colección "users"
        await setDoc(doc(db, "users", userId), userProfile);
    } catch (error) {
        console.error("Error al crear perfil de usuario:", error);
        throw error;
    }
};

/**
 * Obtiene el perfil de un usuario
 * @param {string} userId - ID del usuario
 * @returns {Promise<Object>} - Datos del usuario
 */
export const getUserProfile = async (userId) => {
    try {
        const userDoc = await getDoc(doc(db, "users", userId));

        if (!userDoc.exists()) {
            throw new Error("Usuario no encontrado");
        }

        return {
            id: userDoc.id,
            ...userDoc.data()
        };
    } catch (error) {
        console.error("Error al obtener perfil de usuario:", error);
        throw error;
    }
};

/**
 * Actualiza el perfil de un usuario
 * @param {string} userId - ID del usuario
 * @param {Object} updates - Datos a actualizar
 * @returns {Promise<void>}
 */
export const updateUserProfile = async (userId, updates) => {
    try {
        const userRef = doc(db, "users", userId);

        await updateDoc(userRef, {
            ...updates,
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error("Error al actualizar perfil de usuario:", error);
        throw error;
    }
};

/**
 * Actualiza el estado del usuario
 * @param {string} userId - ID del usuario
 * @param {string} status - Nuevo estado ("Disponible", "Libre hoy", "Permiso solicitado")
 * @returns {Promise<void>}
 */
export const updateUserStatus = async (userId, status) => {
    try {
        await updateUserProfile(userId, { status });
    } catch (error) {
        console.error("Error al actualizar estado del usuario:", error);
        throw error;
    }
};

/**
 * Actualiza la última actividad del usuario
 * @param {string} userId - ID del usuario
 * @returns {Promise<void>}
 */
export const updateLastActive = async (userId) => {
    try {
        const userRef = doc(db, "users", userId);

        await updateDoc(userRef, {
            "stats.lastActive": serverTimestamp(),
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error("Error al actualizar última actividad:", error);
        throw error;
    }
};

/**
 * Agrega un grupo al usuario
 * @param {string} userId - ID del usuario
 * @param {string} groupId - ID del grupo
 * @returns {Promise<void>}
 */
export const addUserToGroup = async (userId, groupId) => {
    try {
        const userDoc = await getDoc(doc(db, "users", userId));

        if (!userDoc.exists()) {
            throw new Error("Usuario no encontrado");
        }

        const currentGroupIds = userDoc.data().groupIds || [];

        if (currentGroupIds.includes(groupId)) {
            throw new Error("El usuario ya está en este grupo");
        }

        await updateDoc(doc(db, "users", userId), {
            groupIds: [...currentGroupIds, groupId],
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error("Error al agregar usuario al grupo:", error);
        throw error;
    }
};

/**
 * Remueve un grupo del usuario
 * @param {string} userId - ID del usuario
 * @param {string} groupId - ID del grupo
 * @returns {Promise<void>}
 */
export const removeUserFromGroup = async (userId, groupId) => {
    try {
        const userDoc = await getDoc(doc(db, "users", userId));

        if (!userDoc.exists()) {
            throw new Error("Usuario no encontrado");
        }

        const currentGroupIds = userDoc.data().groupIds || [];
        const updatedGroupIds = currentGroupIds.filter(id => id !== groupId);

        await updateDoc(doc(db, "users", userId), {
            groupIds: updatedGroupIds,
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error("Error al remover usuario del grupo:", error);
        throw error;
    }
};
