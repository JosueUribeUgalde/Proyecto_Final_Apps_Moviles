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
            // Métricas del grupo - se calculan y actualizan dinámicamente
            metrics: {
                coverageRate: 0,        // Tasa de cobertura (ausencias cubiertas)
                avgResponseTime: 0,     // Tiempo promedio de respuesta en minutos
                reassignments: 0,       // Total de reasignaciones en últimos 7 días
                lastUpdated: serverTimestamp()
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

/**
 * Calcula la tasa de cobertura en porcentaje
 * Ausencias cubiertas (aprobadas con replacementUserId) vs total de peticiones
 * @param {Array} historial - Array de decisiones del historial
 * @returns {number} - Porcentaje de cobertura (0-100)
 */
const calculateCoverageRate = (historial) => {
    if (historial.length === 0) return 0;
    
    const approved = historial.filter(p => {
        return p.status === "Aprobada" && p.replacementUserId && p.replacementUserId.trim() !== "";
    }).length;
    
    const coverage = (approved / historial.length) * 100;
    return Math.round(coverage);
};

/**
 * Calcula el tiempo promedio de respuesta en minutos
 * Desde que se crea la petición hasta que se aprueba/rechaza
 * @param {Array} historial - Array de decisiones del historial
 * @returns {number} - Tiempo en minutos redondeado
 */
const calculateAvgResponseTime = (historial) => {
    if (historial.length === 0) return 0;
    
    const times = historial.map(p => {
        try {
            // Manejar Timestamps de Firestore
            const createdTime = p.createdAt?.toDate?.()?.getTime?.() || new Date(p.createdAt).getTime();
            const resolvedTime = (p.approvedAt?.toDate?.()?.getTime?.() || p.rejectedAt?.toDate?.()?.getTime?.() || new Date(p.approvedAt || p.rejectedAt).getTime());
            
            if (!createdTime || !resolvedTime) return 0;
            return (resolvedTime - createdTime) / (1000 * 60); // Convertir a minutos
        } catch (e) {
            console.warn("Error calculando tiempo de respuesta:", e);
            return 0;
        }
    }).filter(time => time > 0); // Filtrar tiempos inválidos
    
    if (times.length === 0) return 0;
    
    const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
    return Math.round(avgTime);
};

/**
 * Calcula el total de reasignaciones en los últimos 7 días
 * Peticiones aprobadas con replacementUserId
 * @param {Array} historial - Array de decisiones del historial
 * @returns {number} - Total de reasignaciones
 */
const calculateReassignments = (historial) => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    return historial.filter(p => {
        try {
            // Manejar Timestamps de Firestore
            const approvedTime = p.approvedAt?.toDate?.();
            if (!approvedTime) return false;
            
            return p.status === "Aprobada" && p.replacementUserId && p.replacementUserId.trim() !== "" && approvedTime >= weekAgo;
        } catch (e) {
            console.warn("Error procesando reasignación:", e);
            return false;
        }
    }).length;
};

/**
 * Actualiza las métricas del grupo basadas en el historial
 * Se recomienda llamar después de aprobar/rechazar una petición
 * @param {string} groupId - ID del grupo
 * @param {Array} historial - Array de decisiones del historial
 * @param {number} groupMembersCount - Total de miembros del grupo (no utilizado actualmente)
 * @returns {Promise<void>}
 */
export const updateGroupMetrics = async (groupId, historial, groupMembersCount) => {
    try {
        if (!groupId || !historial || historial.length === 0) {
            console.warn("Parámetros inválidos para actualizar métricas");
            return;
        }
        
        const coverageRate = calculateCoverageRate(historial);
        const avgResponseTime = calculateAvgResponseTime(historial);
        const reassignments = calculateReassignments(historial);
        
        // Logging para debuggear
        console.log("📊 Actualizando Métricas del Grupo:", {
            groupId,
            historialLength: historial.length,
            coverageRate,
            avgResponseTime,
            reassignments,
            historalSample: historial.slice(0, 2).map(h => ({
                status: h.status,
                replacementUserId: h.replacementUserId,
                createdAt: h.createdAt?.toDate?.() || h.createdAt,
                approvedAt: h.approvedAt?.toDate?.() || h.approvedAt,
                rejectedAt: h.rejectedAt?.toDate?.() || h.rejectedAt
            }))
        });
        
        const groupRef = doc(db, "groups", groupId);
        
        await updateDoc(groupRef, {
            metrics: {
                coverageRate,
                avgResponseTime,
                reassignments,
                lastUpdated: serverTimestamp()
            },
            updatedAt: serverTimestamp()
        });
        
        console.log(`✅ Métricas actualizadas para el grupo ${groupId}`);
    } catch (error) {
        console.error("Error al actualizar métricas del grupo:", error);
        throw error;
    }
};

/**
 * Calcula la asistencia por día de la semana desde el historial
 * Cuenta ausencias aprobadas usando la fecha de la petición (record.date), no createdAt
 * @param {Array} historial - Array de decisiones del historial
 * @param {number} totalMembers - Total de miembros del grupo (validado)
 * @returns {Object} - { labels, data } para la gráfica
 */
