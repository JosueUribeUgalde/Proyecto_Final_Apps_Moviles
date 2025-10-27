import { View, Pressable, Text } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import styles from "./styles/MenuFooterStyles";
export default function MenuFooter() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Pressable 
        style={({ pressed }) => [
          styles.button,
          pressed && { opacity: 0.5 }
        ]}
        onPress={() => navigation.navigate('Home')}
      >
        <Ionicons name="home" size={24} color="gray" />
        <Text style={styles.buttonText}>Home</Text>
      </Pressable>
      
      <Pressable 
        style={({ pressed }) => [
          styles.button,
          pressed && { opacity: 0.5 }
        ]}
        onPress={() => navigation.navigate('Calendar')}
      >
        <Ionicons name="calendar-outline" size={24} color="gray" />
        <Text style={styles.buttonText}>Calendario</Text>
      </Pressable>
      
      <Pressable 
        style={({ pressed }) => [
          styles.button,
          pressed && { opacity: 0.5 }
        ]}
        onPress={() => navigation.navigate('AddReport')}
      >
        <Ionicons name="add-circle" size={32} color="gray" />
        <Text style={styles.buttonText}>Añadir</Text>
      </Pressable>
      
      <Pressable 
        style={({ pressed }) => [
          styles.button,
          pressed && { opacity: 0.5 }
        ]}
        onPress={() => navigation.navigate('History')}
      >
        <Ionicons name="file-tray-full-outline" size={24} color="gray" />
        <Text style={styles.buttonText}>Historial</Text>
      </Pressable>
      
      <Pressable 
        style={({ pressed }) => [
          styles.button,
          pressed && { opacity: 0.5 }
        ]}
        onPress={() => navigation.navigate('Profile')}
      >
        <Ionicons name="person-outline" size={24} color="gray" />
        <Text style={styles.buttonText}>Perfil</Text>
      </Pressable>
    </View>
  );
}

