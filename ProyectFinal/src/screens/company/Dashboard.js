import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc } from 'firebase/firestore';
import { MenuFooterCompany } from '../../components';
import styles from '../../styles/screens/company/DashboardStyles';
import { COLORS } from '../../components/constants/theme';
import { getCurrentUser } from '../../services/authService';
import { db } from '../../config/firebaseConfig';

export default function Dashboard({ navigation }) {
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCompanyData();
  }, []);

  const loadCompanyData = async () => {
    try {
      const user = getCurrentUser();
      if (!user) {
        console.log('No hay usuario autenticado');
        setLoading(false);
        return;
      }

      const companyDoc = await getDoc(doc(db, 'companies', user.uid));
      
      if (companyDoc.exists()) {
        setCompanyData(companyDoc.data());
      } else {
        console.log('No se encontró documento de empresa');
      }
    } catch (error) {
      console.error('Error al cargar datos de empresa:', error);
    } finally {
      setLoading(false);
    }
  };

  // Función helper para mostrar datos o fallback
  const displayData = (value, fallback = 'Sin datos disponibles') => {
    return value || fallback;
  };

  // Función para obtener el nombre del plan
  const getPlanName = (planType) => {
    const plans = {
      basic: 'Basic',
      plus: 'Plus',
      pro: 'Pro',
      enterprise: 'Enterprise'
    };
    return plans[planType] || 'Sin plan';
  };

  // Función para formatear fecha
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Sin fecha';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('es-MX', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      });
    } catch (error) {
      return 'Sin fecha';
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={{ marginTop: 16, color: COLORS.textGray }}>Cargando datos...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
              <Text style={styles.companySubtitle}>
                {displayData(companyData?.companyName)}
              </Text>
            </View>
            <View style={styles.planChip}>
              <Text style={styles.planChipText}>
                Plan actual: {getPlanName(companyData?.plan?.type)}
              </Text>
            </View>
          </View>

          <View style={styles.planLines}>
            <View style={styles.planLine}>
              <Text style={styles.planLineLabel}>Resumen del plan</Text>
            </View>
            <View style={styles.planLine}>
              <Text style={styles.planLineLabel}>Usuarios incluidos</Text>
              <Text style={styles.planLineValue}>
                Hasta {displayData(companyData?.plan?.maxUsers, '0')}
              </Text>
            </View>
            <View style={styles.planLine}>
              <Text style={styles.planLineLabel}>Automatización con IA</Text>
              <Text style={styles.planActive}>
                {companyData?.plan?.features?.includes('analytics') ? 'Activa' : 'Inactiva'}
              </Text>
            </View>
            <View style={styles.planLine}>
              <Text style={styles.planLineLabel}>Siguiente cobro</Text>
              <Text style={styles.planLineValue}>
                {formatDate(companyData?.plan?.endDate)}
              </Text>
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
            <Text style={styles.metricNumber}>
              {displayData(companyData?.stats?.totalEmployees, '0')}
            </Text>
            <Text style={styles.metricSub}>Total registrados</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={styles.metricIconWrap}>
              <Ionicons name="time-outline" size={16} color={COLORS.textGray} />
            </View>
            <Text style={styles.metricTitle}>Turnos hoy</Text>
            <Text style={styles.metricNumber}>
              {displayData(companyData?.stats?.activeRequests, '0')}
            </Text>
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
