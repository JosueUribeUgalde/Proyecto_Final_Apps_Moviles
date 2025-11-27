import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Image, ScrollView, Pressable, Switch, Modal, ActivityIndicator } from 'react-native';
import HeaderScreen from "../../components/HeaderScreen";
import MenuFooter from "../../components/MenuFooter";
import InfoModal from "../../components/InfoModal";
import styles, { TOGGLE_COLORS } from "../../styles/screens/user/ProfileStyles";
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../components/constants/theme';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { logoutUser, getCurrentUser } from '../../services/authService';
import { getUserProfile } from '../../services/userService';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';

export default function Profile() {
  const navigation = useNavigation();

  // Estados para datos del usuario
  const [userData, setUserData] = useState(null);
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

  // Cargar datos del usuario al montar el componente y cada vez que la pantalla recibe foco
  useFocusEffect(
    React.useCallback(() => {
      loadUserData();
    }, [])
  );

  const loadUserData = async () => {
    try {
      const user = getCurrentUser();
      if (!user) {
        setErrorMessage('No hay sesión activa');
        setShowErrorModal(true);
        setLoading(false);
        return;
      }

      // Obtener datos del usuario desde Firestore
      const userProfile = await getUserProfile(user.uid);

      if (userProfile) {
        setUserData(userProfile);

        // Actualizar preferencias y región desde los datos
        if (userProfile.preferences?.notificationsEnabled !== undefined) {
          setNotificationsEnabled(userProfile.preferences.notificationsEnabled);
        }

        if (userProfile.region) {
          setSelectedRegion(userProfile.region);
        }
      } else {
        setErrorMessage('No se encontraron datos del usuario');
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
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

  // Función para actualizar notificaciones en Firestore
  const handleToggleNotifications = async (newValue) => {
    setNotificationsEnabled(newValue);

    try {
      const user = getCurrentUser();
      if (!user) return;

      await updateDoc(doc(db, 'users', user.uid), {
        'preferences.notificationsEnabled': newValue
      });

      // Actualizar también el estado local
      setUserData(prev => ({
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

      await updateDoc(doc(db, 'users', user.uid), {
        region: {
          code: region.code,
          name: region.name
        }
      });

      // Actualizar también el estado local
      setUserData(prev => ({
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
          title="Perfil"
          leftIcon={<Ionicons name="arrow-back" size={24} color="black" />}
          onLeftPress={() => navigation.goBack()}
        />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={{ marginTop: 16, color: COLORS.textGray }}>Cargando perfil...</Text>
        </View>
        <MenuFooter />
      </SafeAreaView>
    );
  }

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
            {userData?.avatar ? (
              <Image
                source={{ uri: userData.avatar }}
                style={styles.avatar}
              />
            ) : (
              <View style={[styles.avatar, { backgroundColor: COLORS.lightGray, justifyContent: 'center', alignItems: 'center' }]}>
                <Ionicons name="person" size={40} color={COLORS.textGray} />
              </View>
            )}

            <View style={styles.nameAndRole}>
              <Text style={styles.cardName}>{userData?.name || 'Sin nombre'}</Text>
              <Text style={styles.cardRole}>{userData?.position || 'Usuario'}</Text>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.editBtn,
                pressed && { opacity: 0.5 }
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
              <Text style={styles.badgeText}>{userData?.role || 'user'}</Text>
            </View>
          </View>

          {/* Cajas de email y teléfono */}
          <View style={styles.infoBox}>
            <Ionicons name="mail-outline" size={20} color={COLORS.textGray} />
            <Text style={styles.infoText}>{userData?.email || 'Sin email'}</Text>
          </View>

          <View style={styles.infoBox}>
            <Ionicons name="call-outline" size={20} color={COLORS.textGray} />
            <Text style={styles.infoText}>{userData?.phone || 'Sin teléfono'}</Text>
          </View>
        </View>

        {/* Preferencias */}
        <View style={styles.preferencesSection}>
          <Text style={styles.sectionTitle}>Preferencias</Text>

          {/* Notificaciones: implementación simple con Switch */}
          <Pressable
            style={({ pressed }) => [
              styles.preferenceItem,
              pressed && { opacity: 0.7 }
            ]}
            onPress={() => handleToggleNotifications(!notificationsEnabled)}
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
                onValueChange={handleToggleNotifications}
                trackColor={{ false: TOGGLE_COLORS.off, true: TOGGLE_COLORS.on }}
                thumbColor={TOGGLE_COLORS.thumb}
                ios_backgroundColor={TOGGLE_COLORS.off}
              />
            </View>
          </Pressable>

          {/* Región y hora */}
          <Pressable
            style={({ pressed }) => [
              styles.preferenceItem,
              pressed && { opacity: 0.7 }
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
                    style={({ pressed }) => [
                      styles.regionOption,
                      selectedRegion.code === region.code && styles.regionOptionSelected,
                      pressed && { opacity: 0.7 }
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
            style={({ pressed }) => [
              styles.preferenceItem,
              pressed && { opacity: 0.7 }
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
          style={({ pressed }) => [
            styles.helpButton,
            pressed && { opacity: 0.7 }
          ]}
          onPress={() => navigation.navigate('Help')}
        >
          <Ionicons name="help-circle-outline" size={24} color={COLORS.primary} />
          <Text style={styles.helpButtonText}>Ayuda</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.signOutButton,
            pressed && { opacity: 0.7 }
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
