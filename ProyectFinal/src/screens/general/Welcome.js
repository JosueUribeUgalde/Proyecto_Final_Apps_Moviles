import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import styles from '../../styles/screens/general/WelcomeStyles';
import { COLORS } from '../../components/constants/theme';

export default function Welcome({ navigation }) {
  const handleUserTypeSelection = (userType) => {
    switch (userType) {
      case 'empresa':
        navigation.navigate('LoginCompany');
        break;
      case 'admin':
        navigation.navigate('LoginAdmin');
        break;
      case 'user':
        navigation.navigate('Login');
        break;
      default:
        break;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Logo o título principal */}
      <View style={styles.headerContainer}>
        <View style={styles.logoContainer}>
          <Ionicons name="business" size={50} color={COLORS.primary} />
        </View>
        <Text style={styles.title}>Bienvenido</Text>
        <Text style={styles.subtitle}>¿Quién eres?</Text>
      </View>

      {/* Opciones de usuario */}
      <View style={styles.optionsContainer}>
        {/* Opción Empresa */}
        <Pressable
          style={({ pressed }) => [
            styles.optionCard,
            pressed && styles.optionCardPressed
          ]}
          onPress={() => handleUserTypeSelection('empresa')}
        >
          <View style={[styles.iconCircle, { backgroundColor: COLORS.backgroundBS }]}>
            <Ionicons name="briefcase" size={30} color={COLORS.primary} />
          </View>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>Empresa</Text>
            <Text style={styles.optionDescription}>
              Gestiona tu organización
            </Text>
          </View>
          <Ionicons 
            name="chevron-forward" 
            size={24} 
            color={COLORS.textGray}
          />
        </Pressable>

        {/* Opción Administrador */}
        <Pressable
          style={({ pressed }) => [
            styles.optionCard,
            pressed && styles.optionCardPressed
          ]}
          onPress={() => handleUserTypeSelection('admin')}
        >
          <View style={[styles.iconCircle, { backgroundColor: COLORS.backgroundBS }]}>
            <Ionicons name="shield-checkmark" size={30} color={COLORS.primary} />
          </View>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>Administrador</Text>
            <Text style={styles.optionDescription}>
              Administra el sistema
            </Text>
          </View>
          <Ionicons 
            name="chevron-forward" 
            size={24} 
            color={COLORS.textGray}
          />
        </Pressable>

        {/* Opción Usuario */}
        <Pressable
          style={({ pressed }) => [
            styles.optionCard,
            pressed && styles.optionCardPressed
          ]}
          onPress={() => handleUserTypeSelection('user')}
        >
          <View style={[styles.iconCircle, { backgroundColor: COLORS.backgroundBS }]}>
            <Ionicons name="person" size={30} color={COLORS.primary} />
          </View>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>Usuario</Text>
            <Text style={styles.optionDescription}>
              Acceso como empleado
            </Text>
          </View>
          <Ionicons 
            name="chevron-forward" 
            size={24} 
            color={COLORS.textGray}
          />
        </Pressable>
      </View>

      {/* Footer */}
      <Text style={styles.footerText}>
        Selecciona tu tipo de acceso para continuar
      </Text>
    </SafeAreaView>
  );
}
