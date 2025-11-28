import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    View,
    Text,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Pressable,
    ActivityIndicator
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import HeaderScreen from "../../components/HeaderScreen";
import InputLogin from "../../components/InputLogin";
import ButtonLogin from "../../components/ButtonLogin";
import { COLORS } from "../../components/constants/theme";
// Servicios de Firebase
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/firebaseConfig";
import { createUserProfile } from "../../services/userService";
// Estilos
import styles from "../../styles/screens/user/RegisterStyles";

export default function Register() {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);

    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [telefono, setTelefono] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Estados para mostrar/ocultar contraseñas
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Estado para errores de validación
    const [validationErrors, setValidationErrors] = useState({});
    const [passwordErrors, setPasswordErrors] = useState([]);

    // Función para validar contraseña
    const validatePassword = (password) => {
        const errors = [];

        if (password.length < 8) {
            errors.push('Mínimo 8 caracteres');
        }
        if (!/[A-Z]/.test(password)) {
            errors.push('Al menos una mayúscula');
        }
        if (!/[0-9]/.test(password)) {
            errors.push('Al menos un número');
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            errors.push('Al menos un carácter especial');
        }

        return errors;
    };

    // Validar formulario
    const validateForm = () => {
        const newErrors = {};

        // Validar nombre
        if (!nombre.trim() || nombre.trim().length < 3) {
            newErrors.nombre = 'Nombre inválido (mínimo 3 caracteres)';
        }

        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim() || !emailRegex.test(email)) {
            newErrors.email = 'Email inválido (ej: usuario@correo.com)';
        }

        // Validar teléfono
        const phoneRegex = /^[0-9]{10}$/;
        if (!telefono.trim()) {
            newErrors.telefono = 'El teléfono es requerido';
        } else if (!phoneRegex.test(telefono.replace(/\s/g, ''))) {
            newErrors.telefono = 'Teléfono inválido (10 dígitos)';
        }

        // Validar contraseñas
        const passErrors = validatePassword(password);
        if (password !== confirmPassword) {
            passErrors.push('Las contraseñas no coinciden');
        }
        if (passErrors.length > 0) {
            newErrors.password = passErrors;
        }

        setValidationErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async () => {
        // Validar formulario
        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            // 1. Crear usuario en Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2. Crear perfil del usuario en Firestore
            await createUserProfile(user.uid, {
                name: nombre,
                email: email,
                phone: telefono
            });

            // Limpiar campos
            setNombre('');
            setEmail('');
            setTelefono('');
            setPassword('');
            setConfirmPassword('');
            setValidationErrors({});
            setPasswordErrors([]);

            // Redirigir a Login después de 1 segundo
            setTimeout(() => {
                setLoading(false);
                navigation.navigate('Login');
            }, 1000);

        } catch (error) {
            setLoading(false);

            // Manejar errores específicos de Firebase
            const newErrors = {};

            if (error.code === 'auth/email-already-in-use') {
                newErrors.email = 'Este correo electrónico ya está registrado';
            } else if (error.code === 'auth/invalid-email') {
                newErrors.email = 'El correo electrónico no es válido';
            } else if (error.code === 'auth/weak-password') {
                newErrors.password = ['La contraseña es muy débil'];
            } else if (error.code === 'auth/network-request-failed') {
                newErrors.general = 'Error de conexión. Verifica tu internet';
            } else {
                newErrors.general = 'Ocurrió un error al crear la cuenta';
            }

            setValidationErrors(newErrors);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1, width: '100%' }}
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
                    style={{ width: '100%' }}
                >
                    {/* Marca con crear cuenta */}
                    <View style={styles.welcomeContainer}>
                        <Image
                            source={require('../../../assets/LogoTM.png')}
                            style={styles.logoImage}
                        />
                        <Text style={styles.welcomeText}>Crear cuenta</Text>
                    </View>

                    {/* Formulario */}
                    <View style={styles.group}>
                        <Text style={styles.label}>Nombre Completo</Text>
                        <InputLogin
                            msj="Tu nombre"
                            value={nombre}
                            onChangeText={(text) => {
                                setNombre(text);
                                // Limpiar error al escribir
                                if (validationErrors.nombre) {
                                    setValidationErrors(prev => ({ ...prev, nombre: undefined }));
                                }
                            }}
                            editable={!loading}
                        />
                        {validationErrors.nombre && (
                            <Text style={styles.errorText}>{validationErrors.nombre}</Text>
                        )}
                    </View>

                    <View style={styles.group}>
                        <Text style={styles.label}>Correo Electrónico</Text>
                        <InputLogin
                            msj="tu@correo.com"
                            value={email}
                            onChangeText={(text) => {
                                setEmail(text);
                                // Limpiar error al escribir
                                if (validationErrors.email) {
                                    setValidationErrors(prev => ({ ...prev, email: undefined }));
                                }
                            }}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            editable={!loading}
                        />
                        {validationErrors.email && (
                            <Text style={styles.errorText}>{validationErrors.email}</Text>
                        )}
                    </View>

                    <View style={styles.group}>
                        <Text style={styles.label}>Teléfono</Text>
                        <InputLogin
                            msj="10 dígitos"
                            value={telefono}
                            onChangeText={(text) => {
                                // Solo permitir números
                                const numericText = text.replace(/[^0-9]/g, '');
                                setTelefono(numericText);
                                // Limpiar error al escribir
                                if (validationErrors.telefono) {
                                    setValidationErrors(prev => ({ ...prev, telefono: undefined }));
                                }
                            }}
                            keyboardType="phone-pad"
                            maxLength={10}
                            editable={!loading}
                        />
                        {validationErrors.telefono && (
                            <Text style={styles.errorText}>{validationErrors.telefono}</Text>
                        )}
                    </View>

                    <View style={styles.group}>
                        <Text style={styles.label}>Contraseña</Text>
                        <View style={{ position: 'relative', width: '100%' }}>
                            <InputLogin
                                msj="Mínimo 8 caracteres"
                                secureTextEntry={!showPassword}
                                value={password}
                                onChangeText={(text) => {
                                    setPassword(text);
                                    setPasswordErrors(validatePassword(text));
                                    // Limpiar error al escribir
                                    if (validationErrors.password) {
                                        setValidationErrors(prev => ({ ...prev, password: undefined }));
                                    }
                                }}
                                editable={!loading}
                            />
                            <Pressable
                                onPress={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: 15,
                                    top: 15,
                                    padding: 5
                                }}
                                disabled={loading}
                            >
                                <Ionicons
                                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                                    size={24}
                                    color={COLORS.textGray}
                                />
                            </Pressable>
                        </View>
                        {passwordErrors.length > 0 && (
                            <View style={styles.errorsContainer}>
                                {passwordErrors.map((error, index) => (
                                    <Text key={index} style={styles.errorText}>
                                        • {error}
                                    </Text>
                                ))}
                            </View>
                        )}
                        {validationErrors.password && Array.isArray(validationErrors.password) && (
                            <View style={styles.errorsContainer}>
                                {validationErrors.password.map((error, index) => (
                                    <Text key={index} style={styles.errorText}>
                                        • {error}
                                    </Text>
                                ))}
                            </View>
                        )}
                    </View>

                    <View style={styles.group}>
                        <Text style={styles.label}>Confirmar Contraseña</Text>
                        <View style={{ position: 'relative', width: '100%' }}>
                            <InputLogin
                                msj="Repite tu contraseña"
                                secureTextEntry={!showConfirmPassword}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                editable={!loading}
                            />
                            <Pressable
                                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                style={{
                                    position: 'absolute',
                                    right: 15,
                                    top: 15,
                                    padding: 5
                                }}
                                disabled={loading}
                            >
                                <Ionicons
                                    name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                                    size={24}
                                    color={COLORS.textGray}
                                />
                            </Pressable>
                        </View>
                        {confirmPassword && password !== confirmPassword && (
                            <Text style={styles.errorText}>✗ Las contraseñas no coinciden</Text>
                        )}
                        {confirmPassword && password === confirmPassword && password.length >= 8 && (
                            <Text style={{ color: "#2e7d32", fontSize: 12, marginTop: 4 }}>✓ Las contraseñas coinciden</Text>
                        )}
                    </View>

                    {/* Error general */}
                    {validationErrors.general && (
                        <View style={{ width: "80%", alignSelf: "center" }}>
                            <Text style={[styles.errorText, { textAlign: "center" }]}>
                                {validationErrors.general}
                            </Text>
                        </View>
                    )}

                    {/* Botón crear cuenta */}
                    <View style={styles.buttonContainer}>
                        {loading ? (
                            <View style={{ padding: 15, alignItems: 'center' }}>
                                <ActivityIndicator size="large" color={COLORS.primary} />
                                <Text style={{ marginTop: 10, color: COLORS.textGray }}>
                                    Creando cuenta...
                                </Text>
                            </View>
                        ) : (
                            <ButtonLogin
                                title="Crear Cuenta"
                                onPress={handleRegister}
                                backgroundColor={COLORS.primary}
                                textColor={COLORS.textWhite}
                                showBorder={false}
                            />
                        )}
                    </View>
                </ScrollView>

                {/* Footer fijo */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>¿Ya tienes cuenta?</Text>
                    <Text
                        style={styles.footerLink}
                        onPress={() => !loading && navigation.navigate('Login')}>
                        Inicia sesión
                    </Text>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
