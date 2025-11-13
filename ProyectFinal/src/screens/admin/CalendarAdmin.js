// 1. Paquetes core de React/React Native
import { useState } from 'react';
import { Text, View, ScrollView, Pressable, Alert, Dimensions, Modal, FlatList } from "react-native";

// 2. Bibliotecas de terceros
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { LineChart, BarChart, ProgressChart, PieChart } from 'react-native-chart-kit';

// 3. Componentes propios
import { HeaderScreen, Banner, MenuFooterAdmin, ButtonLogin } from "../../components";
import InfoModal from "../../components/InfoModal";

// 4. Constantes y utilidades
import { COLORS, RADIUS } from '../../components/constants/theme';

// 5. Estilos
import styles from "../../styles/screens/admin/CalendarAdminStyles";

const screenWidth = Dimensions.get('window').width;

// Configuración de idioma español
LocaleConfig.locales['es'] = {
  monthNames: [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ],
  monthNamesShort: [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
  ],
  dayNames: [
    'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
  ],
  dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
  today: 'Hoy'
};
LocaleConfig.defaultLocale = 'es';

export default function CalendarAdmin({ navigation }) {
  const [showBanner, setShowBanner] = useState(false);
  const [bannerMessage, setBannerMessage] = useState('');
  const [bannerType, setBannerType] = useState('success');
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('Esta semana');
  
  // Grupos estáticos (después se cargarán desde Firebase)
  const groups = [
    { id: 1, name: 'Recepción', color: COLORS.primary },
    { id: 2, name: 'Cocina', color: COLORS.textGreen },
    { id: 3, name: 'Meseros', color: COLORS.primary },
    { id: 4, name: 'Bar', color: COLORS.textGreen },
    { id: 5, name: 'Anfitriones', color: COLORS.primary },
    { id: 6, name: 'Operaciones', color: COLORS.textGreen },
  ];
  
  // Peticiones pendientes con fechas
  const pendingRequests = [
    {
      id: 1,
      name: 'Alex Johnson',
      position: 'Recepción',
      date: today,
      time: '9:00 AM - 1:00 PM',
      reason: 'Enfermedad',
      status: 'Pendiente'
    },
    {
      id: 2,
      name: 'Priya Patel',
      position: 'Mesero',
      date: today,
      time: '12:00 PM - 8:00 PM',
      reason: 'Personal',
      status: 'Pendiente'
    },
    {
      id: 3,
      name: 'Diego Ramos',
      position: 'Anfitrión',
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      time: '10:00 AM - 6:00 PM',
      reason: 'Vacaciones',
      status: 'Pendiente'
    },
    {
      id: 4,
      name: 'María López',
      position: 'Cocina',
      date: today,
      time: '2:00 PM - 10:00 PM',
      reason: 'Cita médica', 
      status: 'Pendiente'
    },
    {
      id: 5,
      name: 'Carlos Méndez',
      position: 'Bar',
      date: today,
      time: '6:00 PM - 11:00 PM',
      reason: 'Personal',
      status: 'Pendiente'
    },
  ];

  // Datos para las gráficas (después se conectarán con Firebase)
  // Simulando datos reales de asistencia - NÚMEROS ABSOLUTOS
  const attendanceTrendData = {
    labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
    datasets: [
      {
        // Mostrando empleados presentes de 25 totales
        // Lun: 23/25, Mar: 22/25, Mié: 24/25, Jue: 23/25
        // Vie: 21/25, Sáb: 20/25, Dom: 22/25
        data: [23, 22, 24, 23, 21, 20, 22],
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        strokeWidth: 3
      }
    ],
    legend: ["Empleados presentes (de 25 totales)"]
  };

  const teamCoverageData = {
    labels: ["Recepción", "Cocina", "Operaciones"],
    datasets: [
      {
        // Porcentajes de cobertura por equipo
        // Recepción: 90%
        // Cocina: 90%
        // Operaciones: 80%
        data: [90, 90, 80]
      }
    ],
    legend: ["Porcentaje de cobertura"]
  };

  const metricsProgressData = {
    labels: ["Tasa Ausencias", "Horas Extra", "Asig. Auto", "Ajustes Man."],
    // Tasa Ausencias: 10/125 = 0.08 (8%)
    // Horas Extra: 42/1000 = 0.042 (4.2%)
    // Asig. Auto: 26/30 = 0.87 (87%)
    // Ajustes Man: 4/34 = 0.12 (12%)
    data: [0.08, 0.042, 0.87, 0.12]
  };

  // Configuración de gráficas basada en theme.js
  const chartConfig = {
    backgroundColor: COLORS.secondary,
    backgroundGradientFrom: COLORS.primary,
    backgroundGradientTo: COLORS.secondary,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, 1)`,
    style: {
      borderRadius: RADIUS.md,
    },
    propsForDots: {
      r: "7",
      strokeWidth: "3",
      stroke: COLORS.backgroundWhite
    }
  };

  const chartConfigWhite = {
    backgroundColor: COLORS.backgroundWhite,
    backgroundGradientFrom: COLORS.backgroundWhite,
    backgroundGradientTo: COLORS.backgroundWhite,
    decimalPlaces: 0,
    color: (opacity = 1) => COLORS.primary,
    labelColor: (opacity = 1) => COLORS.textBlack,
    style: {
      borderRadius: RADIUS.md,
    },
    barPercentage: 0.7,
    formatYLabel: (value) => Math.round(value).toString(),
  };

  const handleViewRequests = () => {
    navigation.navigate('RequestScreen');
  };

  const handleReportAction = (action) => {
    if (action === 'export') {
      Alert.alert('Exportar', 'Exportación iniciada');
      return;
    }
    if (action === 'filter') {
      Alert.alert('Filtros', 'Abrir modal de filtros (pendiente)');
      return;
    }
    if (action === 'viewDetails') {
      navigation.navigate('History');
      return;
    }
    Alert.alert('Acción', String(action));
  };

  // Marcar fechas con peticiones pendientes
  const getMarkedDates = () => {
    const marked = {};
    
    pendingRequests.forEach(request => {
      if (!marked[request.date]) {
        marked[request.date] = {
          marked: true,
          dotColor: COLORS.primary,
        };
      }
    });

    if (selectedDate) {
      marked[selectedDate] = {
        ...marked[selectedDate],
        selected: true,
        selectedColor: COLORS.primary,
        selectedTextColor: '#FFFFFF'
      };
    }

    return marked;
  };

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  const getRequestsForDate = () => {
    return pendingRequests.filter(req => req.date === selectedDate);
  };

  const formatSelectedDate = () => {
    if (!selectedDate) return '';
    const date = new Date(selectedDate);
    const day = date.getDate();
    const monthNames = LocaleConfig.locales['es'].monthNames;
    const month = monthNames[date.getMonth()];
    return `${day} de ${month}`;
  };

  const handleGroupSelect = (group) => {
    setSelectedGroup(group);
    setShowGroupModal(false);
    // Aquí se cargarán los datos específicos del grupo desde Firebase
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <HeaderScreen
        title="Calendario Administrador"
        leftIcon={<Ionicons name="arrow-back" size={24} color="black" />}
        rightIcon={<Ionicons name="notifications-outline" size={24} color="black" />}
        onLeftPress={() => navigation.goBack()}
        onRightPress={() => {}}
      />
      
      {showBanner && (
        <View style={styles.bannerContainer}>
          <Banner
            message={bannerMessage}
            type={bannerType}
            visible={showBanner}
            onHide={() => setShowBanner(false)}
          />
        </View>
      )}
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Calendario */}
        <View style={styles.calendarContainer}>
          <Calendar
            current={today}
            onDayPress={onDayPress}
            markedDates={getMarkedDates()}
            theme={{
              backgroundColor: COLORS.backgroundWhite,
              calendarBackground: COLORS.backgroundWhite,
              textSectionTitleColor: COLORS.textBlack,
              selectedDayBackgroundColor: COLORS.primary,
              selectedDayTextColor: '#FFFFFF',
              todayTextColor: COLORS.primary,
              dayTextColor: COLORS.textBlack,
              textDisabledColor: COLORS.textGray,
              dotColor: COLORS.primary,
              selectedDotColor: '#FFFFFF',
              arrowColor: COLORS.primary,
              monthTextColor: COLORS.textBlack,
              indicatorColor: COLORS.primary,
              textDayFontWeight: '400',
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: '600',
              textDayFontSize: 16,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 14
            }}
            style={styles.calendar}
            hideExtraDays={true}
            disableMonthChange={false}
            firstDay={1}
            hideDayNames={false}
            showWeekNumbers={false}
            disableArrowLeft={false}
            disableArrowRight={false}
          />
        </View>

        {/* Peticiones Pendientes - Indicador Simple */}
        <View style={styles.requestsWrapper}>
          <Text style={styles.sectionTitle}>
            Peticiones Pendientes - {formatSelectedDate()}
          </Text>
          
          {getRequestsForDate().length > 0 ? (
            <View style={styles.requestIndicator}>
              <View style={styles.requestIndicatorContent}>
                <Ionicons name="alert-circle" size={32} color={COLORS.primary} />
                <View style={styles.requestIndicatorText}>
                  <Text style={styles.requestIndicatorTitle}>
                    Hay {getRequestsForDate().length} {getRequestsForDate().length === 1 ? 'petición pendiente' : 'peticiones pendientes'} por resolver este día
                  </Text>
                  <Text style={styles.requestIndicatorSubtitle}>
                    Revisa y gestiona las peticiones de ausencia
                  </Text>
                </View>
              </View>
              <Pressable
                style={({ pressed }) => [
                  styles.viewRequestsButton,
                  pressed && { opacity: 0.7 }
                ]}
                onPress={handleViewRequests}
              >
                <Text style={styles.viewRequestsButtonText}>Ver</Text>
                <Ionicons name="arrow-forward" size={20} color={COLORS.textGreen} />
              </Pressable>
            </View>
          ) : (
            <View style={styles.noRequests}>
              <Ionicons name="calendar-outline" size={48} color={COLORS.textGray} />
              <Text style={styles.noRequestsText}>
                No hay peticiones pendientes para este día
              </Text>
            </View>
          )}
        </View>

        {/* Selector de Grupos */}
        <View style={styles.groupSelectorContainer}>
          <Text style={styles.groupSelectorTitle}>Seleccionar Grupo</Text>
          <Pressable
            style={({ pressed }) => [
              styles.groupSelectorButton,
              pressed && { opacity: 0.7 }
            ]}
            onPress={() => setShowGroupModal(true)}
          >
            <Ionicons name="people-outline" size={24} color={COLORS.primary} />
            <Text style={[
              styles.groupSelectorButtonText,
              selectedGroup && { color: COLORS.textBlack, fontWeight: '600' }
            ]}>
              {selectedGroup ? selectedGroup.name : 'No hay grupo seleccionado'}
            </Text>
            <Ionicons name="chevron-down" size={20} color={COLORS.textGray} />
          </Pressable>
        </View>

        {/* Sección de Reportes */}
        <View style={styles.reportsSection}>
          {/* Resumen General */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderCentered}>
              <Text style={styles.sectionTitleCentered}>Resumen General</Text>
            </View>

            {selectedGroup ? (
              <>
                {/* Botón Exportar centrado */}
                <View style={styles.exportButtonContainer}>
                  <ButtonLogin
                    title="Exportar"
                    onPress={() => handleReportAction('export')}
                    icon={<Ionicons name="download-outline" size={20} color={COLORS.textGreen} />}
                    backgroundColor={COLORS.backgroundWhite}
                    textColor={COLORS.textGreen}
                    borderColor={COLORS.borderSecondary}
                  />
                </View>

                <View style={styles.metricsRow}>
                  <View style={styles.metricCard}>
                    <Text style={styles.metricLabel}>Asistencia Semanal</Text>
                    <Text style={styles.metricValue}>92%</Text>
                    <Text style={styles.metricSub}>Esta Semana</Text>
                  </View>

                  <View style={styles.metricCard}>
                    <Text style={styles.metricLabel}>Tasa de Cobertura</Text>
                    <Text style={styles.metricValue}>96%</Text>
                    <Text style={styles.metricSub}>Ausencias cubiertas</Text>
                  </View>

                  <View style={styles.metricCard}>
                    <Text style={styles.metricLabel}>Tiempo de Respuesta</Text>
                    <Text style={styles.metricValue}>14m</Text>
                    <Text style={styles.metricSub}>Tiempo de reemplazo</Text>
                  </View>

                  <View style={styles.metricCard}>
                    <Text style={styles.metricLabel}>Reasignaciones</Text>
                    <Text style={styles.metricValue}>38</Text>
                    <Text style={styles.metricSub}>Últimos 7 días</Text>
                  </View>
                </View>
              </>
            ) : (
              <View style={styles.noGroupSelected}>
                <Ionicons name="analytics-outline" size={64} color={COLORS.textGray} />
                <Text style={styles.noGroupSelectedTitle}>No hay información disponible</Text>
                <Text style={styles.noGroupSelectedText}>
                  Seleccione un grupo para ver el resumen general y las métricas
                </Text>
              </View>
            )}
          </View>

          {selectedGroup && (
            <>
              {/* GRÁFICOS ANALÍTICOS */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Filtros</Text>
                </View>
                <View style={styles.filterRow}>
                  <Pressable
                    style={({ pressed }) => [
                      styles.filterChip,
                      selectedFilter === 'Esta semana' && styles.filterChipSelected,
                      pressed && { opacity: 0.7 }
                    ]}
                    onPress={() => setSelectedFilter('Esta semana')}
                  >
                    <Text style={[
                      styles.filterText,
                      selectedFilter === 'Esta semana' && styles.filterTextSelected
                    ]}>
                      Esta semana
                    </Text>
                  </Pressable>

                  <Pressable
                    style={({ pressed }) => [
                      styles.filterChip,
                      selectedFilter === 'Últimos 30 días' && styles.filterChipSelected,
                      pressed && { opacity: 0.7 }
                    ]}
                    onPress={() => setSelectedFilter('Últimos 30 días')}
                  >
                    <Text style={[
                      styles.filterText,
                      selectedFilter === 'Últimos 30 días' && styles.filterTextSelected
                    ]}>
                      Últimos 30 días
                    </Text>
                  </Pressable>

                  <Pressable
                    style={({ pressed }) => [
                      styles.filterChip,
                      selectedFilter === 'Trimestre' && styles.filterChipSelected,
                      pressed && { opacity: 0.7 }
                    ]}
                    onPress={() => setSelectedFilter('Trimestre')}
                  >
                    <Text style={[
                      styles.filterText,
                      selectedFilter === 'Trimestre' && styles.filterTextSelected
                    ]}>
                      Trimestre
                    </Text>
                  </Pressable>

                  <Pressable
                    style={({ pressed }) => [
                      styles.filterChip,
                      selectedFilter === 'Año' && styles.filterChipSelected,
                      pressed && { opacity: 0.7 }
                    ]}
                    onPress={() => setSelectedFilter('Año')}
                  >
                    <Text style={[
                      styles.filterText,
                      selectedFilter === 'Año' && styles.filterTextSelected
                    ]}>
                      Año
                    </Text>
                  </Pressable>
                </View>
              </View>

              {/* Tendencia de Asistencia */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Tendencia de Asistencia</Text>
                </View>

                <View style={styles.chartContainer}>
                  <LineChart
                    data={attendanceTrendData}
                    width={screenWidth * 0.9}
                    height={220}
                    chartConfig={chartConfig}
                    style={styles.chart}
                  />
                  <Text style={styles.chartDescription}>Empleados presentes cada día (de 25 totales en el grupo)</Text>
                </View>
              </View>

              {/* Cobertura por Equipo */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Porcentaje de cobertura por grupos</Text>
                </View>

                <View style={styles.chartContainer}>
                  <BarChart
                    data={teamCoverageData}
                    width={screenWidth * 0.9}
                    height={220}
                    chartConfig={chartConfigWhite}
                    style={styles.chart}
                    showValuesOnTopOfBars
                    fromZero
                    yAxisSuffix="%"
                  />
                  <Text style={styles.chartDescription}>Porcentaje de ausencias cubiertas por cada grupo</Text>
                </View>

                <View style={styles.topMetricsContainer}>
                  <View style={styles.topMetricsHeader}>
                    <Text style={styles.sectionTitle}>Métricas Principales</Text>
                  </View>

                  <View style={styles.chartContainer}>
                    <PieChart
                      data={[
                        {
                          name: 'Ausencias',
                          population: 10,
                          color: COLORS.error,
                          legendFontColor: COLORS.textBlack,
                          legendFontSize: 12
                        },
                        {
                          name: 'Asig. Auto',
                          population: 26,
                          color: COLORS.textGray,
                          legendFontColor: COLORS.textBlack,
                          legendFontSize: 12
                        },
                        {
                          name: 'Ajustes',
                          population: 4,
                          color: COLORS.textGreen,
                          legendFontColor: COLORS.textBlack,
                          legendFontSize: 12
                        }
                      ]}
                      width={screenWidth * 0.9}
                      height={200}
                      chartConfig={{
                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        labelColor: (opacity = 1) => COLORS.textBlack,
                      }}
                      accessor="population"
                      backgroundColor="transparent"
                      paddingLeft="15"
                      absolute
                      style={styles.chart}
                      hasLegend={true}
                      center={[10, 0]}
                    />
                  </View>

                  <View style={styles.metricsLegendContainer}>
                    <View style={styles.legendItem}>
                      <View style={[styles.legendDot, { backgroundColor: COLORS.error }]} />
                      <Text style={styles.legendText}>Tasa Ausencias: 10 de 125 empleados (8%)</Text>
                    </View>
                    <View style={styles.legendItem}>
                      <View style={[styles.legendDot, { backgroundColor: COLORS.textGray }]} />
                      <Text style={styles.legendText}>Asig. Auto: 26 de 30 turnos (87%)</Text>
                    </View>
                    <View style={styles.legendItem}>
                      <View style={[styles.legendDot, { backgroundColor: COLORS.textGreen }]} />
                      <Text style={styles.legendText}>Ajustes Man: 4 de 34 cambios (12%)</Text>
                    </View>
                  </View>
                </View>
              </View>
            </>
          )}
        </View>

        {/* Espacio inferior */}
        <View style={{ height: 20 }} />
      </ScrollView>
      
      <View style={styles.footerContainer}>
        <MenuFooterAdmin />
      </View>

      {/* Modal de Selección de Grupos */}
      <Modal
        transparent
        visible={showGroupModal}
        animationType="fade"
        onRequestClose={() => setShowGroupModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowGroupModal(false)}>
          <Pressable style={styles.groupModalContainer} onPress={(e) => e.stopPropagation()}>
            <View style={styles.groupModalHeader}>
              <Text style={styles.groupModalTitle}>Seleccione un grupo</Text>
              <Pressable onPress={() => setShowGroupModal(false)}>
                <Ionicons name="close" size={28} color={COLORS.textGray} />
              </Pressable>
            </View>
            
            <FlatList
              data={groups}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <Pressable
                  style={({ pressed }) => [
                    styles.groupItem,
                    selectedGroup?.id === item.id && styles.groupItemSelected,
                    pressed && { opacity: 0.7 }
                  ]}
                  onPress={() => handleGroupSelect(item)}
                >
                  <Ionicons name="people" size={20} color={item.color} />
                  <Text style={[
                    styles.groupItemText,
                    selectedGroup?.id === item.id && styles.groupItemTextSelected
                  ]}>
                    {item.name}
                  </Text>
                  {selectedGroup?.id === item.id && (
                    <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
                  )}
                </Pressable>
              )}
              ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
              showsVerticalScrollIndicator={false}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
