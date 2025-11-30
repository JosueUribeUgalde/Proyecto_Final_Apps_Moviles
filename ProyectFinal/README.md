# Proyecto Final Apps Móviles

Aplicación móvil (React Native + Expo) para la gestión integral de grupos de trabajo/turnos con roles diferenciados (Usuario, Administrador y Empresa), manejo de ausencias, sustituciones, métricas operativas y notificaciones. Incluye integración con Firebase (Auth + Firestore) y un servicio de IA (Gemini) para sugerencias inteligentes de reemplazo.

## Tabla de Contenido
- Visión General
- Tecnologías Clave
- Arquitectura y Carpetas
- Roles y Flujos Principales
- Servicios (Capas de Dominio)
- Componentes Destacados
- Estilos y Convenciones
- Instalación y Ejecución
- Scripts Disponibles
- Configuración Firebase
- Convenciones de Código / Documentación
- Roadmap (Mejoras Futuras)

## Visión General
La app resuelve la coordinación de personal en grupos: los usuarios solicitan ausencias, los administradores gestionan aprobaciones y sustituciones, las empresas visualizan métricas agregadas y planes. Se registran historiales para auditoría y se generan métricas (cobertura, tiempos de respuesta, reasignaciones) que permiten optimizar la operación.

## Tecnologías Clave
- React Native / Expo (UI y empaquetado multiplataforma).
- Firebase Authentication (registro / login / roles).
- Firestore (persistencia: usuarios, grupos, peticiones, historial, notificaciones).
- Expo Notifications (push locales y programadas).
- Gemini (@google/generative-ai) para sugerencias de sustitución.
- React Navigation (flujo multi-rol).
- Librerías UI y soporte: `@expo/vector-icons`, `react-native-calendars`, `react-native-chart-kit`.

## Arquitectura y Carpetas
```
src/
	components/        # Componentes reutilizables UI
	screens/           # Pantallas organizadas por rol (admin/company/user/general)
	services/          # Lógica de dominio y acceso a Firebase / IA / notificaciones
	styles/            # Estilos modularizados por pantalla y componente
	config/            # Configuración Firebase y futuros providers
	templates/         # Plantillas para nuevas pantallas/estilos
documentation/       # Documentación por componente (migración a .md en progreso)
```
Separación clara entre capa de presentación (components/screens) y capa de lógica (services). El historial se maneja en colección dedicada para trazabilidad.

## Roles y Flujos Principales
- Usuario: solicita ausencias, visualiza calendario, historial personal, recibe notificaciones de estado.
- Administrador: aprueba/rechaza peticiones, inicia solicitudes de sustitución, revisa métricas de su grupo, gestiona miembros.
- Empresa: visualiza dashboards agregados, planes y estados financieros (extensiones futuras).

Flujos clave:
1. Autenticación (login / registro / restablecer contraseña).
2. Peticiones de ausencia → Estado Pendiente → Aprobada/Rechazada (migración a `historial`).
3. Sustituciones: admin solicita usuario reemplazo → usuario acepta / rechaza → métricas actualizadas.
4. Notificaciones: creación y envío (aprobación, rechazo, sustitución, nueva petición).
5. Métricas: cálculo periódico (coverageRate, avgResponseTime, reassignments).
6. IA: sugerencia de mejor reemplazo a partir de disponibilidad y criterios.

## Servicios (Dominio)
- `authService.js`: Login, registro, roles y listeners de sesión.
- `userService.js`: Datos y actualizaciones de perfil de usuario.
- `companyService.js`: Operaciones específicas de la empresa (planes, miembros empresa).
- `groupService.js`: Gestión de grupos, miembros y métricas agregadas.
- `peticionService.js`: Crear/aprobar/rechazar peticiones, mover a historial, calcular estado.
- `notificationService.js`: Crear y enviar notificaciones; flujo sustituciones.
- `pushNotificationService.js`: Abstracción sobre Expo Notifications (programación/envío local).
- `aiService.js`: Prompt y parsing robusto de respuesta Gemini para sugerencias de reemplazo.

Cada servicio busca: validaciones mínimas, errores lanzados con mensajes claros, sin logs ruidosos (solo throws y comentarios).

## Componentes Destacados
- `Banner`: Mensajes temporales (éxito / error) con dismiss automático.
- `ButtonLogin` / `ButtonRequest`: Botones configurables con iconos y estados.
- `HeaderScreen`: Cabecera consistente con acciones izquierda/derecha.
- `MenuFooter*`: Menús de navegación por rol (user/admin/company).
- `NotificationsModal`: Listado interactivo de notificaciones pendientes.
- `ReplacementModal`: Flujo de sustitución (aceptar/rechazar).
- `InfoModal` / `RazonOption` / `InputLogin`: Elementos auxiliares de interacción y formularios.

## Estilos y Convenciones
Estilos organizados por pantalla y por componente: facilita mantenimiento y evita archivos monolíticos.
Convenciones:
- Nombre del archivo: `<NombrePantalla>Styles.js` o `<Componente>Styles.js`.
- Uso de constantes centralizadas en `constants/theme.js` (paleta, tamaños, tipografía).
- Comentarios seccionados (LAYOUT, COLORES, TEXTO, ESTADOS) donde aplica.

## Instalación y Ejecución
Requisitos: Node.js LTS, npm o yarn, cuenta Firebase y Expo CLI (opcional interactivo).

```bash
git clone <repo_url>
cd Proyecto_Final_Apps_Moviles/ProyectFinal
npm install
npx expo start   # Inicia menú interactivo (QR, plataformas)
```

Ejecución directa según plataforma:
```bash
npm run android
npm run ios
npm run web
```

## Scripts Disponibles
- `start`: Inicia servidor Expo.
- `android` / `ios` / `web`: Arranque específico.
- `test`: Arranca Expo limpiando caché (`-c`).

## Configuración Firebase
Editar `src/config/firebaseConfig.js` con credenciales del proyecto:
```js
// Ejemplo mínimo (NO credenciales reales)
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
	apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
	authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```
Variables pueden ubicarse en `app.json` / `.env` usando `react-native-dotenv`.

## Convenciones de Código / Documentación
- Comentarios en español claros y enfocados en propósito y flujo.
- Evitar `console.log` en producción; preferir comments y manejo de errores.
- Reutilizar plantillas en `templates/` al crear nuevas pantallas o estilos.
- Una sola responsabilidad por función en servicios (mínimo acoplamiento).
- Validar parámetros obligatorios al inicio y lanzar `Error` descriptivo.

## Roadmap (Mejoras Futuras)
- Migrar todos los `.txt` de `documentation/` a `.md` con plantilla unificada.
- Diagramas de arquitectura (flujo peticiones → historial → métricas).
- Índices Firestore compuestos para optimizar consultas (fecha + estado).
- Test unitarios (servicios puros) y test de integración (mock Firebase).
- Optimización de escrituras: batch y transacciones para acciones encadenadas.
- Manejo offline y sincronización diferida.
- Segmentación avanzada de notificaciones (prioridad, silenciosas, agrupadas).
- IA avanzada: ranking multi-factor de sustitutos (experiencia, frecuencia previa, carga actual).

## Créditos / Licencia
Proyecto académico / interno. Ajustar sección de licencia si se publica.

---
Si necesitas extender documentación detallada por componente o servicio, consulta la carpeta `documentation/` o solicita la generación de fichas específicas.
