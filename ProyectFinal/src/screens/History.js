import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../components/styles/HistoryStyles";
import MenuFooter from "../components/MenuFooter";
import { Ionicons } from '@expo/vector-icons';
import HeaderScreen from "../components/HeaderScreen";
import { useNavigation } from '@react-navigation/native';

export default function History() {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <HeaderScreen
        title="Historial"
        leftIcon={<Ionicons name="arrow-back" size={24} color="black" />}
        rightIcon={<Ionicons name="notifications-outline" size={24} color="black" />}
        onLeftPress={() => {navigation.goBack()}}
        //Aqui se va a agregar las notificaciones (funcionalidad futura por ahora no hace nada)
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