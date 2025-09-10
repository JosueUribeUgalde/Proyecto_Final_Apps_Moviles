import React from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import HeaderScreen from "../components/HeaderScreen";
import MenuFooter from "../components/MenuFooter";
import styles from "../components/styles/ProfileStyles";
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../components/constants/theme';
import { useNavigation } from '@react-navigation/native';

export default function Profile() {
    const navigation = useNavigation();
    
    const handleLogout = () => {
        navigation.navigate('Logout');
    };

    return (
        <SafeAreaView style={styles.container}>
            <HeaderScreen
                title="Perfil"
                leftIcon={<Ionicons name="arrow-back" size={24} color="black" />}
                rightIcon={<Ionicons name="notifications-outline" size={24} color="black" />}
            />
            
            <ScrollView>
                <View style={styles.profileContainer}>
                    <Image
                        source={require('../../assets/i.png')}
                        style={styles.profileImage}
                    />
                    <Text style={styles.userName}>Alex Johnson Uribe</Text>
                    <Text style={styles.jobTitle}>Workforce Manager</Text>
                    <View style={styles.contactInfo}>
                        <Text style={styles.userEmail}>johnson@company.com</Text>
                        <Text style={styles.userPhone}>+52 5214794621</Text>
                    </View>
                </View>

                <View style={styles.preferencesSection}>
                    <Text style={styles.sectionTitle}>Preferencias</Text>
                    
                    <TouchableOpacity style={styles.preferenceItem}>
                        <View style={styles.preferenceLeft}>
                            <Ionicons name="notifications-outline" size={24} color={COLORS.primary} />
                            <View style={styles.preferenceTextContainer}>
                                <Text style={styles.preferenceTitle}>Notificaciones</Text>
                                <Text style={styles.preferenceSubtitle}>Alertas, aprobaciones, recordatorios</Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={24} color={COLORS.textGray} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.preferenceItem}>
                        <View style={styles.preferenceLeft}>
                            <Ionicons name="calendar-outline" size={24} color={COLORS.primary} />
                            <View style={styles.preferenceTextContainer}>
                                <Text style={styles.preferenceTitle}>Calendario predeterminado</Text>
                                <Text style={styles.preferenceSubtitle}>Semana laboral • 9:00-17:00</Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={24} color={COLORS.textGray} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.preferenceItem}>
                        <View style={styles.preferenceLeft}>
                            <Ionicons name="globe-outline" size={24} color={COLORS.primary} />
                            <View style={styles.preferenceTextContainer}>
                                <Text style={styles.preferenceTitle}>Región y hora</Text>
                                <Text style={styles.preferenceSubtitle}>Estados Unidos (PDT)</Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={24} color={COLORS.textGray} />
                    </TouchableOpacity>
                </View>

                <View style={styles.accountSection}>
                    <Text style={styles.sectionTitle}>Cuenta</Text>
                    
                    <TouchableOpacity style={styles.preferenceItem}>
                        <View style={styles.preferenceLeft}>
                            <Ionicons name="key-outline" size={24} color={COLORS.primary} />
                            <View style={styles.preferenceTextContainer}>
                                <Text style={styles.preferenceTitle}>Cambiar contraseña</Text>
                                <Text style={styles.preferenceSubtitle}>Actualizar credenciales</Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={24} color={COLORS.textGray} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.preferenceItem}>
                        <View style={styles.preferenceLeft}>
                            <Ionicons name="people-outline" size={24} color={COLORS.primary} />
                            <View style={styles.preferenceTextContainer}>
                                <Text style={styles.preferenceTitle}>Equipo y roles</Text>
                                <Text style={styles.preferenceSubtitle}>Administrar accesos y permisos</Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={24} color={COLORS.textGray} />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.helpButton}>
                    <Ionicons name="help-circle-outline" size={24} color={COLORS.primary} />
                    <Text style={styles.helpButtonText}>Ayuda</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.signOutButton}
                    onPress={handleLogout}
                >
                    <Text style={styles.signOutText}>Cerrar sesión</Text>
                </TouchableOpacity>
            </ScrollView>
            <MenuFooter />
        </SafeAreaView>
    );
}