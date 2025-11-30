// 1. Paquetes core de React/React Native
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  Image,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform
} from "react-native";

// 2. Bibliotecas de terceros
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";

// 3. Componentes propios
import HeaderScreen from "../../components/HeaderScreen";
import MenuFooter from "../../components/MenuFooter";
import InfoModal from "../../components/InfoModal";

// 4. Constantes y utilidades
import { COLORS } from "../../components/constants/theme";

// 5. Servicios de Firebase
import { getCurrentUser } from "../../services/authService";
import { getUserProfile, updateUserProfile } from "../../services/userService";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "../../config/firebaseConfig";

// 6. Estilos
import profileStyles from "../../styles/screens/user/ProfileStyles";
import styles from "../../styles/screens/user/EditProfileStyles";

export default function EditProfile() {
  // ============================================
  // ESTADOS
  // ============================================
  
  const navigation = useNavigation();

  // Datos del usuario cargados desde Firestore
  const [userData, setUserData] = useState(null);
  
  // Control de carga y guardado
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Estados editables por el usuario
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarChanged, setAvatarChanged] = useState(false);

  // Estados de solo lectura (no editables)
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [position, setPosition] = useState("");
  const [experience, setExperience] = useState("");

  // Control del modal de mensajes (error/éxito)
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  // ============================================
  // EFECTOS
  // ============================================

  /**
   * Cargar datos del usuario al montar el componente
   */
  useEffect(() => {
    loadUserData();
  }, []);

  // ============================================
  // FUNCIONES DE CARGA DE DATOS
  // ============================================

  /**
   * Carga el perfil completo del usuario desde Firestore
   * Inicializa todos los estados con los datos del usuario
   */
  const loadUserData = async () => {
    try {
      const user = getCurrentUser();
      if (!user) {
        setModalTitle("Error");
        setModalMessage("No hay sesión activa");
        setShowModal(true);
        setLoading(false);
        return;
      }

      const userProfile = await getUserProfile(user.uid);

      if (userProfile) {
        setUserData(userProfile);
        setName(userProfile.name || "");
        setPhone(userProfile.phone || "");
        setPosition(userProfile.position || "");
        setExperience(userProfile.experience || "");
        setAvatar(userProfile.avatar || null);
        setEmail(userProfile.email || "");
        setRole(userProfile.role || "user");
      } else {
        setModalTitle("Error");
        setModalMessage("No se encontraron datos del usuario");
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error al cargar datos:", error);
      setModalTitle("Error");
      setModalMessage("Error al cargar datos del perfil");
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // FUNCIONES DE FIREBASE STORAGE
  // ============================================

  /**
   * Sube una imagen al Firebase Storage en la ruta users/{userId}/profile.jpg
   * @param {string} uri - URI local de la imagen seleccionada
   * @param {string} userId - ID del usuario autenticado
   * @returns {Promise<string>} URL de descarga de la imagen subida
   */
  const uploadImageToStorage = async (uri, userId) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();

      const storageRef = ref(storage, `users/${userId}/profile.jpg`);
      await uploadBytes(storageRef, blob);

      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error("Error al subir imagen:", error);
      throw error;
    }
  };

  /**
   * Elimina la foto de perfil anterior del usuario en Firebase Storage
   * @param {string} userId - ID del usuario autenticado
   */
  const deleteOldAvatar = async (userId) => {
    try {
      const storageRef = ref(storage, `users/${userId}/profile.jpg`);
      await deleteObject(storageRef);
    } catch (error) {
      // Si no existe la foto, no pasa nada
      console.log("No había foto anterior o error al eliminar:", error);
    }
  };

  // ============================================
  // HANDLERS DE EVENTOS
  // ============================================

  /**
   * Guarda los cambios del perfil en Firestore
   * Si se cambió el avatar, lo sube a Storage primero
   * Valida que el nombre no esté vacío
   */
  const handleSave = async () => {
    if (!name.trim()) {
      setModalTitle("Error");
      setModalMessage("El nombre no puede estar vacío");
      setShowModal(true);
      return;
    }

    setSaving(true);

    try {
      const user = getCurrentUser();
      if (!user) return;

      let avatarURL = avatar;

      // Si se cambió el avatar, subirlo a Storage
      if (avatarChanged && avatar) {
        // Eliminar foto anterior si existe
        if (userData?.avatar) {
          await deleteOldAvatar(user.uid);
        }

        // Subir nueva foto
        avatarURL = await uploadImageToStorage(avatar, user.uid);
      }

      // Actualizar documento en Firestore usando el servicio
      await updateUserProfile(user.uid, {
        name: name.trim(),
        phone: phone.trim(),
        avatar: avatarURL,
      });

      setModalTitle("Éxito");
      setModalMessage("Perfil actualizado correctamente");
      setShowModal(true);

      // Regresar después de 2 segundos
      setTimeout(() => {
        navigation.goBack();
      }, 2000);
    } catch (error) {
      console.error("Error al guardar:", error);
      setModalTitle("Error");
      setModalMessage("Error al actualizar el perfil: " + error.message);
      setShowModal(true);
    } finally {
      setSaving(false);
    }
  };

  /**
   * Cancela los cambios y regresa a la pantalla de perfil
   */
  const handleRemove = () => {
    navigation.goBack();
  };

  /**
   * Abre la galería de imágenes para seleccionar un nuevo avatar
   * Solicita permisos si es necesario
   * Permite editar la imagen en aspecto 1:1
   */
  const changeAvatar = async () => {
    try {
      // Pedir permisos
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permisos necesarios",
          "Se necesitan permisos para acceder a la galería"
        );
        return;
      }

      // Abrir galería
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setAvatar(result.assets[0].uri);
        setAvatarChanged(true);
      }
    } catch (error) {
      console.error("Error al seleccionar imagen:", error);
      setModalTitle("Error");
      setModalMessage("Error al seleccionar la imagen");
      setShowModal(true);
    }
  };

  // ============================================
  // RENDERIZADO
  // ============================================

  // Pantalla de carga mientras se obtienen los datos del usuario
  if (loading) {
    return (
      <SafeAreaView edges={["top", "bottom"]} style={profileStyles.container}>
        {/* Header con botón de regreso */}
        <HeaderScreen
          title="Editar perfil"
          leftIcon={<Ionicons name="arrow-back" size={24} color="black" />}
          onLeftPress={() => navigation.goBack()}
        />
        {/* Indicador de carga centrado */}
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={{ marginTop: 16, color: COLORS.textGray }}>
            Cargando datos...
          </Text>
        </View>
        <MenuFooter />
      </SafeAreaView>
    );
  }

  // Pantalla principal de edición de perfil
  return (
    <SafeAreaView edges={["top", "bottom"]} style={profileStyles.container}>
      {/* Header con botón de regreso */}
      <HeaderScreen
        title="Editar perfil"
        leftIcon={<Ionicons name="arrow-back" size={24} color="black" />}
        onLeftPress={() => navigation.goBack()}
      />

      {/* KeyboardAvoidingView para evitar que el teclado tape los inputs */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* ============================================ */}
          {/* SECCIÓN DE AVATAR */}
          {/* ============================================ */}
          <View style={profileStyles.profileCard}>
            {/* Header con avatar y nombre */}
            <View style={profileStyles.cardHeader}>
              {/* Avatar del usuario o icono placeholder */}
              {avatar ? (
                <Image
                  source={{ uri: avatar }}
                  style={profileStyles.avatar}
                />
              ) : (
                <View style={[profileStyles.avatar, { backgroundColor: COLORS.lightGray, justifyContent: 'center', alignItems: 'center' }]}>
                  <Ionicons name="person" size={40} color={COLORS.textGray} />
                </View>
              )}
              {/* Nombre y puesto del usuario */}
              <View style={profileStyles.nameAndRole}>
                <Text style={profileStyles.cardName}>{name || 'Sin nombre'}</Text>
                <Text style={profileStyles.cardRole}>{position || 'Usuario'}</Text>
              </View>
            </View>

            {/* Botón para cambiar imagen de perfil */}
            <Pressable
              onPress={changeAvatar}
              style={({ pressed }) => [
                styles.changeImageBtn,
                pressed && { opacity: 0.5 }
              ]}
            >
              <Ionicons name="create-outline" size={18} color={COLORS.primary} />
              <Text style={styles.changeImageBtnText}>Editar imagen de perfil</Text>
            </Pressable>
          </View>

          {/* ============================================ */}
          {/* SECCIÓN DE INFORMACIÓN PERSONAL */}
          {/* ============================================ */}
          <View style={profileStyles.profileCard}>
            <Text style={profileStyles.sectionTitle}>Información</Text>

            {/* Campo editable: Nombre completo */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre completo</Text>
              <View style={[profileStyles.infoBox, styles.inputBox]}>
                <Ionicons name="person-outline" size={18} color={COLORS.textGray} />
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Nombre"
                  placeholderTextColor={COLORS.textGray}
                  editable={!saving}
                />
              </View>
            </View>

            {/* Campo de solo lectura: Puesto */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Puesto</Text>
              <View style={[profileStyles.infoBox, styles.inputBoxDisabled]}>
                <Ionicons name="briefcase-outline" size={18} color={COLORS.textGray} />
                <TextInput
                  style={styles.inputDisabled}
                  value={position || 'No asignado'}
                  editable={false}
                />
              </View>
            </View>

            {/* Campo de solo lectura: Experiencia */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Experiencia</Text>
              <View style={[profileStyles.infoBox, styles.inputBoxDisabled]}>
                <Ionicons name="ribbon-outline" size={18} color={COLORS.textGray} />
                <TextInput
                  style={styles.inputDisabled}
                  value={experience || 'No especificada'}
                  editable={false}
                />
              </View>
            </View>
          </View>

          {/* ============================================ */}
          {/* SECCIÓN DE CONTACTO */}
          {/* ============================================ */}
          <View style={profileStyles.profileCard}>
            <Text style={profileStyles.sectionTitle}>Contacto</Text>

            {/* Campo de solo lectura: Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Correo electrónico</Text>
              <View style={[profileStyles.infoBox, styles.inputBoxDisabled]}>
                <Ionicons name="mail-outline" size={18} color={COLORS.textGray} />
                <TextInput
                  style={styles.inputDisabled}
                  value={email}
                  editable={false}
                  keyboardType="email-address"
                />
              </View>
            </View>

            {/* Campo editable: Teléfono */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Teléfono</Text>
              <View style={[profileStyles.infoBox, styles.inputBox]}>
                <Ionicons name="call-outline" size={18} color={COLORS.textGray} />
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Teléfono"
                  placeholderTextColor={COLORS.textGray}
                  keyboardType="phone-pad"
                  editable={!saving}
                />
              </View>
            </View>
          </View>

          {/* ============================================ */}
          {/* BOTONES DE ACCIÓN */}
          {/* ============================================ */}
          <View style={styles.actionsRow}>
            {/* Botón para guardar cambios */}
            <Pressable
              style={({ pressed }) => [
                styles.saveBtn,
                pressed && { opacity: 0.8 },
                saving && { opacity: 0.5 }
              ]}
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator size="small" color={COLORS.textGreen} />
              ) : (
                <Ionicons name="save-outline" size={20} color={COLORS.textGreen} />
              )}
              <Text style={styles.saveBtnText}>
                {saving ? 'Guardando...' : 'Guardar cambios'}
              </Text>
            </Pressable>

            {/* Botón para cancelar y regresar */}
            <Pressable
              style={({ pressed }) => [
                styles.removeBtn,
                pressed && { opacity: 0.7 },
                saving && { opacity: 0.5 }
              ]}
              onPress={handleRemove}
              disabled={saving}
            >
              <Ionicons name="close-outline" size={18} color={COLORS.error} />
              <Text style={styles.removeBtnText}>Cancelar</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal para mostrar mensajes de éxito o error */}
      <InfoModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        title={modalTitle}
        message={modalMessage}
      />

      {/* Footer con navegación */}
      <MenuFooter />
    </SafeAreaView>
  );
}
