import styles from "../components/styles/LoginStyles";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ButtonLogin from "../components/ButtonLogin";

export default function Login() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <ButtonLogin title='Login in' onPress={() => { }} />
      <ButtonLogin title='Create account' onPress={() => { }} />
    </SafeAreaView>
  );
}


