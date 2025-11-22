import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { HeaderScreen, ButtonLogin } from "../../components";
import { COLORS } from "../../components/constants/theme";
import styles from "../../styles/screens/user/LogoutStyles";

export default function Logout({ navigation }) {
    const handleLogout = () => {
        navigation.navigate('Welcome');
    };

    const handleCancel = () => {
        navigation.goBack();
    };

    return (
        <SafeAreaView edges={['top']} style={styles.container}>
            <HeaderScreen
                title="Cerrar Sesión"
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
                        backgroundColor={COLORS.backgroundWhite}
                        textColor={COLORS.textGreen}
                        icon={<Ionicons name="close-circle-outline" size={20} color={COLORS.textGreen} />}
                        borderColor={COLORS.borderSecondary}
                        showBorder={true}
                    />

                    <ButtonLogin
                        title="Cerrar Sesión"
                        onPress={handleLogout}
                        backgroundColor={COLORS.backgroundWhite}
                        textColor={COLORS.textRed}
                        icon={<Ionicons name="log-out-outline" size={20} color={COLORS.textRed} />}
                        showBorder={true}
                        borderColor={COLORS.borderSecondary}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}