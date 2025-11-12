// 1. Paquetes core de React/React Native
import { useState } from 'react';
import { Text, View, Image, Pressable } from "react-native";
// 2. Bibliotecas de terceros
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
// 3. Componentes propios
import { ButtonLogin, InputLogin, HeaderScreen } from "../../components";
import InfoModal from "../../components/InfoModal";
// 4. Constantes y utilidades
import { COLORS } from '../../components/constants/theme';
// 5. Estilos
import styles from "../../styles/screens/user/LoginStyles";
// 6. Archivos estáticos
import LogoSF from '../../../assets/LogoTM.png';

export default function LoginCompany({ navigation }) {
  const [showInfoModal, setShowInfoModal] = useState(false);

  const handleLogin = () => {
    navigation.navigate('Dashboard');
  };

  const handleForgotPassword = () => {
    navigation.navigate('PasswordReset');
  };

  const handleShowAccountInfo = () => {
    setShowInfoModal(true);
  };

  const handleRegister = () => {
    navigation.navigate('RegisterCompany');
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <HeaderScreen
        title="Company Login"
        leftIcon={<Ionicons name="arrow-back" size={24} color="black" />}
        onLeftPress={() => navigation.navigate('Welcome')}
      />
      
      <View style={styles.welcomeContainer}>
        <Image
          source={LogoSF}
          style={styles.logoImage}
        />
        <Text style={styles.welcomeText}>Panel de Empresa</Text>
      </View>

      {/* Grupo Email */}
      <View style={styles.group}>
        <Text style={styles.label}>
          Email
        </Text>
        <InputLogin msj="empresa@correo.com" />
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
            Has olvidado tu contraseña?
          </Text>
        </Pressable>
      </View>

      <ButtonLogin
        title='Login'
        onPress={handleLogin}
        icon={<Ionicons name="log-in-outline" size={24} color="white" />}
        showBorder={false} 
      />

      {/* Sección de registro mejorada */}
      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>¿No tienes una cuenta?</Text>
        <Pressable 
          onPress={handleRegister}
          style={({pressed}) => [
            styles.registerButton,
            pressed && {opacity: 0.7}
          ]}
        >
          <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 10}}>
            <Text style={styles.registerButtonText}>Regístrate</Text>
            <Ionicons 
              name="arrow-forward" 
              size={16} 
              color={COLORS.primary} 
              style={{marginLeft: 6}}
            />
          </View>
        </Pressable>
      </View>

      <View style={styles.dividerContainer}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>Información</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Botón de información sobre cuenta de empresa */}
      <Pressable 
        onPress={handleShowAccountInfo}
        style={({ pressed }) => [
          styles.infoButtonContainer,
          pressed && { opacity: 0.7 }
        ]}
      >
        <Ionicons name="help-circle-outline" size={20} color={COLORS.primary} />
        <Text style={styles.infoButtonText}>
          ¿Cómo crear una cuenta de Empresa?
        </Text>
      </Pressable>

      {/* saber que */}
      <InfoModal
        visible={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        title="Cuentas de Empresa"
        message={`Para crear una cuenta de empresa, necesitas seguir estos pasos:\n
          1. Da click en el botón "Regístrate"\n
          2. Completa el formulario con la información de tu empresa\n
          3. Adjunta los documentos requeridos\n
          4. Envía tu solicitud de registro\n
          5. Recibirás un correo de confirmación cuando tu cuenta esté activa\n
          Si tienes dudas adicionales, contacta al soporte técnico.`}
      />

    </SafeAreaView>
  );
}
