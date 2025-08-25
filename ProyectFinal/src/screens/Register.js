import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text } from "react-native";
import HeaderScreen from "../components/HeaderScreen";
import { COLORS } from "../components/constants/theme";
import styles from "../components/styles/RegisterStyles";
import InputLogin from "../components/InputLogin";

export default function Register() {
    return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
        <HeaderScreen title="Registrarse" />

    <View style={styles.container}>
    {/*Titulo*/}
        <View style={styles.brandWrap}>
            <Text style={styles.brandTitle}>ShiftFlow</Text>
        </View>

    {/*Subtitulo*/}
            <Text style={styles.subtitle}>Crear Cuenta</Text>

    {/*Nombre Completo*/}
    <View style={styles.group}>
        <Text style={styles.label}>Nombre Completo</Text>
        <InputLogin msj="Tu nombre" />
    </View>
    </View>
    </SafeAreaView>
);
}