import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Image } from "react-native";
import HeaderScreen from "../components/HeaderScreen";
import InputLogin from "../components/InputLogin";
import ButtonLogin from "../components/ButtonLogin";
import Banner from "../components/Banner";
import { COLORS } from "../components/constants/theme";
import { Ionicons } from '@expo/vector-icons';
import styles from "../components/styles/PasswordResetStyles";

export default function PasswordReset() {
    const [showBanner, setShowBanner] = useState(false);
    const [bannerType, setBannerType] = useState('error');
    const [bannerMessage, setBannerMessage] = useState('');

    const handlePasswordReset = () => {
        setBannerMessage("Enlace de recuperación enviado a tu correo");
        setBannerType("success");
        setShowBanner(true);
    };

    const handleVerificationCode = () => {
        console.log('Verification code clicked');
    };

    const handleBackToLogin = () => {
        console.log('Back to login clicked');
    };

    return (
        <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
            <HeaderScreen 
                title="Recuperar contraseña"
                leftIcon={<Ionicons name="arrow-back" size={24} color="black" />}
                onLeftPress={handleBackToLogin}
            />

            <View style={styles.welcomeContainer}>
                <Image
                    source={require('../../assets/logoSF.png')}
                    style={styles.logoImage}
                />
            </View>

            <View style={styles.bannerContainer}>
                <Banner
                    message={bannerMessage}
                    type={bannerType}
                    visible={showBanner}
                    onHide={() => setShowBanner(false)}
                />
            </View>

            <View style={styles.infoContainer}>
                <View style={styles.infoRow}>
                    <View style={styles.infoIcon}>
                        <Ionicons name="information-circle" size={24} color={COLORS.primary} />
                    </View>
                    <View style={styles.infoTextContainer}>
                        <Text style={styles.infoTitle}>¿Olvidaste tu contraseña?</Text>
                        <Text style={styles.infoText}>
                            Ingresa tu correo y te enviaremos un enlace para restablecerla.
                        </Text>
                    </View>
                </View>
            </View>

            <View style={styles.group}>
                <Text style={styles.label}>Correo electrónico</Text>
                <InputLogin msj="tu@ejemplo.com" />
            </View>

            <Text style={styles.spamText}>
                Asegúrate de tener acceso a este correo.
            </Text>

            <View style={styles.buttonContainer}>
                <ButtonLogin
                    title="Enviar enlace"
                    onPress={handlePasswordReset}
                    backgroundColor={COLORS.primary}
                    textColor={COLORS.textWhite}
                    showBorder={false}
                />
            </View>

            <View style={styles.secondaryButtonContainer}>
                <ButtonLogin
                    title="Usar código de verificación"
                    onPress={handleVerificationCode}
                    backgroundColor={COLORS.secondary}
                    textColor={COLORS.textBlack}
                    showBorder={false}
                />
            </View>

            <Text style={styles.spamText}>
                Si no ves el correo en unos minutos, revisa tu carpeta de spam o solicita uno nuevo.
            </Text>
        </SafeAreaView>
    );
}