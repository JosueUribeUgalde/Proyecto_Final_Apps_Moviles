// 1. Paquetes core de React/React Native
import { useState } from 'react';
import { Text, View, ScrollView, Pressable, Alert } from "react-native";

// 2. Bibliotecas de terceros
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { Calendar, LocaleConfig } from 'react-native-calendars';

// 3. Componentes propios
import { HeaderScreen, Banner, MenuFooterAdmin, ButtonLogin } from "../../components";

// 4. Constantes y utilidades
import { COLORS } from '../../components/constants/theme';

// 5. Estilos
import styles from "../../styles/screens/admin/CalendarAdminStyles";

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
  const [showAllRequests, setShowAllRequests] = useState(false);
  
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

  const handleApprove = (requestId) => {
    setBannerMessage('Petición aprobada exitosamente');
    setBannerType('success');
    setShowBanner(true);
  };

  const handleReject = (requestId) => {
    setBannerMessage('Petición rechazada');
    setBannerType('error');
    setShowBanner(true);
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

  const getDisplayedRequests = () => {
    const requests = getRequestsForDate();
    return showAllRequests ? requests : requests.slice(0, 2);
  };

  const formatSelectedDate = () => {
    if (!selectedDate) return '';
    const date = new Date(selectedDate);
    const day = date.getDate();
    const monthNames = LocaleConfig.locales['es'].monthNames;
    const month = monthNames[date.getMonth()];
    return `${day} de ${month}`;
  };

  const renderRequestCard = (request) => (
    <View key={request.id} style={styles.requestCard}>
      <View style={styles.requestHeader}>
        <View>
          <Text style={styles.requestName}>{request.name}</Text>
          <Text style={styles.requestPosition}>{request.position}</Text>
        </View>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{request.status}</Text>
        </View>
      </View>
      
      <View style={styles.requestDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={16} color={COLORS.textGray} />
          <Text style={styles.detailText}>{request.time}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="information-circle-outline" size={16} color={COLORS.textGray} />
          <Text style={styles.detailText}>{request.reason}</Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <Pressable
          style={({ pressed }) => [
            styles.approveButton,
            pressed && { opacity: 0.7 }
          ]}
          onPress={() => handleApprove(request.id)}
        >
          <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" />
          <Text style={styles.approveButtonText}>Aprobar</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.rejectButton,
            pressed && { opacity: 0.7 }
          ]}
          onPress={() => handleReject(request.id)}
        >
          <Ionicons name="close-circle-outline" size={20} color={COLORS.primary} />
          <Text style={styles.rejectButtonText}>Rechazar</Text>
        </Pressable>
      </View>
    </View>
  );

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

        {/* Peticiones Pendientes (con límite de 2) */}
        <View style={styles.requestsWrapper}>
          <Text style={styles.sectionTitle}>
            Peticiones Pendientes - {formatSelectedDate()}
          </Text>
          
          {getRequestsForDate().length > 0 ? (
            <>
              {getDisplayedRequests().map((request) => renderRequestCard(request))}
              
              {getRequestsForDate().length > 2 && (
                <Pressable
                  style={({ pressed }) => [
                    styles.viewMoreButton,
                    pressed && { opacity: 0.7 }
                  ]}
                  onPress={() => setShowAllRequests(!showAllRequests)}
                >
                  <Text style={styles.viewMoreText}>
                    {showAllRequests ? 'Ver menos' : `Ver más (${getRequestsForDate().length - 2})`}
                  </Text>
                  <Ionicons 
                    name={showAllRequests ? "chevron-up" : "chevron-down"} 
                    size={20} 
                    color={COLORS.primary} 
                  />
                </Pressable>
              )}
            </>
          ) : (
            <View style={styles.noRequests}>
              <Ionicons name="calendar-outline" size={48} color={COLORS.textGray} />
              <Text style={styles.noRequestsText}>
                No hay peticiones pendientes para este día
              </Text>
            </View>
          )}
        </View>

        {/* Sección de Reportes */}
        <View style={styles.reportsSection}>
          {/* Resumen General */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Resumen General</Text>
              <ButtonLogin
                title="Exportar"
                onPress={() => handleReportAction('export')}
                icon={<Ionicons name="download-outline" size={20} color="white" />}
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
          </View>

          {/* Filtros */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Filtros</Text>
              <ButtonLogin
                title="Ajustar"
                onPress={() => handleReportAction('filter')}
                icon={<Ionicons name="filter-outline" size={20} color="white" />}
              />
            </View>
            <View style={styles.filterRow}>
              <Text style={styles.filterText}>Esta semana</Text>
              <Text style={styles.filterText}>Últimos 30 días</Text>
              <Text style={styles.filterText}>Trimestre</Text>
              <Text style={styles.filterText}>Año</Text>
            </View>
          </View>

          {/* Tendencia de Asistencia */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Tendencia de Asistencia</Text>
              <View style={styles.buttonRow}>
                <ButtonLogin
                  title="Línea"
                  onPress={() => handleReportAction('line')}
                  icon={<Ionicons name="analytics-outline" size={18} color="white" />}
                />
                <ButtonLogin
                  title="Barra"
                  onPress={() => handleReportAction('bar')}
                  icon={<Ionicons name="bar-chart-outline" size={18} color="white" />}
                />
              </View>
            </View>

            <View>
              <View style={styles.chartPlaceholder}>
                <Text style={styles.chartPlaceholderText}>Espacio para gráfica</Text>
              </View>
              <Text style={styles.chartDescription}>Muestra asistencia diaria vs objetivo</Text>
            </View>
          </View>

          {/* Cobertura por Equipo */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Cobertura por Equipo</Text>
              <ButtonLogin
                title="Ver Detalles"
                onPress={() => handleReportAction('viewDetails')}
              />
            </View>

            <View style={styles.teamRow}>
              <View style={styles.teamItem}>
                <Text style={styles.teamName}>Recepción</Text>
                <Text style={styles.teamValue}>98%</Text>
              </View>
              <View style={styles.teamItem}>
                <Text style={styles.teamName}>Cocina</Text>
                <Text style={styles.teamValue}>93%</Text>
              </View>
              <View style={styles.teamItem}>
                <Text style={styles.teamName}>Operaciones</Text>
                <Text style={styles.teamValue}>95%</Text>
              </View>
            </View>

            <View style={styles.topMetricsContainer}>
              <View style={styles.topMetricsHeader}>
                <Text style={styles.sectionTitle}>Métricas Principales</Text>
                <ButtonLogin
                  title="Fijar"
                  onPress={() => handleReportAction('pin')}
                  icon={<Ionicons name="pin-outline" size={18} color="white" />}
                />
              </View>

              <View style={styles.metricsRow}>
                <View style={styles.metricCard}>
                  <Text style={styles.metricLabel}>Tasa de Ausencias</Text>
                  <Text style={styles.metricValue}>3%</Text>
                  <Text style={styles.metricSub}>Este Mes</Text>
                </View>

                <View style={styles.metricCard}>
                  <Text style={styles.metricLabel}>Horas Extra</Text>
                  <Text style={styles.metricValue}>42</Text>
                  <Text style={styles.metricSub}>Últimos 30 días</Text>
                </View>

                <View style={styles.metricCard}>
                  <Text style={styles.metricLabel}>Asignaciones Auto</Text>
                  <Text style={styles.metricValue}>87%</Text>
                  <Text style={styles.metricSub}>Reemplazos automáticos</Text>
                </View>

                <View style={styles.metricCard}>
                  <Text style={styles.metricLabel}>Ajustes Manuales</Text>
                  <Text style={styles.metricValue}>12%</Text>
                  <Text style={styles.metricSub}>De reasignaciones</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Espacio inferior */}
        <View style={{ height: 20 }} />
      </ScrollView>
      
      <View style={styles.footerContainer}>
        <MenuFooterAdmin />
      </View>
    </SafeAreaView>
  );
}
