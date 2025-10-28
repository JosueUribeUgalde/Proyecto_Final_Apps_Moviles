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
import HeaderScreen from "../components/HeaderScreen";
import InputLogin from "../components/InputLogin";
import ButtonLogin from "../components/ButtonLogin";
import Banner from "../components/Banner";
import { COLORS } from "../components/constants/theme";
import styles from "../components/styles/RegisterStyles";

export default function Register() {
    const navigation = useNavigation();
    const [showBanner, setShowBanner] = useState(false);

    const handleRegister = () => {
        setShowBanner(true);
        setTimeout(() => {
            setShowBanner(false);
            navigation.navigate('Home');
        }, 1500);
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
            >
                <HeaderScreen title="Registrarse" />
                
                <ScrollView 
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.contentContainer}>
                        {/* Marca con crear cuenta */}
                        <View style={styles.welcomeContainer}>
                            <Image
                                source={require('../../assets/LogoTM.png')}
                                style={styles.logoImage}
                            />
                            <Text style={styles.welcomeText}>Crear cuenta</Text>
                        </View>

                        {/* Formulario */}
                        <View style={styles.block}>
                            <View style={styles.group}>
                                <Text style={styles.label}>Nombre Completo</Text>
                                <InputLogin msj="Tu nombre" />
                            </View>

                            <View style={styles.group}>
                                <Text style={styles.label}>Correo Electrónico</Text>
                                <InputLogin msj="tu@correo.com" />
                            </View>

                            <View style={styles.group}>
                                <Text style={styles.label}>Contraseña</Text>
                                <InputLogin msj="••••••" secureTextEntry />
                            </View>

                            <View style={styles.group}>
                                <Text style={styles.label}>Confirmar Contraseña</Text>
                                <InputLogin msj="••••••" secureTextEntry />
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

            {/* Banner */}
            <Banner
                message="Registro exitoso"
                type="success"
                visible={showBanner}
                onHide={() => setShowBanner(false)}
            />
        </SafeAreaView>
    );
}
