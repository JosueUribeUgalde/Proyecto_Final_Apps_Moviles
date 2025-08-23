import { TextInput } from "react-native";
import styles from "./styles/InputStyles";
export default function InputLogin({ msj, secureTextEntry }) {
  return (
    <TextInput
      style={styles.input}
      placeholder={msj}
      secureTextEntry={secureTextEntry}
    />
  );
}
