import { useState } from 'react'; // Agregar este import
import styles from "../components/styles/LoginStyles";
import { Text, View, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ButtonLogin from "../components/ButtonLogin";
import InputLogin from "../components/InputLogin";
import HeaderScreen from "../components/HeaderScreen";
import Banner from "../components/Banner";
import { COLORS } from '../components/constants/theme';
import { Ionicons } from '@expo/vector-icons'; // libreria de expo para iconos https://icons.expo.fyi/Index

export default function Login() {
  const [showBanner, setShowBanner] = useState(false);

  const handleLogin = () => {
    setShowBanner(true);
    // El banner se ocultará automáticamente después de 3 segundos
  };

  const handleForgotPassword = () => {
    // TODO: Implementar lógica para recuperar contraseña
    console.log('Forgot password clicked');
  };

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
      <View style={styles.bannerContainer}>
        {/*Se agrego este banner al button login solo como test*/}
        <Banner
          message="Credenciales incorrectas"
          type="error"
          visible={showBanner}
          onHide={() => setShowBanner(false)}
        />
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
        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.forgotPassword}>
            Forgot Password?
          </Text>
        </TouchableOpacity>
      </View>

      <ButtonLogin
        title='Login'
        onPress={handleLogin}
        icon={<Ionicons name="log-in-outline" size={24} color="white" />}
        showBorder={false} 
        />



      <View style={styles.dividerContainer}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>OR</Text>
        <View style={styles.dividerLine} />
      </View>

      <ButtonLogin
        title='Login with Google'
        onPress={() => { }}
        icon={
          <Image
            source={require('../../assets/icon_google1.png')}
            style={{ width: 24, height: 24 }}
          />
        }
        backgroundColor={COLORS.backgroundWhite}
        textColor={COLORS.textBlack} />
      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>
          No tienes cuenta?
        </Text>
        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.registerTextClick}>
            {' '}Regístrate
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}


