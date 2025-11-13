import { Text, Pressable, View } from "react-native";
import styles from "../styles/components/ButtonStyles";

export default function ButtonLogin({ 
  title, 
  onPress, 
  icon, 
  backgroundColor, 
  textColor,
  borderColor,
  showBorder = true
}) {
  return (
    <Pressable 
      style={({ pressed }) => [
        styles.button, 
        backgroundColor && { backgroundColor },
        borderColor && { borderColor },
        !showBorder && { borderWidth: 0 },
        pressed && { opacity: 0.5 } // Efecto de opacidad cuando se presiona
      ]} 
      onPress={onPress}
      android_ripple={{ color: 'rgba(0, 0, 0, 0.1)' }} // Efecto ripple en Android
    >
      <View style={styles.contentRow}>
        {icon && <View style={styles.icon}>{icon}</View>}
        <Text style={[
          styles.buttonText,
          textColor && { color: textColor },
          { fontWeight: '600' }
        ]}>
          {title}
        </Text>
      </View>
    </Pressable>
  );
}
