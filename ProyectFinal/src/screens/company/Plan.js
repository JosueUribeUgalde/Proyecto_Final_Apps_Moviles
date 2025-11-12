import React, { useMemo, useState, useRef } from "react";
import { View, Text, ScrollView, Pressable, FlatList, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import styles from "../../styles/screens/company/PlanStyles";
import { MenuFooterCompany } from "../../components";
import PaymentMethod from "./PaymentMethod";

// Seleccionador de pestañas
const Selector = ({ value, onChange }) => {
  const items = useMemo(() => ([
    { key: "plans", label: "Planes" },
    { key: "payments", label: "Métodos de pago" },
  ]), []);
  return (
    <View style={styles.selector}>
      {items.map((it) => {
        const active = it.key === value;
        return (
          <Pressable key={it.key} onPress={() => onChange(it.key)} style={[styles.segmentBtn, active && styles.segmentBtnActive]}>
            <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{it.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
};

// Datos de planes
const PLANS = [
  {
    id: "Free",
    tier: "Free",
    tagline: "Para empezar sin costo",
    price: "$0",
    period: "mx /mes",
    tone: undefined,
    badge: { label: "Actual", tone: "success" },
    blocks: {
      incluye: [
        "Hasta 10 miembros",
        "Tableros y tareas básicas",
        "Reasignación básica con IA",
        "Panel de administración",
      ],
      limites: [
        "Historial 30 días",
        "2 grupos de trabajo",
      ],
      soporte: ["Centro de ayuda y comunidad"],
    },
  },
  {
    id: "Plus",
    tier: "Plus",
    tagline: "Para equipos en crecimiento",
    price: "$199",
    period: "mx /mes",
    tone: undefined,
    badge: { label: "Ahorra 15% anual", tone: "primary" },
    blocks: {
      incluye: [
        "Hasta 25 miembros",
        "Automatizaciones básicas",
        "Asignación por carga y skills",
        "Panel de administración avanzado",
      ],
      limites: ["Historial 1 año", "Proyectos ilimitados (uso justo)"],
      soporte: ["Soporte por email 24-48h"],
    },
  },
  {
    id: "Pro",
    tier: "Pro",
    tagline: "Control y SLA",
    price: "$799",
    period: "mx /mes",
    tone: "pro",
    badge: { label: "Recomendado", tone: "primary" },
    blocks: {
      incluye: [
        "Hasta 100 miembros",
        "SSO, roles granulares",
        "Automatizaciones avanzadas + IA asistida",
        "Panel de administración avanzado",
      ],
      limites: ["Historial 3 años"],
      soporte: ["SLA 24/7 priorizado"],
    },
  },
  {
    id: "Business",
    tier: "Business",
    tagline: "Ilimitado, seguridad y cuenta dedicada",
    price: "Contactar",
    period: "",
    tone: undefined,
    badge: { label: "Personalizado", tone: "primary" },
    blocks: {
      incluye: [
        "Miembros ilimitados",
        "Integraciones avanzadas y auditoría",
        "Onboarding y Gerente de cuenta",
        "Panel de administración avanzado",
      ],
      limites: ["Contratos y facturación anual", "Cumplimiento y seguridad"],
      soporte: ["SLA personalizado + canal dedicado"],
    },
  },
];

// componnentes dentro de tarjeta de plan
const Badge = ({ label }) => (
  <View style={styles.planBadge}><Text style={styles.planBadgeText}>{label}</Text></View>
);

const Bullets = ({ items, icon = "checkmark-circle", iconStyle }) => (
  <View style={styles.features}>
    {items.map((t, i) => (
      <View key={i} style={styles.featureRow}>
        <Ionicons name={icon} size={18} style={[styles.featureIcon, iconStyle]} />
        <Text style={styles.featureText}>{t}</Text>
      </View>
    ))}
  </View>
);

// Tarjeta de plan
const PlanCard = ({ plan, onPress }) => {
  const toneStyle = plan.tone === "pro" ? styles.card_pro : null;
  return (
    <View style={[styles.card, toneStyle]}>
      <View style={styles.cardTop}>
        <View style={styles.planTierRow}>
          <Text style={styles.planTier}>{plan.tier}</Text>
          {plan.badge && <Badge label={plan.badge.label} />}
        </View>
      </View>

      <Text style={styles.planTagline}>{plan.tagline}</Text>

      <View style={styles.priceRow}>
        <Text style={styles.price}>{plan.price}</Text>
        {!!plan.period && <Text style={styles.pricePeriod}>{plan.period}</Text>}
      </View>

      <View style={styles.featureGroup}>
        <Text style={styles.featureHeader}>Incluye</Text>
        <Bullets items={plan.blocks.incluye} />
      </View>

      <View style={styles.featureGroup}>
        <Text style={styles.featureHeader}>Límites</Text>
        <Bullets items={plan.blocks.limites} icon="alert-circle" iconStyle={styles.limitIcon} />
      </View>

      <View style={styles.featureGroup}>
        <Text style={styles.featureHeader}>Soporte</Text>
        <Bullets items={plan.blocks.soporte} icon="headset" iconStyle={styles.limitIcon} />
      </View>

      <Pressable onPress={() => onPress(plan)} style={styles.ctaBtn}>
        <Text style={styles.ctaBtnText}>
          {plan.price === "Contactar" ? "Hablar con ventas" : `Elegir ${plan.tier}`}
        </Text>
      </Pressable>
    </View>
  );
};

export default function Plan() {
  const [tab, setTab] = useState("plans");
  const payScrollRef = useRef(null);
  const onChoosePlan = (p) => console.log("Elegir plan:", p.id);

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.headerBtn}
          onPress={() => navigation.navigate("Dashboard")}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </Pressable>
        <Text style={styles.headerTitle}>Planes</Text>
      </View>

      {/* Selector de pestañas */}
      <Selector value={tab} onChange={setTab} />

      {/* Si la pestaña seleccionada es "Planes" */}
      {tab === "plans" ? (
        // ----- Sección de planes -----
        <ScrollView ref={payScrollRef} contentContainerStyle={styles.scrollPad}>
          <FlatList
            data={PLANS} // lista de planes disponibles
            keyExtractor={(it) => it.id}
            renderItem={({ item }) => <PlanCard plan={item} onPress={onChoosePlan} />}
            contentContainerStyle={styles.listGap}
            scrollEnabled={false}
          />
        </ScrollView>
      ) : (
        // Sección de métodos de pago (dividida a otro archivo)
        <KeyboardAvoidingView
          behavior={Platform.select({ ios: "padding", android: undefined })}
          style={{ flex: 1 }}
        >
          <PaymentMethod />
        </KeyboardAvoidingView>
      )}

      <MenuFooterCompany />
    </SafeAreaView>
  );
}