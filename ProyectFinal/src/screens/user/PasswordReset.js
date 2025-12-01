import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Image, KeyboardAvoidingView, ScrollView, Platform, ActivityIndicator } from "react-native";
import HeaderScreen from "../../components/HeaderScreen";
import InputLogin from "../../components/InputLogin";
import ButtonLogin from "../../components/ButtonLogin";
import InfoModal from "../../components/InfoModal";
import { COLORS } from "../../components/constants/theme";
import { Ionicons } from '@expo/vector-icons';
import { resetPassword } from "../../services/authService";
import styles from "../../styles/screens/user/PasswordResetStyles";

export default function PasswordReset({ navigation }) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');

    const handlePasswordReset = async () => {
        // Validar que el email no esté vacío y tenga formato válido
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email.trim()) {
            setModalTitle('Error');
            setModalMessage('Por favor, ingresa tu correo electrónico');
            setShowModal(true);
            return;
        }
        
        if (!emailRegex.test(email)) {
            setModalTitle('Error');
            setModalMessage('Por favor, ingresa un correo electrónico válido');
            setShowModal(true);
            return;
        }
        
        // Llamar al servicio de Firebase para enviar el correo
        setLoading(true);
        try {
            const result = await resetPassword(email);
            
            if (result.success) {
                setModalTitle('Éxito');
                setModalMessage('Enlace de recuperación enviado a tu correo. Revisa tu bandeja de entrada.');
            } else {
                setModalTitle('Error');
                setModalMessage(result.message);
            }
            setShowModal(true);
        } catch (error) {
            setModalTitle('Error');
            setModalMessage('Error al enviar el correo. Inténtalo de nuevo.');
            setShowModal(true);
        } finally {
            setLoading(false);
        }
    };

    const handleBackToLogin = () => {
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
            <HeaderScreen 
                title="Recuperar contraseña"
                leftIcon={<Ionicons name="arrow-back" size={24} color="black" />}
                // rightIcon={<Ionicons name="settings" size={24} color="black" />}
                onLeftPress={handleBackToLogin}
                onRightPress={() => { }}
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
                <Image
                    source={require('../../../assets/LogoTM.png')}
                    style={styles.logoImage}
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
                <InputLogin 
                    msj="tu@ejemplo.com" 
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
            </View>

            <Text style={styles.spamText}>
                Asegúrate de tener acceso a este correo.
            </Text>

            <View style={styles.buttonContainer}>
                <ButtonLogin
                    title={loading ? "Enviando..." : "Enviar enlace"}
                    onPress={handlePasswordReset}
                    backgroundColor={COLORS.primary}
                    textColor={COLORS.textWhite}
                    showBorder={false}
                    disabled={loading}
                />
            </View>

                    <Text style={styles.spamText}>
                        Si no ves el correo en unos minutos, revisa tu carpeta de spam o solicita uno nuevo.
                    </Text>
                </ScrollView>
            </KeyboardAvoidingView>

            <InfoModal
                visible={showModal}
                onClose={() => setShowModal(false)}
                title={modalTitle}
                message={modalMessage}
            />
        </SafeAreaView>
    );
}