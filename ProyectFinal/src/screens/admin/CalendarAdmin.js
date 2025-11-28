// 1. Paquetes core de React/React Native
import { useState, useRef, useEffect } from 'react';
import { Text, View, ScrollView, Pressable, Alert, Dimensions, Modal, FlatList, ActivityIndicator } from "react-native";

// 2. Bibliotecas de terceros
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { LineChart, BarChart, ProgressChart, PieChart } from 'react-native-chart-kit';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import ViewShot from 'react-native-view-shot';

// 3. Componentes propios
import { HeaderScreen, Banner, MenuFooterAdmin, ButtonLogin } from "../../components";
import InfoModal from "../../components/InfoModal";

// 4. Constantes y utilidades
import { COLORS, RADIUS } from '../../components/constants/theme';

// 4.5 Servicios de Firebase
import { getCurrentUser } from "../../services/authService";
import { getAdminProfile } from "../../services/companyService";
import { getGroupsByIds } from "../../services/groupService";
import { getPeticionesByIds } from "../../services/peticionService";

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
  
  // Estados para datos de Firebase
  const [loading, setLoading] = useState(true);
  const [adminData, setAdminData] = useState(null);
  const [groups, setGroupsData] = useState([]);
  const [allPendingRequests, setAllPendingRequests] = useState([]);
  
  // Referencias para capturar las gráficas como imágenes
  const lineChartRef = useRef();
  const barChartRef = useRef();
  const pieChartRef = useRef();
  
  // Cargar datos del admin y sus peticiones al montar
  useEffect(() => {
    loadAdminDataAndPetitions();
  }, []);

  const loadAdminDataAndPetitions = async () => {
    try {
      setLoading(true);
      const user = getCurrentUser();
      if (!user) {
        console.error("No hay sesión activa");
        setLoading(false);
        return;
      }

      // Obtener datos del admin
      const adminProfile = await getAdminProfile(user.uid);
      if (!adminProfile) {
        console.error("No se encontraron datos del admin");
        setLoading(false);
        return;
      }

      setAdminData(adminProfile);

      // Cargar grupos del admin
      if (adminProfile.groupIds && adminProfile.groupIds.length > 0) {
        const groupsData = await getGroupsByIds(adminProfile.groupIds);
        setGroupsData(groupsData);

        // Cargar peticiones de todos los grupos
        await loadAllPetitions(groupsData);
      }
    } catch (error) {
      console.error("Error al cargar datos del admin:", error);
      setBannerMessage("Error al cargar datos");
      setBannerType("error");
      setShowBanner(true);
    } finally {
      setLoading(false);
    }
  };

  const loadAllPetitions = async (groupsData) => {
    try {
      let allPeticiones = [];

      // Obtener peticiones pendientes de cada grupo
      for (const group of groupsData) {
        if (group.peticionesPendientesIds && group.peticionesPendientesIds.length > 0) {
          const peticiones = await getPeticionesByIds(group.peticionesPendientesIds);
          allPeticiones = [...allPeticiones, ...peticiones];
        }
      }

      setAllPendingRequests(allPeticiones);
    } catch (error) {
      console.error("Error al cargar peticiones:", error);
    }
  };

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

  const handleReportAction = async (action) => {
    if (action === 'export') {
      try {
        // Capturar las gráficas como imágenes
        let lineChartImage = null;
        let barChartImage = null;
        let pieChartImage = null;
        
        // Esperar un momento para asegurar que las gráficas estén renderizadas
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Capturar LineChart
        if (lineChartRef.current) {
          try {
            const uri = await lineChartRef.current.capture();
            const base64 = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' });
            lineChartImage = `data:image/jpeg;base64,${base64}`;
            console.log('LineChart capturada');
          } catch (error) {
            console.log('Error capturando LineChart:', error);
          }
        }
        
        // Capturar BarChart
        if (barChartRef.current) {
          try {
            const uri = await barChartRef.current.capture();
            const base64 = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' });
            barChartImage = `data:image/jpeg;base64,${base64}`;
            console.log('BarChart capturada');
          } catch (error) {
            console.log('Error capturando BarChart:', error);
          }
        }
        
        // Capturar PieChart
        if (pieChartRef.current) {
          try {
            const uri = await pieChartRef.current.capture();
            const base64 = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' });
            pieChartImage = `data:image/jpeg;base64,${base64}`;
            console.log('PieChart capturada');
          } catch (error) {
            console.log('Error capturando PieChart:', error);
          }
        }
        
        // Generar contenido HTML del reporte
        const html = `
          <html>
            <head>
              <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
              <style>
                body {
                  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                  padding: 20px;
                  color: #333;
                }
                h1 {
                  color: #178C72;
                  text-align: center;
                  margin-bottom: 10px;
                }
                h2 {
                  color: #178C72;
                  margin-top: 25px;
                  margin-bottom: 15px;
                  border-bottom: 2px solid #178C72;
                  padding-bottom: 5px;
                }
                .header-info {
                  text-align: center;
                  margin-bottom: 30px;
                  color: #666;
                }
                .metrics-grid {
                  display: grid;
                  grid-template-columns: repeat(2, 1fr);
                  gap: 15px;
                  margin-bottom: 30px;
                }
                .metric-card {
                  border: 1px solid #E0E0E0;
                  border-radius: 8px;
                  padding: 15px;
                  background-color: #F9F9F9;
                }
                .metric-label {
                  font-size: 12px;
                  color: #666;
                  margin-bottom: 8px;
                }
                .metric-value {
                  font-size: 28px;
                  font-weight: bold;
                  color: #178C72;
                  margin-bottom: 5px;
                }
                .metric-sub {
                  font-size: 11px;
                  color: #999;
                }
                table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-top: 15px;
                }
                th {
                  background-color: #178C72;
                  color: white;
                  padding: 12px;
                  text-align: left;
                  font-weight: 600;
                }
                td {
                  padding: 10px;
                  border-bottom: 1px solid #E0E0E0;
                }
                tr:nth-child(even) {
                  background-color: #F9F9F9;
                }
                .footer {
                  margin-top: 40px;
                  text-align: center;
                  font-size: 11px;
                  color: #999;
                  border-top: 1px solid #E0E0E0;
                  padding-top: 15px;
                }
                .chart-image {
                  width: 100%;
                  max-width: 650px;
                  height: auto;
                  margin: 15px auto;
                  display: block;
                  border-radius: 8px;
                }
              </style>
            </head>
            <body>
              <h1>Reporte de Asistencia</h1>
              <div class="header-info">
                <p><strong>Grupo:</strong> ${selectedGroup ? selectedGroup.name : 'Todos los grupos'}</p>
                <p><strong>Período:</strong> ${selectedFilter}</p>
                <p><strong>Fecha de generación:</strong> ${new Date().toLocaleDateString('es-ES', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</p>
              </div>

              <h2>Resumen General</h2>
              <div class="metrics-grid">
                <div class="metric-card">
                  <div class="metric-label">Asistencia Semanal</div>
                  <div class="metric-value">92%</div>
                  <div class="metric-sub">Esta Semana</div>
                </div>
                <div class="metric-card">
                  <div class="metric-label">Tasa de Cobertura</div>
                  <div class="metric-value">96%</div>
                  <div class="metric-sub">Ausencias cubiertas</div>
                </div>
                <div class="metric-card">
                  <div class="metric-label">Tiempo de Respuesta</div>
                  <div class="metric-value">14m</div>
                  <div class="metric-sub">Tiempo de reemplazo</div>
                </div>
                <div class="metric-card">
                  <div class="metric-label">Reasignaciones</div>
                  <div class="metric-value">38</div>
                  <div class="metric-sub">Últimos 7 días</div>
                </div>
              </div>

              ${lineChartImage ? `
              <h2>Tendencia de Asistencia Semanal</h2>
              <img src="${lineChartImage}" class="chart-image" alt="Gráfica de Tendencia" />
              ` : ''}

              <h2>Tendencia de Asistencia Semanal (Datos)</h2>
              <table>
                <thead>
                  <tr>
                    <th>Día</th>
                    <th>Empleados Presentes</th>
                    <th>Porcentaje</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Lunes</td>
                    <td>23 / 25</td>
                    <td>92%</td>
                  </tr>
                  <tr>
                    <td>Martes</td>
                    <td>22 / 25</td>
                    <td>88%</td>
                  </tr>
                  <tr>
                    <td>Miércoles</td>
                    <td>24 / 25</td>
                    <td>96%</td>
                  </tr>
                  <tr>
                    <td>Jueves</td>
                    <td>23 / 25</td>
                    <td>92%</td>
                  </tr>
                  <tr>
                    <td>Viernes</td>
                    <td>21 / 25</td>
                    <td>84%</td>
                  </tr>
                  <tr>
                    <td>Sábado</td>
                    <td>20 / 25</td>
                    <td>80%</td>
                  </tr>
                  <tr>
                    <td>Domingo</td>
                    <td>22 / 25</td>
                    <td>88%</td>
                  </tr>
                </tbody>
              </table>

              ${barChartImage ? `
              <h2>Cobertura por Equipos</h2>
              <img src="${barChartImage}" class="chart-image" alt="Gráfica de Cobertura" />
              ` : ''}

              <h2>Cobertura por Equipos (Datos)</h2>
              <table>
                <thead>
                  <tr>
                    <th>Equipo</th>
                    <th>Porcentaje de Cobertura</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Recepción</td>
                    <td>90%</td>
                  </tr>
                  <tr>
                    <td>Cocina</td>
                    <td>90%</td>
                  </tr>
                  <tr>
                    <td>Operaciones</td>
                    <td>80%</td>
                  </tr>
                </tbody>
              </table>

              ${pieChartImage ? `
              <h2>Métricas Principales</h2>
              <img src="${pieChartImage}" class="chart-image" alt="Gráfica de Métricas" />
              ` : ''}

              <h2>Métricas Principales (Detalle)</h2>
              <table>
                <thead>
                  <tr>
                    <th>Métrica</th>
                    <th>Valor</th>
                    <th>Descripción</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Tasa de Ausencias</td>
                    <td>10 / 125</td>
                    <td>8% de empleados ausentes</td>
                  </tr>
                  <tr>
                    <td>Asignaciones Automáticas</td>
                    <td>26 / 30</td>
                    <td>87% de turnos asignados automáticamente</td>
                  </tr>
                  <tr>
                    <td>Ajustes Manuales</td>
                    <td>4 / 34</td>
                    <td>12% de cambios requirieron ajuste manual</td>
                  </tr>
                </tbody>
              </table>

              <div class="footer">
                <p>Reporte generado automáticamente por el Sistema de Gestión de Asistencia</p>
                <p>© ${new Date().getFullYear()} - Todos los derechos reservados</p>
              </div>
            </body>
          </html>
        `;

        // Generar el PDF con soporte para archivos locales
        const { uri } = await Print.printToFileAsync({ 
          html,
          base64: false
        });
        
        // Compartir el PDF
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Exportar Reporte de Asistencia',
          UTI: 'com.adobe.pdf'
        });

        Alert.alert('Éxito', 'Reporte exportado correctamente');
      } catch (error) {
        console.error('Error al exportar PDF:', error);
        Alert.alert('Error', 'No se pudo exportar el reporte');
      }
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
    allPendingRequests.forEach(request => {
      if (request.date) {
        marked[request.date] = {
          marked: true,
          dotColor: COLORS.primary
        };
      }
    });
    marked[selectedDate] = {
      ...marked[selectedDate],
      selected: true,
      selectedColor: COLORS.primary
    };
    return marked;
  };

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  const getRequestsForDate = () => {
    return allPendingRequests.filter(req => req.date === selectedDate);
  };

  const formatSelectedDate = () => {
    if (!selectedDate) return '';
    const [year, monthStr, dayStr] = selectedDate.split('-');
    const day = parseInt(dayStr, 10);
    const monthNames = LocaleConfig.locales['es'].monthNames;
    const month = monthNames[parseInt(monthStr, 10) - 1];
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
      
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={{ marginTop: 16, color: COLORS.textGray }}>
            Cargando peticiones...
          </Text>
        </View>
      ) : (
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

                <ViewShot 
                  ref={lineChartRef} 
                  options={{ 
                    format: 'jpg', 
                    quality: 0.9,
                    result: 'tmpfile'
                  }}
                  style={{ backgroundColor: '#FFFFFF' }}
                >
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
                </ViewShot>
              </View>

              {/* Cobertura por Equipo */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Porcentaje de cobertura por grupos</Text>
                </View>

                <ViewShot 
                  ref={barChartRef} 
                  options={{ 
                    format: 'jpg', 
                    quality: 0.9,
                    result: 'tmpfile'
                  }}
                  style={{ backgroundColor: '#FFFFFF' }}
                >
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
                </ViewShot>

                <View style={styles.topMetricsContainer}>
                  <View style={styles.topMetricsHeader}>
                    <Text style={styles.sectionTitle}>Métricas Principales</Text>
                  </View>

                  <ViewShot 
                    ref={pieChartRef} 
                    options={{ 
                      format: 'jpg', 
                      quality: 0.9,
                      result: 'tmpfile'
                    }}
                    style={{ backgroundColor: '#FFFFFF' }}
                  >
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
                  </ViewShot>

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
      )}
      
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
