import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { 
    View, 
    Text, 
    Image, 
    KeyboardAvoidingView, 
    Platform,
    ScrollView
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import HeaderScreen from "../../components/HeaderScreen";
import InputLogin from "../../components/InputLogin";
import ButtonLogin from "../../components/ButtonLogin";
import InfoModal from "../../components/InfoModal";
import { COLORS } from "../../components/constants/theme";
// 5. Estilos
import styles from "../../styles/screens/user/RegisterStyles";

export default function Register() {
    const navigation = useNavigation();
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleRegister = () => {
        // Validar que todos los campos estén llenos
        if (!nombre.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
            setModalTitle('Error');
            setModalMessage('Por favor, completa todos los campos');
            setShowModal(true);
            return;
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setModalTitle('Error');
            setModalMessage('Por favor, ingresa un correo electrónico válido');
            setShowModal(true);
            return;
        }

        // Validar que las contraseñas coincidan
        if (password !== confirmPassword) {
            setModalTitle('Error');
            setModalMessage('Las contraseñas no coinciden');
            setShowModal(true);
            return;
        }

        // Validar longitud mínima de contraseña
        if (password.length < 6) {
            setModalTitle('Error');
            setModalMessage('La contraseña debe tener al menos 6 caracteres');
            setShowModal(true);
            return;
        }

        // Si todas las validaciones pasan, mostrar éxito y redirigir
        setModalTitle('Éxito');
        setModalMessage('Cuenta creada exitosamente');
        setShowModal(true);
        
        // Redirigir a Login después de cerrar el modal
        setTimeout(() => {
            setShowModal(false);
            navigation.navigate('Login');
        }, 2000);
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
            >
                <HeaderScreen 
                    title="Registrarse"
                    leftIcon={<Ionicons name="arrow-back" size={24} color="black" />}
                    onLeftPress={() => navigation.goBack()}
                />
                
                <ScrollView 
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.contentContainer}>
                        {/* Marca con crear cuenta */}
                        <View style={styles.welcomeContainer}>
                            <Image
                                source={require('../../../assets/LogoTM.png')}
                                style={styles.logoImage}
                            />
                            <Text style={styles.welcomeText}>Crear cuenta</Text>
                        </View>

                        {/* Formulario */}
                        <View style={styles.block}>
                            <View style={styles.group}>
                                <Text style={styles.label}>Nombre Completo</Text>
                                <InputLogin 
                                    msj="Tu nombre" 
                                    value={nombre}
                                    onChangeText={setNombre}
                                />
                            </View>

                            <View style={styles.group}>
                                <Text style={styles.label}>Correo Electrónico</Text>
                                <InputLogin 
                                    msj="tu@correo.com"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>

                            <View style={styles.group}>
                                <Text style={styles.label}>Contraseña</Text>
                                <InputLogin 
                                    msj="••••••" 
                                    secureTextEntry
                                    value={password}
                                    onChangeText={setPassword}
                                />
                            </View>

                            <View style={styles.group}>
                                <Text style={styles.label}>Confirmar Contraseña</Text>
                                <InputLogin 
                                    msj="••••••" 
                                    secureTextEntry
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                />
                            </View>
                        </View>

                        {/* Botón crear cuenta */}
                        <View style={styles.buttonContainer}>
                            <ButtonLogin
                                title="Crear Cuenta"
                                onPress={handleRegister}
                                backgroundColor={COLORS.primary}
                                textColor={COLORS.textWhite}
                            />
                        </View>
                    </View>
                </ScrollView>

                {/* Footer fijo */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>¿Ya tienes cuenta?</Text>
                    <Text
                        style={styles.footerLink}
                        onPress={() => navigation.navigate('Login')}>
                        Inicia sesión
                    </Text>
                </View>
            </KeyboardAvoidingView>

            {/* Modal */}
            <InfoModal
                visible={showModal}
                onClose={() => setShowModal(false)}
                title={modalTitle}
                message={modalMessage}
            />
        </SafeAreaView>
    );
}
