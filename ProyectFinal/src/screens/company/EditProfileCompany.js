import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TextInput, ScrollView, Pressable, Image, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import profileStyles from "../../styles/screens/company/ProfileCompanyStyles";
import styles from "../../styles/screens/company/EditProfileCompanyStyles";
import HeaderScreen from "../../components/HeaderScreen";
import MenuFooterCompany from "../../components/MenuFooterCompany";
import InfoModal from "../../components/InfoModal";
import { COLORS } from "../../components/constants/theme";
import { getCurrentUser } from "../../services/authService";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "../../config/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";

export default function EditProfileCompany() {
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Campos editables
  const [name, setName] = useState("");
  const [legalRep, setLegalRep] = useState("");
  const [phone, setPhone] = useState("");
  const [rfc, setRfc] = useState("");
  const [fiscalAddress, setFiscalAddress] = useState("");
  const [logo, setLogo] = useState(null);

  // Campos de solo lectura
  const [role] = useState("Empresa");
  const [experience, setExperience] = useState("");
  const [email, setEmail] = useState("");

  // Estados de documentos (solo se muestran)
  const [proofOfAddressStatus, setProofOfAddressStatus] = useState("Pendiente");
  const [ineStatus, setIneStatus] = useState("Pendiente");

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    loadCompanyData();
  }, []);

  const loadCompanyData = async () => {
    try {
      const user = getCurrentUser();
      if (!user) {
        setModalTitle("Error");
        setModalMessage("No hay sesion activa");
        setShowModal(true);
        setLoading(false);
        return;
      }

      const companySnap = await getDoc(doc(db, "companies", user.uid));
      if (!companySnap.exists()) {
        setModalTitle("Error");
        setModalMessage("No se encontro el perfil de la empresa");
        setShowModal(true);
        setLoading(false);
        return;
      }

      const data = companySnap.data();
      setName(data.companyName || "");
      setLegalRep(data.ownerName || "");
      setPhone(data.phone || "");
      setRfc(data.rfc || "");
      setFiscalAddress(data.address || "");
      setEmail(data.email || "");
      setLogo(data.logo || null);
      setExperience(data.plan?.type ? `Plan ${data.plan.type}` : "Perfil empresarial");

      const proofDoc = data.documents?.proofOfAddress;
      const hasProof =
        (typeof proofDoc === "string" && proofDoc) ||
        proofDoc?.front ||
        proofDoc?.back;
      const hasIne = data.documents?.officialId?.front || data.documents?.officialId?.back;
      setProofOfAddressStatus(hasProof ? "Activo" : "Pendiente");
      setIneStatus(hasIne ? "Activo" : "Pendiente");
    } catch (error) {
      console.error("Error al cargar perfil de empresa:", error);
      setModalTitle("Error");
      setModalMessage("Error al cargar el perfil");
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setModalTitle("Dato faltante");
      setModalMessage("El nombre de la empresa no puede estar vacio.");
      setShowModal(true);
      return;
    }
    if (proofOfAddressStatus !== "Activo") {
      setModalTitle("Documentos requeridos");
      setModalMessage("Sube el comprobante de domicilio para guardar cambios.");
      setShowModal(true);
      return;
    }

    setSaving(true);

    try {
      const user = getCurrentUser();
      if (!user) {
        setModalTitle("Error");
        setModalMessage("No hay sesion activa");
        setShowModal(true);
        return;
      }

      await updateDoc(doc(db, "companies", user.uid), {
        companyName: name.trim(),
        ownerName: legalRep.trim(),
        phone: phone.trim(),
        rfc: rfc.trim(),
        address: fiscalAddress.trim(),
      });

      setModalTitle("Exito");
      setModalMessage("Cambios guardados correctamente.");
      setShowModal(true);
      setTimeout(() => navigation.goBack(), 1500);
    } catch (error) {
      console.error("Error al guardar perfil de empresa:", error);
      setModalTitle("Error");
      setModalMessage("No se pudieron guardar los cambios.");
      setShowModal(true);
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = () => {
    navigation.goBack();
  };

  const uploadLogoToStorage = async (uri, userId) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, `companies/${userId}/logo.jpg`);
    await uploadBytes(storageRef, blob);
    return await getDownloadURL(storageRef);
  };

  const changeAvatar = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        setModalTitle("Permiso requerido");
        setModalMessage("Habilita acceso a fotos para cambiar el logo.");
        setShowModal(true);
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled) return;

      const user = getCurrentUser();
      if (!user) {
        setModalTitle("Sesión");
        setModalMessage("No hay sesión activa");
        setShowModal(true);
        return;
      }

      setSaving(true);
      const downloadUrl = await uploadLogoToStorage(result.assets[0].uri, user.uid);
      await updateDoc(doc(db, "companies", user.uid), { logo: downloadUrl });
      setLogo(downloadUrl);
      setModalTitle("Logo actualizado");
      setModalMessage("Tu imagen de perfil se actualizó correctamente.");
      setShowModal(true);
    } catch (error) {
      console.error("Error al cambiar logo:", error);
      setModalTitle("Error");
      setModalMessage("No se pudo actualizar el logo.");
      setShowModal(true);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView edges={["top","bottom"]} style={profileStyles.container}>
        <HeaderScreen
          title="Editar perfil (Empresa)"
          leftIcon={<Ionicons name="arrow-back" size={24} color="black" />}
          onLeftPress={() => navigation.goBack()}
        />
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={{ marginTop: 16, color: COLORS.textGray }}>Cargando datos...</Text>
        </View>
        <MenuFooterCompany />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top","bottom"]} style={profileStyles.container}>
      <HeaderScreen
        title="Editar perfil (Empresa)"
        leftIcon={<Ionicons name="arrow-back" size={24} color="black" />}
        onLeftPress={() => navigation.goBack()}
      />

      <ScrollView>

        <View style={profileStyles.profileCard}>
          <View style={profileStyles.cardHeader}>
            {logo ? (
              <Image source={{ uri: logo }} style={profileStyles.avatar} />
            ) : (
              <View
                style={[
                  profileStyles.avatar,
                  { backgroundColor: COLORS.lightGray, justifyContent: "center", alignItems: "center" }
                ]}
              >
                <Ionicons name="business" size={32} color={COLORS.textGray} />
              </View>
            )}
            <View style={profileStyles.nameAndRole}>
              <Text style={profileStyles.cardName}>{name || "Empresa"}</Text>
              <Text style={profileStyles.cardRole}>{role}</Text>
            </View>
          </View>

          <Pressable 
            onPress={changeAvatar} 
            style={({pressed}) => [
              styles.changeImageBtn,
              pressed && {opacity: 0.5}
            ]}
          >
            <Ionicons name="create-outline" size={18} color={COLORS.primary} />
            <Text style={styles.changeImageBtnText}>Editar imagen de perfil</Text>
          </Pressable>
        </View>

        <View style={profileStyles.profileCard}>
          <Text style={profileStyles.sectionTitle}>Informacion</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre de empresa</Text>
            <View style={[profileStyles.infoBox, styles.inputBox]}>
              <Ionicons name="business-outline" size={18} color={COLORS.textGray} />
              <TextInput 
                style={styles.input} 
                value={name} 
                onChangeText={setName} 
                placeholder="Empresa S.A. de C.V." 
                placeholderTextColor={COLORS.textGray}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre del representante</Text>
            <View style={[profileStyles.infoBox, styles.inputBox]}>
              <Ionicons name="person-outline" size={18} color={COLORS.textGray} />
              <TextInput 
                style={styles.input} 
                value={legalRep} 
                onChangeText={setLegalRep} 
                placeholder="Nombre del representante legal" 
                placeholderTextColor={COLORS.textGray}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Puesto</Text>
            <View style={[profileStyles.infoBox, styles.inputBoxDisabled]}>
              <Ionicons name="briefcase-outline" size={18} color={COLORS.textGray} />
              <TextInput style={styles.inputDisabled} value={role} editable={false}/>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Plan activo</Text>
            <View style={[profileStyles.infoBox, styles.inputBoxDisabled]}>
              <Ionicons name="ribbon-outline" size={18} color={COLORS.textGray} />
              <TextInput style={styles.inputDisabled} value={experience} editable={false}/>
            </View>
          </View>
        </View>

        <View style={profileStyles.profileCard}>
          <Text style={profileStyles.sectionTitle}>Contacto</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Correo electronico</Text>
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
            <Text style={styles.label}>Telefono</Text>
            <View style={[profileStyles.infoBox, styles.inputBox]}>
              <Ionicons name="call-outline" size={18} color={COLORS.textGray} />
              <TextInput 
                style={styles.input} 
                value={phone} 
                onChangeText={setPhone} 
                placeholder="+52 ..." 
                placeholderTextColor={COLORS.textGray}
                keyboardType="phone-pad"
              />
            </View>
          </View>
        </View>

        <View style={profileStyles.profileCard}>
          <Text style={profileStyles.sectionTitle}>Informacion fiscal</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>RFC</Text>
            <View style={[profileStyles.infoBox, styles.inputBox]}>
              <Ionicons name="card-outline" size={18} color={COLORS.textGray} />
              <TextInput 
                style={styles.input} 
                value={rfc} 
                onChangeText={(text) => setRfc(text.toUpperCase())} 
                placeholder="RFC de la empresa" 
                placeholderTextColor={COLORS.textGray}
                autoCapitalize="characters"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Direccion fiscal</Text>
            <View style={[profileStyles.infoBox, styles.inputBox]}>
              <Ionicons name="location-outline" size={18} color={COLORS.textGray} />
              <TextInput 
                style={styles.input} 
                value={fiscalAddress} 
                onChangeText={setFiscalAddress} 
                placeholder="Calle, numero, colonia, CP, ciudad, estado" 
                placeholderTextColor={COLORS.textGray}
                multiline
              />
            </View>
          </View>
        </View>

        <View style={profileStyles.profileCard}>
          <Text style={profileStyles.sectionTitle}>Documentos</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Comprobante de domicilio</Text>
            <View style={[profileStyles.infoBox, styles.docStatusBox]}>
              <Ionicons name="document-text-outline" size={18} color={COLORS.textGray} />
              <Text style={styles.docStatusText}>
                {proofOfAddressStatus === "Activo" ? "Documentos cargados" : "Aun sin cargar"}
              </Text>
              <View style={[
                styles.statusPill,
                proofOfAddressStatus === "Activo" ? styles.statusPillActive : styles.statusPillPending
              ]}>
                <Text style={[
                  styles.statusPillText,
                  proofOfAddressStatus === "Activo" ? styles.statusPillTextActive : styles.statusPillTextPending
                ]}>
                  {proofOfAddressStatus}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>INE (frente y reverso)</Text>
            <View style={[profileStyles.infoBox, styles.docStatusBox]}>
              <Ionicons name="id-card-outline" size={18} color={COLORS.textGray} />
              <Text style={styles.docStatusText}>
                {ineStatus === "Activo" ? "Documentos cargados" : "Aun sin cargar"}
              </Text>
              <View style={[
                styles.statusPill,
                ineStatus === "Activo" ? styles.statusPillActive : styles.statusPillPending
              ]}>
                <Text style={[
                  styles.statusPillText,
                  ineStatus === "Activo" ? styles.statusPillTextActive : styles.statusPillTextPending
                ]}>
                  {ineStatus}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.actionsRow}>
          <Pressable 
            style={({pressed}) => [
              styles.saveBtn,
              pressed && {opacity: 0.8},
              saving && {opacity: 0.6}
            ]} 
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator size="small" color={COLORS.textGreen} />
            ) : (
              <Ionicons name="save-outline" size={20} color={COLORS.textGreen} />
            )}
            <Text style={styles.saveBtnText}>{saving ? "Guardando..." : "Guardar cambios"}</Text>
          </Pressable>

          <Pressable 
            style={({pressed}) => [
              styles.removeBtn,
              pressed && {opacity: 0.7}
            ]} 
            onPress={handleRemove}
            disabled={saving}
          >
            <Ionicons name="trash-outline" size={18} color={COLORS.error} />
            <Text style={styles.removeBtnText}>Cancelar</Text>
          </Pressable>
        </View>
      </ScrollView>

      <InfoModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        title={modalTitle}
        message={modalMessage}
      />

      <MenuFooterCompany />
    </SafeAreaView>
  );
}