export const calculateWeeklyAttendanceData = (historial, totalMembers = 25) => {
    try {
        // Validar totalMembers - si es 0 o negativo, usar default
        const validTotalMembers = totalMembers && totalMembers > 0 ? totalMembers : 25;

        // Inicializar contadores para cada día de la semana
        const weekDays = {
            1: { name: 'Lun', absences: 0 }, // Monday = 1
            2: { name: 'Mar', absences: 0 },
            3: { name: 'Mié', absences: 0 },
            4: { name: 'Jue', absences: 0 },
            5: { name: 'Vie', absences: 0 },
            6: { name: 'Sáb', absences: 0 },
            0: { name: 'Dom', absences: 0 }  // Sunday = 0
        };

        // Contar ausencias aprobadas por día
        // IMPORTANTE: Usar record.date (fecha de la ausencia), NO createdAt (fecha de creación)
        historial.forEach(record => {
            if (record.status === 'Aprobada') {
                // Usar la fecha de la petición (record.date)
                let date;
                if (record.date) {
                    // Si date es string (YYYY-MM-DD), convertir a Date
                    if (typeof record.date === 'string') {
                        const [year, month, day] = record.date.split('-');
                        date = new Date(year, parseInt(month) - 1, day);
                    } else {
                        date = record.date?.toDate?.() || new Date(record.date);
                    }
                } else {
                    // Fallback a createdAt si no existe date
                    date = record.createdAt?.toDate?.() || new Date(record.createdAt);
                }
                
                const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
                
                if (weekDays[dayOfWeek]) {
                    weekDays[dayOfWeek].absences++;
                }
            }
        });

        // Calcular empleados presentes (total - ausencias)
        // Validar que no sea negativo ni NaN
        const labels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
        const data = [
            Math.max(0, validTotalMembers - weekDays[1].absences),  // Monday
            Math.max(0, validTotalMembers - weekDays[2].absences),  // Tuesday
            Math.max(0, validTotalMembers - weekDays[3].absences),  // Wednesday
            Math.max(0, validTotalMembers - weekDays[4].absences),  // Thursday
            Math.max(0, validTotalMembers - weekDays[5].absences),  // Friday
            Math.max(0, validTotalMembers - weekDays[6].absences),  // Saturday
            Math.max(0, validTotalMembers - weekDays[0].absences)   // Sunday
        ];

        // Validar que no haya NaN
        const cleanData = data.map(val => isNaN(val) ? 0 : val);

        console.log("📈 Asistencia Semanal Calculada:", {
            validTotalMembers,
            absencesPerDay: weekDays,
            attendancePerDay: cleanData,
            sampleRecords: historial.slice(0, 3).map(r => ({
                date: r.date,
                status: r.status,
                dayOfWeek: r.date ? (typeof r.date === 'string' 
                    ? new Date(r.date.split('-')[0], r.date.split('-')[1] - 1, r.date.split('-')[2]).getDay()
                    : r.date.toDate?.().getDay?.())
                    : 'sin fecha'
            }))
        });

        return { labels, data: cleanData };
    } catch (error) {
        console.error("Error al calcular asistencia semanal:", error);
        // Retornar datos por defecto si hay error
        return { 
            labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
            data: [25, 25, 25, 25, 25, 25, 25]
        };
    }
};

/**
 * Calcula el total de turnos trabajados por todos los miembros de un grupo
 * Suma los días laborales disponibles (availableDays) de cada miembro
 * @param {Array} memberIds - Array de IDs de miembros del grupo
 * @returns {Promise<number>} - Total de turnos/días laborales disponibles
 */
export const calculateTotalShiftsWorked = async (memberIds) => {
    try {
        if (!memberIds || memberIds.length === 0) {
            return 0;
        }

        let totalShifts = 0;

        // Iterar sobre cada miembro del grupo
        for (const memberId of memberIds) {
            try {
                const memberDoc = await getDoc(doc(db, "users", memberId));
                
                if (memberDoc.exists()) {
                    const memberData = memberDoc.data();
                    // availableDays está almacenado como string: "Lun • Mar • Vie"
                    // Necesitamos parsearlo a array
                    const availableDaysStr = memberData.availableDays || '';
                    
                    if (availableDaysStr && typeof availableDaysStr === 'string') {
                        // Dividir por "•" y contar elementos válidos
                        const days = availableDaysStr
                            .split('•')
                            .map(d => d.trim())
                            .filter(d => d && d !== 'N/A' && d.length > 0);
                        
                        totalShifts += days.length;
                    }
                }
            } catch (error) {
                console.error(`Error al obtener miembro ${memberId}:`, error);
                // Continuar con el siguiente miembro si hay error
                continue;
            }
        }

        return totalShifts;
    } catch (error) {
        console.error("Error al calcular turnos trabajados:", error);
        return 0;
    }
};
