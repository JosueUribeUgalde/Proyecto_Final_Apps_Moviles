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

// 5. Estilos
import styles from "../components/styles/HomeStyles";


export default function Home({ navigation }) {
  const [showBanner, setShowBanner] = useState(false);
  
  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <HeaderScreen
        title="Home"
        
        rightIcon={<Ionicons name="notifications-outline" size={24} color="black" />}
        onLeftPress={() => navigation.goBack()}
        onRightPress={() => {}}
      />
      
      {/* Banner para mensajes (opcional) */}
      <View style={styles.bannerContainer}>
        <Banner
          message="Mensaje de ejemplo"
          type="error"
          visible={showBanner}
          onHide={() => setShowBanner(false)}
        />
      </View>
      
      {/* Contenido principal */}
      <ScrollView style={styles.content}>
        <Text>Contenido de la pantalla</Text>
        {/* Más contenido aquí */}
      </ScrollView>
      
      {/* Footer */}
      <View style={styles.footerContainer}>
        <MenuFooter />
      </View>
    </SafeAreaView>
  );
}