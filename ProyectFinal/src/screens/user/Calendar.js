// 1. Paquetes core de React/React Native
import { useState, useEffect } from 'react';
import { Text, View, ScrollView, FlatList, ActivityIndicator } from "react-native";

// 2. Bibliotecas de terceros
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { Calendar, LocaleConfig } from 'react-native-calendars';

// 3. Componentes propios
import { HeaderScreen, Banner, MenuFooter } from "../../components";

// 4. Constantes y utilidades
import { COLORS } from '../../components/constants/theme';

// 4.5 Servicios de Firebase
import { getCurrentUser } from "../../services/authService";
import { getUserProfile } from "../../services/userService";

// 5. Estilos
import styles from "../../styles/screens/user/CalendarStyles";

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

export default function CalendarScreen({ navigation }) {
  const [showBanner, setShowBanner] = useState(false);
  const [bannerMessage, setBannerMessage] = useState('');
  const [bannerType, setBannerType] = useState('success');
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);

  // Estados para datos de Firebase
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [workDays, setWorkDays] = useState([]);
  const [markedDates, setMarkedDates] = useState({});

  // Cargar datos del usuario al montar
  useEffect(() => {
    loadUserData();
  }, []);

  // Calcular días marcados cuando cambian los datos
  useEffect(() => {
    if (userData) {
      calculateMarkedDates();
    }
  }, [userData, selectedDate]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const user = getCurrentUser();
      if (!user) {
        setBannerMessage("No hay sesión activa");
        setBannerType("error");
        setShowBanner(true);
        setLoading(false);
        return;
      }

      // Obtener datos del usuario
      const userProfile = await getUserProfile(user.uid);
      if (!userProfile) {
        setBannerMessage("No se encontraron datos del usuario");
        setBannerType("error");
        setShowBanner(true);
        setLoading(false);
        return;
      }

      setUserData(userProfile);

      // Procesar días laborales
      if (userProfile.availableDays && userProfile.availableDays !== "N/A") {
        const days = userProfile.availableDays.split(',').map(d => d.trim());
        setWorkDays(days);
      } else {
        setWorkDays([]);
      }
    } catch (error) {
      console.error("Error al cargar datos del usuario:", error);
      setBannerMessage("Error al cargar datos");
      setBannerType("error");
      setShowBanner(true);
    } finally {
      setLoading(false);
    }
  };

  const calculateMarkedDates = () => {
    const marked = {};

    // Si no hay días laborales configurados, solo marcar fecha seleccionada
    if (workDays.length === 0 || !userData || userData.startTime === "N/A") {
      marked[selectedDate] = {
        selected: true,
        selectedColor: COLORS.primary,
        selectedTextColor: COLORS.textWhite
      };
      setMarkedDates(marked);
      return;
    }

    // Marcar los próximos 60 días que coincidan con días laborales
    const currentDate = new Date();
    for (let i = 0; i < 60; i++) {
      const date = new Date(currentDate);
      date.setDate(currentDate.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];

      if (isWorkDay(date)) {
        marked[dateStr] = {
          marked: true,
          dotColor: COLORS.primary,
        };
      }
    }

    // Marcar fecha seleccionada
    marked[selectedDate] = {
      ...marked[selectedDate],
      selected: true,
      selectedColor: COLORS.primary,
      selectedTextColor: COLORS.textWhite
    };

    setMarkedDates(marked);
  };

  const isWorkDay = (date) => {
    if (workDays.length === 0) return false;

    const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const dayName = dayNames[date.getDay()];

    return workDays.includes(dayName);
  };

  const hasShiftOnDate = (dateStr) => {
    if (!userData || userData.startTime === "N/A" || workDays.length === 0) {
      return false;
    }

    const date = new Date(dateStr);
    return isWorkDay(date);
  };

  const getShiftForDate = (dateStr) => {
    if (!hasShiftOnDate(dateStr)) return null;

    return {
      time: `${userData.startTime} - ${userData.endTime}`,
      mealTime: userData.mealTime !== "N/A" ? userData.mealTime : "No especificado",
      status: 'Confirmado'
    };
  };

  const getNextTwoShifts = () => {
    if (!userData || userData.startTime === "N/A" || workDays.length === 0) {
      return [];
    }

    const shifts = [];
    const currentDate = new Date();
    let daysChecked = 0;
    let daysAhead = 1; // Empezar desde mañana

    while (shifts.length < 2 && daysChecked < 60) {
      const date = new Date(currentDate);
      date.setDate(currentDate.getDate() + daysAhead);

      if (isWorkDay(date)) {
        const dateStr = date.toISOString().split('T')[0];
        shifts.push({
          id: shifts.length + 1,
          date: dateStr,
          dateFormatted: formatDate(date),
          time: `${userData.startTime} - ${userData.endTime}`,
          mealTime: userData.mealTime !== "N/A" ? userData.mealTime : "No especificado",
          status: 'Confirmado'
        });
      }

      daysAhead++;
      daysChecked++;
    }

    return shifts;
  };

  const formatDate = (date) => {
    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const monthNames = LocaleConfig.locales['es'].monthNames;

    const dayName = dayNames[date.getDay()];
    const day = date.getDate();
    const month = monthNames[date.getMonth()];

    return `${dayName} ${day} de ${month}`;
  };

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  const formatSelectedDate = () => {
    if (!selectedDate) return '';
    const [year, monthStr, dayStr] = selectedDate.split('-');
    const day = parseInt(dayStr, 10);
    const monthNames = LocaleConfig.locales['es'].monthNames;
    const month = monthNames[parseInt(monthStr, 10) - 1];
    return `${day} de ${month}`;
  };

  const renderUpcomingShiftItem = ({ item }) => (
    <View style={styles.upcomingShiftCard}>
      <View style={styles.upcomingShiftHeader}>
        <Ionicons name="calendar-outline" size={24} color={COLORS.primary} />
        <Text style={styles.upcomingShiftDate}>{item.dateFormatted}</Text>
      </View>
      <View style={styles.upcomingShiftDetails}>
        <View style={styles.upcomingShiftRow}>
          <Ionicons name="time-outline" size={18} color={COLORS.textGray} />
          <Text style={styles.upcomingShiftTime}>{item.time}</Text>
        </View>
        <View style={styles.upcomingShiftRow}>
          <Ionicons name="restaurant-outline" size={18} color={COLORS.textGray} />
          <Text style={styles.upcomingShiftMeal}>Comida: {item.mealTime}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <HeaderScreen
        title="Calendario de Turnos"
        leftIcon={<Ionicons name="arrow-back" size={24} color="black" />}
        rightIcon={<Ionicons name="notifications-outline" size={24} color="black" />}
        onLeftPress={() => navigation.goBack()}
        onRightPress={() => { }}
      />

      {/* Banner para mensajes */}
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

      {/* Contenido principal */}
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={{ marginTop: 16, color: COLORS.textGray }}>
            Cargando turnos...
          </Text>
        </View>
      ) : (
        <ScrollView style={styles.content}>
          {/* Calendario */}
          <View style={styles.calendarContainer}>
            <Calendar
              current={today}
              onDayPress={onDayPress}
              markedDates={markedDates}
              theme={{
                backgroundColor: COLORS.backgroundWhite,
                calendarBackground: COLORS.backgroundWhite,
                textSectionTitleColor: COLORS.textBlack,
                selectedDayBackgroundColor: COLORS.primary,
                selectedDayTextColor: COLORS.textWhite,
                todayTextColor: COLORS.primary,
                dayTextColor: COLORS.textBlack,
                textDisabledColor: COLORS.textGray,
                dotColor: COLORS.primary,
                selectedDotColor: COLORS.textWhite,
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

          {/* Turno del día seleccionado */}
          <View style={styles.appointmentsSection}>
            <Text style={styles.sectionTitle}>
              Turno del Día ({formatSelectedDate()})
            </Text>

            {!userData || userData.startTime === "N/A" || workDays.length === 0 ? (
              <View style={styles.noShiftsConfigured}>
                <Ionicons name="information-circle-outline" size={64} color={COLORS.textGray} />
                <Text style={styles.noShiftsConfiguredTitle}>Sin turnos configurados</Text>
                <Text style={styles.noShiftsConfiguredText}>
                  Aún no tienes turnos asignados. Contacta a tu administrador para que configure tus días y horarios laborales.
                </Text>
              </View>
            ) : hasShiftOnDate(selectedDate) ? (
              <View style={styles.shiftCard}>
                <View style={styles.shiftHeader}>
                  <Ionicons name="checkmark-circle" size={32} color={COLORS.primary} />
                  <Text style={styles.shiftTitle}>Tienes turno hoy</Text>
                </View>
                <View style={styles.shiftDetails}>
                  <View style={styles.shiftRow}>
                    <Ionicons name="time-outline" size={20} color={COLORS.textGray} />
                    <Text style={styles.shiftTime}>
                      Horario: {getShiftForDate(selectedDate)?.time}
                    </Text>
                  </View>
                  <View style={styles.shiftRow}>
                    <Ionicons name="restaurant-outline" size={20} color={COLORS.textGray} />
                    <Text style={styles.shiftMeal}>
                      Comida: {getShiftForDate(selectedDate)?.mealTime}
                    </Text>
                  </View>
                </View>
              </View>
            ) : (
              <View style={styles.noAppointments}>
                <Ionicons name="calendar-outline" size={48} color={COLORS.textGray} />
                <Text style={styles.noAppointmentsText}>
                  No hay turno programado para este día
                </Text>
              </View>
            )}
          </View>

          {/* Próximos turnos */}
          {userData && userData.startTime !== "N/A" && workDays.length > 0 && (
            <View style={styles.upcomingSection}>
              <Text style={styles.sectionTitle}>Próximos Turnos</Text>

              {getNextTwoShifts().length > 0 ? (
                <FlatList
                  data={getNextTwoShifts()}
                  renderItem={renderUpcomingShiftItem}
                  keyExtractor={(item) => item.id.toString()}
                  scrollEnabled={false}
                  style={styles.upcomingList}
                  ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
                />
              ) : (
                <View style={styles.noUpcomingShifts}>
                  <Ionicons name="calendar-outline" size={48} color={COLORS.textGray} />
                  <Text style={styles.noUpcomingShiftsText}>
                    No hay próximos turnos programados
                  </Text>
                </View>
              )}
            </View>
          )}
        </ScrollView>
      )}

      {/* Footer */}
      <View style={styles.footerContainer}>
        <MenuFooter />
      </View>
    </SafeAreaView>
  );
}