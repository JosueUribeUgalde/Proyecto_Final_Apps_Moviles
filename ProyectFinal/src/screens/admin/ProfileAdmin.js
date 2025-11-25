// Libreria para uso de estados
import React, { useState } from "react";
// Libreria de navegacion de React Native
import { SafeAreaView } from "react-native-safe-area-context";
// Componentes y utilidades de React Native
import { View, Text, Image, ScrollView, Pressable, Switch, Modal } from 'react-native';
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
import { useNavigation } from '@react-navigation/native';
// Importacion de servicio de autenticacion
import { logoutUser } from '../../services/authService';

export default function ProfileAdmin() {
  const navigation = useNavigation();
  
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

  // Datos de usuario (mock data)
  const [name]= useState("Juan Carlos Administrador");
  const [email] = useState("admin@empresa.com");
  const [phone] = useState("+52 9876543210");
  const [role] = useState("Administrador General");
  const [user] = useState("Administrador");

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

  const regions = [
    { name: "México", code: "MX" },
    { name: "Estados Unidos", code: "US" }
  ];

  // Funcion para seleccionar region en el modal
  const handleRegionSelect = (region) => {
    setSelectedRegion(region);
    setIsRegionModalVisible(false);
  };

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
            <Image
              source={require('../../../assets/i.png')}
              style={styles.avatar}
            />

            <View style={styles.nameAndRole}>
              <Text style={styles.cardName}>{name}</Text>
              <Text style={styles.cardRole}>{role}</Text>
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
              <Text style={styles.badgeText}>{user}</Text>
            </View>
          </View>

          {/* Cajas de email y teléfono */}
          <View style={styles.infoBox}>
            <Ionicons name="mail-outline" size={20} color={COLORS.textGray} />
            <Text style={styles.infoText}>{email}</Text>
          </View>

          <View style={styles.infoBox}>
            <Ionicons name="call-outline" size={20} color={COLORS.textGray} />
            <Text style={styles.infoText}>{phone}</Text>
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
            onPress={() => setNotificationsEnabled(v => !v)}
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
                onValueChange={setNotificationsEnabled}
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
                <Text style={styles.preferenceSubtitle}>{selectedRegion.name} ({selectedRegion.code})</Text>
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
