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
        onPress={() => navigation.navigate('Home')}
      >
        <Ionicons name="grid-outline" size={24} color="gray" />
        <Text style={styles.buttonText}>Dashboard</Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && { opacity: 0.5 }
        ]}
        onPress={() => navigation.navigate('Calendar')}
      >
        <Ionicons name="calendar-outline" size={24} color="gray" />
        <Text style={styles.buttonText}>Calendar</Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && { opacity: 0.5 }
        ]}
        onPress={() => navigation.navigate('Members')}
      >
        <Ionicons name="people-outline" size={24} color="gray" />
        <Text style={styles.buttonText}>Members</Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && { opacity: 0.5 }
        ]}
        onPress={() => navigation.navigate('ListAdmin')}
      >
        <Ionicons name="mail-outline" size={24} color="gray" />
        <Text style={styles.buttonText}>Requests</Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && { opacity: 0.5 }
        ]}
        onPress={() => navigation.navigate('ReportScreen')}
      >
        <Ionicons name="stats-chart-outline" size={24} color="gray" />
        <Text style={styles.buttonText}>Reports</Text>
      </Pressable>
    </View>
  );
}
