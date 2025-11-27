// Servicio de Autenticación con Firebase
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
 * @param {string} email - Correo electrónico
 * @param {string} password - Contraseña
 * @returns {Promise<Object>} - Usuario autenticado
 */
export const loginUser = async (email, password) => {
  try {
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
 * Login de empresa: exige que exista documento en la coleccion companies
 * @param {string} email - Correo de la empresa
 * @param {string} password - Contrasena
 * @returns {Promise<Object>} - Resultado de autenticacion
 */
export const loginCompany = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const companySnap = await getDoc(doc(db, 'companies', user.uid));

    if (!companySnap.exists()) {
      // Cerrar sesion para evitar que quede autenticado un usuario sin perfil de empresa
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
 * @param {string} email - Correo electrónico
 * @param {string} password - Contraseña
 * @returns {Promise<Object>} - Usuario creado
 */
export const registerUser = async (email, password) => {
  try {
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
 * @returns {Promise<Object>}
 */
export const logoutUser = async () => {
  try {
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
 * @param {string} email - Correo electrónico
 * @returns {Promise<Object>}
 */
export const resetPassword = async (email) => {
  try {
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
 * @returns {Object|null} - Usuario actual o null
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

/**
 * Escuchar cambios en el estado de autenticación
 * @param {Function} callback - Función que se ejecuta cuando cambia el estado
 * @returns {Function} - Función para dejar de escuchar
 */
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Obtener el rol del usuario autenticado
 * Verifica en las colecciones: users, admins y companies
 * @param {string} userId - ID del usuario autenticado
 * @returns {Promise<Object>} - {role: string, data: Object}
 */
export const getUserRole = async (userId) => {
  try {
    // 1. Verificar si es usuario normal (colección users)
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return {
        role: 'user',
        data: userDoc.data()
      };
    }

    // 2. Verificar si es administrador (colección admins)
    const adminDoc = await getDoc(doc(db, 'admins', userId));
    if (adminDoc.exists()) {
      return {
        role: 'admin',
        data: adminDoc.data()
      };
    }

    // 3. Verificar si es empresa (colección companies)
    const companyDoc = await getDoc(doc(db, 'companies', userId));
    if (companyDoc.exists()) {
      return {
        role: 'company',
        data: companyDoc.data()
      };
    }

    // Si no se encuentra en ninguna colección
    return {
      role: null,
      data: null
    };
  } catch (error) {
    console.error('Error al obtener rol del usuario:', error);
    return {
      role: null,
      data: null,
      error: error.message
    };
  }
};


//Esta funcion va estar en modo prueba-Josue owner
/**
 * Verificar si un email es de administrador
 * En producción, esto debería verificarse contra Firestore o una base de datos
 * Por ahora, verificamos el dominio del email o una lista específica
 * @param {string} email - Correo electrónico
 * @returns {boolean}
 */
export const isAdminEmail = (email) => {
  // Lista de emails de admin permitidos
  const adminEmails = [
    'admin@empresa.com',
    'admin@correo.com',
    // Agrega más emails de admin aquí
  ];

  // Verificar si el email está en la lista de admins
  return adminEmails.includes(email.toLowerCase());

};

/**
 * Obtener mensaje de error en español
 * @param {string} errorCode - Código de error de Firebase
 * @returns {string} - Mensaje de error
 */
const getErrorMessage = (errorCode) => {
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
