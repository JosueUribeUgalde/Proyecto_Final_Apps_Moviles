// 1. Paquetes core de React/React Native
import React, { useState, useEffect } from "react";
import { View, Text, Image, ScrollView, Pressable, Switch, Modal, ActivityIndicator } from 'react-native';

// 2. Bibliotecas de terceros
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

// 3. Componentes propios
import HeaderScreen from "../../components/HeaderScreen";
import MenuFooter from "../../components/MenuFooter";
import InfoModal from "../../components/InfoModal";
import NotificationsModal from "../../components/NotificationsModal";

// 4. Constantes y utilidades
import { COLORS } from '../../components/constants/theme';

// 5. Servicios de Firebase
import { logoutUser, getCurrentUser } from '../../services/authService';
import { getUserProfile } from '../../services/userService';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';

// 6. Estilos
import styles, { TOGGLE_COLORS } from "../../styles/screens/user/ProfileStyles";

export default function Profile() {
  // ============================================
  // ESTADOS
  // ============================================
  
  const navigation = useNavigation();

  // Datos completos del perfil del usuario desde Firestore
  const [userData, setUserData] = useState(null);
  
  // Control de carga inicial de datos
  const [loading, setLoading] = useState(true);

  // Estado del toggle de notificaciones
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  // Control de visibilidad del modal de selección de región
  const [isRegionModalVisible, setIsRegionModalVisible] = useState(false);
  
  // Control de visibilidad del modal de selección de status
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  
  // Control del modal de errores
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Control de visibilidad del modal de notificaciones
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  
  // Región seleccionada actualmente (México por defecto)
  const [selectedRegion, setSelectedRegion] = useState({
    name: "México",
    code: "MX"
  });
  
  // Status seleccionado actualmente
  const [selectedStatus, setSelectedStatus] = useState("Disponible");

  // ============================================
  // EFECTOS
  // ============================================

  
  /**
   * Cargar datos del usuario cada vez que la pantalla recibe foco
   * Esto asegura que los datos estén actualizados al regresar de EditProfile
   */
  useFocusEffect(
    React.useCallback(() => {
      loadUserData();
    }, [])
  );

  // ============================================
  // FUNCIONES DE CARGA DE DATOS
  // ============================================
  
  /**
   * Carga el perfil completo del usuario desde Firestore
   * Incluye datos personales, preferencias y configuración regional
   */
  const loadUserData = async () => {
    try {
      // Obtener usuario actualmente autenticado
      const user = getCurrentUser();
      if (!user) {
        setErrorMessage('No hay sesión activa');
        setShowErrorModal(true);
        setLoading(false);
        return;
      }

      // Obtener documento completo del usuario desde Firestore
      const userProfile = await getUserProfile(user.uid);

      if (userProfile) {
        setUserData(userProfile);

        // Actualizar preferencias de notificaciones si existen en el perfil
        if (userProfile.preferences?.notificationsEnabled !== undefined) {
          setNotificationsEnabled(userProfile.preferences.notificationsEnabled);
        }

        // Actualizar región seleccionada si existe en el perfil
        if (userProfile.region) {
          setSelectedRegion(userProfile.region);
        }
        
        // Actualizar status seleccionado si existe en el perfil
        if (userProfile.status) {
          setSelectedStatus(userProfile.status);
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

  // ============================================
  // HANDLERS DE EVENTOS
  // ============================================

  
  /**
   * Cierra la sesión del usuario en Firebase Authentication
   * Después del logout exitoso, reinicia la navegación a la pantalla de Login
   */
  const handleLogout = async () => {
    const result = await logoutUser();
    if (result.success) {
      // Resetear stack de navegación para evitar volver atrás
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

  /**
   * Navega a la pantalla de edición de perfil
   */
  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  /**
   * Actualiza la preferencia de notificaciones en Firestore
   * Si falla, revierte el cambio en el estado local
   * @param {boolean} newValue - Nuevo estado del toggle de notificaciones
   */
  const handleToggleNotifications = async (newValue) => {
    setNotificationsEnabled(newValue);

    try {
      const user = getCurrentUser();
      if (!user) return;

      // Actualizar en Firestore usando dot notation
      await updateDoc(doc(db, 'users', user.uid), {
        'preferences.notificationsEnabled': newValue
      });

      // Actualizar también el estado local para mantener sincronización
      setUserData(prev => ({
        ...prev,
        preferences: {
          ...prev?.preferences,
          notificationsEnabled: newValue
        }
      }));
    } catch (error) {
      console.error('Error al actualizar notificaciones:', error);
      // Revertir el cambio si la actualización falla
      setNotificationsEnabled(!newValue);
      setErrorMessage('Error al actualizar preferencias de notificaciones');
      setShowErrorModal(true);
    }
  };

  // ============================================
  // DATOS ESTÁTICOS
  // ============================================

  
  // Lista de regiones disponibles para selección
  const regions = [
    { name: "México", code: "MX" },
    { name: "Estados Unidos", code: "US" }
  ];
  
  // Lista de status disponibles para selección
  const statusOptions = [
    "Disponible",
    "Ocupado"
  ];

  /**
   * Maneja la selección de una región del modal
   * Actualiza tanto Firestore como el estado local
   * @param {Object} region - Objeto con name y code de la región
   */
  const handleRegionSelect = async (region) => {
    setSelectedRegion(region);
    setIsRegionModalVisible(false);

    try {
      const user = getCurrentUser();
      if (!user) return;

      // Actualizar región en Firestore
      await updateDoc(doc(db, 'users', user.uid), {
        region: {
          code: region.code,
          name: region.name
        }
      });

      // Actualizar también el estado local para mantener sincronización
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
  
  /**
   * Maneja la selección de un status del modal
   * Actualiza tanto Firestore como el estado local
   * @param {string} status - Nuevo status del usuario
   */
  const handleStatusSelect = async (status) => {
    setSelectedStatus(status);
    setIsStatusModalVisible(false);

    try {
      const user = getCurrentUser();
      if (!user) return;

      // Actualizar status en Firestore
      await updateDoc(doc(db, 'users', user.uid), {
        status: status
      });

      // Actualizar también el estado local para mantener sincronización
      setUserData(prev => ({
        ...prev,
        status: status
      }));
    } catch (error) {
      console.error('Error al actualizar status:', error);
      setErrorMessage('Error al actualizar status');
      setShowErrorModal(true);
    }
  };

  // ============================================
  // RENDERIZADO
  // ============================================

  
  // Pantalla de carga mostrada mientras se obtienen los datos del perfil
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        {/* Header con botón de regreso */}
        <HeaderScreen
          title="Perfil"
          leftIcon={<Ionicons name="arrow-back" size={24} color="black" />}
          onLeftPress={() => navigation.goBack()}
        />
        {/* Indicador de carga centrado */}
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={{ marginTop: 16, color: COLORS.textGray }}>Cargando perfil...</Text>
        </View>
        {/* Footer con navegación */}
        <MenuFooter />
      </SafeAreaView>
    );
  }

  // Pantalla principal con información del perfil
  return (
    <SafeAreaView style={styles.container}>
      {/* Header con botones de regreso y notificaciones */}
      <HeaderScreen
        title="Perfil"
        rightIcon={<Ionicons name="notifications-outline" size={24} color="black" />}
        onRightPress={() => setNotificationsVisible(true)}
        leftIcon={<Ionicons name="arrow-back" size={24} color="black" />}
        onLeftPress={() => navigation.goBack()}
      />

      <ScrollView>
        {/* ============================================ */}
        {/* TARJETA DE PERFIL */}
        {/* ============================================ */}
        
        <View style={styles.profileCard}>
          {/* Header con avatar, nombre y botón de editar */}
          <View style={styles.cardHeader}>
            {/* Avatar del usuario o icono placeholder */}
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

            {/* Nombre y puesto del usuario */}
            <View style={styles.nameAndRole}>
              <Text style={styles.cardName}>{userData?.name || 'Sin nombre'}</Text>
              <Text style={styles.cardRole}>{userData?.position || 'Usuario'}</Text>
            </View>

            {/* Botón de editar perfil */}
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

          {/* Badge de rol del usuario */}
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Ionicons name="shield-checkmark-outline" size={16} color={COLORS.textBlack} />
              <Text style={styles.badgeText}>{userData?.role || 'user'}</Text>
            </View>
            <View style={[styles.badge, { 
              backgroundColor: userData?.status === 'Disponible' ? COLORS.secondary : 
                              userData?.status === 'Ocupado' ? COLORS.statusPending : 
                              userData?.status === 'No disponible' ? COLORS.statusRejected : COLORS.secondary 
            }]}>
              <Ionicons 
                name={userData?.status === 'Disponible' ? 'checkmark-circle-outline' : 
                      userData?.status === 'Ocupado' ? 'time-outline' : 
                      userData?.status === 'No disponible' ? 'close-circle-outline' : 'help-circle-outline'} 
                size={16} 
                color={userData?.status === 'Disponible' ? COLORS.textBlack : 
                       userData?.status === 'Ocupado' ? '#F57C00' : 
                       userData?.status === 'No disponible' ? COLORS.textRed : COLORS.textBlack} 
              />
              <Text style={[styles.badgeText, {
                color: userData?.status === 'Disponible' ? COLORS.textBlack : 
                       userData?.status === 'Ocupado' ? '#F57C00' : 
                       userData?.status === 'No disponible' ? COLORS.textRed : COLORS.textBlack
              }]}>
                {userData?.status || 'Sin estado'}
              </Text>
            </View>
          </View>

          {/* Información de contacto */}
          <View style={styles.infoBox}>
            <Ionicons name="mail-outline" size={20} color={COLORS.textGray} />
            <Text style={styles.infoText}>{userData?.email || 'Sin email'}</Text>
          </View>

          <View style={styles.infoBox}>
            <Ionicons name="call-outline" size={20} color={COLORS.textGray} />
            <Text style={styles.infoText}>{userData?.phone || 'Sin teléfono'}</Text>
          </View>

          {/* Experiencia del usuario */}
          <View style={styles.infoBox}>
            <Ionicons name="medal-outline" size={20} color={COLORS.textGray} />
            <Text style={styles.infoText}>{`Experiencia: ${userData?.experience || 'Sin experiencia'}`}</Text>
          </View>

          {/* Sección de horarios laborales */}
          <View style={{ marginTop: 16 }}>
            <Text style={[styles.sectionTitle, { marginBottom: 12, fontSize: 14, color: COLORS.textGray }]}>
              Horarios Laborales
            </Text>

            {/* Días de trabajo disponibles */}
            <View style={styles.infoBox}>
              <Ionicons name="calendar-outline" size={20} color={COLORS.textGray} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.infoText, { fontSize: 12, color: COLORS.textGray }]}>Días de trabajo</Text>
                <Text style={styles.infoText}>{userData?.availableDays || 'N/A'}</Text>
              </View>
            </View>

            {/* Horario de entrada y salida */}
            <View style={styles.infoBox}>
              <Ionicons name="time-outline" size={20} color={COLORS.textGray} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.infoText, { fontSize: 12, color: COLORS.textGray }]}>Horario</Text>
                <Text style={styles.infoText}>
                  {userData?.startTime && userData?.endTime && userData.startTime !== 'N/A' && userData.endTime !== 'N/A'
                    ? `${userData.startTime} - ${userData.endTime}`
                    : 'N/A'}
                </Text>
              </View>
            </View>

            {/* Hora de comida */}
            <View style={styles.infoBox}>
              <Ionicons name="restaurant-outline" size={20} color={COLORS.textGray} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.infoText, { fontSize: 12, color: COLORS.textGray }]}>Hora de comida</Text>
                <Text style={styles.infoText}>{userData?.mealTime || 'N/A'}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ============================================ */}
        {/* SECCIÓN DE PREFERENCIAS */}
        {/* ============================================ */}
        
        <View style={styles.preferencesSection}>
          <Text style={styles.sectionTitle}>Preferencias</Text>

          {/* Toggle de notificaciones */}
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

            {/* Switch para activar/desactivar notificaciones */}
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

          {/* Selector de región */}
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
          
          {/* Selector de status */}
          <Pressable
            style={({ pressed }) => [
              styles.preferenceItem,
              pressed && { opacity: 0.7 }
            ]}
            onPress={() => setIsStatusModalVisible(true)}
          >
            <View style={styles.preferenceLeft}>
              <Ionicons 
                name={selectedStatus === 'Disponible' ? 'checkmark-circle-outline' : 'time-outline'} 
                size={24} 
                color={COLORS.primary} 
              />
              <View style={styles.preferenceTextContainer}>
                <Text style={styles.preferenceTitle}>Modificar status</Text>
                <Text style={styles.preferenceSubtitle}>
                  {selectedStatus || 'Disponible'}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color={COLORS.textGray} />
          </Pressable>

          {/* Modal para seleccionar región */}
          <Modal
            visible={isRegionModalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setIsRegionModalVisible(false)}
          >
            {/* Fondo semi-transparente que cierra el modal */}
            <Pressable
              style={styles.modalOverlay}
              onPress={() => setIsRegionModalVisible(false)}
            >
              {/* Contenedor del modal */}
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Seleccionar región</Text>

                {/* Lista de regiones disponibles */}
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
                    {/* Checkmark para región seleccionada */}
                    {selectedRegion.code === region.code && (
                      <Ionicons name="checkmark" size={24} color={COLORS.primary} />
                    )}
                  </Pressable>
                ))}
              </View>
            </Pressable>
          </Modal>
          
          {/* Modal para seleccionar status */}
          <Modal
            visible={isStatusModalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setIsStatusModalVisible(false)}
          >
            {/* Fondo semi-transparente que cierra el modal */}
            <Pressable
              style={styles.modalOverlay}
              onPress={() => setIsStatusModalVisible(false)}
            >
              {/* Contenedor del modal */}
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Seleccionar status</Text>

                {/* Lista de status disponibles */}
                {statusOptions.map((status) => (
                  <Pressable
                    key={status}
                    style={({ pressed }) => [
                      styles.regionOption,
                      selectedStatus === status && styles.regionOptionSelected,
                      pressed && { opacity: 0.7 }
                    ]}
                    onPress={() => handleStatusSelect(status)}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                      <Ionicons 
                        name={status === 'Disponible' ? 'checkmark-circle-outline' : 'time-outline'} 
                        size={20} 
                        color={selectedStatus === status ? COLORS.primary : COLORS.textGray} 
                      />
                      <Text style={[
                        styles.regionOptionText,
                        selectedStatus === status && styles.regionOptionTextSelected
                      ]}>
                        {status}
                      </Text>
                    </View>
                    {/* Checkmark para status seleccionado */}
                    {selectedStatus === status && (
                      <Ionicons name="checkmark" size={24} color={COLORS.primary} />
                    )}
                  </Pressable>
                ))}
              </View>
            </Pressable>
          </Modal>
        </View>

        {/* ============================================ */}
        {/* SECCIÓN DE CUENTA */}
        {/* ============================================ */}
        
        <View style={styles.accountSection}>
          <Text style={styles.sectionTitle}>Cuenta</Text>

          {/* Opción para cambiar contraseña */}
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

        {/* Botón de ayuda */}
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

        {/* Botón de cerrar sesión */}
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

      {/* Modal de errores */}
      <InfoModal
        visible={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="Error"
        message={errorMessage}
      />
      
      {/* Modal de notificaciones */}
      <NotificationsModal
        visible={notificationsVisible}
        onClose={() => setNotificationsVisible(false)}
      />

      {/* Footer con navegación */}
      <MenuFooter />
    </SafeAreaView>
  );
}
