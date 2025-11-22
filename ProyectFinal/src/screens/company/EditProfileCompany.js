// Libreria para menejo de estado y componentes de React Native
import React, { useState } from "react";
// Libreria de safe area para dispositivos con notch
import { SafeAreaView } from "react-native-safe-area-context";
// Componentes y utilidades de React Native
import { View, Text, TextInput, ScrollView, Pressable, Image } from "react-native";
// Libreria de iconos de Expo
import { Ionicons } from "@expo/vector-icons";
// Libreria de navegacion de React Native
import { useNavigation } from "@react-navigation/native";
// importacion de estilos de pantalla de perfil (se deja tal cual)
import profileStyles from "../../styles/screens/admin/ProfileAdminStyles";
// importacion de estilos de pantalla de edicion de perfil (mantener)
import styles from "../../styles/screens/admin/EditProfileAdminStyles";
// Importacion de componente HeaderScreen y MenuFooterCompany (se deja tal cual)
import HeaderScreen from "../../components/HeaderScreen";
import MenuFooterCompany from "../../components/MenuFooterCompany";
// Importacion de constantes 
import { COLORS } from "../../components/constants/theme";

export default function EditProfileCompany() {
  const navigation = useNavigation();

  // ================== ESTADO ORIGINAL (no tocar semántica base) ==================
  // Nombre de empresa (reemplaza "nombre" previo) — editable
  const [name, setName] = useState("La casa de la ama");
  const [role] = useState("Empresa");              // solo lectura
  const [experience] = useState("2 años de empresa");              // solo lectura (placeholder)
  const [email] = useState("empresa@correo.com");  // solo lectura (NO editable)
  // Teléfono — editable
  const [phone, setPhone] = useState("+52 5555555555");

  // ================== NUEVOS CAMPOS SOLICITADOS (todos editables) ==================
  const [rfc, setRfc] = useState("VTA010203AB1");
  const [fiscalAddress, setFiscalAddress] = useState("Calle 123, Col. Centro, CP 76000, Qro.");
  const [legalRep, setLegalRep] = useState("Juan Pérez");
  const [proofOfAddress, setProofOfAddress] = useState("Comprobante.pdf");
  const [ine, setIne] = useState("INE_frente_y_reverso.pdf");

  // ================== HANDLERS ORIGINALES (se conservan) ==================
  const handleSave = () => {
    // Aquí guardarías la info (pendiente de implementación real)
    navigation.goBack();
  };

  const handleRemove = () => {
    navigation.goBack();
  };

  const changeAvatar = () => {
    // pendiente de implementación
  };

  return (
    <SafeAreaView edges={["top","bottom"]} style={profileStyles.container}>
      <HeaderScreen
        title="Editar perfil (Empresa)"
        leftIcon={<Ionicons name="arrow-back" size={24} color="black" />}
        onLeftPress={() => navigation.goBack()}
      />

      <ScrollView>

        {/* ======= Cabecera ======= */}
        <View style={profileStyles.profileCard}>
          <View style={profileStyles.cardHeader}>
            <Image source={require("../../../assets/i.png")} style={profileStyles.avatar} />
            <View style={profileStyles.nameAndRole}>
              <Text style={profileStyles.cardName}>{name}</Text>
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

        {/* ======= Información general (empresa / representante) ======= */}
        <View style={profileStyles.profileCard}>
          <Text style={profileStyles.sectionTitle}>Información</Text>

          {/* Nombre de empresa (editable) */}
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

          {/* Nombre del representante (editable) */}
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

          {/* Puesto (solo lectura) */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Puesto</Text>
            <View style={[profileStyles.infoBox, styles.inputBoxDisabled]}>
              <Ionicons name="briefcase-outline" size={18} color={COLORS.textGray} />
              <TextInput style={styles.inputDisabled} value={role} editable={false}/>
            </View>
          </View>

          {/* Experiencia (solo lectura) */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Experiencia</Text>
            <View style={[profileStyles.infoBox, styles.inputBoxDisabled]}>
              <Ionicons name="ribbon-outline" size={18} color={COLORS.textGray} />
              <TextInput style={styles.inputDisabled} value={experience} editable={false}/>
            </View>
          </View>
        </View>

        {/* ======= Contacto ======= */}
        <View style={profileStyles.profileCard}>
          <Text style={profileStyles.sectionTitle}>Contacto</Text>

          {/* Correo (solo lectura, NO editable) */}
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

          {/* Teléfono (editable) */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Teléfono</Text>
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

        {/* ======= Información fiscal ======= */}
        <View style={profileStyles.profileCard}>
          <Text style={profileStyles.sectionTitle}>Información fiscal</Text>

          {/* RFC */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>RFC</Text>
            <View style={[profileStyles.infoBox, styles.inputBox]}>
              <Ionicons name="card-outline" size={18} color={COLORS.textGray} />
              <TextInput 
                style={styles.input} 
                value={rfc} 
                onChangeText={setRfc} 
                placeholder="RFC de la empresa" 
                placeholderTextColor={COLORS.textGray}
                autoCapitalize="characters"
              />
            </View>
          </View>

          {/* Dirección fiscal */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Dirección fiscal</Text>
            <View style={[profileStyles.infoBox, styles.inputBox]}>
              <Ionicons name="location-outline" size={18} color={COLORS.textGray} />
              <TextInput 
                style={styles.input} 
                value={fiscalAddress} 
                onChangeText={setFiscalAddress} 
                placeholder="Calle, número, colonia, CP, ciudad, estado" 
                placeholderTextColor={COLORS.textGray}
                multiline
              />
            </View>
          </View>
        </View>

        {/* ======= Documentos ======= */}
        <View style={profileStyles.profileCard}>
          <Text style={profileStyles.sectionTitle}>Documentos</Text>

          {/* Comprobante de domicilio */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Comprobante de domicilio</Text>
            <View style={[profileStyles.infoBox, styles.inputBox]}>
              <Ionicons name="document-text-outline" size={18} color={COLORS.textGray} />
              <TextInput 
                style={styles.input} 
                value={proofOfAddress} 
                onChangeText={setProofOfAddress} 
                placeholder="Nombre de archivo o enlace" 
                placeholderTextColor={COLORS.textGray}
              />
            </View>
          </View>

          {/* INE */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>INE (frente y reverso)</Text>
            <View style={[profileStyles.infoBox, styles.inputBox]}>
              <Ionicons name="id-card-outline" size={18} color={COLORS.textGray} />
              <TextInput 
                style={styles.input} 
                value={ine} 
                onChangeText={setIne} 
                placeholder="Nombre de archivo o enlace" 
                placeholderTextColor={COLORS.textGray}
              />
            </View>
          </View>
        </View>

        {/* ======= Acciones ======= */}
        <View style={styles.actionsRow}>
          <Pressable 
            style={({pressed}) => [
              styles.saveBtn,
              pressed && {opacity: 0.8}
            ]} 
            onPress={handleSave}
          >
            <Ionicons name="save-outline" size={20} color={COLORS.textGreen} />
            <Text style={styles.saveBtnText}>Guardar cambios</Text>
          </Pressable>

          <Pressable 
            style={({pressed}) => [
              styles.removeBtn,
              pressed && {opacity: 0.7}
            ]} 
            onPress={handleRemove}
          >
            <Ionicons name="trash-outline" size={18} color={COLORS.error} />
            <Text style={styles.removeBtnText}>Cancelar</Text>
          </Pressable>
        </View>
      </ScrollView>

      <MenuFooterCompany />
    </SafeAreaView>
  );
}