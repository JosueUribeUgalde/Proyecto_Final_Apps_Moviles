import React from 'react';
import { View, Text, ScrollView, Pressable, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MenuFooterCompany } from '../../components';
import styles from '../../styles/screens/company/DashboardStyles';
import { COLORS } from '../../components/constants/theme';

export default function Dashboard({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.headerIconLeft}>
        </Pressable>
        <Text style={styles.headerTitle}>TurnMate</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Tarjeta Empresa + Plan */}
        <View style={styles.card}>
          <View style={styles.companyRow}>
            <View style={styles.companyAvatar}>
              {/* placeholder de logo */}
            </View>
            <View style={styles.companyTextWrap}>
              <Text style={styles.companyTitle}>Empresa</Text>
              <Text style={styles.companySubtitle}>La casa de la ama</Text>
            </View>
            <View style={styles.planChip}>
              <Text style={styles.planChipText}>Plan actual: Pro</Text>
            </View>
          </View>

          <View style={styles.planLines}>
            <View style={styles.planLine}>
              <Text style={styles.planLineLabel}>Resumen del plan</Text>
            </View>
            <View style={styles.planLine}>
              <Text style={styles.planLineLabel}>Usuarios incluidos</Text>
              <Text style={styles.planLineValue}>Hasta 30</Text>
            </View>
            <View style={styles.planLine}>
              <Text style={styles.planLineLabel}>Automatización con IA</Text>
              <Text style={styles.planActive}>Activa</Text>
            </View>
            <View style={styles.planLine}>
              <Text style={styles.planLineLabel}>Siguiente cobro</Text>
              <Text style={styles.planLineValue}>15 Nov 2025</Text>
            </View>
          </View>

          <View style={styles.planActionsRow}>
            <Pressable style={styles.btnOutline}>
              <Ionicons name="information-circle-outline" size={16} color={COLORS.textBlack} />
              <Text style={styles.btnOutlineText}>Ver detalles</Text>
            </Pressable>
            <Pressable style={styles.btnPrimary}>
              <Ionicons name="arrow-forward" size={16} color={COLORS.textWhite} />
              <Text style={styles.btnPrimaryText}>Cambiar plan</Text>
            </Pressable>
          </View>
        </View>

        {/* Métricas (2 columnas) */}
        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <View style={styles.metricIconWrap}>
              <Ionicons name="people-outline" size={16} color={COLORS.textGray} />
            </View>
            <Text style={styles.metricTitle}>Miembros</Text>
            <Text style={styles.metricNumber}>48</Text>
            <Text style={styles.metricSub}>Total registrados</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={styles.metricIconWrap}>
              <Ionicons name="time-outline" size={16} color={COLORS.textGray} />
            </View>
            <Text style={styles.metricTitle}>Turnos hoy</Text>
            <Text style={styles.metricNumber}>12</Text>
            <Text style={styles.metricSub}>En curso</Text>
          </View>
        </View>

        {/* Resumen de hoy */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Resumen de hoy</Text>

          <Pressable style={styles.listItem}>
            <Ionicons name="sparkles-outline" size={18} color={COLORS.primary} />
            <Text style={styles.listItemText}>IA reasignó 2 turnos por ausencia</Text>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textGray} />
          </Pressable>

          <Pressable style={styles.listItem}>
            <Ionicons name="alert-circle-outline" size={18} color={COLORS.primary} />
            <Text style={styles.listItemText}>Próximo turno crítico en 1h</Text>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textGray} />
          </Pressable>
        </View>
      </ScrollView>

      <MenuFooterCompany />
    </SafeAreaView>
  );
}
