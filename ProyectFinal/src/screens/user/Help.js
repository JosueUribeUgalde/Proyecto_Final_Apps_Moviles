import React, { useState } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HeaderScreen from "../../components/HeaderScreen";
import styles from '../../styles/screens/user/HelpStyles';
import { COLORS } from '../../components/constants/theme';

const FAQ_DATA = [
  {
    title: "¿Cómo cambiar mi contraseña?",
    content: "Ve a Perfil > Cuenta > Cambiar contraseña. Sigue las instrucciones para actualizar tus credenciales de forma segura."
  },
  {
    title: "¿Cómo actualizar mi información personal?",
    content: "En la pantalla de Perfil, toca el botón 'Editar' junto a tu nombre. Ahí podrás modificar tus datos personales."
  },
  {
    title: "¿Cómo configurar las notificaciones?",
    content: "Dirígete a Perfil > Preferencias > Notificaciones. Usa el interruptor para activar o desactivar las notificaciones."
  },
  {
    title: "¿Cómo cambiar la región y zona horaria?",
    content: "En Perfil > Preferencias > Región y hora, selecciona tu ubicación preferida para ajustar la configuración regional."
  },
];

export default function Help({ navigation }) {
  const [expandedItem, setExpandedItem] = useState(null);

  const handleContactSupport = () => {
    Linking.openURL('mailto:soporte@tuempresa.com');
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderScreen
        title="Ayuda"
        leftIcon={<Ionicons name="arrow-back" size={24} color="black" />}
        onLeftPress={() => navigation.goBack()}
      />

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.title}>Preguntas frecuentes</Text>
          
          {FAQ_DATA.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.helpCard}
              onPress={() => setExpandedItem(expandedItem === index ? null : index)}
            >
              <View style={styles.helpHeader}>
                <Text style={styles.helpTitle}>{item.title}</Text>
                <Ionicons
                  name={expandedItem === index ? "chevron-up" : "chevron-down"}
                  size={24}
                  color={COLORS.textGray}
                />
              </View>
              {expandedItem === index && (
                <Text style={styles.helpContent}>{item.content}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>¿Necesitas más ayuda?</Text>
          <Text style={styles.contactText}>
            Nuestro equipo de soporte está disponible para ayudarte
            con cualquier duda o problema que tengas.
          </Text>
          <TouchableOpacity
            style={styles.contactButton}
            onPress={handleContactSupport}
          >
            <Ionicons name="mail-outline" size={20} color={COLORS.textWhite} />
            <Text style={styles.contactButtonText}>Contactar soporte</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}