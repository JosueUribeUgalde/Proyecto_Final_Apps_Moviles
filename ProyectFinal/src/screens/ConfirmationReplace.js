import { useState } from 'react';
import { Text, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { HeaderScreen, Banner, MenuFooter, ButtonLogin } from "../components";
import { COLORS } from '../components/constants/theme';
import styles from "../components/styles/ConfirmationStyles";

export default function ConfirmationReplace({ 
  navigation,
  route 
}) {
  const [showBanner, setShowBanner] = useState(false);
  
  const { 
    empleado = "Juan Pérez",
    fechaInicio = "2024-07-15", 
    fechaFin = "2024-07-17",
    motivo = "Cita médica"
  } = route?.params || {};

  const handleViewCalendar = () => {
    setShowBanner(true);
  };

  const handleBackToDashboard = () => {
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <HeaderScreen
        title="Confirmación de Reemplazo"
        leftIcon={<Ionicons name="arrow-back" size={24} color="black" />}
        onLeftPress={() => navigation.goBack()}
      />
      
      <View style={styles.bannerContainer}>
        <Banner
          message="Funcionalidad de calendario próximamente"
          type="error"
          visible={showBanner}
          onHide={() => setShowBanner(false)}
        />
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark" size={40} color="white" />
          </View>
        </View>

        <Text style={styles.mainTitle}>
          ¡Ausencia reportada con éxito!
        </Text>

        <Text style={styles.subtitle}>
          Tu reemplazo ha sido asignado.
        </Text>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Empleado:</Text>
            <Text style={styles.infoValue}>{empleado}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Fechas:</Text>
            <Text style={styles.infoValue}>{fechaInicio} - {fechaFin}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Motivo:</Text>
            <Text style={styles.infoValue}>{motivo}</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <ButtonLogin
            title="Ver detalles en el calendario"
            onPress={handleViewCalendar}
            backgroundColor={COLORS.primary}
            textColor={COLORS.textWhite}
            showBorder={false}
          />

          <ButtonLogin
            title="Volver al Dashboard"
            onPress={handleBackToDashboard}
            backgroundColor={COLORS.secondary}
            textColor={COLORS.textBlack}
            showBorder={false}
          />
        </View>
      </ScrollView>
      
      <View style={styles.footerContainer}>
        <MenuFooter />
      </View>
    </SafeAreaView>
  );
}