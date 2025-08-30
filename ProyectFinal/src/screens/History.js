import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../components/styles/HistoryStyles";
import MenuFooter from "../components/MenuFooter";
import { Ionicons } from '@expo/vector-icons';
import HeaderScreen from "../components/HeaderScreen";

export default function History() {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <HeaderScreen
        title="Historial"
        leftIcon={<Ionicons name="chevron-back-sharp" size={24} color="black" />}
        rightIcon={<Ionicons name="notifications-outline" size={24} color="black" />}
        onLeftPress={() => { }}
        onRightPress={() => { }}
      />
      
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Título de la actividad</Text>
          <Text style={styles.cardDate}>Fecha: 01/01/2023</Text>
          <Text style={styles.cardDescription}>Motivo: Descripción de la actividad</Text>
        </View>
      </View>

      <View style={styles.footerContainer}>
        <MenuFooter />
      </View>
    </SafeAreaView>
  );
}