import { View, Pressable, Text } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import styles from "../styles/components/MenuFooterCompanyStyles";

export default function MenuFooterCompany() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Pressable 
        style={({ pressed }) => [
          styles.button,
          pressed && { opacity: 0.5 }
        ]}
        onPress={() => navigation.navigate('Dashboard')}
      >
        <Ionicons name="grid-outline" size={24} color="gray" />
        <Text style={styles.buttonText}>Menu</Text>
      </Pressable>
      
      <Pressable 
        style={({ pressed }) => [
          styles.button,
          pressed && { opacity: 0.5 }
        ]}
        onPress={() => navigation.navigate('Miembros')}
      >
        <Ionicons name="people-outline" size={24} color="gray" />
        <Text style={styles.buttonText}>Miembros</Text>
      </Pressable>
      
      <Pressable 
        style={({ pressed }) => [
          styles.button,
          pressed && { opacity: 0.5 }
        ]}
        onPress={() => navigation.navigate('Plan')}
      >
        <Ionicons name="card-outline" size={24} color="gray" />
        <Text style={styles.buttonText}>Planes</Text>
      </Pressable>
      
      <Pressable 
        style={({ pressed }) => [
          styles.button,
          pressed && { opacity: 0.5 }
        ]}
        onPress={() => navigation.navigate('ProfileCompany')}
      >
        <Ionicons name="person-outline" size={24} color="gray" />
        <Text style={styles.buttonText}>Perfil</Text>
      </Pressable>
    </View>
  );
}