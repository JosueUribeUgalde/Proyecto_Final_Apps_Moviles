// 1. Paquetes core de React/React Native
import { useState, useEffect } from 'react';
import { Text, View, ScrollView, Pressable, Platform, TextInput, Modal, FlatList, ActivityIndicator, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';

// 2. Bibliotecas de terceros
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';

// 3. Componentes propios
import { HeaderScreen, Banner, MenuFooter, RazonOption, ButtonLogin } from "../../components";
import InfoModal from "../../components/InfoModal";
import NotificationsModal from "../../components/NotificationsModal";

// 4. Constantes y utilidades
import { COLORS } from '../../components/constants/theme';

// 5. Servicios de Firebase
import { getCurrentUser } from "../../services/authService";
import { getUserProfile } from "../../services/userService";
import { createPeticion } from "../../services/peticionService";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";

// 6. Estilos - Deberás crear este archivo para tu pantalla
import styles from "../../styles/screens/user/AddReportStyles";
import CalendarAdminStyles from "../../styles/screens/admin/CalendarAdminStyles";

export default function ScreenTemplate({ navigation }) {
  // ============================================
  // ESTADOS
  // ============================================
  
  // Control de carga inicial de datos
  const [loading, setLoading] = useState(true);
  
  // Datos del usuario logueado (perfil completo desde Firebase)
  const [userData, setUserData] = useState(null);

  // Grupo actualmente seleccionado para el reporte
  const [selectedGroup, setSelectedGroup] = useState(null);
  
  // Control de visibilidad del modal de selección de grupos
  const [showGroupSelectModal, setShowGroupSelectModal] = useState(false);

  // Lista de todos los grupos a los que pertenece el usuario
  const [groups, setGroups] = useState([]);

  // Control de visibilidad del banner (NO SE USA actualmente)
  const [showBanner, setShowBanner] = useState(false);
  
  // Control de visibilidad del modal de notificaciones
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  
  // Fecha seleccionada para el reporte de ausencia/permiso
  const [fecha, setFecha] = useState(new Date());
  
  // Hora seleccionada para el reporte
  const [hora, setHora] = useState(new Date());
  
  // Control de visibilidad del DateTimePicker de fecha
  const [mostrarSelectorFecha, setMostrarSelectorFecha] = useState(false);
  
  // Control de visibilidad del DateTimePicker de hora
  const [mostrarSelectorHora, setMostrarSelectorHora] = useState(false);
  
  // ID de la razón seleccionada (1-4: Enfermedad, Transporte, Familia, Otro)
  const [razonSeleccionada, setRazonSeleccionada] = useState(null);
  
  // Texto descriptivo del incidente/motivo del reporte
  const [detalles, setDetalles] = useState('');

  // Control del modal de información general
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoModalTitle, setInfoModalTitle] = useState('');
  const [infoModalMessage, setInfoModalMessage] = useState('');
  
  // Estado de carga mientras se envía la petición
  const [enviandoPeticion, setEnviandoPeticion] = useState(false);

  // ============================================
  // EFECTOS
  // ============================================
  
  
  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    loadUserData();
  }, []);

  // ============================================
  // FUNCIONES DE CARGA DE DATOS
  // ============================================
  
  /**
   * Carga los datos del usuario y sus grupos desde Firebase
   * Se ejecuta al montar el componente
   */
  const loadUserData = async () => {
    try {
      // Obtener usuario actualmente autenticado
      const user = getCurrentUser();
      if (!user) {
        console.error("No hay sesión activa");
        setLoading(false);
        return;
      }

      // Obtener perfil completo del usuario desde Firestore
      const userProfile = await getUserProfile(user.uid);

      if (userProfile) {
        setUserData(userProfile);

        // Cargar grupos del usuario si tiene groupIds en su perfil
        if (userProfile.groupIds && userProfile.groupIds.length > 0) {
          await loadUserGroups(userProfile.groupIds);
        } else {
          setGroups([]);
        }
      } else {
        console.error("No se encontraron datos del usuario");
      }
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Carga la información completa de los grupos del usuario
   * Recibe array de IDs y consulta Firestore para obtener los datos completos
   */
  const loadUserGroups = async (groupIds) => {
    try {
      if (!groupIds || groupIds.length === 0) {
        setGroups([]);
        return;
      }

      // Obtener documentos completos de cada grupo desde Firestore
      const groupsData = [];
      for (const groupId of groupIds) {
        const groupDoc = await getDoc(doc(db, "groups", groupId));
        if (groupDoc.exists()) {
          groupsData.push({
            id: groupDoc.id,
            ...groupDoc.data()
          });
        }
      }

      setGroups(groupsData);
    } catch (error) {
      console.error("Error al cargar grupos:", error);
      setGroups([]);
    }
  };

  // ============================================
  // HANDLERS DE EVENTOS
  // ============================================

  
  /**
   * Maneja la selección de un grupo del modal
   * Establece el grupo seleccionado y cierra el modal
   */
  const handleGroupSelect = (group) => {
    setSelectedGroup(group);
    setShowGroupSelectModal(false);
  };
  
  /**
   * Maneja el cambio de fecha en el DateTimePicker
   * En iOS mantiene el picker visible, en Android lo cierra automáticamente
   */
  const onChangeFecha = (event, selectedDate) => {
    setMostrarSelectorFecha(Platform.OS === 'ios'); // En iOS mantener visible
    if (selectedDate) {
      setFecha(selectedDate);
    }
  };

  /**
   * Maneja el cambio de hora en el DateTimePicker
   */
  const onChangeHora = (event, selectedTime) => {
    setMostrarSelectorHora(Platform.OS === 'ios');
    if (selectedTime) {
      setHora(selectedTime);
    }
  };

  // ============================================
  // DATOS ESTÁTICOS
  // ============================================
  
  // Opciones de razones predefinidas para ausencias/permisos
  const razones = [
    {
      id: 1,
      title: 'Enfermedad',
      description: 'Malestar o cita médica',
      iconName: 'medical'
    },
    {
      id: 2,
      title: 'Problema de Transporte',
      description: 'Retraso o problema de transporte',
      iconName: 'car'
    },
    {
      id: 3,
      title: 'Familia/Emergencia',
      description: 'Asunto personal urgente',
      iconName: 'people'
    },
    {
      id: 4,
      title: 'Otro',
      description: 'Proporciona detalles a continuación',
      iconName: 'ellipsis-horizontal'
    }
  ];

  /**
   * Valida y envía el reporte de ausencia/permiso a Firebase
   * Validaciones:
   * 1. Grupo seleccionado
   * 2. Razón seleccionada
   * 3. Detalles no vacíos
   * Después de enviar, navega a la pantalla de confirmación
   */
  const enviarReporte = async () => {
    // Validación 1: Verificar que haya un grupo seleccionado
    if (!selectedGroup) {
      setInfoModalTitle('Grupo Requerido');
      setInfoModalMessage('Por favor selecciona un grupo antes de enviar el reporte');
      setShowInfoModal(true);
      return;
    }

    // Validación 2: Verificar que haya una razón seleccionada
    if (!razonSeleccionada) {
      setInfoModalTitle('Razón Requerida');
      setInfoModalMessage('Por favor selecciona una razón para tu ausencia o permiso');
      setShowInfoModal(true);
      return;
    }
    
    // Validación 3: Verificar que los detalles no estén vacíos
    if (!detalles.trim()) {
      setInfoModalTitle('Detalles Requeridos');
      setInfoModalMessage('Por favor proporciona detalles del incidente para completar tu reporte');
      setShowInfoModal(true);
      return;
    }

    setEnviandoPeticion(true);

    try {
      const user = getCurrentUser();
      if (!user) {
        throw new Error('No hay sesión activa');
      }

      // Buscar la información completa de la razón seleccionada
      const razonInfo = razones.find(r => r.id === razonSeleccionada);

      // Preparar objeto con todos los datos de la petición
      const peticionData = {
        userId: user.uid,
        userName: userData.name || 'Usuario',
        groupId: selectedGroup.id,
        position: userData.position || 'Miembro',
        date: fecha.toISOString().split('T')[0], // Formato ISO: "2025-01-22"
        startTime: hora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true }),
        reason: `${razonInfo.title}: ${detalles.trim()}` // Combinar razón y detalles
      };

      // Crear la petición en Firestore (colección peticionesPendientes)
      await createPeticion(peticionData);

      // Mostrar mensaje de éxito
      setInfoModalTitle('¡Petición Enviada!');
      setInfoModalMessage('Tu petición ha sido enviada exitosamente y está pendiente de aprobación.');
      setShowInfoModal(true);

      // Limpiar todos los campos del formulario
      setRazonSeleccionada(null);
      setDetalles('');
      setFecha(new Date());
      setHora(new Date());

    } catch (error) {
      console.error('Error al enviar petición:', error);
      setInfoModalTitle('Error');
      setInfoModalMessage(error.message || 'No se pudo enviar la petición. Inténtalo de nuevo.');
      setShowInfoModal(true);
    } finally {
      setEnviandoPeticion(false);
    }
  };

  // ============================================
  // RENDERIZADO
  // ============================================

  
  // Pantalla de carga mostrada mientras se obtienen los datos iniciales
  if (loading) {
    return (
      <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
        <HeaderScreen
          title="Reportes"
          leftIcon={<Ionicons name="arrow-back" size={24} color="black" />}
          onLeftPress={() => navigation.goBack()}
          rightIcon={<Ionicons name="notifications-outline" size={24} color="black" />}
          onRightPress={() => setNotificationsVisible(true)}
        />
        {/* Indicador de carga centrado */}
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={{ marginTop: 16, color: COLORS.textGray }}>
            Cargando datos...
          </Text>
        </View>
        <View style={styles.footerContainer}>
          <MenuFooter />
        </View>
      </SafeAreaView>
    );
  }

  // Pantalla principal con formulario de reporte
  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      {/* Header con botón de regreso y notificaciones */}
      <HeaderScreen
        title="Reportes"
        leftIcon={<Ionicons name="arrow-back" size={24} color="black" />}
        onLeftPress={() => navigation.goBack()}
        rightIcon={<Ionicons name="notifications-outline" size={24} color="black" />}
        onRightPress={() => setNotificationsVisible(true)}
      />
      
      {/* KeyboardAvoidingView para ajustar el contenido cuando aparece el teclado */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* TouchableWithoutFeedback permite cerrar el teclado al tocar fuera */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          {/* Contenido scrolleable del formulario */}
          <ScrollView 
            style={styles.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
        {/* Selector de grupos - muestra el grupo actual o mensaje por defecto */}
        <View style={CalendarAdminStyles.groupSelectorContainer}>
          <Text style={CalendarAdminStyles.groupSelectorTitle}>Selecciona un grupo</Text>
          <Pressable
            style={({ pressed }) => [
              CalendarAdminStyles.groupSelectorButton,
              pressed && { opacity: 0.7 }
            ]}
            onPress={() => setShowGroupSelectModal(true)}
          >
            <Ionicons name="people-outline" size={24} color={COLORS.primary} />
            <Text style={[
              CalendarAdminStyles.groupSelectorButtonText,
              selectedGroup && { color: COLORS.textBlack, fontWeight: '600' }
            ]}>
              {selectedGroup ? selectedGroup.name : 'No hay grupo seleccionado'}
            </Text>
            <Ionicons name="chevron-down" size={20} color={COLORS.textGray} />
          </Pressable>
        </View>

        {/* Contenido condicional: se muestra solo si hay un grupo seleccionado */}
        {selectedGroup ? (
          <>
            {/* Sección de Fecha y Hora */}
            <View style={styles.containerFecha}>
          {/* Label y botón para seleccionar fecha */}
          <Text style={styles.textoFecha}>Fecha seleccionada:</Text>
          <Pressable 
            onPress={() => setMostrarSelectorFecha(true)}
            style={styles.containerSelectorFecha}
          >
            <Text>{fecha.toLocaleDateString('es-ES')}</Text>
          </Pressable>
          
          {/* Label y botón para seleccionar hora */}
          <Text style={styles.textoFecha}>Hora seleccionada:</Text>
          <Pressable 
            onPress={() => setMostrarSelectorHora(true)}
            style={styles.containerSelectorFecha}
          >
            <Text>{hora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</Text>
          </Pressable>
          
          {/* DateTimePicker de fecha - se muestra condicionalmente */}
          {mostrarSelectorFecha && (
            <DateTimePicker
              value={fecha}
              mode="date"
              display="default"
              onChange={onChangeFecha}
            />
          )}
          
          {/* DateTimePicker de hora - se muestra condicionalmente */}
          {mostrarSelectorHora && (
            <DateTimePicker
              value={hora}
              mode="time"
              display="default"
              onChange={onChangeHora}
            />
          )}
        </View>

        {/* Sección de selección de razón de ausencia/permiso */}
        <View style={styles.containerRazones}>
          <Text style={styles.tituloSeccion}>Reason</Text>
          {/* Mapear todas las razones predefinidas */}
          {razones.map((razon) => (
            <RazonOption
              key={razon.id}
              title={razon.title}
              description={razon.description}
              iconName={razon.iconName}
              isSelected={razonSeleccionada === razon.id}
              onSelect={() => setRazonSeleccionada(razon.id)}
            />
          ))}
        </View>

        {/* Sección de descripción detallada del incidente */}
        <View style={styles.containerDetalles}>
          <Text style={styles.tituloSeccion}>Detalles</Text>
          
          {/* TextInput multilinea para la descripción */}
          <TextInput
            style={styles.textAreaDetalles}
            placeholder="Describe el incidente aquí..."
            placeholderTextColor={COLORS.textGray}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            value={detalles}
            onChangeText={setDetalles}
          />
        </View>

        {/* Botón de envío del reporte */}
        <View style={styles.botonEnviarContainer}>
          <ButtonLogin 
            title={enviandoPeticion ? "Enviando..." : "Enviar Reporte"}
            onPress={enviarReporte}
            backgroundColor={COLORS.backgroundBP}
            textColor={COLORS.textWhite}
            showBorder={false}
            disabled={enviandoPeticion}
          />
        </View>
          </>
        ) : (
          // Mensaje cuando no hay grupo seleccionado
          <View style={CalendarAdminStyles.noGroupSelected}>
            <Ionicons name="people-outline" size={64} color={COLORS.textGray} />
            <Text style={CalendarAdminStyles.noGroupSelectedTitle}>No hay grupo seleccionado</Text>
            <Text style={CalendarAdminStyles.noGroupSelectedText}>
              Selecciona un grupo para enviar un reporte de ausencia o permiso
            </Text>
          </View>
        )}
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      {/* ============================================ */}
      {/* MODALES */}
      {/* ============================================ */}
      
      {/* Modal para seleccionar un grupo de la lista */}
      <Modal
        visible={showGroupSelectModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowGroupSelectModal(false)}
      >
        {/* Fondo semi-transparente que cierra el modal al presionar */}
        <Pressable
          style={CalendarAdminStyles.modalOverlay}
          onPress={() => setShowGroupSelectModal(false)}
        >
          {/* Contenedor del modal - evita que el click cierre el modal */}
          <Pressable style={CalendarAdminStyles.groupModalContainer} onPress={(e) => e.stopPropagation()}>
            {/* Header del modal con título y botón de cerrar */}
            <View style={CalendarAdminStyles.groupModalHeader}>
              <Text style={CalendarAdminStyles.groupModalTitle}>Seleccione un grupo</Text>
              <Pressable onPress={() => setShowGroupSelectModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.textBlack} />
              </Pressable>
            </View>
            {/* Lista scrolleable de grupos disponibles */}
            <FlatList
              data={groups}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item: group }) => (
                <Pressable
                  style={({ pressed }) => [
                    CalendarAdminStyles.groupItem,
                    selectedGroup?.id === group.id && CalendarAdminStyles.groupItemSelected,
                    pressed && { opacity: 0.7 }
                  ]}
                  onPress={() => handleGroupSelect(group)}
                >
                  {/* Icono del grupo */}
                  <Ionicons name="people" size={20} color={COLORS.primary} />
                  {/* Nombre del grupo */}
                  <Text style={[
                    CalendarAdminStyles.groupItemText,
                    selectedGroup?.id === group.id && CalendarAdminStyles.groupItemTextSelected
                  ]}>
                    {group.name}
                  </Text>
                  {/* Checkmark para grupo seleccionado */}
                  {selectedGroup?.id === group.id && (
                    <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
                  )}
                </Pressable>
              )}
              ListEmptyComponent={() => (
                // Mensaje cuando no hay grupos disponibles
                <View style={{ padding: 20, alignItems: 'center' }}>
                  <Ionicons name="folder-open-outline" size={48} color={COLORS.textGray} />
                  <Text style={{
                    marginTop: 12,
                    fontSize: 16,
                    color: COLORS.textGray,
                    textAlign: 'center'
                  }}>
                    No tienes grupos asignados
                  </Text>
                </View>
              )}
              ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
              showsVerticalScrollIndicator={false}
            />
          </Pressable>
        </Pressable>
      </Modal>

      {/* Footer con navegación */}
      <View style={styles.footerContainer}>
        <MenuFooter />
      </View>

      {/* Modal de información general (éxito, error, validación) */}
      <InfoModal
        visible={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        title={infoModalTitle}
        message={infoModalMessage}
      />
      
      {/* Modal de notificaciones */}
      <NotificationsModal
        visible={notificationsVisible}
        onClose={() => setNotificationsVisible(false)}
      />
    </SafeAreaView>
  );
}