// 1. Paquetes core de React/React Native
import { useState, useEffect } from 'react';
import { Text, View, Image, Pressable, Alert, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
// 2. Bibliotecas de terceros
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
//import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
// 3. Componentes propios
import { ButtonLogin, InputLogin, HeaderScreen } from "../../components";
import InfoModal from "../../components/InfoModal";
// 4. Servicios de Firebase(funciones de autenticación)
import { loginUser } from '../../services/authService';
// 5. Constantes y utilidades
import { COLORS } from '../../components/constants/theme';
// 6. Estilos
import styles from "../../styles/screens/user/LoginStyles";
// 7. Archivos estáticos
import LogoSF from '../../../assets/LogoTM.png';
import LogoGoogle from '../../../assets/icon_google1.png';

export default function Login({ navigation }) {
  // Estados para los inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Estados para InfoModal
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  
  // Estado de carga
  const [loading, setLoading] = useState(false);
  
  // Estado para mostrar/ocultar contraseña
  const [showPassword, setShowPassword] = useState(false);

  // Comenta temporalmente la configuración de Google
  // useEffect(() => {
  //   GoogleSignin.configure({
  //     webClientId: '154945832096-cg30sjdppgqk8hamf3j7ihofcv1cl3ip.apps.googleusercontent.com',
  //     offlineAccess: true,
  //   });
  // }, []);

  const handleLogin = async () => {
    // Validar campos vacíos
    if (!email.trim() || !password.trim()) {
      setModalTitle('Error');
      setModalMessage('Por favor, completa todos los campos');
      setShowModal(true);
      return;
    }

    setLoading(true);

    // Intentar login con Firebase
    const result = await loginUser(email, password);

    setLoading(false);

    // El objeto result devuelve{ success: boolean, message: string and user: credential.user }
    if (result.success) {
      // Login exitoso - navegar a Home
      navigation.navigate('Home');
    } else {
      // Mostrar error
      setModalTitle('Error de Autenticación');
      setModalMessage(result.message);
      setShowModal(true);
    }
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
    // Mostrar modal informativo sobre Google Sign-In
    setModalTitle('Próximamente');
    setModalMessage('El inicio de sesión con Google estará disponible en la versión final de la aplicación (APK).');
    setShowModal(true);
  };
  return (

    <SafeAreaView edges={['top']} style={styles.container}>
      <HeaderScreen
        title="User Login"
        leftIcon={<Ionicons name="arrow-back" size={24} color="black" />}
        onLeftPress={() => navigation.navigate('Welcome')}
      />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, width: '100%' }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1, alignItems: 'center', paddingBottom: 20, width: '100%' }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          style={{ width: '100%' }}
        >
          <View style={styles.welcomeContainer}>
            <Image
              source={LogoSF}
              style={styles.logoImage}
            />
            <Text style={styles.welcomeText}>Panel usuario</Text>

          </View>

          {/* Grupo Email */}
          <View style={styles.group}>
            <Text style={styles.label}>
              Email
            </Text>
            <InputLogin 
              msj="ejemplo@correo.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Grupo Password */}
          <View style={styles.group}>
            <Text style={styles.label}>
              Password
            </Text>
            <View style={{ position: 'relative', width: '100%' }}>
              <InputLogin 
                msj="password" 
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: 15,
                  top: 15,
                  padding: 5
                }}
              >
                <Ionicons 
                  name={showPassword ? "eye-off-outline" : "eye-outline"} 
                  size={24} 
                  color={COLORS.textGray} 
                />
              </Pressable>
            </View>
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
            title={loading ? 'Iniciando sesión...' : 'Login'}
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
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal informativo */}
      <InfoModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        title={modalTitle}
        message={modalMessage}
      />
    </SafeAreaView>
  );
}


