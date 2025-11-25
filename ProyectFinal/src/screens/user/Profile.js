import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Image, ScrollView, Pressable, Switch, Modal } from 'react-native';
import HeaderScreen from "../../components/HeaderScreen";
import MenuFooter from "../../components/MenuFooter";
import InfoModal from "../../components/InfoModal";
import styles, { TOGGLE_COLORS } from "../../styles/screens/user/ProfileStyles";
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../components/constants/theme';
import { useNavigation } from '@react-navigation/native';
import { logoutUser } from '../../services/authService';

export default function Profile() {
  const navigation = useNavigation();
  
  // Funcion para cerrar sesion con Firebase
  const handleLogout = async () => {
    const result = await logoutUser();
    if (result.success) {
      // Navegar a la pantalla de login después del logout exitoso
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } else {
      // Mostrar error con InfoModal
      setErrorMessage(result.message);
      setShowErrorModal(true);
    }
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  const [name]= useState("Damian Elias Nietopa");
  const [email] = useState("ElMmaian@gmail.com");
  const [phone] = useState("+52 1234567890");
  const [role] = useState("Recursos humanos");
  const [user] = useState("Usuario");

  // estado simple para el Switch
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
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

  const handleRegionSelect = (region) => {
    setSelectedRegion(region);
    setIsRegionModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderScreen
        title="Perfil"
        rightIcon={<Ionicons name="notifications-outline" size={24} color="black" />}
        leftIcon={<Ionicons name="arrow-back" size={24} color="black" />}
        onLeftPress={() => navigation.goBack()}
      />
      
      <ScrollView>

        {/* Tarjeta de usuario */}
        <View style={styles.profileCard}>
          <View style={styles.cardHeader}>
            <Image
              source={require('../../../assets/i.png')}
              style={styles.avatar}
            />

            <View style={styles.nameAndRole}>
              <Text style={styles.cardName} placeholder="Nombre">{name}</Text>
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
              <Text style={styles.badgeText} placeholder="user">{user}</Text>
            </View>
          </View>

          {/* Cajas de email y teléfono */}
          <View style={styles.infoBox}>
            <Ionicons name="mail-outline" size={20} color={COLORS.textGray} />
            <Text style={styles.infoText} placeholder="gmail">{email}</Text>
          </View>

          <View style={styles.infoBox}>
            <Ionicons name="call-outline" size={20} color={COLORS.textGray} />
            <Text style={styles.infoText} placeholder="phone">{phone}</Text>
          </View>
        </View>

        {/* Preferencias */}
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
                <Text style={styles.preferenceSubtitle}>Alertas, aprobaciones, recordatorios</Text>
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

          {/* Reemplazar el TouchableOpacity de Región y hora */}
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

        {/* Sección de cuenta */}
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

      <MenuFooter />
    </SafeAreaView>
  );
}
