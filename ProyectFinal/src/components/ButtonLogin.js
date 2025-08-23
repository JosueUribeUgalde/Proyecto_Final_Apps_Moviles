import { Text, TouchableOpacity, View } from "react-native";
import styles from "./styles/ButtonStyle";

export default function ButtonLogin({ title, onPress, icon }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <View style={styles.contentRow}>
        {icon && <View style={styles.icon}>{icon}</View>}
        <Text style={styles.buttonText}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}
