import styles from "../components/styles/LoginStyles";
import { Text, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ButtonLogin from "../components/ButtonLogin";
import InputLogin from "../components/InputLogin";
import HeaderScreen from "../components/HeaderScreen";
import { Ionicons } from '@expo/vector-icons'; // libreria de expo para iconos https://icons.expo.fyi/Index

export default function Login() {
  return (

    <SafeAreaView style={styles.container}>
      <HeaderScreen
        title="Login"
        leftIcon={<Ionicons name="arrow-back" size={24} color="black" />}
        rightIcon={<Ionicons name="settings" size={24} color="black" />}
        onLeftPress={() => { }}
        onRightPress={() => { }}
      />
      <View style={styles.welcomeContainer}>
        <Image 
          source={require('../../assets/logoSF.png')}
          style={styles.logoImage}
        />
        <Text style={styles.welcomeText}>Welcome back</Text>
      </View>
      {/* Grupo Email */}
      <View style={styles.group}>
        <Text style={styles.label}>
          Email
        </Text>
        <InputLogin msj="ejemplo@correo.com" />
      </View>

      {/* Grupo Password */}
      <View style={styles.group}>
        <Text style={styles.label}>
          Password
        </Text>
        <InputLogin msj="password" secureTextEntry />
      </View>

      <ButtonLogin title='Login' 
      onPress={() => { }}  
      icon={<Ionicons name="log-in-outline" size={24} color="white" />}/>
      <ButtonLogin title='Create account' onPress={() => { }} />
    </SafeAreaView>
  );
}


