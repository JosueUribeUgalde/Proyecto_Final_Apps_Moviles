//Libreria para menejo de estado y componentes de React Native
import React, { useState } from "react";
// Libreria de safe area para dispositivos con notch
import { SafeAreaView } from "react-native-safe-area-context";
// Componentes y utilidades de React Native
import { View, Text, TextInput, ScrollView, Pressable, Image } from "react-native";
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
// Importacion de constantes 
import { COLORS } from "../../components/constants/theme";

export default function EditProfileAdmin() {
  const navigation = useNavigation();

  const [name, setName] = useState("Juan Carlos Administrador"); // editable
  const [role] = useState("Administrador General");              // solo lectura
  const [experience] = useState("5 years");                      // solo lectura(pendiente de implemntacion editable  empresa o admin?)
  const [email] = useState("admin@empresa.com");                 // solo lectura
  const [phone, setPhone] = useState("+52 9876543210");          // editable

  //Funcion para guardar cambios(Pendiente de implementar) y regresar
  const handleSave = () => {
    navigation.goBack();
  };

  //Funcion para cancelar cambios y regresar a perfil
  const handleRemove = () => {
    navigation.goBack();
  };

  // Funcion para cambiar foto de perfil (pendiente de implementar)
  const changeAvatar = () => {
    // ....
  };

  return (
    <SafeAreaView edges={["top","bottom"]} style={profileStyles.container}>
      <HeaderScreen
        title="Editar perfil"
        leftIcon={<Ionicons name="arrow-back" size={24} color="black" />}
        onLeftPress={() => navigation.goBack()}
      />

      <ScrollView>
        {/* Cabecera de Editar perfil*/}
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
              <TextInput style={styles.inputDisabled} value={role} editable={false}/>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Experiencia</Text>
            <View style={[profileStyles.infoBox, styles.inputBoxDisabled]}>
              <Ionicons name="ribbon-outline" size={18} color={COLORS.textGray} />
              <TextInput style={styles.inputDisabled} value={experience} editable={false}/>
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

      <MenuFooterAdmin />
    </SafeAreaView>
  );
}
