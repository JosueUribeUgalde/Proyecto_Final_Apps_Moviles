import { Pressable, Text, View } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import styles from "../styles/components/RazonOptionStyles";

export default function RazonOption({ title, description, iconName, isSelected, onSelect }) {
  return (
    <Pressable 
      onPress={onSelect}
      style={({ pressed }) => [
        styles.container,
        isSelected && styles.containerSelected,
        pressed && { opacity: 0.5 }
      ]}
    >
      {/* Icono */}
      <View style={styles.iconContainer}>
        <Ionicons 
          name={iconName} 
          size={24} 
          color={isSelected ? "#000" : "#666"} 
        />
      </View>
      
      {/* Textos */}
      <View style={styles.textContainer}>
        <Text style={[styles.title, isSelected && styles.titleSelected]}>
          {title}
        </Text>
        <Text style={styles.description}>
          {description}
        </Text>
      </View>
      
      {/* Indicador de selección */}
      {isSelected && (
        <View style={styles.checkContainer}>
          <Ionicons name="checkmark-circle" size={24} color="#178C72" />
        </View>
      )}
    </Pressable>
  );
}
