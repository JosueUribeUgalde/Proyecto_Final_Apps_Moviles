import { Text, TouchableOpacity, View } from "react-native";
import styles from "./styles/ButtonStyle";

export default function ButtonLogin({ 
  title, 
  onPress, 
  icon, 
  backgroundColor, 
  textColor,
  showBorder = true // valor por defecto true para mantener compatibilidad
}) {
  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        backgroundColor && { backgroundColor },
        !showBorder && { borderWidth: 0 } // remueve el borde si showBorder es false
      ]} 
      onPress={onPress}
    >
      <View style={styles.contentRow}>
        {icon && <View style={styles.icon}>{icon}</View>}
        <Text style={[
          styles.buttonText,
          textColor && { color: textColor }
        ]}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
