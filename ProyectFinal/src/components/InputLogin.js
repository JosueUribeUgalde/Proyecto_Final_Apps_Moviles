import { TextInput } from "react-native";
import styles from "../styles/components/InputStyles";
export default function InputLogin({ msj, secureTextEntry, value, onChangeText, keyboardType, autoCapitalize }) {
  return (
    <TextInput
      style={styles.input}
      placeholder={msj}
      secureTextEntry={secureTextEntry}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
    />
  );
}
