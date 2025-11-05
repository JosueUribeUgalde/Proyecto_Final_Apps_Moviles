// src/screens/EditProfile.js
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Entypo from '@expo/vector-icons/Entypo';

// Reutiliza estilos base del perfil (misma UI)
import profileStyles from "../../styles/screens/user/ProfileStyles";
// Estilos mínimos específicos para Edit
import styles from "../../styles/screens/user/EditProfileStyles";

import HeaderScreen from "../../components/HeaderScreen";
import MenuFooter from "../../components/MenuFooter";
import { COLORS } from "../../components/constants/theme";

const STATUS_OPTIONS = ["Disponible", "Indisponible", "Ocupado"];
const SHIFT_OPTIONS = ["Turnos Matutino", "Turnos nocturnos", "Turnos mixtos"];

export default function EditProfile() {
  const navigation = useNavigation();

  const [name, setName] = useState("Damian Elias Nietopa"); // editable
  const [role] = useState("Workforce Manager");           // solo lectura
  const [experience] = useState("3 years");               // solo lectura
  const [status, setStatus] = useState("Available");      // seleccionable
  const [preferredShifts, setPreferredShifts] = useState("Day shifts"); // seleccionable
  const [maxHours, setMaxHours] = useState("48");         // editable
  const [email] = useState("ElMmaian@gmail.com");            // solo lectura
  const [phone, setPhone] = useState("+52 1234567890");   // editable

  const [showStatusPicker, setShowStatusPicker] = useState(false);
  const [showShiftsPicker, setShowShiftsPicker] = useState(false);

  const handleSave = () => {
    navigation.goBack();
  };

  const handleRemove = () => {
    navigation.goBack();
  };

  const changeAvatar = () => {
};

  return (
    <SafeAreaView edges={["top","bottom"]} style={profileStyles.container}>
      <HeaderScreen
        title="Editar perfil"
        leftIcon={<Ionicons name="arrow-back" size={24} color="black" />}
        onLeftPress={() => navigation.goBack()}
      />

      <ScrollView>
        {/* Parte de perfil*/}
        <View style={profileStyles.profileCard}>
          <View style={profileStyles.cardHeader}>
            <Image source={require("../../../assets/i.png")} style={profileStyles.avatar} />
            <View style={profileStyles.nameAndRole}>
              <Text style={profileStyles.cardName}>{name}</Text>
              <Text style={profileStyles.cardRole}>{role}</Text>
            </View>
            <TouchableOpacity onPress={changeAvatar} style={profileStyles.editBtn}>
              <Ionicons name="swap-horizontal" size={18} color={COLORS.textBlack} />
              <Text style={profileStyles.editBtnText}>Cambiar imagen</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Informacion de perfil */}
        <View style={profileStyles.profileCard}>
          <Text style={profileStyles.sectionTitle}>Información</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre completo</Text>
            <View style={[profileStyles.infoBox, styles.inputBox]}>
              <Ionicons name="person-outline" size={18} color={COLORS.textGray} />
              <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Nombre" placeholderTextColor={COLORS.textGray}/>
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

        {/* Disponibilidad */}
        <View style={profileStyles.profileCard}>
          <Text style={profileStyles.sectionTitle}>Disponibilidad de turno</Text>

          <TouchableOpacity style={[profileStyles.infoBox, styles.rowNav]} onPress={() => setShowStatusPicker(true)} activeOpacity={0.50}>
            <View style={styles.rowLeft}>
              <Ionicons name="pulse-outline" size={18} color={COLORS.textGray} />
              <View style={styles.rowTextWrap}>
                <Text style={styles.rowTitle}>Estado</Text>
                <Text style={styles.rowSubtitle}>{status}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textGray} />
          </TouchableOpacity>

          <TouchableOpacity style={[profileStyles.infoBox, styles.rowNav]} onPress={() => setShowShiftsPicker(true)} activeOpacity={0.85}>
            <View style={styles.rowLeft}>
              <Ionicons name="sunny-outline" size={18} color={COLORS.textGray} />
              <View style={styles.rowTextWrap}>
                <Text style={styles.rowTitle}>Turnos preferidos</Text>
                <Text style={styles.rowSubtitle}>{preferredShifts}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textGray} />
          </TouchableOpacity>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Horas máximas por semana</Text>
            <View style={[profileStyles.infoBox, styles.inputBox]}>
              <Ionicons name="time-outline" size={18} color={COLORS.textGray} />
              <TextInput style={styles.input} value={maxHours} onChangeText={setMaxHours} keyboardType="number-pad" placeholder="0" placeholderTextColor={COLORS.textGray}/>
            </View>
          </View>
        </View>

        {/* Contacto */}
        <View style={profileStyles.profileCard}>
          <Text style={profileStyles.sectionTitle}>Contacto</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Correo electrónico</Text>
            <View style={[profileStyles.infoBox, styles.inputBoxDisabled]}>
              <Ionicons name="mail-outline" size={18} color={COLORS.textGray} />
              <TextInput style={styles.inputDisabled} value={email} editable={false} keyboardType="email-address"/>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Teléfono</Text>
            <View style={[profileStyles.infoBox, styles.inputBox]}>
              <Ionicons name="call-outline" size={18} color={COLORS.textGray} />
              <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholderTextColor={COLORS.textGray}/>
            </View>
          </View>
        </View>

        {/* Estado de trabajo */}
        <View style={profileStyles.profileCard}>
          <Text style={profileStyles.sectionTitle}>Carga de trabajo</Text>

          <View style={styles.chipsRow}>
            <View style={styles.chip}>
              <Ionicons name="calendar-outline" size={14} color={COLORS.textBlack} />
              <Text style={styles.chipText}>Programado: 4 turnos</Text>
            </View>
            <View style={styles.chip}>
              <Ionicons name="hourglass-outline" size={14} color={COLORS.textBlack} />
              <Text style={styles.chipText}>Esta semana: 32 h</Text>
            </View>
          </View>
        </View>

        {/* Guarda y cancela */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.9}>
            <Entypo name="save" size={20} color={COLORS.textWhite} />
            <Text style={styles.saveBtnText}>Guardar cambios</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.removeBtn} onPress={handleRemove} activeOpacity={0.9}>
            <Ionicons name="trash-outline" size={18} color={COLORS.error} />
            <Text style={styles.removeBtnText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <MenuFooter />

      {/* Estado de disponibilidad  */}
      <Modal visible={showStatusPicker} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Selecciona estado</Text>
            {STATUS_OPTIONS.map(opt => (
              <TouchableOpacity key={opt} style={styles.modalOption} onPress={() => { setStatus(opt); setShowStatusPicker(false); }} activeOpacity={0.9}>
                <Text style={styles.modalOptionText}>{opt}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.modalClose} onPress={() => setShowStatusPicker(false)}>
              <Text style={styles.modalCloseText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Turnos lista */}
      <Modal visible={showShiftsPicker} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Turnos preferidos</Text>
            {SHIFT_OPTIONS.map(opt => (
              <TouchableOpacity key={opt} style={styles.modalOption} onPress={() => { setPreferredShifts(opt); setShowShiftsPicker(false); }} activeOpacity={0.9}>
                <Text style={styles.modalOptionText}>{opt}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.modalClose} onPress={() => setShowShiftsPicker(false)}>
              <Text style={styles.modalCloseText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
