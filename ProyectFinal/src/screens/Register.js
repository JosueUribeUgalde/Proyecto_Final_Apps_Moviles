import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Image} from "react-native";
import HeaderScreen from "../components/HeaderScreen";
import InputLogin from "../components/InputLogin";
import ButtonLogin from "../components/ButtonLogin";
import Banner from "../components/Banner";
import { COLORS } from "../components/constants/theme";
import styles from "../components/styles/RegisterStyles";

export default function Register() {
    // Controlador dse visibilidad del banner
const [showBanner, setShowBanner] = useState(false);

const handleRegister = () => {
    // Aquí iria la logica de registro
    setShowBanner(true);
};

return (
    // Contenedor principal, edges es para que no se superponga con la barra de estado
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
    {/*Header con el titulo al igual que la barra separadora*/}
        <HeaderScreen title="Registrarse" />
    {/*Marca con crear cuenta*/}
    <View style={styles.welcomeContainer}>
        <Image
            source={require('../../assets/logoSF.png')}
            style={styles.logoImage}
        />
        <Text style={styles.welcomeText}>Crear cuenta</Text>
    </View>
    {/*Grupo de cada campo: nombre, correo, contraseña, confirmar contraseña*/}
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
    {/*Boton crear cuenta personalizado*/}
    <View style={styles.buttonContainer}>
        <ButtonLogin
            title="Crear Cuenta"
            onPress={handleRegister}
            backgroundColor={COLORS.primary}
            textColor={COLORS.textWhite}
        />
    </View>

    {/*Parte baja de la screen, usabdi stylos de register*/}
    <View style={styles.footer}>
        <Text style={styles.footerText}>¿Ya tienes cuenta?</Text>
        <Text
            style={styles.footerLink}
            onPress={() => navigation.replace("src\screens\Login.js")}>
            Inicia sesión
        </Text>
    </View>
    {/*Banner de registro exitoso al igual que su fubncionalidad*/}
    <Banner
        message="Registro exitoso"
        type="success"
        visible={showBanner}
        onHide={() => setShowBanner(false)}
    />
    </SafeAreaView>
);
}
