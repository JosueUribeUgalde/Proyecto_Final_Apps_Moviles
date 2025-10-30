// 1. Paquetes core de React/React Native
import { useState } from 'react';
import { Text, View, ScrollView, Pressable, Platform, TextInput } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';

// 2. Bibliotecas de terceros
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';

// 3. Componentes propios
import { HeaderScreen, Banner, MenuFooter, RazonOption, ButtonLogin } from "../components";

// 4. Constantes y utilidades
import { COLORS } from '../components/constants/theme';

// 5. Estilos - Deberás crear este archivo para tu pantalla
import styles from "../components/stylesScreensAdmin/AddReportStyles";

export default function ScreenTemplate({ navigation }) {
  const [showBanner, setShowBanner] = useState(false);
  const [fecha, setFecha] = useState(new Date());
  const [hora, setHora] = useState(new Date());
  const [mostrarSelectorFecha, setMostrarSelectorFecha] = useState(false);
  const [mostrarSelectorHora, setMostrarSelectorHora] = useState(false);
  const [razonSeleccionada, setRazonSeleccionada] = useState(null);
  const [detalles, setDetalles] = useState('');
  const [documentoAdjunto, setDocumentoAdjunto] = useState(null);
  const [visibleManager, setVisibleManager] = useState(false);
  
  // TODO: Agrega tus estados y funciones aquí
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

  const seleccionarDocumento = async () => {
    try {
      const resultado = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true
      });
      
      if (!resultado.canceled) {
        setDocumentoAdjunto(resultado.assets[0]);
      }
    } catch (error) {
      console.log('Error al seleccionar documento:', error);
    }
  };

  const seleccionarImagen = async () => {
    try {
      const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permiso.granted) {
        const resultado = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 0.8,
        });
        
        if (!resultado.canceled) {
          setDocumentoAdjunto(resultado.assets[0]);
        }
      }
    } catch (error) {
      console.log('Error al seleccionar imagen:', error);
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

  const enviarReporte = () => {
    // Validación básica
    if (!razonSeleccionada) {
      alert('Por favor selecciona una razón');
      return;
    }
    
    if (!detalles.trim()) {
      alert('Por favor proporciona detalles del incidente');
      return;
    }

    // Aquí iría la lógica para enviar el reporte
    const razonInfo = razones.find(r => r.id === razonSeleccionada);
    const reporte = {
      fecha: fecha.toISOString(),
      hora: hora.toISOString(),
      razon: razonInfo,
      detalles: detalles,
      documentoAdjunto: documentoAdjunto,
      visibleManager: visibleManager
    };
    
    console.log('Reporte enviado:', reporte);
    // TODO: Aquí conectarías con tu API o base de datos
    
    // Navegar a la pantalla de confirmación
    navigation.navigate('ConfirmationReplace', {
      empleado: 'Usuario',
      fechaInicio: fecha.toLocaleDateString('es-ES'),
      fechaFin: fecha.toLocaleDateString('es-ES'),
      motivo: razonInfo.title
    });
  };

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
          
          {/* Botones de adjuntar documento y visibilidad */}
          <View style={styles.opcionesContainer}>
            {/* Botón adjuntar documento */}
            <Pressable 
              onPress={seleccionarDocumento}
              style={({ pressed }) => [
                styles.botonAdjuntar,
                pressed && { opacity: 0.5 }
              ]}
            >
              <Ionicons name="attach" size={20} color={COLORS.textGray} />
              <Text style={styles.textoBotonAdjuntar}>
                Adjuntar documento
              </Text>
              <Text style={styles.textoOpcional}>(opcional)</Text>
            </Pressable>
            
            {/* Botón visibilidad */}
            <Pressable 
              onPress={() => setVisibleManager(!visibleManager)}
              style={({ pressed }) => [
                styles.botonVisibilidad,
                visibleManager && styles.botonVisibilidadActivo,
                pressed && { opacity: 0.5 }
              ]}
            >
              <Ionicons 
                name={visibleManager ? "lock-open" : "lock-closed"} 
                size={20} 
                color={visibleManager ? COLORS.primary : COLORS.textGray} 
              />
              <Text style={[
                styles.textoVisibilidad,
                visibleManager && styles.textoVisibilidadActivo
              ]}>
                Visible para manager
              </Text>
            </Pressable>
          </View>
          
          {/* Mostrar documento adjunto si existe */}
          {documentoAdjunto && (
            <View style={styles.documentoAdjuntoContainer}>
              <Ionicons name="document" size={20} color={COLORS.primary} />
              <Text style={styles.nombreDocumento} numberOfLines={1}>
                {documentoAdjunto.name || 'Documento adjunto'}
              </Text>
              <Pressable onPress={() => setDocumentoAdjunto(null)}>
                <Ionicons name="close-circle" size={20} color={COLORS.error} />
              </Pressable>
            </View>
          )}
        </View>

        {/* Botón de envío */}
        <View style={styles.botonEnviarContainer}>
          <ButtonLogin 
            title="Enviar Reporte"
            onPress={enviarReporte}
            backgroundColor={COLORS.primary}
            textColor={COLORS.backgroundWhite}
          />
        </View>
        
      </ScrollView>
      
      {/* Footer */}
      <View style={styles.footerContainer}>
        <MenuFooter />
      </View>
    </SafeAreaView>
  );
}