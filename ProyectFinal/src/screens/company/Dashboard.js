import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc, collection, getDocs, query, where, or } from 'firebase/firestore';
import { MenuFooterCompany } from '../../components';
import styles from '../../styles/screens/company/DashboardStyles';
import { COLORS } from '../../components/constants/theme';
import { getCurrentUser } from '../../services/authService';
import { db } from '../../config/firebaseConfig';

// 🔗 IDs reales de tus documentos de planes en la colección "planes"
const PLAN_DOC_IDS = {
  free: '4VmP8hBm5UQRLbx0FlVR',
  plus: 'iXEPW1ei0Zj3yhxjbvEv',
  pro: 'DJWvhUobjcGlfNHxjeKS',
  business: 'CY7vPGZgkiIVP5cgpznY',
};

// Normalizar lo que venga en plan.type a una key de plan
const getPlanKeyFromType = (planType) => {
  if (!planType) return null;
  const map = {
    basic: 'free', // tu viejo "basic" = free
    free: 'free',
    plus: 'plus',
    pro: 'pro',
    business: 'business',
    enterprise: 'business',
  };
  return map[planType] || null;
};

// Nombre bonito según el tipo
const getPlanName = (planType) => {
  const key = getPlanKeyFromType(planType);
  const names = {
    free: 'Free',
    plus: 'Plus',
    pro: 'Pro',
    business: 'Business',
  };
  return names[key] || 'Sin plan';
};

// Siguiente nivel de plan para el botón "Cambiar plan"
const getNextPlanKey = (currentKey) => {
  switch (currentKey) {
    case 'free':
      return 'plus';
    case 'plus':
      return 'pro';
    case 'pro':
      return 'business';
    default:
      return null; // ya está en el máximo o no tiene plan
  }
};

