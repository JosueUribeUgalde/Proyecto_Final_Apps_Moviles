import { View, Pressable, Text } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import styles from "../styles/components/MenuFooterStyles";

export default function MenuFooterAdmin() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && { opacity: 0.5 }
        ]}
        onPress={() => navigation.navigate('DashboardAdmin')}
      >
        <Ionicons name="grid-outline" size={24} color="gray" />
        <Text style={styles.buttonText}>Dashboard</Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && { opacity: 0.5 }
        ]}
        onPress={() => navigation.navigate('CalendarAdmin')}
      >
        <Ionicons name="calendar-outline" size={24} color="gray" />
        <Text style={styles.buttonText}>Calendario</Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && { opacity: 0.5 }
        ]}
        onPress={() => navigation.navigate('Members')}
      >
        <Ionicons name="people-outline" size={24} color="gray" />
        <Text style={styles.buttonText}>Miembros</Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && { opacity: 0.5 }
        ]}
        onPress={() => navigation.navigate('RequestScreen')}
      >
        <Ionicons name="mail-outline" size={24} color="gray" />
        <Text style={styles.buttonText}>Peticiones</Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && { opacity: 0.5 }
        ]}
        onPress={() => navigation.navigate('ProfileAdmin')}
      >
        <Ionicons name="person-outline" size={24} color="gray" />
        <Text style={styles.buttonText}>Perfil</Text>
      </Pressable>
    </View>
  );
}
