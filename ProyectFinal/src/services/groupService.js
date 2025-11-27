// Servicio para gestión de grupos en Firebase
import {
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    serverTimestamp,
    arrayUnion,
    arrayRemove
} from "firebase/firestore";
import { db } from "../config/firebaseConfig";

/**
 * Crea un nuevo grupo en Firestore
 * @param {string} name - Nombre del grupo
 * @param {string} adminId - ID del administrador que crea el grupo
 * @returns {Promise<string>} - ID del grupo creado
 */
export const createGroup = async (name, adminId) => {
    try {
        if (!name || !name.trim()) {
            throw new Error("El nombre del grupo es requerido");
        }

        if (!adminId) {
            throw new Error("El ID del administrador es requerido");
        }

        // Estructura del grupo según especificaciones
        const groupData = {
            name: name.trim(),
            adminId: adminId,
            color: "#4A90E2", // Color por defecto (azul)
            description: "", // Descripción vacía por defecto
            memberCount: 0, // Sin miembros inicialmente
            memberIds: [], // Array vacío de miembros
            stats: {
                coveragePercentage: 0, // 0% de cobertura inicial
                activeMembers: 0, // Sin miembros activos
                absences: 0 // Sin ausencias
            },
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        };

        // Crear el documento en la colección "groups"
        const docRef = await addDoc(collection(db, "groups"), groupData);

        // Actualizar el array groupIds del administrador
        const adminRef = doc(db, "admins", adminId);
        await updateDoc(adminRef, {
            groupIds: arrayUnion(docRef.id)
        });

        console.log("Grupo creado exitosamente con ID:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Error al crear grupo:", error);
        throw error;
    }
};

/**
 * Obtiene un grupo por su ID
 * @param {string} groupId - ID del grupo
 * @returns {Promise<Object>} - Datos del grupo
 */
export const getGroupById = async (groupId) => {
    try {
        const groupDoc = await getDoc(doc(db, "groups", groupId));

        if (!groupDoc.exists()) {
            throw new Error("Grupo no encontrado");
        }

        return {
            id: groupDoc.id,
            ...groupDoc.data()
        };
    } catch (error) {
        console.error("Error al obtener grupo:", error);
        throw error;
    }
};

/**
 * Obtiene todos los grupos de un administrador
 * @param {Array<string>} groupIds - Array de IDs de grupos
 * @returns {Promise<Array>} - Array de grupos
 */
export const getGroupsByIds = async (groupIds) => {
    try {
        if (!groupIds || groupIds.length === 0) {
            return [];
        }

        const groupsData = [];
        for (const groupId of groupIds) {
            const groupDoc = await getDoc(doc(db, "groups", groupId));
            if (groupDoc.exists()) {
                groupsData.push({
                    id: groupDoc.id,
                    ...groupDoc.data()
                });
            }
        }

        return groupsData;
    } catch (error) {
        console.error("Error al obtener grupos:", error);
        throw error;
    }
};

/**
 * Actualiza un grupo existente
 * @param {string} groupId - ID del grupo
 * @param {Object} updates - Datos a actualizar
 * @returns {Promise<void>}
 */
export const updateGroup = async (groupId, updates) => {
    try {
        const groupRef = doc(db, "groups", groupId);

        await updateDoc(groupRef, {
            ...updates,
            updatedAt: serverTimestamp()
        });

        console.log("Grupo actualizado exitosamente");
    } catch (error) {
        console.error("Error al actualizar grupo:", error);
        throw error;
    }
};

/**
 * Elimina un grupo
 * @param {string} groupId - ID del grupo
 * @param {string} adminId - ID del administrador
 * @returns {Promise<void>}
 */
export const deleteGroup = async (groupId, adminId) => {
    try {
        // Verificar que el grupo existe
        const groupDoc = await getDoc(doc(db, "groups", groupId));
        if (!groupDoc.exists()) {
            throw new Error("Grupo no encontrado");
        }

        const groupData = groupDoc.data();

        // Verificar que no tenga miembros
        if (groupData.memberIds && groupData.memberIds.length > 0) {
            throw new Error("No se puede eliminar un grupo con miembros activos");
        }

        // Eliminar el grupo de la colección
        await deleteDoc(doc(db, "groups", groupId));

        // Remover el groupId del array del administrador
        const adminRef = doc(db, "admins", adminId);
        await updateDoc(adminRef, {
            groupIds: arrayRemove(groupId)
        });

        console.log("Grupo eliminado exitosamente");
    } catch (error) {
        console.error("Error al eliminar grupo:", error);
        throw error;
    }
};

/**
 * Agrega un miembro a un grupo
 * @param {string} groupId - ID del grupo
 * @param {string} memberId - ID del miembro
 * @returns {Promise<void>}
 */
export const addMemberToGroup = async (groupId, memberId) => {
    try {
        const groupRef = doc(db, "groups", groupId);
        const groupDoc = await getDoc(groupRef);

        if (!groupDoc.exists()) {
            throw new Error("Grupo no encontrado");
        }

        const currentData = groupDoc.data();
        const currentMemberIds = currentData.memberIds || [];

        // Verificar que el miembro no esté ya en el grupo
        if (currentMemberIds.includes(memberId)) {
            throw new Error("El miembro ya está en el grupo");
        }

        await updateDoc(groupRef, {
            memberIds: arrayUnion(memberId),
            memberCount: currentMemberIds.length + 1,
            updatedAt: serverTimestamp()
        });

        console.log("Miembro agregado al grupo exitosamente");
    } catch (error) {
        console.error("Error al agregar miembro al grupo:", error);
        throw error;
    }
};

/**
 * Remueve un miembro de un grupo
 * @param {string} groupId - ID del grupo
 * @param {string} memberId - ID del miembro
 * @returns {Promise<void>}
 */
export const removeMemberFromGroup = async (groupId, memberId) => {
    try {
        const groupRef = doc(db, "groups", groupId);
        const groupDoc = await getDoc(groupRef);

        if (!groupDoc.exists()) {
            throw new Error("Grupo no encontrado");
        }

        const currentData = groupDoc.data();
        const currentMemberIds = currentData.memberIds || [];

        await updateDoc(groupRef, {
            memberIds: arrayRemove(memberId),
            memberCount: Math.max(0, currentMemberIds.length - 1),
            updatedAt: serverTimestamp()
        });

        console.log("Miembro removido del grupo exitosamente");
    } catch (error) {
        console.error("Error al remover miembro del grupo:", error);
        throw error;
    }
};

/**
 * Actualiza las estadísticas de un grupo
 * @param {string} groupId - ID del grupo
 * @param {Object} stats - Nuevas estadísticas
 * @returns {Promise<void>}
 */
export const updateGroupStats = async (groupId, stats) => {
    try {
        const groupRef = doc(db, "groups", groupId);

        await updateDoc(groupRef, {
            stats: stats,
            updatedAt: serverTimestamp()
        });

        console.log("Estadísticas del grupo actualizadas exitosamente");
    } catch (error) {
        console.error("Error al actualizar estadísticas del grupo:", error);
        throw error;
    }
};
