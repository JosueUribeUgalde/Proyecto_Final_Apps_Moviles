import React, { useMemo, useState, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  Pressable,
  TextInput,
  FlatList,
  RefreshControl,
  Alert,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import HeaderScreen from "../../components/HeaderScreen";
import MenuFooterCompany from "../../components/MenuFooterCompany";
import { COLORS } from "../../components/constants/theme";
import styles from "../../styles/screens/company/InvoiceHistoryStyles";
import { useNavigation } from "@react-navigation/native";

// Datos de facturas
const INVOICES = [
  { id: "INV-0123", title: "Marzo 2025",    issued: "05 Mar 2025", due: "05 Mar 2025", paid: null,         amount: 199, status: "proximo" },
  { id: "INV-0122", title: "Febrero 2025",  issued: "05 Feb 2025", due: "05 Feb 2025", paid: "06 Feb 2025", amount: 199, status:  "fallida", failNote: "Falló el pago" },
  { id: "INV-0121", title: "Enero 2025",    issued: "05 Ene 2025", due: "05 Ene 2025", paid: "06 Ene 2025", amount: 199, status: "pagada"  },
  { id: "INV-0120", title: "Diciembre 2024",issued: "05 Dic 2024", due: "05 Dic 2024", paid: "05 Dic 2024", amount: 199, status: "pagada"  },
  { id: "INV-0119", title: "Noviembre 2024",issued: "05 Nov 2024", due: "05 Nov 2024", paid: null,          amount: 199, status: "pagada" },
  { id: "INV-0118", title: "Octubre 2024",  issued: "05 Oct 2024", due: "05 Oct 2024", paid: "05 Oct 2024", amount: 199, status: "pagada"  },
];

// Etiquetas de estado
const STATUS_LABELS = {
  pagada: "Pagada",
  fallida: "Fallida",
  proximo: "Próximo mes",
};

// Dinero formateado
const money = (n) =>
  Number(n || 0).toLocaleString("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  });

export default function InvoiceHistory() {
  const navigation = useNavigation();

  const [query, setQuery] = useState("");
  const [period, setPeriod] = useState("12m");
  const [showPeriodModal, setShowPeriodModal] = useState(false);
  const [stateFilter, setStateFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);

  // Refrescar lista
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 900);
  }, []);

  // Cambiar filtro de estado
  const cycleStateFilter = useCallback(() => {
    const seq = ["all", "pagada", "proximo", "fallida"];
    setStateFilter((s) => seq[(seq.indexOf(s) + 1) % seq.length]);
  }, []);

  // Descargar PDF
  const handleOpenPDF = useCallback((inv) => {
    Alert.alert("Descargar PDF", `Generar/descargar PDF de ${inv.id}`, [
      { text: "Cancelar", style: "cancel" },
      { text: "Descargar", onPress: () => {} },
    ]);
  }, []);

  // Reintentar pago
  const handleRetryPayment = useCallback((inv) => {
    Alert.alert("Reintentar pago", `Reintentar cobro de ${inv.id}`, [
      { text: "Cancelar", style: "cancel" },
      { text: "Reintentar", onPress: () => {} },
    ]);
  }, []);

  // Total de facturado, pagado y próximo
  const summary = useMemo(() => {
    const total = INVOICES.reduce((a, i) => a + (i.amount || 0), 0);
    const proximo = INVOICES.filter((i) => i.status === "proximo").reduce((a, i) => a + (i.amount || 0), 0);
    const pagado = total - proximo;
    return { total, proximo, pagado, count: INVOICES.length };
  }, []);

  // Filtrado local por texto, estado y periodo
  const filteredData = useMemo(() => {
    return INVOICES.filter((inv) => {
      const hayTexto = `${inv.id} ${inv.title}`.toLowerCase().includes(query.trim().toLowerCase());
      const hayEstado = stateFilter === "all" ? true : inv.status === stateFilter;
      const hayPeriodo = ["12m", "6m", "3m"].includes(period);
      return hayTexto && hayEstado && hayPeriodo;
    });
  }, [query, stateFilter, period]);

  // Renderizado de cada factura
  const renderItem = useCallback(
    ({ item: inv }) => (
      <View style={styles.card}>
        {/* Header de la tarjeta */}
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <Ionicons name="document-text-outline" size={18} color={COLORS.textGray} />
            <Text style={styles.invTitle}>#{inv.id} — {inv.title}</Text>
          </View>

          <View style={[styles.badge, styles[`badge_${inv.status}`]]}>
            <Text style={[styles.badgeText, styles[`badgeText_${inv.status}`]]}>
              {STATUS_LABELS[inv.status]}
            </Text>
          </View>
        </View>

        {/* Metadatos (emitida / vencimiento o pagada) */}
        <View style={styles.metaRow}>
          <View style={styles.metaPair}>
            <Text style={styles.metaLabel}>Emitida:</Text>
            <Text style={styles.metaValue}>{inv.issued}</Text>
          </View>

          {inv.paid ? (
            <View style={styles.metaPair}>
              <Text style={styles.metaLabel}>Pagada:</Text>
              <Text style={styles.metaValue}>{inv.paid}</Text>
            </View>
          ) : (
            <View style={styles.metaPair}>
              <Text style={styles.metaLabel}>Vence:</Text>
              <Text style={styles.metaValue}>{inv.due}</Text>
            </View>
          )}
        </View>

        {!!inv.failNote && <Text style={styles.failNote}>{inv.failNote}</Text>}

        {/* Acciones */}
        <View style={styles.actionsRow}>
          <Pressable
            style={({ pressed }) => [styles.actionBtn, pressed && styles.actionPressed]}
            onPress={() => handleOpenPDF(inv)}
            accessibilityLabel={`Descargar PDF de ${inv.id}`}
          >
            <Ionicons name="document-outline" size={18} color={COLORS.textBlack} />
            <Text style={styles.actionText}>PDF</Text>
          </Pressable>

          {inv.status === "fallida" && (
            <Pressable
              style={({ pressed }) => [styles.actionBtn, styles.actionGhost, pressed && styles.actionPressed]}
              onPress={() => handleRetryPayment(inv)}
              accessibilityLabel={`Reintentar pago de ${inv.id}`}
            >
              <Ionicons name="refresh-outline" size={18} color={COLORS.textGray} />
              <Text style={styles.actionGhostText}>Reintentar</Text>
            </Pressable>
          )}
        </View>
      </View>
    ),
    [handleOpenPDF, handleRetryPayment]
  );

  // Renderizado principal
  return (
    <SafeAreaView style={styles.container}>
      <HeaderScreen
        title="Historial de facturas"
        leftIcon={<Ionicons name="arrow-back" size={24} color="black" />}
        onLeftPress={() => navigation.goBack()}
        onRightPress={() => Alert.alert("Ayuda", "Busca, filtra y descarga tus facturas.")}
      />

      <View style={styles.filtersRow}>
        {/* Buscador */}
        <View style={styles.searchChip}>
          <Ionicons name="search-outline" size={16} color={COLORS.textGray} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Buscar factura, #, correo..."
            placeholderTextColor={COLORS.textGray}
            style={styles.searchInput}
            returnKeyType="search"
          />
        </View>

        {/* Selector de tiempo */}
        <Pressable
          style={({ pressed }) => [styles.filterChip, pressed && styles.chipPressed]}
          onPress={() => setShowPeriodModal(true)}
        >
          <Ionicons name="calendar-outline" size={16} color={COLORS.textGray} />
          <Text style={styles.chipText}>
            {period === "12m" ? "Últimos 12 meses" : period === "6m" ? "Últimos 6 meses" : "Últimos 3 meses"}
          </Text>
        </Pressable>

        {/* Filtro de estado */}
        <Pressable
          style={({ pressed }) => [styles.filterChip, pressed && styles.chipPressed]}
          onPress={cycleStateFilter}
        >
          <Ionicons name="funnel-outline" size={16} color={COLORS.textGray} />
          <Text style={styles.chipText}>{stateFilter === "all" ? "Estado" : STATUS_LABELS[stateFilter]}</Text>
        </Pressable>
      </View>

      {/* Modal de periodo */}
      <Modal
        visible={showPeriodModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPeriodModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowPeriodModal(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Rango de tiempo</Text>

            {[
              { key: "12m", label: "Últimos 12 meses" },
              { key: "6m",  label: "Últimos 6 meses"  },
              { key: "3m",  label: "Últimos 3 meses"  },
            ].map((opt) => (
              <Pressable
                key={opt.key}
                style={({ pressed }) => [
                  styles.modalOption,
                  period === opt.key && styles.modalOptionActive,
                  pressed && { opacity: 0.75 },
                ]}
                onPress={() => {
                  setPeriod(opt.key);
                  setShowPeriodModal(false);
                }}
              >
                <Text style={[styles.modalOptionText, period === opt.key && styles.modalOptionTextActive]}>
                  {opt.label}
                </Text>
                {period === opt.key && <Ionicons name="checkmark" size={18} color={COLORS.primary} />}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>

      {/* Resumen */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryCol}>
          <Text style={styles.summaryLabel}>Total pagado</Text>
          <Text style={styles.summaryValue}>{money(summary.pagado)}</Text>
        </View>
        <View style={styles.summaryCol}>
          <Text style={styles.summaryLabel}>Próximo mes</Text>
          <Text style={styles.summaryValuePending}>{money(summary.proximo)}</Text>
        </View>
        <View style={styles.summaryCol}>
          <Text style={styles.summaryLabel}>Facturas</Text>
          <Text style={styles.summaryValue}>{summary.count}</Text>
        </View>
      </View>

      {/* Lista de facturas */}
      <FlatList
        data={filteredData}
        keyExtractor={(i) => i.id}
        contentContainerStyle={styles.listContent}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
        ListHeaderComponent={<Text style={styles.sectionHeader}>Facturas</Text>}
      />

      <MenuFooterCompany />
    </SafeAreaView>
  );
}