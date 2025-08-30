import { View, TouchableOpacity, Text } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import styles from "./styles/MenuFooterStyles";

export default function MenuFooter() {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button}>
        <Ionicons name="home" size={24} color="gray" />
        <Text style={styles.buttonText}>Home</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button}>
        <Ionicons name="calendar-outline" size={24} color="gray" />
        <Text style={styles.buttonText}>Calendario</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button}>
        <Ionicons name="add-circle" size={32} color="gray" />
        <Text style={styles.buttonText}>Reportar</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button}>
        <Ionicons name="file-tray-full-outline" size={24} color="gray" />
        <Text style={styles.buttonText}>Historial</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button}>
        <Ionicons name="person-outline" size={24} color="gray" />
        <Text style={styles.buttonText}>Perfil</Text>
      </TouchableOpacity>
    </View>
  );
}

