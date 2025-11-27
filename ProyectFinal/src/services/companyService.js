import { db, storage } from '../config/firebaseConfig';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { registerUser } from './authService';

const uploadFile = async (uri, storagePath) => {
  if (!uri) return null;
  const response = await fetch(uri);
  const blob = await response.blob();
  const storageRef = ref(storage, storagePath);
  await uploadBytes(storageRef, blob);
  return await getDownloadURL(storageRef);
};

export const registerCompany = async (formData) => {
  const {
    companyName,
    email,
    phone,
    rfc,
    address,
    ownerName,
    password,
    logo,
    officialId,
    proofOfAddress,
    fiscalStatus,
    // opcional: si ya traes el plan elegido desde la pantalla de planes
    selectedPlanType,   // 'basic' | 'plus' | 'pro' | 'enterprise'
  } = formData;

  // 1) Crear usuario en Auth
  const result = await registerUser(email, password);
  if (!result.success) {
    return {
      success: false,
      message: result.message || 'No se pudo crear la cuenta de la empresa',
    };
  }

  const uid = result.user.uid;

  try {
    // 2) Subir archivos a Storage
    const logoUrl = await uploadFile(logo, `companies/${uid}/logo.jpg`);
    const officialIdFrontUrl = await uploadFile(formData.officialId.front, `companies/${uid}/officialId_front.jpg`);
    const officialIdBackUrl = await uploadFile(formData.officialId.back, `companies/${uid}/officialId_back.jpg`);
    const proofOfAddressUrl = await uploadFile(formData.proofOfAddress, `companies/${uid}/proofOfAddress.jpg`);

    // 3) Armar doc EXACTO con la estructura que quieres
    const planType = selectedPlanType || 'basic';

    const companyDoc = {
      companyName,
      address,
      email,
      ownerName,
      phone,
      rfc,

      logo: logoUrl || logo || null,  // si usas Storage, logoUrl; si no, lo que venga

      documents: {
        officialId: {
          front: officialIdFrontUrl,
          back: officialIdBackUrl
        },
        proofOfAddress: proofOfAddressUrl
      },

      payment: {
        billingCycle: 'monthly',
        method: null,
        lastFourDigits: null,
        cardName: null,
        exp: null,
        billingStreet: null,
        billingCity: null,
        billingZip: null,
        phone,
      },

      plan: {
        type: planType,
        status: 'active',
        features: ['analytics', 'reports', 'api'],
        maxUsers: planType === 'basic' ? 10 : planType === 'plus' ? 25 : planType === 'pro' ? 50 : 100,
        startDate: serverTimestamp(),
        endDate: null,
      },

      stats: {
        activeRequests: 0,
        totalEmployees: 0,
        totalGroups: 0,
        updatedAt: serverTimestamp(),
      },

      // Array de administradores (IDs de usuarios que pueden administrar la empresa)
      administradores: [],
      foto: null,
      invoices: [],
      createdAt: serverTimestamp(),
    };

    await setDoc(doc(db, 'companies', uid), companyDoc);

    return {
      success: true,
      message: 'Empresa registrada correctamente',
    };
  } catch (error) {
    console.log('Fallo en Storage/Firestore', error);
    return {
      success: false,
      message: error.message || 'Error al guardar datos de la empresa',
    };
  }
};
