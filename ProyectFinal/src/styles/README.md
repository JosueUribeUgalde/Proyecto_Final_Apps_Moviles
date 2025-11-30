# Estructura de Estilos

Esta carpeta contiene todos los estilos de la aplicación organizados de manera escalable y completamente documentados en español.

## Estructura Actualizada

```
styles/
├── README.md
│
├── components/          # Estilos de componentes reutilizables
│   ├── BannerStyles.js                  # Banner de notificaciones
│   ├── ButtonRequestStyles.js           # Botones de solicitudes
│   ├── ButtonStyles.js                  # Botones generales
│   ├── HeaderScreenStyles.js            # Headers de pantallas
│   ├── InfoModalStyles.js               # Modal de información
│   ├── InputStyles.js                   # Campos de entrada
│   ├── MenuFooterCompanyStyles.js       # Menú footer para empresa
│   ├── MenuFooterStyles.js              # Menú footer para usuario
│   ├── NotificationsModalStyles.js      # Modal de notificaciones
│   └── RazonOptionStyles.js             # Opciones de razones
│
└── screens/
    ├── general/        # Estilos de pantallas compartidas
    │   └── WelcomeStyles.js             # ✅ Pantalla de bienvenida inicial
    │
    ├── user/           # Estilos de pantallas de usuario
    │   ├── AddReportStyles.js           # Agregar reporte de ausencia
    │   ├── CalendarStyles.js            # ✅ Calendario de turnos del usuario
    │   ├── EditProfileStyles.js         # Edición de perfil
    │   ├── HelpStyles.js                # Pantalla de ayuda
    │   ├── HistoryStyles.js             # Historial de ausencias
    │   ├── HomeStyles.js                # Pantalla principal del usuario
    │   ├── LoginStyles.js               # Login de usuario
    │   ├── LogoutStyles.js              # Cierre de sesión
    │   ├── PasswordResetStyles.js       # Recuperación de contraseña
    │   ├── ProfileStyles.js             # Perfil de usuario
    │   └── RegisterStyles.js            # Registro de usuario
    │
    ├── admin/          # Estilos de pantallas de administrador
    │   ├── CalendarAdminStyles.js       # ✅ Calendario con métricas y gráficas
    │   ├── DashboardAdminStyles.js      # Dashboard principal del admin
    │   ├── EditProfileAdminStyles.js    # Edición de perfil admin
    │   ├── LoginAdminStyles.js          # Login de administrador
    │   ├── MembersAdminStyles.js        # ✅ Gestión de miembros y grupos
    │   ├── ProfileAdminStyles.js        # Perfil de administrador
    │   ├── ReplacementModalStyles.js    # Modal de reemplazo de miembros
    │   └── RequestStyles.js             # ✅ Gestión de solicitudes
    │
    └── company/        # Estilos de pantallas de empresa
        ├── DashboardStyles.js           # Dashboard de empresa
        ├── EditProfileCompanyStyles.js  # Edición de perfil empresa
        ├── InvoiceHistoryStyles.js      # Historial de facturas
        ├── LoginCompanyStyles.js        # Login de empresa
        ├── MembersCompanyStyles.js      # Gestión de miembros
        ├── PlanStyles.js                # Gestión de planes
        ├── ProfileCompanyStyles.js      # Perfil de empresa
        └── RegisterStyles.js            # Registro de empresa
```

## Estado de Documentación

### ✅ Completamente Documentados
Los siguientes archivos cuentan con comentarios descriptivos en español organizados por secciones:

- **general/WelcomeStyles.js** - 20+ comentarios, 4 secciones
- **user/CalendarStyles.js** - 70+ comentarios, 12 secciones
- **admin/CalendarAdminStyles.js** - 36 comentarios, 8 secciones
- **admin/MembersAdminStyles.js** - 80+ comentarios, 10 secciones (archivo principal)
- **admin/RequestStyles.js** - 60+ comentarios, 8 secciones

### 🔄 Pendientes de Documentación
Archivos que aún requieren comentarios descriptivos en español:
- Todos los estilos de `components/`
- Estilos restantes de `user/`
- Estilos restantes de `admin/`
- Todos los estilos de `company/`

## Convenciones de Importación

