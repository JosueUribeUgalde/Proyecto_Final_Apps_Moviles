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
    arrayRemove,
    increment
} from "firebase/firestore";
import { db } from "../config/firebaseConfig";

/**
 * Genera un código de invitación único de 6 caracteres
 * @returns {string} - Código de invitación (ej: "ABC123")
 */
export const generateInviteCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
};

/**
 * Verifica si un código de invitación ya existe
 * @param {string} code - Código a verificar
 * @returns {Promise<boolean>} - true si existe, false si no
 */
const inviteCodeExists = async (code) => {
    try {
        const groupsRef = collection(db, "groups");
        const q = query(groupsRef, where("inviteCode", "==", code));
        const querySnapshot = await getDocs(q);
        return !querySnapshot.empty;
    } catch (error) {
        console.error("Error al verificar código:", error);
        return false;
    }
};

/**
 * Genera un código de invitación único (verifica que no exista)
 * @returns {Promise<string>} - Código único
 */
export const generateUniqueInviteCode = async () => {
    let code = generateInviteCode();
    let attempts = 0;
    const maxAttempts = 10;

    while (await inviteCodeExists(code) && attempts < maxAttempts) {
        code = generateInviteCode();
        attempts++;
    }

    if (attempts >= maxAttempts) {
        throw new Error("No se pudo generar un código único");
    }

    return code;
};

/**
 * Crea un nuevo grupo en Firestore
 * @param {string} name - Nombre del grupo
 * @param {string} adminId - ID del administrador que crea el grupo
 * @param {string} description - Descripción del grupo (opcional)
 * @returns {Promise<string>} - ID del grupo creado
 */
export const createGroup = async (name, adminId, description = "") => {
    try {
        if (!name || !name.trim()) {
            throw new Error("El nombre del grupo es requerido");
        }

        if (!adminId) {
            throw new Error("El ID del administrador es requerido");
        }

        // Generar código de invitación único
        const inviteCode = await generateUniqueInviteCode();

        // Estructura del grupo según especificaciones
        const groupData = {
            name: name.trim(),
            adminId: adminId,
            inviteCode: inviteCode,
            description: description.trim(),
            memberCount: 0,
            memberIds: [],
            peticionesPendientesIds: [],
            stats: {
                totalShifts: 0
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
    } catch (error) {
        console.error("Error al actualizar estadísticas del grupo:", error);
        throw error;
    }
};

/**
 * Permite a un usuario unirse a un grupo usando un código de invitación
 * @param {string} userId - ID del usuario
 * @param {string} inviteCode - Código de invitación
 * @returns {Promise<Object>} - Información del grupo al que se unió
 */
export const joinGroupWithCode = async (userId, inviteCode) => {
    try {
        if (!userId) {
            throw new Error("ID de usuario requerido");
        }

        if (!inviteCode || inviteCode.trim().length !== 6) {
            throw new Error("Código de invitación inválido");
        }

        const codeUpper = inviteCode.trim().toUpperCase();

        // Buscar grupo por código de invitación
        const groupsRef = collection(db, "groups");
        const q = query(groupsRef, where("inviteCode", "==", codeUpper));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            throw new Error("Código de invitación no encontrado");
        }

        const groupDoc = querySnapshot.docs[0];
        const groupData = groupDoc.data();
        const groupId = groupDoc.id;

        // Verificar si el usuario ya es miembro
        if (groupData.memberIds?.includes(userId)) {
            throw new Error("Ya eres miembro de este grupo");
        }

        // Agregar usuario al grupo
        await updateDoc(doc(db, "groups", groupId), {
            memberIds: arrayUnion(userId),
            memberCount: increment(1),
            updatedAt: serverTimestamp()
        });

        // Agregar grupo al usuario
        await updateDoc(doc(db, "users", userId), {
            groupIds: arrayUnion(groupId),
            updatedAt: serverTimestamp()
        });

        return {
            success: true,
            groupName: groupData.name,
            groupId: groupId,
            message: `Te has unido exitosamente a "${groupData.name}"`
        };
    } catch (error) {
        console.error("Error al unirse al grupo:", error);
        throw error;
    }
};
