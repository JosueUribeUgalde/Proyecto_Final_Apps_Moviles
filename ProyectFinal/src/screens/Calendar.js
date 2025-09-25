// 1. Paquetes core de React/React Native
import { useState } from 'react';
import { Text, View, ScrollView, FlatList } from "react-native";

// 2. Bibliotecas de terceros
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { Calendar, LocaleConfig } from 'react-native-calendars';

// 3. Componentes propios
import { HeaderScreen, Banner, MenuFooter } from "../components";

// 4. Constantes y utilidades
import { COLORS } from '../components/constants/theme';

// 5. Estilos
import styles from "../components/styles/CalendarStyles";

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
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  
  // Datos de turnos de ejemplo con fechas actuales
  const getAppointmentsForCurrentMonth = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    
    // Generar fechas para los próximos días
    const appointments = {};
    
    // Turno para hoy
    const todayStr = today.toISOString().split('T')[0];
    appointments[todayStr] = [
      {
        id: 1,
        title: 'Turno de Mañana',
        time: '08:00 - 17:00',
        status: 'Confirmado'
      },
      {
        id: 2,
        title: 'Turno de Tarde',
        time: '14:00 - 22:00',
        status: 'Pendiente'
      }
    ];
    
    // Turno para mañana
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    appointments[tomorrowStr] = [
      {
        id: 3,
        title: 'Turno de Noche',
        time: '22:00 - 06:00',
        status: 'Confirmado'
      }
    ];
    
    // Turno para pasado mañana
    const dayAfter = new Date(today);
    dayAfter.setDate(today.getDate() + 2);
    const dayAfterStr = dayAfter.toISOString().split('T')[0];
    appointments[dayAfterStr] = [
      {
        id: 4,
        title: 'Turno de Mañana',
        time: '08:00 - 17:00',
        status: 'Pendiente'
      }
    ];
    
    return appointments;
  };

  const [appointments] = useState(getAppointmentsForCurrentMonth());

  // Marcar fechas con turnos
  const getMarkedDates = () => {
    const marked = {};
    
    // Marcar fechas con turnos
    Object.keys(appointments).forEach(date => {
      const hasConfirmed = appointments[date].some(apt => apt.status === 'Confirmado');
      const hasPending = appointments[date].some(apt => apt.status === 'Pendiente');
      
      marked[date] = {
        marked: true,
        dotColor: hasConfirmed ? COLORS.primary : COLORS.textGray,
      };
    });

    // Marcar fecha seleccionada
    if (selectedDate) {
      marked[selectedDate] = {
        ...marked[selectedDate],
        selected: true,
        selectedColor: COLORS.primary,
        selectedTextColor: COLORS.textWhite
      };
    }

    return marked;
  };

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  const getSelectedDateAppointments = () => {
    return appointments[selectedDate] || [];
  };

  const renderAppointmentItem = ({ item }) => (
    <View style={styles.appointmentCard}>
      <View style={styles.appointmentHeader}>
        <Text style={styles.appointmentTitle}>{item.title}</Text>
        <View style={[
          styles.statusBadge,
          { backgroundColor: item.status === 'Confirmado' ? COLORS.primary : COLORS.textGray }
        ]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.appointmentTime}>{item.time}</Text>
    </View>
  );

  const formatSelectedDate = () => {
    if (!selectedDate) return '';
    const date = new Date(selectedDate);
    const day = date.getDate();
    const monthNames = LocaleConfig.locales['es'].monthNames;
    const month = monthNames[date.getMonth()];
    return `${day} de ${month}`;
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <HeaderScreen
        title="Calendario de Turnos"
        leftIcon={<Ionicons name="arrow-back" size={24} color="black" />}
        rightIcon={<Ionicons name="notifications-outline" size={24} color="black" />}
        onLeftPress={() => navigation.goBack()}
        onRightPress={() => {}}
      />
      
      {/* Banner para mensajes */}
      <View style={styles.bannerContainer}>
        <Banner
          message="Mensaje de ejemplo"
          type="success"
          visible={showBanner}
          onHide={() => setShowBanner(false)}
        />
      </View>
      
      {/* Contenido principal */}
      <ScrollView style={styles.content}>
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

        {/* Lista de turnos del día seleccionado */}
        <View style={styles.appointmentsSection}>
          <Text style={styles.sectionTitle}>
            Turnos del Día ({formatSelectedDate()})
          </Text>
          
          {getSelectedDateAppointments().length > 0 ? (
            <FlatList
              data={getSelectedDateAppointments()}
              renderItem={renderAppointmentItem}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
              style={styles.appointmentsList}
            />
          ) : (
            <View style={styles.noAppointments}>
              <Text style={styles.noAppointmentsText}>
                No hay turnos programados para este día
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      
      {/* Footer */}
      <View style={styles.footerContainer}>
        <MenuFooter />
      </View>
    </SafeAreaView>
  );
}