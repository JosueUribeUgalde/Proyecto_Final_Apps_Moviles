/**
 * authService.js
 * 
 * Servicio de Autenticación con Firebase
 * Gestiona todas las operaciones de autenticación y autorización:
 * - Login y registro de usuarios
 * - Login específico para empresas
 * - Recuperación de contraseñas
 * - Gestión de sesiones
 * - Verificación de roles (user, admin, company)
 * 
 * Integración con Firebase Authentication y Firestore
 */

import {
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig';

/**
 * Login de usuario (Admin o User normal)
 * 
 * Autentica usuarios mediante Firebase Authentication
 * No verifica rol específico, solo credenciales válidas
 * 
 * @param {string} email - Correo electrónico del usuario
 * @param {string} password - Contraseña del usuario
 * @returns {Promise<Object>} Objeto con resultado:
 *   - success: boolean - Indica si el login fue exitoso
 *   - user: Object|null - Datos del usuario autenticado
 *   - message: string - Mensaje descriptivo del resultado
 */
export const loginUser = async (email, password) => {
  try {
    // Autenticar con Firebase usando email y contraseña
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return {
      success: true,
      user: userCredential.user,
      message: 'Login exitoso'
    };
  } catch (error) {
    return {
      success: false,
      user: null,
      message: getErrorMessage(error.code)
    };
  }
};

/**
 * Login de empresa: exige que exista documento en la colección companies
 * 
 * Autentica empresas verificando que exista un perfil de empresa en Firestore
 * Si las credenciales son válidas pero no existe perfil de empresa,
 * cierra la sesión automáticamente para mantener la seguridad
 * 
 * @param {string} email - Correo electrónico de la empresa
 * @param {string} password - Contraseña de la empresa
 * @returns {Promise<Object>} Objeto con resultado:
 *   - success: boolean - Indica si el login fue exitoso
 *   - user: Object|null - Datos del usuario autenticado
 *   - company: Object - Datos del perfil de empresa (solo si success=true)
 *   - message: string - Mensaje descriptivo del resultado
 */
export const loginCompany = async (email, password) => {
  try {
    // Autenticar con Firebase
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Verificar que existe documento en la colección 'companies'
    const companySnap = await getDoc(doc(db, 'companies', user.uid));

    if (!companySnap.exists()) {
      // Cerrar sesión para evitar que quede autenticado sin perfil de empresa
      await signOut(auth);
      return {
        success: false,
        user: null,
        message: 'Esta cuenta no esta registrada como Empresa.'
      };
    }

    return {
      success: true,
      user,
      company: companySnap.data(),
      message: 'Login de empresa exitoso'
    };
  } catch (error) {
    return {
      success: false,
      user: null,
      message: getErrorMessage(error.code)
    };
  }
};

/**
 * Registro de nuevo usuario (solo para users normales, NO admin)
 * 
 * Crea una nueva cuenta en Firebase Authentication
 * Los administradores deben ser creados mediante proceso separado
 * 
 * @param {string} email - Correo electrónico del nuevo usuario
 * @param {string} password - Contraseña (mínimo 8 caracteres)
 * @returns {Promise<Object>} Objeto con resultado:
 *   - success: boolean - Indica si el registro fue exitoso
 *   - user: Object|null - Datos del usuario creado
 *   - message: string - Mensaje descriptivo del resultado
 */
export const registerUser = async (email, password) => {
  try {
    // Crear nueva cuenta en Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return {
      success: true,
      user: userCredential.user,
      message: 'Cuenta creada exitosamente'
    };
  } catch (error) {
    return {
      success: false,
      user: null,
      message: getErrorMessage(error.code)
    };
  }
};

/**
 * Cerrar sesión
 * 
 * Cierra la sesión actual del usuario en Firebase
 * Limpia el estado de autenticación y tokens
 * 
 * @returns {Promise<Object>} Objeto con resultado:
 *   - success: boolean - Indica si el cierre fue exitoso
 *   - message: string - Mensaje descriptivo del resultado
 */
export const logoutUser = async () => {
  try {
    // Cerrar sesión en Firebase Authentication
    await signOut(auth);
    return {
      success: true,
      message: 'Sesión cerrada exitosamente'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error al cerrar sesión'
    };
  }
};

/**
 * Enviar email para restablecer contraseña
 * 
 * Envía un correo con enlace para restablecer contraseña
 * El usuario recibirá un email de Firebase con instrucciones
 * 
 * @param {string} email - Correo electrónico del usuario
 * @returns {Promise<Object>} Objeto con resultado:
 *   - success: boolean - Indica si el envío fue exitoso
 *   - message: string - Mensaje descriptivo del resultado
 */
