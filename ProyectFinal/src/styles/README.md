# Estructura de Estilos

Esta carpeta contiene todos los estilos de la aplicación organizados de manera escalable.

## Estructura

```
styles/
├── components/          # Estilos de componentes reutilizables
│   ├── BannerStyles.js
│   ├── ButtonStyles.js
│   ├── HeaderScreenStyles.js
│   ├── InfoModalStyles.js
│   ├── InputStyles.js
│   ├── MenuFooterStyles.js
│   └── RazonOptionStyles.js
│
└── screens/
    ├── general/        # Estilos de pantallas compartidas
    │   └── WelcomeStyles.js
    │
    ├── user/           # Estilos de pantallas de usuario
    │   ├── AddReportStyles.js
    │   ├── CalendarStyles.js
    │   ├── ConfirmationStyles.js
    │   ├── EditProfileStyles.js
    │   ├── HelpStyles.js
    │   ├── HistoryStyles.js
    │   ├── HomeStyles.js
    │   ├── LoginStyles.js
    │   ├── LogoutStyles.js
    │   ├── PasswordResetStyles.js
    │   ├── ProfileStyles.js
    │   └── RegisterStyles.js
    │
    ├── admin/          # Estilos de pantallas de administrador
    │   ├── ListAdminStyles.js
    │   └── ReportStyles.js
    │
    └── empresa/        # Estilos de pantallas de empresa (futuro)
```

## Convenciones de Importación

### Desde componentes
```javascript
import styles from '../styles/components/ButtonStyles';
```

### Desde pantallas generales
```javascript
import styles from '../../styles/screens/general/WelcomeStyles';
```

### Desde pantallas de usuario
```javascript
import styles from '../../styles/screens/user/LoginStyles';
```

### Desde pantallas de administrador
```javascript
import styles from '../../styles/screens/admin/ReportStyles';
```

## Beneficios de esta estructura

1. **Separación clara**: Los estilos de componentes están separados de los estilos de pantallas
2. **Escalabilidad**: Fácil agregar nuevos roles (empresa, manager, etc.)
3. **Paralelismo con screens**: La estructura de estilos refleja exactamente la estructura de screens
4. **Mantenibilidad**: Más fácil encontrar y actualizar estilos específicos
5. **Colaboración**: Reduce conflictos al trabajar en equipo
6. **Claridad**: La estructura refleja la arquitectura de la aplicación
