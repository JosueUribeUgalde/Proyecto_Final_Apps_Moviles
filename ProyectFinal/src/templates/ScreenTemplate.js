// 1. Paquetes core de React/React Native
import { useState } from 'react';
import { Text, View, ScrollView } from "react-native";

// 2. Bibliotecas de terceros
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';

// 3. Componentes propios
import { HeaderScreen, Banner, MenuFooter } from "../components";

// 4. Constantes y utilidades
import { COLORS } from '../components/constants/theme';

// 5. Estilos - Deberás crear este archivo para tu pantalla
// import styles from "../components/styles/TuPantallaStyles";

/**
 * Plantilla base para nuevas pantallas
 * 
 * Instrucciones:
 * 1. Copia este archivo y renómbralo según tu pantalla
 * 2. Crea un archivo de estilos correspondiente en components/styles/
 * 3. Reemplaza los comentarios TODO con tu código
 * 4. Elimina los componentes que no necesites
 * 
 * @param {object} navigation - Objeto de navegación
 * @returns {JSX.Element} - Componente de pantalla
 */
export default function ScreenTemplate({ navigation }) {
  const [showBanner, setShowBanner] = useState(false);
  
  // TODO: Agrega tus estados y funciones aquí
  
  return (
    <SafeAreaView edges={['top', 'bottom']} style={/* TODO: styles.container */{}}>
      <HeaderScreen
        title="Título de Pantalla"
        leftIcon={<Ionicons name="arrow-back" size={24} color="black" />}
        rightIcon={<Ionicons name="settings" size={24} color="black" />}
        onLeftPress={() => navigation.goBack()}
        onRightPress={() => {/* TODO: acción */}}
      />
      
      {/* Banner para mensajes (opcional) */}
      <View style={/* TODO: styles.bannerContainer */{}}>
        <Banner
          message="Mensaje de ejemplo"
          type="error" // o "success"
          visible={showBanner}
          onHide={() => setShowBanner(false)}
        />
      </View>
      
      {/* Contenido principal */}
      <ScrollView style={/* TODO: styles.content */{}}>
        {/* TODO: Agrega tu contenido aquí */}
        <Text>Contenido de la pantalla</Text>
      </ScrollView>
      
      {/* Footer */}
      <View style={/* TODO: styles.footerContainer */{}}>
        <MenuFooter />
      </View>
    </SafeAreaView>
  );
}