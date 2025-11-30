# Estructura de Screens

Esta carpeta contiene todas las pantallas de la aplicación organizadas por rol/tipo de usuario.

## Estructura Actualizada

```
screens/
├── index.js            # Exporta todas las pantallas
├── README.md           # Este archivo
│
├── general/            # Pantallas compartidas/acceso general
│   └── Welcome.js      # Pantalla de bienvenida y selección de rol
│
├── user/               # Pantallas de usuario (empleados)
│   ├── AddReport.js           # Solicitar ausencia/permiso
│   ├── Calendar.js            # Calendario de turnos personales
│   ├── EditProfile.js         # Editar perfil de usuario
│   ├── Help.js                # Centro de ayuda
│   ├── History.js             # Historial de ausencias
│   ├── Home.js                # Dashboard principal del usuario
│   ├── Login.js               # Inicio de sesión de usuario
│   ├── Logout.js              # Cierre de sesión
│   ├── PasswordReset.js       # Recuperación de contraseña
│   ├── Profile.js             # Perfil de usuario
│   └── Register.js            # Registro de nuevo usuario
│
├── admin/              # Pantallas de administrador (gestión de equipo)
│   ├── CalendarAdmin.js       # Calendario con métricas y gráficas
│   ├── DashboardAdmin.js      # Dashboard principal del admin
│   ├── EditProfileAdmin.js    # Editar perfil admin
│   ├── LoginAdmin.js          # Inicio de sesión admin
│   ├── MembersAdmin.js        # Gestión de miembros y grupos
│   ├── ProfileAdmin.js        # Perfil de administrador
│   └── RequestScreen.js       # Gestión de solicitudes/ausencias
│
└── company/            # Pantallas de empresa (nivel corporativo)
    ├── Dashboard.js           # Dashboard principal de empresa
    ├── EditProfileCompany.js  # Editar perfil empresa
    ├── InvoiceHistory.js      # Historial de facturas
    ├── LoginCompany.js        # Inicio de sesión empresa
    ├── MembersCompany.js      # Gestión de miembros empresa
    ├── PaymentMethod.js       # Métodos de pago
    ├── Plan.js                # Gestión de planes/suscripciones
    ├── ProfileCompany.js      # Perfil de empresa
    └── RegisterCompany.js     # Registro de nueva empresa
```

## Roles y Permisos

### 👤 Usuario (User)
- **Objetivo**: Gestionar sus propios turnos, ausencias y perfil
- **Funcionalidades**:
  - Ver calendario personal de turnos
  - Solicitar ausencias/permisos
  - Ver historial de solicitudes
  - Editar perfil personal
  - Acceder a ayuda

### 👨‍💼 Administrador (Admin)
- **Objetivo**: Gestionar equipo, turnos y solicitudes
- **Funcionalidades**:
  - Ver calendario del equipo con métricas
  - Gestionar miembros y grupos
  - Aprobar/rechazar solicitudes de ausencias
  - Ver dashboard con estadísticas
  - Gestionar reemplazos de turnos

### 🏢 Empresa (Company)
- **Objetivo**: Gestión corporativa y facturación
- **Funcionalidades**:
  - Dashboard corporativo
  - Gestión de múltiples equipos/miembros
  - Historial de facturas
  - Gestión de planes/suscripciones
  - Métodos de pago

## Convenciones de Importación

### Importación centralizada desde index.js
```javascript
// En App.js, navegación o cualquier archivo
import { 
  Welcome, 
  Login, 
  Register,
  Home, 
  LoginAdmin, 
  MembersAdmin,
  Dashboard,
  LoginCompany 
} from './src/screens';
```

### Importación directa (alternativa)
```javascript
// Usuario
import Home from './src/screens/user/Home';
import Calendar from './src/screens/user/Calendar';

// Admin
import MembersAdmin from './src/screens/admin/MembersAdmin';
import RequestScreen from './src/screens/admin/RequestScreen';

// Empresa
import Dashboard from './src/screens/company/Dashboard';
import Plan from './src/screens/company/Plan';
```

## Relación con Estilos

Cada pantalla tiene su archivo de estilos correspondiente en `src/styles/screens/`:

| Screen | Styles |
|--------|--------|
| `general/Welcome.js` | `styles/screens/general/WelcomeStyles.js` |
| `user/Calendar.js` | `styles/screens/user/CalendarStyles.js` |
| `admin/MembersAdmin.js` | `styles/screens/admin/MembersAdminStyles.js` |
| `company/Dashboard.js` | `styles/screens/company/DashboardStyles.js` |

## Añadir una Nueva Pantalla

