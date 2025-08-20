import {Text, TouchableOpacity } from "react-native";
import styles from "./styles/ButtonStyle";
export default function ButtonLogin({ title, onPress }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}
