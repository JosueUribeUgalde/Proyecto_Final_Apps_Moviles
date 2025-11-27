import React, { useMemo, useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import styles from "../../styles/screens/company/PlanStyles";
import { MenuFooterCompany } from "../../components";
import PaymentMethod from "./PaymentMethod";

// 🔥 Firebase
import { db } from "../../config/firebaseConfig";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

// Seleccionador de pestañas
const Selector = ({ value, onChange }) => {
  const items = useMemo(
    () => [
      { key: "plans", label: "Planes" },
      { key: "payments", label: "Métodos de pago" },
    ],
    []
  );
  return (
    <View style={styles.selector}>
      {items.map((it) => {
        const active = it.key === value;
        return (
          <Pressable
            key={it.key}
            onPress={() => onChange(it.key)}
            style={[styles.segmentBtn, active && styles.segmentBtnActive]}
          >
            <Text style={[styles.segmentText, active && styles.segmentTextActive]}>
              {it.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

// componnentes dentro de tarjeta de plan
const Badge = ({ label }) => (
  <View style={styles.planBadge}>
    <Text style={styles.planBadgeText}>{label}</Text>
  </View>
);

const Bullets = ({ items, icon = "checkmark-circle", iconStyle }) => {
  const safeItems = Array.isArray(items) ? items : [];
  return (
    <View style={styles.features}>
      {safeItems.map((t, i) => (
        <View key={i} style={styles.featureRow}>
          <Ionicons name={icon} size={18} style={[styles.featureIcon, iconStyle]} />
          <Text style={styles.featureText}>{t}</Text>
        </View>
      ))}
    </View>
  );
};

// Tarjeta de plan (la dejamos igual, ya que vamos a adaptar los datos)
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
        <Bullets
          items={plan.blocks.limites}
          icon="alert-circle"
          iconStyle={styles.limitIcon}
        />
      </View>

      <View style={styles.featureGroup}>
        <Text style={styles.featureHeader}>Soporte</Text>
        <Bullets
          items={plan.blocks.soporte}
          icon="headset"
          iconStyle={styles.limitIcon}
        />
      </View>

      <Pressable onPress={() => onPress(plan)} style={styles.ctaBtn}>
        <Text style={styles.ctaBtnText}>
          {plan.price === "Contactar" ? "Hablar con ventas" : `Elegir ${plan.tier}`}
        </Text>
      </Pressable>
    </View>
  );
};

export default function Plan({ navigation }) {
  const [tab, setTab] = useState("plans");
  const payScrollRef = useRef(null);

  // 🔥 NUEVO: estados para planes desde Firestore
  const [planes, setPlanes] = useState([]);
  const [cargandoPlanes, setCargandoPlanes] = useState(true);

  const onChoosePlan = (p) => console.log("Elegir plan:", p.id);

  // Escuchar colección "planes"
  useEffect(() => {
    const colRef = collection(db, "planes");
    const qPlanes = query(colRef, orderBy("orden", "asc"));

    const unsubscribe = onSnapshot(
      qPlanes,
      (snap) => {
        const lista = snap.docs.map((docSnap) => {
          const data = docSnap.data();
          const logicalId = data.id || docSnap.id; // "free", "plus", "pro", "business"

          // Mapeamos los datos en español a la estructura que ya usaba tu UI
          let tone = undefined;
          let badge = null;

          switch (logicalId) {
            case "free":
              badge = { label: "Actual", tone: "success" };
              break;
            case "plus":
              badge = { label: "Ahorra 15% anual", tone: "primary" };
              break;
            case "pro":
              badge = { label: "Recomendado", tone: "primary" };
              tone = "pro";
              break;
            case "business":
              badge = { label: "Personalizado", tone: "primary" };
              break;
          }

          return {
            id: logicalId, // usamos el id lógico
            tier: data.nombre || logicalId, // título del plan
            tagline: data.eslogan || "",

            price:
              data.precio === null || data.precio === undefined
                ? "Contactar"
                : `$${data.precio}`,

            period: data.periodo
              ? `mx /${data.periodo}`
              : "",

            tone,
            badge,

            blocks: {
              incluye: Array.isArray(data.bloques?.incluye) ? data.bloques.incluye : [],
              limites: Array.isArray(data.bloques?.limites) ? data.bloques.limites : [],
              soporte: Array.isArray(data.bloques?.soporte) ? data.bloques.soporte : [],
            },
          };
        });

        setPlanes(lista);
        setCargandoPlanes(false);
      },
      (error) => {
        console.error("Error escuchando planes:", error);
        setCargandoPlanes(false);
      }
    );

    return () => unsubscribe();
  }, []);

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
        cargandoPlanes ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingTop: 40,
            }}
          >
            <ActivityIndicator size="large" />
            <Text style={{ marginTop: 8 }}>Cargando planes...</Text>
          </View>
        ) : (
          // ----- Sección de planes -----
          <ScrollView ref={payScrollRef} contentContainerStyle={styles.scrollPad}>
            <FlatList
              data={planes}
              keyExtractor={(it) => it.id}
              renderItem={({ item }) => (
                <PlanCard plan={item} onPress={onChoosePlan} />
              )}
              contentContainerStyle={styles.listGap}
              scrollEnabled={false}
            />
          </ScrollView>
        )
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
