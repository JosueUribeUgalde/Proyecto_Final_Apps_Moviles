// Libreria para uso de estados
import React, { useState } from "react";
// Libreria de navegacion de React Native
import { SafeAreaView } from "react-native-safe-area-context";
// Componentes y utilidades de React Native
import { View, Text, Image, ScrollView, Pressable, Switch, Modal, ActivityIndicator } from 'react-native';
// Importacion de componentes propios
import HeaderScreen from "../../components/HeaderScreen";
import MenuFooterCompany from "../../components/MenuFooterCompany";
import InfoModal from "../../components/InfoModal";
// Importacion de estilos y uso de google fonts
import styles, { TOGGLE_COLORS } from "../../styles/screens/company/ProfileCompanyStyles";
// Importacion de libreria de iconos
import { Ionicons } from '@expo/vector-icons';
// Importacion de constantes
import { COLORS } from '../../components/constants/theme';
// Importacion de libreria de navegacion
import { useNavigation, useFocusEffect } from '@react-navigation/native';
// Servicios y Firestore
import { logoutUser, getCurrentUser } from '../../services/authService';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';

export default function ProfileCompany() {
  const navigation = useNavigation();
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // estado simple para el Switch
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  // estado y datos para el modal de seleccion de region
  const [isRegionModalVisible, setIsRegionModalVisible] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState({
    name: "Mexico",
    code: "MX"
  });

  const regions = [
    { name: "Mexico", code: "MX" },
    { name: "Estados Unidos", code: "US" }
  ];

  useFocusEffect(
    React.useCallback(() => {
      loadCompanyData();
    }, [])
  );

  const loadCompanyData = async () => {
    try {
      const user = getCurrentUser();
      if (!user) {
        setErrorMessage('No hay sesion activa');
        setShowErrorModal(true);
        setLoading(false);
        return;
      }

      const companySnap = await getDoc(doc(db, 'companies', user.uid));
      if (!companySnap.exists()) {
        setErrorMessage('No se encontro el perfil de la empresa');
        setShowErrorModal(true);
        setLoading(false);
        return;
      }

      const data = companySnap.data();
      setCompanyData(data);

      if (data.preferences?.notificationsEnabled !== undefined) {
        setNotificationsEnabled(data.preferences.notificationsEnabled);
      }

      if (data.region) {
        setSelectedRegion(data.region);
      }
    } catch (error) {
      console.error('Error al cargar perfil de empresa:', error);
      setErrorMessage('Error al cargar el perfil');
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  // Funcion para cerrar sesion
  const handleLogout = async () => {
    const result = await logoutUser();
    if (result.success) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'LoginCompany' }],
      });
    } else {
      setErrorMessage(result.message);
      setShowErrorModal(true);
    }
  };

  // Funcion para navegar a pantalla de edicion de perfil
  const handleEditProfile = () => {
    navigation.navigate('EditProfileCompany');
  };

  const handleToggleNotifications = async (newValue) => {
    setNotificationsEnabled(newValue);
    try {
      const user = getCurrentUser();
      if (!user) return;

      await updateDoc(doc(db, 'companies', user.uid), {
        'preferences.notificationsEnabled': newValue
      });

      setCompanyData(prev => ({
        ...prev,
        preferences: {
          ...prev?.preferences,
          notificationsEnabled: newValue
        }
      }));
    } catch (error) {
      console.error('Error al actualizar notificaciones:', error);
      setNotificationsEnabled(!newValue);
      setErrorMessage('No se pudieron actualizar las notificaciones');
      setShowErrorModal(true);
    }
  };

  // Funcion para seleccionar region en el modal
  const handleRegionSelect = async (region) => {
    setSelectedRegion(region);
    setIsRegionModalVisible(false);

    try {
      const user = getCurrentUser();
      if (!user) return;

      await updateDoc(doc(db, 'companies', user.uid), {
        region: {
          code: region.code,
          name: region.name,
        },
      });

      setCompanyData(prev => ({
        ...prev,
        region: {
          code: region.code,
          name: region.name,
        },
      }));
    } catch (error) {
      console.error('Error al actualizar region:', error);
      setErrorMessage('No se pudo actualizar la region');
      setShowErrorModal(true);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <HeaderScreen
          title="Perfil Empresarial"
          leftIcon={<Ionicons name="arrow-back" size={24} color="black" />}
          onLeftPress={() => navigation.goBack()}
        />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={{ marginTop: 16, color: COLORS.textGray }}>Cargando perfil...</Text>
        </View>
        <MenuFooterCompany />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <HeaderScreen
        title="Perfil Empresarial"
        leftIcon={<Ionicons name="arrow-back" size={24} color="black" />}
        onLeftPress={() => navigation.goBack()}
      />
      
      <ScrollView>

        {/* Primer card de perfil */}
        <View style={styles.profileCard}>
          <View style={styles.cardHeader}>
            {companyData?.logo ? (
              <Image
                source={{ uri: companyData.logo }}
                style={styles.avatar}
              />
            ) : (
              <View style={[styles.avatar, { backgroundColor: COLORS.lightGray, justifyContent: 'center', alignItems: 'center' }]}>
                <Ionicons name="business" size={40} color={COLORS.textGray} />
              </View>
            )}

            <View style={styles.nameAndRole}>
              <Text style={styles.cardName}>{companyData?.companyName || 'Sin nombre'}</Text>
              <Text style={styles.cardRole}>{companyData?.ownerName || 'Representante'}</Text>
            </View>

            <Pressable 
              style={({pressed}) => [
                styles.editBtn,
                pressed && {opacity: 0.5}
              ]} 
              onPress={handleEditProfile}
            >
              <Ionicons name="create-outline" size={18} color={COLORS.textGreen} />
              <Text style={styles.editBtnText}>Editar</Text>
            </Pressable>
          </View>

          {/* Usuario */}
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Ionicons name="shield-checkmark-outline" size={16} color={COLORS.textBlack} />
              <Text style={styles.badgeText}>{companyData?.plan?.status === 'active' ? 'Empresa activa' : 'Empresa'}</Text>
            </View>
          </View>

          {/* Cajas de email y telefono */}
          <View style={styles.infoBox}>
            <Ionicons name="mail-outline" size={20} color={COLORS.textGray} />
            <Text style={styles.infoText}>{companyData?.email || 'Sin email'}</Text>
          </View>

          <View style={styles.infoBox}>
            <Ionicons name="call-outline" size={20} color={COLORS.textGray} />
            <Text style={styles.infoText}>{companyData?.phone || 'Sin telefono'}</Text>
          </View>
        </View>

        {/* Segundo card de preferencias */}
        <View style={styles.preferencesSection}>
          <Text style={styles.sectionTitle}>Preferencias</Text>
          
          {/* Notificaciones: implementacion simple con Switch */}
          <Pressable
            style={({pressed}) => [
              styles.preferenceItem,
              pressed && {opacity: 0.7}
            ]}
            onPress={() => handleToggleNotifications(!notificationsEnabled)}
          >
            <View style={styles.preferenceLeft}>
              <Ionicons name="notifications-outline" size={24} color={COLORS.primary} />
              <View style={styles.preferenceTextContainer}>
                <Text style={styles.preferenceTitle}>Notificaciones</Text>
                <Text style={styles.preferenceSubtitle}>Alertas, peticiones</Text>
              </View>
            </View>

            <View style={styles.toggleContainer}>
              <Switch
                value={notificationsEnabled}
                onValueChange={handleToggleNotifications}
                trackColor={{ false: TOGGLE_COLORS.off, true: TOGGLE_COLORS.on }}
                thumbColor={TOGGLE_COLORS.thumb}
                ios_backgroundColor={TOGGLE_COLORS.off}
              />
            </View>
          </Pressable>

          {/* Region y hora */}
          <Pressable 
            style={({pressed}) => [
              styles.preferenceItem,
              pressed && {opacity: 0.7}
            ]}
            onPress={() => setIsRegionModalVisible(true)}
          >
            <View style={styles.preferenceLeft}>
              <Ionicons name="globe-outline" size={24} color={COLORS.primary} />
              <View style={styles.preferenceTextContainer}>
                <Text style={styles.preferenceTitle}>Region y hora</Text>
                <Text style={styles.preferenceSubtitle}>{selectedRegion.name} ({selectedRegion.code})</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color={COLORS.textGray} />
          </Pressable>

          {/* Modal de seleccion de region */}
          <Modal
            visible={isRegionModalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setIsRegionModalVisible(false)}>
            <Pressable 
              style={styles.modalOverlay}
              onPress={() => setIsRegionModalVisible(false)}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Seleccionar region</Text>
                
                {regions.map((region) => (
                  <Pressable
                    key={region.code}
                    style={({pressed}) => [
                      styles.regionOption,
                      selectedRegion.code === region.code && styles.regionOptionSelected,
                      pressed && {opacity: 0.7}
                    ]}
                    onPress={() => handleRegionSelect(region)}>
                    <Text style={[
                      styles.regionOptionText,
                      selectedRegion.code === region.code && styles.regionOptionTextSelected]}>
                      {region.name}
                    </Text>
                    {selectedRegion.code === region.code && (
                      <Ionicons name="checkmark" size={24} color={COLORS.primary} />)}
                  </Pressable>))}
              </View>
            </Pressable>
          </Modal>
        </View>

          {/* Facturacion */}
            <View style={styles.preferencesSection}>
                <Text style={styles.sectionTitle}>Facturacion</Text>

          {/* Metodos de pago */}
                <Pressable style={({ pressed }) => [styles.preferenceItem, pressed && { opacity: 0.7 }]}
                  onPress={() => navigation.navigate('PaymentMethod')}>
              <View style={styles.preferenceLeft}>
                <Ionicons name="card-outline" size={24} color={COLORS.primary} />
              <View style={styles.preferenceTextContainer}>
                <Text style={styles.preferenceTitle}>Metodos de pago</Text>
                <Text style={styles.preferenceSubtitle}>Gestiona tus tarjetas y bancos</Text>
              </View>
              </View>
                <Ionicons name="chevron-forward" size={24} color={COLORS.textGray} />
                </Pressable>

          {/* Planes */}
                <Pressable onPress={() => navigation.navigate('Plan')}>
              <View style={styles.preferenceItem}>
                <View style={styles.preferenceLeft}>
                  <Ionicons name="pricetags-outline" size={24} color={COLORS.primary} />
                <View style={styles.preferenceTextContainer}>
                  <Text style={styles.preferenceTitle}>Planes</Text>
                  <Text style={styles.preferenceSubtitle}>Cambiar o revisar tu plan</Text>
                </View>
                </View>

          {/* Estilo activo o no */}
                <View style={styles.billingPill}>
                <Text style={styles.billingPillText}>{companyData?.plan?.status === 'active' ? 'Activo' : 'Inactivo'}</Text>
                </View>
              </View>
                </Pressable>

          {/* Historial de facturas */}
                <Pressable style={({ pressed }) => [styles.preferenceItem, pressed && { opacity: 0.7 }]}
                  onPress={() => navigation.navigate('InvoiceHistory')}>
              <View style={styles.preferenceLeft}>
                <Ionicons name="document-text-outline" size={24} color={COLORS.primary} />
                <View style={styles.preferenceTextContainer}>
                  <Text style={styles.preferenceTitle}>Historial de facturas</Text>
                  <Text style={styles.preferenceSubtitle}>Descarga recibos y facturas</Text>
                </View>
              </View>
                <Ionicons name="chevron-forward" size={24} color={COLORS.textGray} />
                </Pressable>
            </View>

        {/* Tercer card de cuenta(cambio contrasena) */}
        <View style={styles.accountSection}>
          <Text style={styles.sectionTitle}>Cuenta</Text>
          
          <Pressable 
            style={({pressed}) => [
              styles.preferenceItem,
              pressed && {opacity: 0.7}
            ]} 
            onPress={() => navigation.navigate('PasswordReset')}
          >
            <View style={styles.preferenceLeft}>
              <Ionicons name="key-outline" size={24} color={COLORS.primary} />
              <View style={styles.preferenceTextContainer}>
                <Text style={styles.preferenceTitle}>Cambiar contrasena</Text>
                <Text style={styles.preferenceSubtitle}>Actualizar credenciales</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color={COLORS.textGray} />
          </Pressable>
        </View>

{/* Ultima card de ayuda */}
        <Pressable 
          style={({pressed}) => [
            styles.helpButton,
            pressed && {opacity: 0.7}
          ]}
          onPress={() => navigation.navigate('Help')}
        >
          <Ionicons name="help-circle-outline" size={24} color={COLORS.primary} />
          <Text style={styles.helpButtonText}>Ayuda</Text>
        </Pressable>
        
        <Pressable 
          style={({pressed}) => [
            styles.signOutButton,
            pressed && {opacity: 0.7}
          ]}
          onPress={handleLogout}
        >
          <Text style={styles.signOutText}>Cerrar sesion</Text>
        </Pressable>
      </ScrollView>

      <InfoModal
        visible={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="Error"
        message={errorMessage}
      />

      <MenuFooterCompany />
    </SafeAreaView>
  );
}