// Formatear fecha simple
const formatDate = (date) => {
  if (!date) return 'Sin fecha';
  return date.toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

// Calcular siguiente cobro: startDate + 1 periodo
const getNextBillingDateLabel = (startTimestamp, billingCycle = 'monthly') => {
  if (!startTimestamp) return 'Sin fecha';

  try {
    const startDate = startTimestamp.toDate
      ? startTimestamp.toDate()
      : new Date(startTimestamp);

    const next = new Date(startDate);

    if (billingCycle === 'monthly') {
      next.setMonth(next.getMonth() + 1);
    } else if (billingCycle === 'yearly') {
      next.setFullYear(next.getFullYear() + 1);
    }

    return formatDate(next);
  } catch (e) {
    return 'Sin fecha';
  }
};

const displayData = (value, fallback = 'Sin datos disponibles') => {
  if (value === null || value === undefined || value === '') return fallback;
  return value;
};

export default function Dashboard({ navigation }) {
  const [companyData, setCompanyData] = useState(null);
  const [planData, setPlanData] = useState(null); // datos del plan desde /planes
  const [totalMembers, setTotalMembers] = useState(0); // total de administradores + usuarios
  const [adminCount, setAdminCount] = useState(0); // solo administradores
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

      // 1) Leer empresa
      const companyDoc = await getDoc(doc(db, 'companies', user.uid));

      if (!companyDoc.exists()) {
        console.log('No se encontró documento de empresa');
        setLoading(false);
        return;
      }

      const data = companyDoc.data();
      setCompanyData(data);

      // 1b) Contar administradores ligados a esta empresa
      let admins = 0;
      let adminIds = [];
      try {
        const adminsQuery = query(
          collection(db, 'admins'),
          where('companyId', '==', user.uid)
        );
        const adminsSnap = await getDocs(adminsQuery);
        admins = adminsSnap.size;
        adminIds = adminsSnap.docs.map((docItem) => docItem.id);
        setAdminCount(admins);
      } catch (error) {
        console.error('Error al contar administradores:', error);
        setAdminCount(0);
      }

      // 2) Contar usuarios únicos en los grupos ligados a la empresa (memberIds sin duplicados)
      try {
        const groupsRef = collection(db, 'groups');
        const groupsQueries = [];

        // Preferimos filtrar por companyId si está presente en tus docs
        groupsQueries.push(query(groupsRef, where('companyId', '==', user.uid)));

        // Si no hubiera companyId, también intentamos por adminId (en bloques de 10 por la restricción de Firestore)
        if (adminIds.length) {
          const chunkSize = 10;
          for (let i = 0; i < adminIds.length; i += chunkSize) {
            const slice = adminIds.slice(i, i + chunkSize);
            groupsQueries.push(query(groupsRef, where('adminId', 'in', slice)));
          }
        }

        const memberSet = new Set();
        for (const qRef of groupsQueries) {
          const snap = await getDocs(qRef);
          snap.forEach((docItem) => {
            const members = docItem.data()?.memberIds;
            if (Array.isArray(members)) {
              members.forEach((m) => memberSet.add(m));
            }
          });
        }

        const uniqueMembers = memberSet.size;
        setTotalMembers(admins + uniqueMembers);
      } catch (error) {
        console.error('Error al contar miembros totales (admins + grupos):', error);
        setTotalMembers(admins);
      }

      // 3) A partir del tipo de plan de la empresa, leer su plan en /planes
      const planKey = getPlanKeyFromType(data.plan?.type);
      if (planKey) {
        const planDocId = PLAN_DOC_IDS[planKey];
        if (planDocId) {
          const planSnap = await getDoc(doc(db, 'planes', planDocId));
          if (planSnap.exists()) {
            setPlanData(planSnap.data());
          }
        }
      }
    } catch (error) {
      console.error('Error al cargar datos de empresa:', error);
    } finally {
      setLoading(false);
    }
  };

  // Estado de automatización: según plan activo + si el plan incluye "ia"
  const getAutomationLabel = () => {
    const isActive = companyData?.plan?.status === 'active';
    const hasIAFromPlan =
      Array.isArray(planData?.caracteristicas) &&
      planData.caracteristicas.includes('ia');

    return isActive && hasIAFromPlan ? 'Activa' : 'Inactiva';
  };

  // Siguiente cobro calculado
  const nextBillingLabel = getNextBillingDateLabel(
    companyData?.plan?.startDate,
    companyData?.payment?.billingCycle || 'monthly'
  );

  // Navegar para cambiar plan (siguiente nivel)
  const handleChangePlan = () => {
    const currentKey = getPlanKeyFromType(companyData?.plan?.type);
    const nextKey = getNextPlanKey(currentKey);

    navigation.navigate('Plan', {
      tab: 'plans',
      suggestedUpgrade: nextKey,
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View
          style={[
            styles.container,
            { justifyContent: 'center', alignItems: 'center' },
          ]}
        >
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={{ marginTop: 16, color: COLORS.textGray }}>
            Cargando datos...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.headerIconLeft}>
          {/* espacio para menú si luego quieres */}
        </Pressable>
        <Text style={styles.headerTitle}>TurnMate</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Tarjeta Empresa + Plan */}
        <View style={styles.card}>
          <View style={styles.companyRow}>
            <View style={styles.companyAvatar}>
              {companyData?.logo ? (
                <Image
                  source={{ uri: companyData.logo }}
                  style={styles.companyAvatarImage}
                />
              ) : (
                <Text style={styles.companyAvatarInitials}>
                  {(companyData?.companyName?.[0] || '?').toUpperCase()}
                </Text>
              )}
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
                Hasta {displayData(planData?.maxUsuarios, '0')}
              </Text>
            </View>
            <View style={styles.planLine}>
              <Text style={styles.planLineLabel}>Automatización con IA</Text>
              <Text style={styles.planActive}>{getAutomationLabel()}</Text>
            </View>
            <View style={styles.planLine}>
              <Text style={styles.planLineLabel}>Siguiente cobro</Text>
              <Text style={styles.planLineValue}>{nextBillingLabel}</Text>
            </View>
          </View>

          <View style={styles.planActionsRow}>
            <Pressable style={styles.btnPrimary} onPress={handleChangePlan}>
              <Ionicons
                name="arrow-forward"
                size={16}
                color={COLORS.textWhite}
              />
              <Text style={styles.btnPrimaryText}>Cambiar plan</Text>
            </Pressable>
          </View>
        </View>

        {/* Métricas (3 columnas) */}
        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <View style={styles.metricIconWrap}>
              <Ionicons
                name="people-outline"
                size={16}
                color={COLORS.textGray}
              />
            </View>
            <Text style={styles.metricTitle}>Miembros</Text>
            <Text style={styles.metricNumber}>
              {totalMembers}
            </Text>
            <Text style={styles.metricSub}>Total registrados</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={styles.metricIconWrap}>
              <Ionicons
                name="time-outline"
                size={16}
                color={COLORS.textGray}
              />
            </View>
            <Text style={styles.metricTitle}>Turnos hoy</Text>
            <Text style={styles.metricNumber}>
              {displayData(companyData?.stats?.activeRequests, '0')}
            </Text>
            <Text style={styles.metricSub}>En curso</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={styles.metricIconWrap}>
              <Ionicons
                name="shield-checkmark-outline"
                size={16}
                color={COLORS.textGray}
              />
            </View>
            <Text style={styles.metricTitle}>Administradores</Text>
            <Text style={styles.metricNumber}>
              {adminCount}
            </Text>
            <Text style={styles.metricSub}>Activos</Text>
          </View>
        </View>

        {/* Resumen de hoy */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Resumen de hoy</Text>

          <Pressable style={styles.listItem}>
            <Ionicons
              name="sparkles-outline"
              size={18}
              color={COLORS.primary}
            />
            <Text style={styles.listItemText}>
              IA reasignó 2 turnos por ausencia
            </Text>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={COLORS.textGray}
            />
          </Pressable>

          <Pressable style={styles.listItem}>
            <Ionicons
              name="alert-circle-outline"
              size={18}
              color={COLORS.primary}
            />
            <Text style={styles.listItemText}>
              Próximo turno crítico en 1h
            </Text>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={COLORS.textGray}
            />
          </Pressable>
        </View>
      </ScrollView>

      <MenuFooterCompany />
    </SafeAreaView>
  );
}