### 1. Crear el archivo de la pantalla
```bash
# Ejemplo para usuario
screens/user/MiNuevaPantalla.js
```

### 2. Estructura básica de la pantalla
```javascript
import React from 'react';
import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import styles from '../../styles/screens/user/MiNuevaPantallaStyles';

const MiNuevaPantalla = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Mi Nueva Pantalla</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MiNuevaPantalla;
```

### 3. Exportarla en `screens/index.js`
```javascript
// Usuario
export { default as MiNuevaPantalla } from './user/MiNuevaPantalla';

// Admin
export { default as MiNuevaPantallaAdmin } from './admin/MiNuevaPantallaAdmin';

// Company
export { default as MiNuevaPantallaCompany } from './company/MiNuevaPantallaCompany';
```

### 4. Crear archivo de estilos
```bash
styles/screens/user/MiNuevaPantallaStyles.js
```

### 5. Estructura de estilos con documentación
```javascript
import { StyleSheet } from 'react-native';
import { COLORS, FONTS, RADIUS, SHADOWS } from '../../../components/constants/theme';

/**
 * MiNuevaPantallaStyles
 * 
 * Descripción de la pantalla
 * Incluye estilos para:
 * - Elemento 1
 * - Elemento 2
 */

export default StyleSheet.create({
  // ===========================
  // CONTENEDORES PRINCIPALES
  // ===========================
  
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  content: {
    flex: 1,
    width: '90%',
    alignSelf: 'center',
  },
});
```

### 6. Agregar a la navegación
```javascript
// En tu archivo de navegación (ej: AppNavigator.js)
<Stack.Screen 
  name="MiNuevaPantalla" 
  component={MiNuevaPantalla}
  options={{ title: 'Mi Nueva Pantalla' }}
/>
```

## Componentes Comunes en Pantallas

### Elementos Estándar
- **SafeAreaView**: Contenedor principal para áreas seguras
- **ScrollView**: Contenido desplazable
- **Banner**: Notificaciones (user y admin)
- **MenuFooter**: Navegación inferior (user)
- **HeaderScreen**: Encabezados personalizados

### Modales Reutilizables
- **NotificationsModal**: Modal de notificaciones
- **InfoModal**: Modal de información general
- **ReplacementModal**: Modal de reemplazo (admin)

### Ejemplo de uso
```javascript
import Banner from '../../components/Banner';
import MenuFooter from '../../components/MenuFooter';
import NotificationsModal from '../../components/NotificationsModal';

const MiPantalla = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <Banner />
      <ScrollView style={styles.content}>
        {/* Contenido */}
      </ScrollView>
      <MenuFooter navigation={navigation} activeScreen="Home" />
      <NotificationsModal />
    </SafeAreaView>
  );
};
```

## Convenciones de Nomenclatura

### Nombres de Archivos
- **PascalCase**: `MembersAdmin.js`, `Calendar.js`
- **Descriptivos**: El nombre indica claramente la funcionalidad
- **Sin sufijos de rol en general**: `Login.js` en vez de `LoginUser.js`
- **Con sufijos para roles específicos**: `LoginAdmin.js`, `LoginCompany.js`

### Nombres de Componentes
- **PascalCase**: `const MembersAdmin = () => {}`
- **Mismo nombre que el archivo**: Facilita búsquedas
- **Export default**: Para importación simplificada

## Navegación entre Roles

### Usuario → Admin
```javascript
navigation.navigate('LoginAdmin');
```

### Usuario → Empresa
```javascript
navigation.navigate('LoginCompany');
```

### Regresar a Welcome
```javascript
navigation.navigate('Welcome');
```

## Estado de Documentación de Pantallas

### ✅ Completamente Documentadas
- `admin/MembersAdmin.js` - 80+ comentarios en código

### 🔄 Con Documentación Parcial
- Mayoría de pantallas tienen comentarios básicos

### 📝 Pendientes de Documentación Completa
- Pantallas de `company/`
- Algunas pantallas de `user/`

## Beneficios de esta Estructura

1. **Separación por roles**: Cada tipo de usuario tiene sus pantallas organizadas
2. **Escalabilidad**: Fácil agregar nuevos roles (gerente, supervisor, etc.)
3. **Paralelismo con styles**: Refleja exactamente la estructura de estilos
4. **Mantenibilidad**: Fácil encontrar y mantener pantallas específicas
5. **Colaboración**: Múltiples desarrolladores pueden trabajar sin conflictos
6. **Exportaciones centralizadas**: Un solo punto de importación para todas las pantallas
7. **Consistencia**: Estructura predecible facilita onboarding de nuevos desarrolladores
8. **Modularidad**: Cada pantalla es independiente y reutilizable
