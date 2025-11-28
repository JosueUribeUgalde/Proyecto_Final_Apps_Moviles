// 1. Paquetes core de React/React Native
import { useState, useEffect } from 'react';
import { Text, View, ScrollView, Pressable, Platform, TextInput, Modal, FlatList, ActivityIndicator } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';

// 2. Bibliotecas de terceros
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';

// 3. Componentes propios
import { HeaderScreen, Banner, MenuFooter, RazonOption, ButtonLogin } from "../../components";
import InfoModal from "../../components/InfoModal";

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
  // Estados para carga de datos
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  // Estado para el selector de grupos
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showGroupSelectModal, setShowGroupSelectModal] = useState(false);

  // Estado para grupos del usuario (cargados desde Firebase)
  const [groups, setGroups] = useState([]);

  const [showBanner, setShowBanner] = useState(false);
  const [fecha, setFecha] = useState(new Date());
  const [hora, setHora] = useState(new Date());
  const [mostrarSelectorFecha, setMostrarSelectorFecha] = useState(false);
  const [mostrarSelectorHora, setMostrarSelectorHora] = useState(false);
  const [razonSeleccionada, setRazonSeleccionada] = useState(null);
  const [detalles, setDetalles] = useState('');

  // Estados para InfoModal
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoModalTitle, setInfoModalTitle] = useState('');
  const [infoModalMessage, setInfoModalMessage] = useState('');
  const [enviandoPeticion, setEnviandoPeticion] = useState(false);
  
  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    loadUserData();
  }, []);

  // Función para cargar datos del usuario y sus grupos
  const loadUserData = async () => {
    try {
      const user = getCurrentUser();
      if (!user) {
        console.error("No hay sesión activa");
        setLoading(false);
        return;
      }

      // Obtener datos del usuario
      const userProfile = await getUserProfile(user.uid);

      if (userProfile) {
        setUserData(userProfile);

        // Cargar grupos del usuario
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

  // Función para cargar los grupos del usuario desde Firestore
  const loadUserGroups = async (groupIds) => {
    try {
      if (!groupIds || groupIds.length === 0) {
        setGroups([]);
        return;
      }

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

  const handleGroupSelect = (group) => {
    setSelectedGroup(group);
    setShowGroupSelectModal(false);
  };
  
  const onChangeFecha = (event, selectedDate) => {
    setMostrarSelectorFecha(Platform.OS === 'ios'); // En iOS mantener visible
    if (selectedDate) {
      setFecha(selectedDate);
    }
  };

  const onChangeHora = (event, selectedTime) => {
    setMostrarSelectorHora(Platform.OS === 'ios');
    if (selectedTime) {
      setHora(selectedTime);
    }
  };

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

  const enviarReporte = async () => {
    // Validación de grupo seleccionado
    if (!selectedGroup) {
      setInfoModalTitle('Grupo Requerido');
      setInfoModalMessage('Por favor selecciona un grupo antes de enviar el reporte');
      setShowInfoModal(true);
      return;
    }

    // Validación básica
    if (!razonSeleccionada) {
      setInfoModalTitle('Razón Requerida');
      setInfoModalMessage('Por favor selecciona una razón para tu ausencia o permiso');
      setShowInfoModal(true);
      return;
    }
    
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

      // Obtener información de la razón seleccionada
      const razonInfo = razones.find(r => r.id === razonSeleccionada);

      // Preparar datos de la petición
      const peticionData = {
        userId: user.uid,
        userName: userData.name || 'Usuario',
        groupId: selectedGroup.id,
        position: userData.position || 'Miembro',
        date: fecha.toISOString().split('T')[0], // Formato: "2025-01-22"
        startTime: hora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true }),
        reason: `${razonInfo.title}: ${detalles.trim()}`
      };

      // Crear la petición en Firestore
      const peticionId = await createPeticion(peticionData);

      console.log('Petición creada exitosamente:', peticionId);

      // Mostrar mensaje de éxito
      setInfoModalTitle('¡Petición Enviada!');
      setInfoModalMessage('Tu petición ha sido enviada exitosamente y está pendiente de aprobación.');
      setShowInfoModal(true);

      // Limpiar el formulario
      setRazonSeleccionada(null);
      setDetalles('');
      setFecha(new Date());
      setHora(new Date());

      // Navegar a la pantalla de confirmación después de cerrar el modal
      setTimeout(() => {
        navigation.navigate('ConfirmationReplace', {
          empleado: userData.name || 'Usuario',
          fechaInicio: fecha.toLocaleDateString('es-ES'),
          fechaFin: fecha.toLocaleDateString('es-ES'),
          motivo: razonInfo.title
        });
      }, 2000);

    } catch (error) {
      console.error('Error al enviar petición:', error);
      setInfoModalTitle('Error');
      setInfoModalMessage(error.message || 'No se pudo enviar la petición. Inténtalo de nuevo.');
      setShowInfoModal(true);
    } finally {
      setEnviandoPeticion(false);
    }
  };

  // Pantalla de carga mientras se obtienen los datos
  if (loading) {
    return (
      <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
        <HeaderScreen
          title="Reportes"
          leftIcon={<Ionicons name="arrow-back" size={24} color="black" />}
          onLeftPress={() => navigation.goBack()}
          rightIcon={<Ionicons name="notifications-outline" size={24} color="black" />}
        />
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

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <HeaderScreen
        title="Reportes"
        leftIcon={<Ionicons name="arrow-back" size={24} color="black" />}
        onLeftPress={() => navigation.goBack()}
          rightIcon={<Ionicons name="notifications-outline" size={24} color="black" />}
      />
      
      {/* Banner para mensajes (opcional)
      <View style={styles.bannerContainer}>
        <Banner
        
          message="Mensaje de ejemplo"
          type="error" // o "success"
          visible={showBanner}
          onHide={() => setShowBanner(false)}
        />
      </View> */}
      
      {/* Contenido principal */}
      <ScrollView style={styles.content}>
        {/* Selector de Grupos */}
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

        {selectedGroup ? (
          <>
            {/* TODO: Agrega tu contenido aquí */}
            {/* Selector de Fecha */}
            <View style={styles.containerFecha}>
          <Text style={styles.textoFecha}>Fecha seleccionada:</Text>
          <Pressable 
            onPress={() => setMostrarSelectorFecha(true)}
            style={styles.containerSelectorFecha}
          >
            <Text>{fecha.toLocaleDateString('es-ES')}</Text>
          </Pressable>
          
          <Text style={styles.textoFecha}>Hora seleccionada:</Text>
          <Pressable 
            onPress={() => setMostrarSelectorHora(true)}
            style={styles.containerSelectorFecha}
          >
            <Text>{hora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</Text>
          </Pressable>
          
          {/* Ambos selectores dentro del mismo contenedor */}
          {mostrarSelectorFecha && (
            <DateTimePicker
              value={fecha}
              mode="date"
              display="default"
              onChange={onChangeFecha}
            />
          )}
          
          {mostrarSelectorHora && (
            <DateTimePicker
              value={hora}
              mode="time"
              display="default"
              onChange={onChangeHora}
            />
          )}
          
        </View>

        {/* Selector de Razones - ahora vacío */}
        <View style={styles.containerRazones}>
          <Text style={styles.tituloSeccion}>Reason</Text>
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

        {/* Sección de Detalles */}
        <View style={styles.containerDetalles}>
          <Text style={styles.tituloSeccion}>Detalles</Text>
          
          {/* TextInput para descripción */}
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

        {/* Botón de envío */}
        <View style={styles.botonEnviarContainer}>
          <ButtonLogin 
            title={enviandoPeticion ? "Enviando..." : "Enviar Reporte"}
            onPress={enviarReporte}
            backgroundColor={COLORS.backgroundWhite}
            textColor={COLORS.textGreen}
            showBorder={true}
            disabled={enviandoPeticion}
          />
        </View>
          </>
        ) : (
          <View style={CalendarAdminStyles.noGroupSelected}>
            <Ionicons name="people-outline" size={64} color={COLORS.textGray} />
            <Text style={CalendarAdminStyles.noGroupSelectedTitle}>No hay grupo seleccionado</Text>
            <Text style={CalendarAdminStyles.noGroupSelectedText}>
              Selecciona un grupo para enviar un reporte de ausencia o permiso
            </Text>
          </View>
        )}
        
      </ScrollView>
      
      {/* Modal de Selección de Grupo */}
      <Modal
        visible={showGroupSelectModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowGroupSelectModal(false)}
      >
        <Pressable
          style={CalendarAdminStyles.modalOverlay}
          onPress={() => setShowGroupSelectModal(false)}
        >
          <Pressable style={CalendarAdminStyles.groupModalContainer} onPress={(e) => e.stopPropagation()}>
            <View style={CalendarAdminStyles.groupModalHeader}>
              <Text style={CalendarAdminStyles.groupModalTitle}>Seleccione un grupo</Text>
              <Pressable onPress={() => setShowGroupSelectModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.textBlack} />
              </Pressable>
            </View>
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
                  <Ionicons name="people" size={20} color={COLORS.primary} />
                  <Text style={[
                    CalendarAdminStyles.groupItemText,
                    selectedGroup?.id === group.id && CalendarAdminStyles.groupItemTextSelected
                  ]}>
                    {group.name}
                  </Text>
                  {selectedGroup?.id === group.id && (
                    <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
                  )}
                </Pressable>
              )}
              ListEmptyComponent={() => (
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

      {/* Footer */}
      <View style={styles.footerContainer}>
        <MenuFooter />
      </View>

      {/* Modal de Información */}
      <InfoModal
        visible={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        title={infoModalTitle}
        message={infoModalMessage}
      />
    </SafeAreaView>
  );
}