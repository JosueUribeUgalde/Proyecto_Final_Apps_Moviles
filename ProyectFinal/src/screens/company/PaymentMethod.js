// paymentMethod.js
import React, { useRef, useState } from "react";
import { View, Text, ScrollView, Pressable, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../../styles/screens/company/PlanStyles";

// Tarjeta de método de pago
const MethodCard = ({ item, onSetDefault, onEdit, onRemove, onUpdateWireAccount }) => {
  const isDefault = item.default === true;
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
            editable={false}/>
        </View>
      ) : (
        // Para los demás métodos, dejamos las acciones como estaban
        <View style={styles.rowActions}>
          <Pressable onPress={() => onSetDefault(item)} style={styles.ghostBtn}>
            <Text style={styles.ghostText}>{isDefault ? "Seleccionada" : "Usar por defecto"}</Text>
          </Pressable>
          <Pressable onPress={() => onEdit(item)} style={styles.outlineBtn}>
            <Text style={styles.outlineText}>Editar</Text>
          </Pressable>
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

  // Métodos de pago (la CLABE de 'wire' estática, generada al azar)
  const [methods, setMethods] = useState([
    {
      id: "card-4242",
      icon: "card-outline",
      label: "Visa •••• 4242",
      default: true,
      meta: ["Vence 04/27", "Facturación mensual"],
    },
    {
      id: "wire",
      icon: "cash-outline",
      label: "Transferencia bancaria",
      default: false,
      meta: ["Facturación anual", "Procesa 1-2 días"],
      // CLABE/numero estático (falso) — 18 dígitos (ejemplo MX CLABE)
      accountNumber: "646180001234567890",
    },
  ]);

  // Actualizar el número de cuenta para transferencia bancaria (aunque en UI está bloqueado)
  const updateWireAccount = (value) => {
    setMethods((prev) =>
      prev.map((m) => (m.id === "wire" ? { ...m, accountNumber: value } : m))
    );
  };

  // Campos para tarjetas
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [exp, setExp] = useState("");
  const [cvc, setCvc] = useState("");
  const [billingStreet, setBillingStreet] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");

  // Acciones para tarjetas (la transferencia no necesita estas acciones)
  const setDefault = (m) =>
    setMethods((prev) =>
      prev
        .map((x) => ({ ...x, default: x.id === m.id }))
        .sort((a, b) => (a.default === b.default ? 0 : a.default ? -1 : 1))
    );

  const onEdit = (m) => {
    setEditId(m.id);
    const metaExp = m.meta?.find((x) => x.startsWith("Vence "))?.replace("Vence ", "") || "";
    setExp(metaExp);
    setCardName("");
    setCardNumber("");
    setCvc("");
    setBillingStreet("");
    setCity("");
    setZip("");
    setTimeout(scrollToForm, 0);
  };

  const onRemove = (m) => setMethods((prev) => prev.filter((x) => x.id !== m.id));

  const onSaveMethod = () => {
    if (editId) {
      setMethods((prev) =>
        prev.map((x) => {
          if (x.id !== editId) return x;
          const next = { ...x };
          if (cardNumber?.length >= 4) {
            next.label = `Tarjeta •••• ${cardNumber.slice(-4)}`;
          }
          if (exp) {
            const others = (next.meta || []).filter((m) => !m.startsWith("Vence "));
            next.meta = [`Vence ${exp}`, ...others];
          }
          return next;
        })
      );
      setEditId(null);
    } else {
      const m = {
        id: `card-${Date.now()}`,
        icon: "card-outline",
        label: `Tarjeta •••• ${cardNumber.slice(-4)}`,
        default: false,
        meta: [`Vence ${exp}`, "Facturación mensual"],
      };
      setMethods((prev) => [m, ...prev]);
      setTimeout(scrollToForm, 0);
    }
  };

  return (
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
            onSetDefault={setDefault}
            onEdit={onEdit}
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
        placeholder="Número de tarjeta"
        value={cardNumber}
        onChangeText={setCardNumber}
        keyboardType="number-pad"
        onFocus={scrollToForm}
      />

      {/* Campos de fecha y CVC */}
      <View style={styles.row2}>
        <TextInput
          style={[styles.input, styles.rowItem]}
          placeholder="MM/AA"
          value={exp}
          onChangeText={setExp}
          keyboardType="number-pad"
          onFocus={scrollToForm}
        />
        <TextInput
          style={[styles.input, styles.rowItem]}
          placeholder="CVC"
          value={cvc}
          onChangeText={setCvc}
          secureTextEntry
          keyboardType="number-pad"
          onFocus={scrollToForm}
        />
      </View>

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
      <Pressable onPress={onSaveMethod} style={styles.saveBtn}>
        <Text style={styles.saveBtnText}>Guardar método</Text>
      </Pressable>
    </ScrollView>
  );
}
