// paymentMethod.js
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../../styles/screens/company/PlanStyles";
import { getCurrentUser } from "../../services/authService";
import { db } from "../../config/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import InfoModal from "../../components/InfoModal";

// Tarjeta de método de pago
const MethodCard = ({ item, onRemove }) => {
  const isDefault = true;
  const isWire = item.id === "wire";

  return (
    <View style={styles.methodCard}>
      <View style={styles.methodTitleRow}>
        <Ionicons name={item.icon} size={20} />
        <Text style={styles.methodTitle}>{item.label}</Text>
        {isDefault && (
          <View style={styles.defaultChip}>
            <Text style={styles.defaultChipText}>Predeterminada</Text>
          </View>
        )}
      </View>

      <View style={styles.methodMetaRow}>
        {item.meta?.map((m, i) => (
          <Text key={i} style={styles.metaText}>{m}</Text>
        ))}
      </View>

      {/* Para Transferencia bancaria: NO mostrar botones; en su lugar, número de cuenta/CLABE (estático) */}
      {isWire ? (
        <View style={{ marginTop: 8 }}>
          <Text style={styles.sectionSubtitle}>Número de cuenta / CLABE</Text>
          <TextInput
            style={styles.input}
            placeholder="cuenta bancaria"
            value={item.accountNumber || ""}
            onChangeText={(txt) => onUpdateWireAccount?.(txt)}
            keyboardType="number-pad"
            editable={false}
          />
        </View>
      ) : (
        // Acciones para la tarjeta única
        <View style={styles.rowActions}>
          <Pressable onPress={() => onRemove(item)} style={styles.outlineBtn}>
            <Text style={styles.outlineText}>Eliminar</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default function PaymentMethod() {
  const payScrollRef = useRef(null);
  const scrollToForm = () => payScrollRef.current?.scrollToEnd({ animated: true });
  const [editId, setEditId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Métodos de pago
  const [methods, setMethods] = useState([]);
  const [removing, setRemoving] = useState(false);

  // Campos para tarjetas
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [exp, setExp] = useState("");
  const [cvc, setCvc] = useState("");
  const [billingStreet, setBillingStreet] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const loadPayment = async () => {
      try {
        const user = getCurrentUser();
        if (!user) {
          setLoading(false);
          return;
        }

        const snap = await getDoc(doc(db, "companies", user.uid));
        if (snap.exists()) {
          const data = snap.data();
          const lastFour = data.payment?.lastFourDigits;
          const method = data.payment?.method;
          const cycle = data.payment?.billingCycle || "monthly";
          if (method === "card" && lastFour) {
            const card = {
              id: "card-db",
              icon: "card-outline",
              label: `Tarjeta **** ${lastFour}`,
              default: true,
              meta: [`Facturación ${cycle}`],
            };
            setMethods([card]);
          }
        }
      } catch (error) {
        console.error("Error al cargar metodos de pago:", error);
      } finally {
        setLoading(false);
      }
    };
    loadPayment();
  }, []);

  // Actualizar el número de cuenta para transferencia bancaria (aunque en UI está bloqueado)
  const updateWireAccount = (value) => {
    setMethods((prev) =>
      prev.map((m) => (m.id === "wire" ? { ...m, accountNumber: value } : m))
    );
  };

  const onRemove = async (m) => {
    setRemoving(true);
    try {
      const user = getCurrentUser();
      if (user) {
        await updateDoc(doc(db, "companies", user.uid), {
          "payment.method": null,
          "payment.lastFourDigits": null,
          "payment.billingCycle": "monthly",
          "payment.cardName": null,
          "payment.exp": null,
          "payment.billingStreet": null,
          "payment.billingCity": null,
          "payment.billingZip": null,
        });
      }
      setMethods([]);
    } catch (error) {
      console.error("Error al eliminar metodo:", error);
      setModalTitle("Error");
      setModalMessage("No se pudo eliminar el método.");
      setShowModal(true);
    } finally {
      setRemoving(false);
    }
  };

  const onSaveMethod = async () => {
    const digits = cardNumber.replace(/\D/g, "");
    if (!cardName || cardName.trim().length < 3) {
      setModalTitle("Dato faltante");
      setModalMessage("Ingresa el nombre en la tarjeta.");
      setShowModal(true);
      return;
    }
    if (!digits || digits.length !== 18) {
      setModalTitle("Tarjeta inválida");
      setModalMessage("La tarjeta debe tener 18 dígitos.");
      setShowModal(true);
      return;
    }
    if (!exp || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(exp)) {
      setModalTitle("Fecha inválida");
      setModalMessage("Usa formato MM/AA.");
      setShowModal(true);
      return;
    }
    if (!cvc || cvc.replace(/\D/g, "").length !== 3) {
      setModalTitle("CVC inválido");
      setModalMessage("El CVC debe tener 3 dígitos.");
      setShowModal(true);
      return;
    }
    if (zip && zip.replace(/\D/g, "").length > 0 && zip.replace(/\D/g, "").length < 5) {
      setModalTitle("Código postal inválido");
      setModalMessage("Completa los 5 dígitos.");
      setShowModal(true);
      return;
    }

    setSaving(true);
    try {
      const user = getCurrentUser();
      if (!user) {
        setModalTitle("Sesión");
        setModalMessage("No hay sesión activa.");
        setShowModal(true);
        return;
      }

      // Persistir en Firestore
      await updateDoc(doc(db, "companies", user.uid), {
        "payment.method": "card",
        "payment.lastFourDigits": digits.slice(-4),
        "payment.billingCycle": "monthly",
        "payment.cardName": cardName.trim(),
        "payment.exp": exp,
        "payment.billingStreet": billingStreet || null,
        "payment.billingCity": city || null,
        "payment.billingZip": zip || null,
      });

      // Actualizar UI local
      const newCard = {
        id: `card-${Date.now()}`,
        icon: "card-outline",
        label: `Tarjeta **** ${digits.slice(-4)}`,
        default: true,
        meta: [`Vence ${exp || "MM/AA"}`, "Facturacion mensual"],
      };
      setMethods([newCard]);
      setCardName("");
      setCardNumber("");
      setExp("");
      setCvc("");
      setBillingStreet("");
      setCity("");
      setZip("");
      setEditId(null);
      setModalTitle("Método guardado");
      setModalMessage("Método de pago guardado en tu cuenta.");
      setShowModal(true);
    } catch (error) {
      console.error("Error al guardar metodo:", error);
      setModalTitle("Error");
      setModalMessage("No se pudo guardar el método de pago.");
      setShowModal(true);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingTop: 40 }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 8 }}>Cargando metodos...</Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView ref={payScrollRef} contentContainerStyle={styles.scrollPad}>
        {/* Resumen / relevancia de pago */}
        <View style={styles.payHero}>
          <Text style={styles.payHeroTitle}>Método predeterminado</Text>
          <Text style={styles.payHeroSubtitle}>
            Se utilizará para renovaciones y cargos automáticos. 
            Puedes cambiarlo en cualquier momento.
          </Text>
          {methods.slice(0, 1).map((m) => (
            <View key={m.id} style={styles.methodTitleRow}>
              <Ionicons name={m.icon} size={20} />
              <Text style={styles.methodTitle}>{m.label}</Text>
              <View style={styles.defaultChip}>
                <Text style={styles.defaultChipText}>Activo</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Lista de todos los métodos de pago */}
        <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Tus métodos</Text>
        <View style={styles.methodsList}>
          {methods.map((m) => (
            <MethodCard
              key={m.id}
              item={m}
              onRemove={onRemove}
              onUpdateWireAccount={(val) => updateWireAccount(val)}
            />
          ))}
        </View>

        {/* Formulario para agregar o editar método (tarjetas) */}
        <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Añadir nuevo método</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre en la tarjeta"
          value={cardName}
          onChangeText={setCardName}
          onFocus={scrollToForm}
        />
        <TextInput
          style={styles.input}
          placeholder="Número de tarjeta (18 dígitos)"
          value={cardNumber}
          onChangeText={(text) => setCardNumber(text.replace(/\D/g, "").slice(0, 18))}
          keyboardType="number-pad"
          onFocus={scrollToForm}
          maxLength={18}
        />

        {/* Campos de fecha y CVC */}
        <View style={styles.row2}>
          <TextInput
            style={[styles.input, styles.rowItem]}
            placeholder="MM/AA"
            value={exp}
            onChangeText={(text) => {
              const digits = text.replace(/\D/g, "").slice(0, 4);
              const formatted = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
              setExp(formatted);
            }}
            keyboardType="number-pad"
            onFocus={scrollToForm}
            maxLength={5}
          />
          <TextInput
            style={[styles.input, styles.rowItem]}
            placeholder="CVC"
            value={cvc}
            onChangeText={(text) => setCvc(text.replace(/\D/g, "").slice(0, 3))}
            secureTextEntry
            keyboardType="number-pad"
            onFocus={scrollToForm}
            maxLength={3}
          />
        </View>
        <Text style={styles.metaText}>Formato fecha MM/AA · CVC de 3 dígitos</Text>

        {/* Campos de dirección */}
        <TextInput
          style={styles.input}
          placeholder="Calle y número (opcional)"
          value={billingStreet}
          onChangeText={setBillingStreet}
          onFocus={scrollToForm}
        />
        <View style={styles.row2}>
          <TextInput
            style={[styles.input, styles.rowItem]}
            placeholder="Ciudad (opcional)"
            value={city}
            onChangeText={setCity}
            onFocus={scrollToForm}
          />
          <TextInput
            style={[styles.input, styles.rowItem]}
            placeholder="Código postal (opcional)"
            value={zip}
            onChangeText={setZip}
            keyboardType="number-pad"
            onFocus={scrollToForm}
          />
        </View>

        {/* Botón guardar (afecta tarjetas; transferencia no lo necesita) */}
        <Pressable onPress={onSaveMethod} style={styles.saveBtn} disabled={saving}>
          {saving ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.saveBtnText}>Guardar método</Text>
          )}
        </Pressable>
      </ScrollView>

      <InfoModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        title={modalTitle}
        message={modalMessage}
      />
    </>
  );
}