### Desde componentes
```javascript
import styles from '../styles/components/ButtonStyles';
import BannerStyles from '../styles/components/BannerStyles';
import NotificationsModalStyles from '../styles/components/NotificationsModalStyles';
```

### Desde pantallas generales
```javascript
import styles from '../../styles/screens/general/WelcomeStyles';
```

### Desde pantallas de usuario
```javascript
import styles from '../../styles/screens/user/LoginStyles';
import CalendarStyles from '../../styles/screens/user/CalendarStyles';
import HomeStyles from '../../styles/screens/user/HomeStyles';
```

### Desde pantallas de administrador
```javascript
import styles from '../../styles/screens/admin/RequestStyles';
import CalendarAdminStyles from '../../styles/screens/admin/CalendarAdminStyles';
import MembersAdminStyles from '../../styles/screens/admin/MembersAdminStyles';
```

### Desde pantallas de empresa
```javascript
import styles from '../../styles/screens/company/DashboardStyles';
import PlanStyles from '../../styles/screens/company/PlanStyles';
```

## Estándares de Documentación

### Estructura de Comentarios
Todos los archivos de estilos deben seguir esta estructura:

```javascript
/**
 * NombreDelArchivo
 * 
 * Descripción breve de la pantalla/componente
 * Incluye estilos para:
 * - Elemento 1
 * - Elemento 2
 * - Elemento 3
 */

export default StyleSheet.create({
  // ===========================
  // NOMBRE DE LA SECCIÓN
  // ===========================
  
  // Descripción del estilo individual
  estiloEjemplo: {
    // ... propiedades
  },
});
```

### Secciones Comunes
- **CONTENEDORES PRINCIPALES** - Containers, wrappers, layouts principales
- **HEADER/ENCABEZADO** - Títulos, subtítulos, elementos de cabecera
- **FORMULARIOS** - Inputs, labels, campos de texto
- **BOTONES** - Botones de acción, chips, badges
- **CARDS** - Tarjetas de información
- **LISTAS** - FlatLists, ScrollViews, items de lista
- **MODALES** - Overlays, contenido de modales
- **ESTADOS VACÍOS** - Empty states, placeholders
- **FOOTER** - Menús de navegación, elementos de pie de página

## Beneficios de esta estructura

1. **Separación clara**: Los estilos de componentes están separados de los estilos de pantallas
2. **Escalabilidad**: Fácil agregar nuevos roles (empresa, manager, etc.)
3. **Paralelismo con screens**: La estructura de estilos refleja exactamente la estructura de screens
4. **Mantenibilidad**: Más fácil encontrar y actualizar estilos específicos
5. **Colaboración**: Reduce conflictos al trabajar en equipo
6. **Claridad**: La estructura refleja la arquitectura de la aplicación
7. **Documentación**: Comentarios en español facilitan el entendimiento del código
8. **Organización**: Estilos agrupados por secciones lógicas

## Convenciones de Nomenclatura

### Nombres de Archivos
- **PascalCase**: `CalendarStyles.js`, `ButtonStyles.js`
- **Sufijo "Styles"**: Todos los archivos terminan en "Styles.js"
- **Descriptivos**: El nombre indica el componente/pantalla que estiliza

### Nombres de Estilos
- **camelCase**: `container`, `headerTitle`, `buttonPrimary`
- **Descriptivos**: Indican claramente qué elemento estilizan
- **Jerárquicos**: Usan prefijos para agrupar (ej: `modal`, `modalOverlay`, `modalContent`)
- **Estados**: Sufijos para variantes (ej: `button`, `buttonPressed`, `buttonDisabled`)

## Mantenimiento y Limpieza

### Antes de Documentar
1. Identificar todos los estilos usados en el componente/pantalla
2. Eliminar estilos no utilizados
3. Consolidar estilos duplicados
4. Verificar que todos usan constantes del theme

### Durante la Documentación
1. Agregar encabezado con descripción general
2. Organizar en secciones lógicas
3. Comentar cada estilo individualmente
4. Usar separadores visuales entre secciones

### Después de Documentar
1. Verificar que la pantalla sigue funcionando
2. Revisar que no haya estilos duplicados
3. Confirmar que todos los comentarios son claros
4. Actualizar este README si es necesario
