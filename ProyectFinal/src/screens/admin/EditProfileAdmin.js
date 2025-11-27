//Libreria para menejo de estado y componentes de React Native
import React, { useState, useEffect } from "react";
// Libreria de safe area para dispositivos con notch
import { SafeAreaView } from "react-native-safe-area-context";
// Componentes y utilidades de React Native
import { View, Text, TextInput, ScrollView, Pressable, Image, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from "react-native";
// Libreria de iconos de Expo
import { Ionicons } from "@expo/vector-icons";
// Libreria de navegacion de React Native
import { useNavigation } from "@react-navigation/native";
// importacion de estilos de pantalla de perfil
import profileStyles from "../../styles/screens/admin/ProfileAdminStyles";
// importacion de estilos de pantalla de edicion de perfil
import styles from "../../styles/screens/admin/EditProfileAdminStyles";
// Importacion de componente HeaderScreen y MenuFooterAdmin
import HeaderScreen from "../../components/HeaderScreen";
import MenuFooterAdmin from "../../components/MenuFooterAdmin";
import InfoModal from "../../components/InfoModal";
// Importacion de constantes 
import { COLORS } from "../../components/constants/theme";
// Importacion de servicios
import { getCurrentUser } from "../../services/authService";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "../../config/firebaseConfig";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
// Importacion de Image Picker
import * as ImagePicker from "expo-image-picker";

export default function EditProfileAdmin() {
  const navigation = useNavigation();

  // Estados para datos del admin
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Estados editables
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoChanged, setPhotoChanged] = useState(false);

  // Estados de solo lectura (cargados desde Firestore)
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [position, setPosition] = useState("");
  const [experience, setExperience] = useState("");

  // Estados para modal de error/éxito
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  // Cargar datos del admin al montar
  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      const user = getCurrentUser();
      if (!user) {
        setModalTitle("Error");
        setModalMessage("No hay sesión activa");
        setShowModal(true);
        setLoading(false);
        return;
      }

      const adminDoc = await getDoc(doc(db, "admins", user.uid));

      if (adminDoc.exists()) {
        const data = adminDoc.data();
        setAdminData(data);
        setName(data.name || "");
        setPhone(data.phone || "");
        setPosition(data.position || "");
        setExperience(data.experience || "");
        setPhoto(data.photo || null);
        setEmail(data.email || "");
        setRole(data.role || "Admin");
      } else {
        setModalTitle("Error");
        setModalMessage("No se encontraron datos del administrador");
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

  // Funcion para subir imagen a Firebase Storage
  const uploadImageToStorage = async (uri, userId) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      
      const storageRef = ref(storage, `admins/${userId}/profile.jpg`);
      await uploadBytes(storageRef, blob);
      
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error("Error al subir imagen:", error);
      throw error;
    }
  };

  // Funcion para eliminar foto anterior de Storage
  const deleteOldPhoto = async (userId) => {
    try {
      const storageRef = ref(storage, `admins/${userId}/profile.jpg`);
      await deleteObject(storageRef);
    } catch (error) {
      // Si no existe la foto, no pasa nada
      console.log("No había foto anterior o error al eliminar:", error);
    }
  };

  //Funcion para guardar cambios
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

      let photoURL = photo;

      // Si se cambió la foto, subirla a Storage
      if (photoChanged && photo) {
        // Eliminar foto anterior si existe
        if (adminData?.photo) {
          await deleteOldPhoto(user.uid);
        }
        
        // Subir nueva foto
        photoURL = await uploadImageToStorage(photo, user.uid);
      }

      // Actualizar documento en Firestore
      await updateDoc(doc(db, "admins", user.uid), {
        name: name.trim(),
        phone: phone.trim(),
        photo: photoURL,
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

  //Funcion para cancelar cambios y regresar a perfil
  const handleRemove = () => {
    navigation.goBack();
  };

  // Funcion para cambiar foto de perfil
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
        setPhoto(result.assets[0].uri);
        setPhotoChanged(true);
      }
    } catch (error) {
      console.error("Error al seleccionar imagen:", error);
      setModalTitle("Error");
      setModalMessage("Error al seleccionar la imagen");
      setShowModal(true);
    }
  };

  if (loading) {
    return (
      <SafeAreaView edges={["top", "bottom"]} style={profileStyles.container}>
        <HeaderScreen
          title="Editar perfil"
          leftIcon={<Ionicons name="arrow-back" size={24} color="black" />}
          onLeftPress={() => navigation.goBack()}
        />
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={{ marginTop: 16, color: COLORS.textGray }}>
            Cargando datos...
          </Text>
        </View>
        <MenuFooterAdmin />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top","bottom"]} style={profileStyles.container}>
      <HeaderScreen
        title="Editar perfil"
        leftIcon={<Ionicons name="arrow-back" size={24} color="black" />}
        onLeftPress={() => navigation.goBack()}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
        {/* Cabecera de Editar perfil*/}
        <View style={profileStyles.profileCard}>
          <View style={profileStyles.cardHeader}>
            {photo ? (
              <Image source={{ uri: photo }} style={profileStyles.avatar} />
            ) : (
              <View
                style={[
                  profileStyles.avatar,
                  {
                    backgroundColor: COLORS.lightGray,
                    justifyContent: "center",
                    alignItems: "center",
                  },
                ]}
              >
                <Ionicons name="person" size={40} color={COLORS.textGray} />
              </View>
            )}
            <View style={profileStyles.nameAndRole}>
              <Text style={profileStyles.cardName}>{name}</Text>
              <Text style={profileStyles.cardRole}>{role}</Text>
            </View>
          </View>

          <Pressable
            onPress={changeAvatar}
            style={({ pressed }) => [
              styles.changeImageBtn,
              pressed && { opacity: 0.5 },
            ]}
          >
            <Ionicons name="create-outline" size={18} color={COLORS.primary} />
            <Text style={styles.changeImageBtnText}>
              Editar imagen de perfil
            </Text>
          </Pressable>
        </View>

        {/* Segundo card de informacion general */}
        <View style={profileStyles.profileCard}>
          <Text style={profileStyles.sectionTitle}>Información</Text>

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
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Puesto</Text>
            <View style={[profileStyles.infoBox, styles.inputBoxDisabled]}>
              <Ionicons name="briefcase-outline" size={18} color={COLORS.textGray} />
              <TextInput 
                style={styles.inputDisabled} 
                value={position} 
                editable={false}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Experiencia</Text>
            <View style={[profileStyles.infoBox, styles.inputBoxDisabled]}>
              <Ionicons name="ribbon-outline" size={18} color={COLORS.textGray} />
              <TextInput 
                style={styles.inputDisabled} 
                value={experience} 
                editable={false}
              />
            </View>
          </View>
        </View>

        {/* Tercera card de contacto */}
        <View style={profileStyles.profileCard}>
          <Text style={profileStyles.sectionTitle}>Contacto</Text>

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

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Teléfono</Text>
            <View style={[profileStyles.infoBox, styles.inputBox]}>
              <Ionicons name="call-outline" size={18} color={COLORS.textGray} />
              <TextInput 
                style={styles.input} 
                value={phone} 
                onChangeText={setPhone} 
                placeholder="+52 000 000 0000"
                keyboardType="phone-pad"
                placeholderTextColor={COLORS.textGray}
              />
            </View>
          </View>
        </View>

        {/* Guarda y cancela */}
        <View style={styles.actionsRow}>
          <Pressable 
            style={({pressed}) => [
              styles.saveBtn,
              pressed && {opacity: 0.8},
              saving && {opacity: 0.5}
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
              {saving ? "Guardando..." : "Guardar cambios"}
            </Text>
          </Pressable>

          <Pressable 
            style={({pressed}) => [
              styles.removeBtn,
              pressed && {opacity: 0.7}
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

      <InfoModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        title={modalTitle}
        message={modalMessage}
      />

      <MenuFooterAdmin />
    </SafeAreaView>
  );
}
