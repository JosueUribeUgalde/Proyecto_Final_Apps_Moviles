// 1. Paquetes core de React/React Native
import { useState } from 'react';
import { Text, View, Image, Pressable, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
// 2. Bibliotecas de terceros
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
// 3. Componentes propios
import { ButtonLogin, InputLogin, HeaderScreen } from "../../components";
import InfoModal from "../../components/InfoModal";
// 4. Servicios de Firebase(funciones de autenticación)
import { loginUser, isAdminEmail } from '../../services/authService';
// 5. Constantes y utilidades
import { COLORS } from '../../components/constants/theme';
// 6. Estilos
import styles from "../../styles/screens/user/LoginStyles";
// 7. Archivos estáticos
import LogoSF from '../../../assets/LogoTM.png';

export default function LoginAdmin({ navigation }) {
  // Estados para los inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Estados para el modal
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  
  // Estado de carga
  const [loading, setLoading] = useState(false);
  
  // Estado para mostrar/ocultar contraseña
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    // Validar campos vacíos
    if (!email.trim() || !password.trim()) {
      setModalTitle('Error');
      setModalMessage('Por favor, completa todos los campos');
      setShowModal(true);
      return;
    }

    // ESTA ES LA FUNCION TEST - Josue owner
    // if (!isAdminEmail(email)) {
    //   setModalTitle('Acceso Denegado');
    //   setModalMessage('Este correo no tiene permisos de administrador');
    //   setShowModal(true);
    //   return;
    // }

    setLoading(true);

    // Intentar login con Firebase
    const result = await loginUser(email, password);

    setLoading(false);

    // El objeto result devuelve{ success: boolean, message: string and user: credential.user }
    if (result.success) {
      // Login exitoso - navegar a dashboard
      navigation.navigate('DashboardAdmin');
    } else {
      // Mostrar error
      setModalTitle('Error de Autenticación');
      setModalMessage(result.message);
      setShowModal(true);
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate('PasswordReset');
  };

  const handleShowAccountInfo = () => {
    setModalTitle('Cuentas de Administrador');
    setModalMessage('Las cuentas de administrador son creadas por "Empresa". Comuníquese con el encargado para que habilite una cuenta para usted.');
    setShowModal(true);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <HeaderScreen
        title="Admin Login"
        leftIcon={<Ionicons name="arrow-back" size={24} color="black" />}
        onLeftPress={() => navigation.navigate('Welcome')}
      />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1, alignItems: 'center', paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.welcomeContainer}>
            <Image source={LogoSF} style={styles.logoImage} />
            <Text style={styles.welcomeText}>Panel de Administrador</Text>
          </View>

          {/* Grupo Email */}
          <View style={styles.group}>
            <Text style={styles.label}>Email</Text>
            <InputLogin 
              msj="admin@correo.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Grupo Password */}
          <View style={styles.group}>
            <Text style={styles.label}>Password</Text>
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
            <Text style={styles.dividerText}>Información</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Botón de información sobre cuentas de administrador */}
          <Pressable 
            onPress={handleShowAccountInfo}
            style={({ pressed }) => [
              styles.infoButtonContainer,
              pressed && { opacity: 0.7 }
            ]}
          >
            <Ionicons name="help-circle-outline" size={20} color={COLORS.primary} />
            <Text style={styles.infoButtonText}>
              ¿Cómo crear una cuenta de Administrador?
            </Text>
          </Pressable>
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
