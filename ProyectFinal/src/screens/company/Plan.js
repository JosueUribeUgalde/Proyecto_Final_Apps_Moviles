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
  Modal,
  TextInput,
  Alert,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import styles from "../../styles/screens/company/PlanStyles";
import { MenuFooterCompany } from "../../components";
import PaymentMethod from "./PaymentMethod";

// 🔥 Firebase
import { db } from "../../config/firebaseConfig";
import { collection, onSnapshot, query, orderBy, updateDoc, doc, serverTimestamp, getDoc, arrayUnion } from "firebase/firestore";
import { getCurrentUser } from "../../services/authService";

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
  const [planes, setPlanes] = useState([]);
  const [cargandoPlanes, setCargandoPlanes] = useState(true);

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [paying, setPaying] = useState(false);
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [exp, setExp] = useState("");
  const [cvc, setCvc] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [savedPayment, setSavedPayment] = useState(null);
  const [useSavedCard, setUseSavedCard] = useState(false);

  const onChoosePlan = (p) => {
    if (p.id === "business") {
      const phone = "5646672817";
      Linking.openURL(`https://wa.me/${phone}`).catch(() =>
        Alert.alert("WhatsApp", "No se pudo abrir WhatsApp")
      );
      return;
    }
    setSelectedPlan(p);
    setShowCheckout(true);
    setSuccessMessage("");
  };

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
              logicalId === "business"
                ? "Ponte en contacto"
                : data.precio === null || data.precio === undefined
                  ? "Contactar"
                  : `$${data.precio}`,

            period: data.periodo
              ? `mx /${data.periodo}`
              : "",

            tone,
            badge,
            priceValue: typeof data.precio === "number" ? data.precio : null,
            maxUsers: data.maxUsers || data.maxUsuarios || 10,

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

  // cargar tarjeta guardada
  useEffect(() => {
    const loadPayment = async () => {
      try {
        const user = getCurrentUser();
        if (!user) return;
        const snap = await getDoc(doc(db, "companies", user.uid));
        if (!snap.exists()) return;
        const pay = snap.data().payment;
        if (pay?.method === "card" && pay?.lastFourDigits) {
          setSavedPayment(pay);
          setUseSavedCard(true);
        }
      } catch (e) {
        console.error("Error cargando pago guardado", e);
      }
    };
    loadPayment();
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

      <Modal
        visible={showCheckout}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCheckout(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Confirmar compra</Text>
              <Pressable onPress={() => setShowCheckout(false)} style={styles.modalCloseBtn}>
                <Ionicons name="close" size={22} color="black" />
              </Pressable>
            </View>

            <Text style={styles.modalSubtitle}>
              Plan seleccionado: {selectedPlan?.tier}
            </Text>
            <Text style={styles.modalPrice}>
              {selectedPlan?.price || "$0"} {selectedPlan?.period}
            </Text>

            {savedPayment ? (
              <View style={styles.payHero}>
                <Text style={styles.payHeroTitle}>Usar tarjeta guardada</Text>
                <Text style={styles.payHeroSubtitle}>Tarjeta **** {savedPayment.lastFourDigits}</Text>
                <View style={styles.rowActions}>
                  <Pressable
                    style={[styles.ghostBtn, { flex: 1 }, useSavedCard && { opacity: 0.9 }]}
                    onPress={() => setUseSavedCard(true)}
                  >
                    <Text style={styles.ghostText}>Pagar con tarjeta guardada</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.outlineBtn, { flex: 1 }, !useSavedCard && { opacity: 0.9 }]}
                    onPress={() => setUseSavedCard(false)}
                  >
                    <Text style={styles.outlineText}>Actualizar tarjeta</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <Text style={styles.modalSubtitle}>Agrega una tarjeta para pagar</Text>
            )}

            {!useSavedCard && (
              <>
                <View style={styles.modalField}>
                  <Text style={styles.modalLabel}>Nombre en la tarjeta</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="Nombre Apellido"
            value={cardName}
            onChangeText={setCardName}
                  />
                </View>

                <View style={styles.modalField}>
                  <Text style={styles.modalLabel}>Numero de tarjeta (18 dígitos)</Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="##################"
                    value={cardNumber}
                    keyboardType="number-pad"
                    onChangeText={(text) => setCardNumber(text.replace(/\D/g, "").slice(0, 18))}
                    maxLength={18}
                  />
                </View>

                <View style={styles.modalRow}>
                  <View style={[styles.modalField, { flex: 1 }]}>
                    <Text style={styles.modalLabel}>Exp MM/AA</Text>
                    <TextInput
                      style={styles.modalInput}
                      placeholder="04/27"
                      value={exp}
                      keyboardType="number-pad"
                      onChangeText={(text) => {
                        const digits = text.replace(/\D/g, "").slice(0, 4);
                        const formatted = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
                        setExp(formatted);
                      }}
                      maxLength={5}
                    />
                  </View>
                  <View style={[styles.modalField, { flex: 1 }]}>
                    <Text style={styles.modalLabel}>CVC</Text>
                    <TextInput
                      style={styles.modalInput}
                      placeholder="123"
                      value={cvc}
                      keyboardType="number-pad"
                      secureTextEntry
                      onChangeText={(text) => setCvc(text.replace(/\D/g, "").slice(0, 3))}
                      maxLength={3}
                    />
                  </View>
                </View>
              </>
            )}

            {!!successMessage && (
              <Text style={styles.successText}>{successMessage}</Text>
            )}

            <Pressable
              style={[styles.modalPayBtn, paying && { opacity: 0.6 }]}
              disabled={paying}
              onPress={async () => {
                const digits = cardNumber.replace(/\D/g, "");
                if (!useSavedCard) {
                  if (!cardName || cardName.trim().length < 3) {
                    Alert.alert("Tarjeta invalida", "Ingresa el nombre en la tarjeta.");
                    return;
                  }
                  if (!digits || digits.length !== 18) {
                    Alert.alert("Tarjeta invalida", "La tarjeta debe tener 18 dígitos.");
                    return;
                  }
                  if (!exp || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(exp)) {
                    Alert.alert("Fecha invalida", "Usa formato MM/AA.");
                    return;
                  }
                  if (!cvc || cvc.replace(/\D/g, "").length !== 3) {
                    Alert.alert("CVC invalido", "El CVC debe tener 3 dígitos.");
                    return;
                  }
                } else if (!savedPayment) {
                  Alert.alert("Sin tarjeta", "No hay tarjeta guardada, agrega una nueva.");
                  return;
                }
                if (!selectedPlan) return;
                setPaying(true);
                try {
                  const user = getCurrentUser();
                  if (!user) {
                    Alert.alert("Sesion", "No hay sesion activa");
                    return;
                  }
                  const companyRef = doc(db, "companies", user.uid);
                  const companySnap = await getDoc(companyRef);
                  let phone = null;
                  if (companySnap.exists()) {
                    phone = companySnap.data()?.phone || null;
                  }
                  const invoiceId = `INV-${Date.now()}`;
                  const amountNumber = typeof selectedPlan.priceValue === "number" ? selectedPlan.priceValue : 0;

                  const paymentUpdate = useSavedCard && savedPayment
                    ? {
                        method: savedPayment.method,
                        lastFourDigits: savedPayment.lastFourDigits,
                        cardName: savedPayment.cardName || null,
                        exp: savedPayment.exp || null,
                        billingStreet: savedPayment.billingStreet || null,
                        billingCity: savedPayment.billingCity || null,
                        billingZip: savedPayment.billingZip || null,
                      }
                    : {
                        method: "card",
                        lastFourDigits: digits.slice(-4),
                        cardName: cardName.trim(),
                        exp,
                        billingStreet: null,
                        billingCity: null,
                        billingZip: null,
                      };

                  await updateDoc(companyRef, {
                    plan: {
                      type: selectedPlan.id,
                      status: "active",
                      features: selectedPlan.blocks?.incluye || [],
                      maxUsers: selectedPlan.maxUsers || 10,
                      startDate: serverTimestamp(),
                      endDate: null,
                      price: selectedPlan.priceValue || null,
                      period: selectedPlan.period || "monthly",
                    },
                    "payment.billingCycle": "monthly",
                    "payment.method": paymentUpdate.method,
                    "payment.lastFourDigits": paymentUpdate.lastFourDigits,
                    "payment.cardName": paymentUpdate.cardName,
                    "payment.exp": paymentUpdate.exp,
                    "payment.billingStreet": paymentUpdate.billingStreet,
                    "payment.billingCity": paymentUpdate.billingCity,
                    "payment.billingZip": paymentUpdate.billingZip,
                    "payment.phone": phone,
                    invoices: arrayUnion({
                      id: invoiceId,
                      amount: amountNumber,
                      plan: selectedPlan.id,
                      status: "pagada",
                      issuedAt: serverTimestamp(),
                      paidAt: serverTimestamp(),
                      period: "mensual",
                    }),
                  });

                  setSuccessMessage("Compra realizada por un mes. Plan activado.");
                  setTimeout(() => {
                    setShowCheckout(false);
                    setCardName("");
                    setCardNumber("");
                    setExp("");
                    setCvc("");
                    setSuccessMessage("");
                  }, 1600);
                } catch (error) {
                  console.error("Error al procesar pago:", error);
                  Alert.alert("Error", "No se pudo completar el pago.");
                } finally {
                  setPaying(false);
                }
              }}
            >
              {paying ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.modalPayText}>Pagar y activar</Text>
              )}
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
