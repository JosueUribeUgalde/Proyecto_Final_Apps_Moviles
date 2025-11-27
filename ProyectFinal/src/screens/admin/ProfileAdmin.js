// Libreria para uso de estados
import React, { useState, useEffect } from "react";
// Libreria de navegacion de React Native
import { SafeAreaView } from "react-native-safe-area-context";
// Componentes y utilidades de React Native
import { View, Text, Image, ScrollView, Pressable, Switch, Modal, ActivityIndicator } from 'react-native';
// Importacion de componentes propios
import HeaderScreen from "../../components/HeaderScreen";
import MenuFooterAdmin from "../../components/MenuFooterAdmin";
import InfoModal from "../../components/InfoModal";
// Importacion de estilos y uso de google fonts
import styles, { TOGGLE_COLORS } from "../../styles/screens/admin/ProfileAdminStyles";
// Importacion de libreria de iconos
import { Ionicons } from '@expo/vector-icons';
// Importacion de constantes
import { COLORS } from '../../components/constants/theme';
// Importacion de libreria de navegacion
import { useNavigation, useFocusEffect } from '@react-navigation/native';
// Importacion de servicio de autenticacion
import { logoutUser, getCurrentUser } from '../../services/authService';
// Importacion de Firestore
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';

export default function ProfileAdmin() {
  const navigation = useNavigation();
  
  // Estados para datos del admin
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // estado simple para el Switch
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  // estado y datos para el modal de seleccion de region
  const [isRegionModalVisible, setIsRegionModalVisible] = useState(false);
  // Estados para InfoModal de error
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedRegion, setSelectedRegion] = useState({
    name: "México",
    code: "MX"
  });

  // Cargar datos del admin al montar el componente y cada vez que la pantalla recibe foco
  useFocusEffect(
    React.useCallback(() => {
      loadAdminData();
    }, [])
  );

  const loadAdminData = async () => {
    try {
      const user = getCurrentUser();
      if (!user) {
        setErrorMessage('No hay sesión activa');
        setShowErrorModal(true);
        setLoading(false);
        return;
      }

      const adminDoc = await getDoc(doc(db, 'admins', user.uid));
      
      if (adminDoc.exists()) {
        const data = adminDoc.data();
        setAdminData(data);
        
        // Actualizar preferencias y región desde los datos
        if (data.preferences?.notificationsEnabled !== undefined) {
          setNotificationsEnabled(data.preferences.notificationsEnabled);
        }
        
        if (data.region) {
          setSelectedRegion(data.region);
        }
      } else {
        setErrorMessage('No se encontraron datos del administrador');
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error('Error al cargar datos del admin:', error);
      setErrorMessage('Error al cargar datos del perfil');
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };
  
  // Funcion para cerrar sesion con Firebase
  const handleLogout = async () => {
    const result = await logoutUser();
    if (result.success) {
      // Navegar a la pantalla de login después del logout exitoso
      navigation.reset({
        index: 0,
        routes: [{ name: 'LoginAdmin' }],
      });
    } else {
      // Mostrar error con InfoModal
      setErrorMessage(result.message);
      setShowErrorModal(true);
    }
  };

  // Funcion para navegar a pantalla de edicion de perfil
  const handleEditProfile = () => {
    navigation.navigate('EditProfileAdmin');
  };

  // Función para actualizar notificaciones en Firestore
  const handleToggleNotifications = async (newValue) => {
    setNotificationsEnabled(newValue);
    
    try {
      const user = getCurrentUser();
      if (!user) return;

      await updateDoc(doc(db, 'admins', user.uid), {
        'preferences.notificationsEnabled': newValue
      });
      
      // Actualizar también el estado local
      setAdminData(prev => ({
        ...prev,
        preferences: {
          ...prev?.preferences,
          notificationsEnabled: newValue
        }
      }));
    } catch (error) {
      console.error('Error al actualizar notificaciones:', error);
      // Revertir el cambio si falla
      setNotificationsEnabled(!newValue);
      setErrorMessage('Error al actualizar preferencias de notificaciones');
      setShowErrorModal(true);
    }
  };

  const regions = [
    { name: "México", code: "MX" },
    { name: "Estados Unidos", code: "US" }
  ];

  // Funcion para seleccionar region en el modal
  const handleRegionSelect = async (region) => {
    setSelectedRegion(region);
    setIsRegionModalVisible(false);
    
    try {
      const user = getCurrentUser();
      if (!user) return;

      await updateDoc(doc(db, 'admins', user.uid), {
        region: {
          code: region.code,
          name: region.name
        }
      });
      
      // Actualizar también el estado local
      setAdminData(prev => ({
        ...prev,
        region: {
          code: region.code,
          name: region.name
        }
      }));
    } catch (error) {
      console.error('Error al actualizar región:', error);
      setErrorMessage('Error al actualizar región');
      setShowErrorModal(true);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <HeaderScreen
          title="Perfil Administrador"
          leftIcon={<Ionicons name="arrow-back" size={24} color="black" />}
          onLeftPress={() => navigation.goBack()}
        />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={{ marginTop: 16, color: COLORS.textGray }}>Cargando perfil...</Text>
        </View>
        <MenuFooterAdmin />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <HeaderScreen
        title="Perfil Administrador"
        rightIcon={<Ionicons name="notifications-outline" size={24} color="black" />}
        leftIcon={<Ionicons name="arrow-back" size={24} color="black" />}
        onLeftPress={() => navigation.goBack()}
      />
      
      <ScrollView>

        {/* Primer card de perfil */}
        <View style={styles.profileCard}>
          <View style={styles.cardHeader}>
            {adminData?.photo ? (
              <Image
                source={{ uri: adminData.photo }}
                style={styles.avatar}
              />
            ) : (
              <View style={[styles.avatar, { backgroundColor: COLORS.lightGray, justifyContent: 'center', alignItems: 'center' }]}>
                <Ionicons name="person" size={40} color={COLORS.textGray} />
              </View>
            )}

            <View style={styles.nameAndRole}>
              <Text style={styles.cardName}>{adminData?.name || 'Sin nombre'}</Text>
              <Text style={styles.cardRole}>{adminData?.position || 'Administrador'}</Text>
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
              <Text style={styles.badgeText}>{adminData?.role || 'Admin'}</Text>
            </View>
          </View>

          {/* Cajas de email y teléfono */}
          <View style={styles.infoBox}>
            <Ionicons name="mail-outline" size={20} color={COLORS.textGray} />
            <Text style={styles.infoText}>{adminData?.email || 'Sin email'}</Text>
          </View>

          <View style={styles.infoBox}>
            <Ionicons name="call-outline" size={20} color={COLORS.textGray} />
            <Text style={styles.infoText}>{adminData?.phone || 'Sin teléfono'}</Text>
          </View>
        </View>

        {/* Segundo card de preferencias */}
        <View style={styles.preferencesSection}>
          <Text style={styles.sectionTitle}>Preferencias</Text>
          
          {/* Notificaciones: implementación simple con Switch */}
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

          {/* Región y hora */}
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
                <Text style={styles.preferenceTitle}>Región y hora</Text>
                <Text style={styles.preferenceSubtitle}>
                  {selectedRegion?.name || 'México'} ({selectedRegion?.code || 'MX'})
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color={COLORS.textGray} />
          </Pressable>

          {/* Modal de selección de región */}
          <Modal
            visible={isRegionModalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setIsRegionModalVisible(false)}
          >
            <Pressable 
              style={styles.modalOverlay}
              onPress={() => setIsRegionModalVisible(false)}
            >
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Seleccionar región</Text>
                
                {regions.map((region) => (
                  <Pressable
                    key={region.code}
                    style={({pressed}) => [
                      styles.regionOption,
                      selectedRegion.code === region.code && styles.regionOptionSelected,
                      pressed && {opacity: 0.7}
                    ]}
                    onPress={() => handleRegionSelect(region)}
                  >
                    <Text style={[
                      styles.regionOptionText,
                      selectedRegion.code === region.code && styles.regionOptionTextSelected
                    ]}>
                      {region.name}
                    </Text>
                    {selectedRegion.code === region.code && (
                      <Ionicons name="checkmark" size={24} color={COLORS.primary} />
                    )}
                  </Pressable>
                ))}
              </View>
            </Pressable>
          </Modal>
        </View>

        {/* Tercer card de cuenta(cambio contraseña) */}
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
                <Text style={styles.preferenceTitle}>Cambiar contraseña</Text>
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
          <Text style={styles.signOutText}>Cerrar sesión</Text>
        </Pressable>
      </ScrollView>

      <InfoModal
        visible={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="Error"
        message={errorMessage}
      />

      <MenuFooterAdmin />
    </SafeAreaView>
  );
}