export const resetPassword = async (email) => {
  try {
    // Enviar email de recuperación mediante Firebase
    await sendPasswordResetEmail(auth, email);
    return {
      success: true,
      message: 'Correo de recuperación enviado'
    };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error.code)
    };
  }
};

/**
 * Obtener usuario actual
 * 
 * Retorna el usuario actualmente autenticado
 * Si no hay sesión activa, retorna null
 * 
 * @returns {Object|null} Usuario actual de Firebase o null si no hay sesión
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

/**
 * Escuchar cambios en el estado de autenticación
 * 
 * Observer que se ejecuta cuando el usuario inicia o cierra sesión
 * Útil para actualizar la UI cuando cambia el estado de autenticación
 * 
 * @param {Function} callback - Función que se ejecuta cuando cambia el estado
 *   Recibe el usuario actual como parámetro (o null si cerró sesión)
 * @returns {Function} Función unsubscribe para dejar de escuchar cambios
 */
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Obtener el rol del usuario autenticado
 * 
 * Verifica en las colecciones de Firestore para determinar el tipo de usuario
 * Orden de verificación: users → admins → companies
 * 
 * @param {string} userId - ID del usuario autenticado (UID de Firebase)
 * @returns {Promise<Object>} Objeto con:
 *   - role: string|null - Tipo de usuario ('user', 'admin', 'company' o null)
 *   - data: Object|null - Datos del perfil del usuario
 *   - error: string - Mensaje de error (solo si hubo error)
 */
export const getUserRole = async (userId) => {
  try {
    // Verificación 1: Buscar en colección 'users' (usuarios normales/empleados)
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return {
        role: 'user',
        data: userDoc.data()
      };
    }

    // Verificación 2: Buscar en colección 'admins' (administradores)
    const adminDoc = await getDoc(doc(db, 'admins', userId));
    if (adminDoc.exists()) {
      return {
        role: 'admin',
        data: adminDoc.data()
      };
    }

    // Verificación 3: Buscar en colección 'companies' (empresas)
    const companyDoc = await getDoc(doc(db, 'companies', userId));
    if (companyDoc.exists()) {
      return {
        role: 'company',
        data: companyDoc.data()
      };
    }

    // Usuario autenticado pero sin perfil en ninguna colección
    // Esto puede ocurrir si se creó la cuenta pero no se completó el registro
    return {
      role: null,
      data: null
    };
  } catch (error) {
    // Error al consultar Firestore (problemas de red, permisos, etc.)
    return {
      role: null,
      data: null,
      error: error.message
    };
  }
};


/**
 * Verificar si un email es de administrador
 * 
 * NOTA: Esta función está en modo prueba
 * En producción, se debe verificar contra Firestore o base de datos
 * Actualmente usa lista hardcodeada de emails permitidos
 * 
 * @param {string} email - Correo electrónico a verificar
 * @returns {boolean} true si es email de admin, false en caso contrario
 * 
 * @todo Migrar a verificación en Firestore para producción
 * @author Josue (owner)
 */
export const isAdminEmail = (email) => {
  // Lista estática de emails de administrador permitidos
  // TODO: Reemplazar con consulta a Firestore en producción
  const adminEmails = [
    'admin@empresa.com',
    'admin@correo.com',
    // Agregar más emails de admin según necesidad
  ];

  // Verificar si el email (normalizado a minúsculas) está en la lista
  return adminEmails.includes(email.toLowerCase());
};

/**
 * Obtener mensaje de error en español
 * 
 * Traduce códigos de error de Firebase a mensajes amigables en español
 * Mejora la experiencia de usuario mostrando errores comprensibles
 * 
 * @param {string} errorCode - Código de error de Firebase Authentication
 * @returns {string} Mensaje de error traducido y descriptivo
 * @private
 */
const getErrorMessage = (errorCode) => {
  // Mapeo de códigos de error de Firebase a mensajes en español
  const errorMessages = {
    'auth/invalid-email': 'El correo electrónico no es válido',
    'auth/user-disabled': 'Esta cuenta ha sido deshabilitada',
    'auth/user-not-found': 'No existe una cuenta con este correo',
    'auth/wrong-password': 'Contraseña incorrecta',
    'auth/email-already-in-use': 'Este correo ya está registrado',
    'auth/weak-password': 'La contraseña debe tener al menos 8 caracteres y cumplir con los requisitos de seguridad',
    'auth/network-request-failed': 'Error de conexión. Verifica tu internet',
    'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde',
    'auth/invalid-credential': 'Credenciales inválidas'
  };

  return errorMessages[errorCode] || 'Error al procesar la solicitud';
};
