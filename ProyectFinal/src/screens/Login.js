// 1. Paquetes core de React/React Native
import { useState, useEffect } from 'react';
import { Text, View, Image, Pressable, Alert } from "react-native";
// 2. Bibliotecas de terceros
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
//import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
// 3. Componentes propios
import { ButtonLogin, InputLogin, HeaderScreen, Banner } from "../components";
// 4. Constantes y utilidades
import { COLORS } from '../components/constants/theme';
// 5. Estilos
import styles from "../components/styles/LoginStyles";
// 6. Archivos estáticos
import LogoSF from '../../assets/LogoTM.png';
import LogoGoogle from '../../assets/icon_google1.png';

export default function Login({ navigation }) {
  const [showBanner, setShowBanner] = useState(false);
  const [bannerMessage, setBannerMessage] = useState('');
  const [bannerType, setBannerType] = useState('error');

  // Comenta temporalmente la configuración de Google
  // useEffect(() => {
  //   GoogleSignin.configure({
  //     webClientId: '154945832096-cg30sjdppgqk8hamf3j7ihofcv1cl3ip.apps.googleusercontent.com',
  //     offlineAccess: true,
  //   });
  // }, []);

  const handleLogin = () => {
    navigation.navigate('Home');
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  const handleForgotPassword = () => {
    navigation.navigate('PasswordReset');
  };

  // const handleGoogleSignIn = async () => {
  //   try {
  //     console.log('Iniciando Google Sign-In...');
      
  //     // Verificar que Google Play Services esté disponible
  //     await GoogleSignin.hasPlayServices();
  //     console.log('Google Play Services disponible');
      
  //     // Realizar el sign in
  //     const userInfo = await GoogleSignin.signIn();
  //     console.log('User data completa:', JSON.stringify(userInfo, null, 2));
      
  //     // Acceso a los datos del usuario - probando diferentes estructuras
  //     const user = userInfo.user || userInfo.data?.user || userInfo;
  //     console.log('User extraído:', user);
      
  //     if (user && (user.name || user.email)) {
  //       // Mostrar mensaje de éxito
  //       setBannerMessage(`¡Bienvenido ${user.name || user.email}!`);
  //       setBannerType('success');
  //       setShowBanner(true);
        
  //       // Navegar a Home después de un breve delay
  //       setTimeout(() => {
  //         navigation.navigate('Home');
  //       }, 1500);
  //     } else {
  //       setBannerMessage('Error: No se pudieron obtener los datos del usuario');
  //       setBannerType('error');
  //       setShowBanner(true);
  //     }
      
  //   } catch (error) {
  //     console.error('Google Sign-In Error completo:', error);
  //     console.error('Error code:', error.code);
  //     console.error('Error message:', error.message);
      
  //     let errorMessage = 'Error al iniciar sesión con Google';
      
  //     if (error.code === statusCodes.SIGN_IN_CANCELLED) {
  //       errorMessage = 'Login cancelado por el usuario';
  //     } else if (error.code === statusCodes.IN_PROGRESS) {
  //       errorMessage = 'Login en progreso...';
  //     } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
  //       errorMessage = 'Google Play Services no disponible';
  //     } else if (error.code) {
  //       errorMessage = `Error código: ${error.code}`;
  //     }
      
  //     setBannerMessage(errorMessage);
  //     setBannerType('error');
  //     setShowBanner(true);
  //   }
  // };
  const handleGoogleSignIn = () => {
    setBannerMessage('Google Sign-In funciona en el APK compilado');
    setBannerType('success');
    setShowBanner(true);
    
    // Simula navegación exitosa para desarrollo
    setTimeout(() => {
      navigation.navigate('Home');
    }, 2000);
  };
  return (

    <SafeAreaView edges={['top']} style={styles.container}>
      <HeaderScreen
        title="Login"
        // leftIcon={<Ionicons name="arrow-back" size={24} color="black" />}
       // rightIcon={<Ionicons name="settings" size={24} color="black" />}
        onLeftPress={() => { }}
        onRightPress={() => { }}
      />
      <View style={styles.welcomeContainer}>
        <Image
          source={LogoSF}
          style={styles.logoImage}
        />
        <Text style={styles.welcomeText}>Welcome back</Text>

      </View>

      {/* Banner para mensajes */}
      <View style={styles.bannerContainer}>
        <Banner
          message={bannerMessage}
          type={bannerType}
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
        <Pressable 
          onPress={handleForgotPassword}
          style={({pressed}) => [
            styles.forgotPasswordContainer,
            pressed && {opacity: 0.5}
          ]}
        >
          <Text style={styles.forgotPassword}>
            Forgot Password?
          </Text>
        </Pressable>
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
        onPress={handleGoogleSignIn} // Cambiado para usar la función de Google Sign-In
        icon={
          <Image
            source={LogoGoogle}
            style={{ width: 24, height: 24 }}
          />
        }
        backgroundColor={COLORS.backgroundWhite}
        textColor={COLORS.textBlack} 
      />
      
      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>
          No tienes cuenta?
        </Text>
        <Pressable 
          onPress={handleRegister}
          style={({ pressed }) => pressed && { opacity: 0.5 }}
        >
          <Text style={styles.registerTextClick}>
            {' '}Regístrate
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}


