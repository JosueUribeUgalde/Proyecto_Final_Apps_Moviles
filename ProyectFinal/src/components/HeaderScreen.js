import { View, Text, Pressable } from "react-native";
import styles from "../styles/components/HeaderScreenStyles";

export default function HeaderScreen({ title, leftIcon, rightIcon, onLeftPress, onRightPress }) {
  return (
    <View>
      <View style={styles.headerRow}>
        {/* Icono izquierdo */}
        {leftIcon && (
          <Pressable 
            onPress={onLeftPress}
            style={({ pressed }) => [
              styles.leftIcon,
              pressed && { opacity: 0.5 }
            ]}
          >
            {leftIcon}
          </Pressable>
        )}
        
        {/* Título siempre centrado */}
        <Text style={styles.title}>{title}</Text>
        
        {/* Icono derecho */}
        {rightIcon && (
          <Pressable 
            onPress={onRightPress}
            style={({ pressed }) => [
              styles.rightIcon,
              pressed && { opacity: 0.5 }
            ]}
          >
            {rightIcon}
          </Pressable>
        )}
      </View>
    </View>
  );
}