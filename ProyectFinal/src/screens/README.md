# Estructura de Screens

Esta carpeta contiene todas las pantallas de la aplicación organizadas por rol/tipo de usuario.

## Estructura

```
screens/
├── index.js            # Exporta todas las pantallas
│
├── general/            # Pantallas compartidas/acceso general
│   └── Welcome.js      # Pantalla de bienvenida y selección de rol
│
├── user/               # Pantallas exclusivas de usuario
│   ├── Login.js
│   ├── Register.js
│   ├── Home.js
│   ├── Profile.js
│   ├── EditProfile.js
│   ├── History.js
│   ├── PasswordReset.js
│   ├── Logout.js
│   ├── ConfirmationReplace.js
│   ├── Calendar.js
│   ├── AddReport.js
│   └── Help.js
│
├── admin/              # Pantallas exclusivas de administrador
│   ├── LoginAdmin.js
│   ├── ListAdmin.js
│   └── ReportScreen.js
│
└── empresa/            # Pantallas exclusivas de empresa (preparado para futuro)
```

## Convenciones de Importación

### En App.js o cualquier otro archivo
```javascript
import { Welcome, Login, LoginAdmin, Home } from './src/screens';
```

### Todas las exportaciones están disponibles desde `./screens/index.js`

## Añadir una nueva pantalla

### 1. Crear el archivo en la carpeta correspondiente
```
screens/user/MiNuevaPantalla.js
```

### 2. Exportarla en `screens/index.js`
```javascript
export { default as MiNuevaPantalla } from './user/MiNuevaPantalla';
```

### 3. Crear sus estilos en la ubicación correspondiente
```
styles/screens/user/MiNuevaPantallaStyles.js
```

## Beneficios de esta estructura

1. **Separación por roles**: Cada tipo de usuario tiene sus pantallas organizadas
2. **Escalabilidad**: Fácil agregar nuevos roles (empresa, gerente, etc.)
3. **Paralelismo con styles**: Refleja exactamente la estructura de estilos
4. **Mantenibilidad**: Fácil encontrar y mantener pantallas específicas
5. **Colaboración**: Múltiples desarrolladores pueden trabajar sin conflictos
6. **Exportaciones centralizadas**: Un solo punto de importación para todas las pantallas
