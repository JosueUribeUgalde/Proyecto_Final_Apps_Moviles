# 🔔 Configuración de Notificaciones Push

## ✅ Lo que ya está configurado:

1. **Instalación de paquetes**: ✅ 
   - expo-notifications
   - expo-device
   - expo-constants

2. **Servicios creados**: ✅
   - `pushNotificationService.js` - Manejo de notificaciones push
   - `notificationService.js` - Actualizado para enviar push notifications

3. **Integración en App.js**: ✅
   - Listeners configurados para recibir notificaciones
   - Manejo de cuando el usuario toca una notificación

4. **Integración en Home.js**: ✅
   - Registro automático del dispositivo al iniciar sesión
   - Badge con contador de notificaciones no leídas

## 📝 Configuración pendiente:

### 1. Obtener tu Project ID de Expo

Ejecuta en la terminal:

```bash
npx expo whoami
```

Si no tienes cuenta de Expo:
```bash
npx expo login
```

Luego ejecuta:
```bash
npx expo start
```

En la terminal verás tu **Project ID** o puedes encontrarlo en `app.json` bajo la propiedad `extra.eas.projectId`.

### 2. Actualizar el Project ID

Edita el archivo: `src/services/pushNotificationService.js`

**Línea 41**, reemplaza:
```javascript
projectId: 'your-project-id', // Cambiar por tu projectId de Expo
```

Por:
```javascript
projectId: 'tu-project-id-aqui',
```

### 3. Actualizar app.json (si es necesario)

Agrega en `app.json`:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-notifications",
        {
          "icon": "./assets/icon.png",
          "color": "#ffffff",
          "sounds": []
        }
      ]
    ],
    "notification": {
      "icon": "./assets/icon.png",
      "color": "#ffffff",
      "androidMode": "default",
      "androidCollapsedTitle": "{{unread_count}} nuevas notificaciones"
    }
  }
}
```

### 4. Permisos de Android (AndroidManifest.xml)

Si usas Expo Bare Workflow, agrega:
```xml
<uses-permission android:name="android.permission.VIBRATE" />
<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
```

## 🧪 Probar las notificaciones:

### En desarrollo:

1. **En dispositivo físico** (recomendado):
   ```bash
   npm run test
   ```
   - Escanea el QR con Expo Go
   - Las notificaciones funcionarán completamente

2. **En emulador**:
   - Las notificaciones locales funcionan
   - Las push notifications NO funcionan en emulador

### Probar flujo completo:

1. **Login como usuario** → Se registra automáticamente para notificaciones
2. **Admin aprueba/rechaza petición** → Usuario recibe notificación push
3. **Admin solicita sustitución** → Usuario recibe notificación push con botones
4. **Usuario toca la notificación** → La app se abre

## 🎯 Características implementadas:

### ✅ Notificaciones locales
- Se muestran cuando la app está en **primer plano**
- Se muestran cuando la app está en **segundo plano**
- Se muestran cuando la app está **cerrada**

### ✅ Badge (contador)
- Muestra número de notificaciones no leídas
- Se actualiza automáticamente
- Se limpia al abrir NotificationsModal

### ✅ Sonido y vibración
- Sonido predeterminado del sistema
- Vibración en Android
- Configurable por tipo de notificación

### ✅ Tipos de notificaciones
1. **Petición Aprobada** - Verde ✓
2. **Petición Rechazada** - Rojo ✗
3. **Solicitud de Sustitución** - Azul con botones de acción
4. **Sustitución Aceptada** - Verde ✓✓
5. **Sustitución Rechazada** - Rojo ✗

## 📱 Funciones disponibles:

### En `pushNotificationService.js`:

```javascript
// Registrar dispositivo para notificaciones
registerForPushNotifications(userId)

// Enviar notificación local inmediata
sendLocalNotification(title, body, data)

// Programar notificación para el futuro
scheduleLocalNotification(title, body, seconds, data)

// Actualizar badge
setBadgeCount(count)

// Limpiar todas las notificaciones
clearAllNotifications()
```

## 🚀 Próximos pasos (opcional):

### Para notificaciones push desde servidor:

1. **Instalar Expo Push Notification Tool**:
   ```bash
   npm install expo-server-sdk
   ```

2. **Crear función Cloud (Firebase Functions)**:
   - Detectar cuando se crea una notificación en Firestore
   - Enviar push notification al token del usuario
   - Usar Expo Push Notification API

3. **Ejemplo de función**:
   ```javascript
   const { Expo } = require('expo-server-sdk');
   
   exports.sendPushNotification = functions.firestore
     .document('notifications/{notificationId}')
     .onCreate(async (snap, context) => {
       const notification = snap.data();
       const expo = new Expo();
       
       // Obtener token del usuario
       const userDoc = await admin.firestore()
         .collection('users')
         .doc(notification.userId)
         .get();
       
       const pushToken = userDoc.data().pushToken;
       
       // Enviar notificación
       await expo.sendPushNotificationsAsync([{
         to: pushToken,
         title: notification.title,
         body: notification.message,
         data: notification
       }]);
     });
   ```

## 📚 Documentación útil:

- [Expo Notifications Docs](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [Expo Push Notifications](https://docs.expo.dev/push-notifications/overview/)
- [Firebase Cloud Functions](https://firebase.google.com/docs/functions)

## ⚠️ Importante:

- Las notificaciones push **solo funcionan en dispositivos físicos**
- Necesitas una cuenta de Expo (gratuita)
- Para producción, considera usar EAS Build
- Prueba en iOS y Android por separado (permisos diferentes)

## 🐛 Troubleshooting:

### "No se otorgaron permisos para notificaciones"
→ Ve a Configuración del dispositivo > Apps > Tu App > Permisos > Habilitar notificaciones

### "Las notificaciones no suenan"
→ Verifica que el dispositivo no esté en modo silencio
→ Revisa la configuración de canales en Android

### "El badge no se actualiza"
→ iOS: Requiere permiso específico de badge
→ Android: Depende del launcher

## ✨ Estado actual:

- [x] Instalación de paquetes
- [x] Servicio de push notifications creado
- [x] Integración en App.js
- [x] Integración en Home.js
- [x] Notificaciones locales funcionando
- [x] Badge con contador
- [ ] Agregar Project ID de Expo
- [ ] Probar en dispositivo físico
- [ ] (Opcional) Cloud Functions para push desde servidor
