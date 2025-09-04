import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { HeaderScreen, ButtonLogin, Banner } from "../components";
import { COLORS } from "../components/constants/theme";
import styles from "../components/styles/LogoutStyles";

export default function Logout({ navigation }) {
    const [showBanner, setShowBanner] = useState(false);

    const handleLogout = () => {
        setShowBanner(true);
        setTimeout(() => {
            navigation.navigate('Login');
        }, 2000);
    };

    const handleCancel = () => {
        navigation.goBack();
    };

    return (
        <SafeAreaView edges={['top']} style={styles.container}>
            <HeaderScreen
                title="Cerrar Sesión"
                leftIcon={<Ionicons name="arrow-back" size={24} color="black" />}
                onLeftPress={handleCancel}
            />

            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Ionicons name="log-out-outline" size={80} color={COLORS.primary} />
                </View>

                <Text style={styles.title}>
                    ¿Estás seguro que quieres cerrar sesión?
                </Text>

                <Text style={styles.subtitle}>
                    Se cerrará tu sesión en este dispositivo.{'\n'}
                    Podrás iniciar sesión de nuevo en cualquier momento.
                </Text>

                <View style={styles.buttonContainer}>
                    <ButtonLogin
                        title="Cancelar"
                        onPress={handleCancel}
                        backgroundColor={COLORS.secondary}
                        textColor={COLORS.textBlack}
                        showBorder={false}
                    />

                    <ButtonLogin
                        title="Cerrar Sesión"
                        onPress={handleLogout}
                        backgroundColor={COLORS.error}
                        textColor={COLORS.textWhite}
                        showBorder={false}
                    />
                </View>
            </View>

            <Banner
                message="Sesión cerrada exitosamente"
                type="success"
                visible={showBanner}
                onHide={() => setShowBanner(false)}
            />
        </SafeAreaView>
    );
}