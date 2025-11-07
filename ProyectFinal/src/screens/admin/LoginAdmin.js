// 1. Paquetes core de React/React Native
import { useState } from 'react';
import { Text, View, Image, Pressable } from "react-native";
// 2. Bibliotecas de terceros
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
// 3. Componentes propios
import { ButtonLogin, InputLogin, HeaderScreen, Banner } from "../../components";
import InfoModal from "../../components/InfoModal";
// 4. Constantes y utilidades
import { COLORS } from '../../components/constants/theme';
// 5. Estilos
import styles from "../../styles/screens/user/LoginStyles";
// 6. Archivos estáticos
import LogoSF from '../../../assets/LogoTM.png';

export default function LoginAdmin({ navigation }) {
  const [showBanner, setShowBanner] = useState(false);
  const [bannerMessage, setBannerMessage] = useState('');
  const [bannerType, setBannerType] = useState('error');
  const [showInfoModal, setShowInfoModal] = useState(false);

  const handleLogin = () => {
    // TODO: Implementar lógica de autenticación de admin
    navigation.navigate('RequestScreen'); // Navegar a pantalla de admin
  };

  const handleForgotPassword = () => {
    navigation.navigate('PasswordReset');
  };

  const handleShowAccountInfo = () => {
    setShowInfoModal(true);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <HeaderScreen
        title="Admin Login"
        leftIcon={<Ionicons name="arrow-back" size={24} color="black" />}
        onLeftPress={() => navigation.navigate('Welcome')}
      />
      
      <View style={styles.welcomeContainer}>
        <Image
          source={LogoSF}
          style={styles.logoImage}
        />
        <Text style={styles.welcomeText}>Panel de Administrador</Text>
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
        <InputLogin msj="admin@correo.com" />
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

      {/* Modal informativo */}
      <InfoModal
        visible={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        title="Cuentas de Administrador"
        message='Las cuentas de administrador son creadas por "Empresa". Comuníquese con el encargado para que habilite una cuenta para usted.'
      />
    </SafeAreaView>
  );
}
