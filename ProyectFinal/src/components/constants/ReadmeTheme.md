# 🎨 Guía de Estilo y Nomenclatura – `theme.js`

Este documento define las convenciones de nomenclatura, estructura y buenas prácticas para el archivo `theme.js` y el uso de constantes en general en el proyecto. Su objetivo es garantizar consistencia, legibilidad y mantenibilidad del código.

---

## 🔤 Convenciones de Nomenclatura

### 1. **Terminaciones y abreviaturas**

| Abreviatura | Significado | Ejemplo |
|------------|------------|--------|
| `BP` | Button Primary | `backgroundBP` → color del botón principal |
| `BS` | Button Secondary | `backgroundBS` → color del botón secundario |
| `Back` | Background | `backgroundBack` → fondo general |
| `PT` | Primary Theme | `colorPT` → abreviatura de `colorPrimaryTheme` |

> ✅ **Regla**:  
> - Para nombres largos: usa las primeras letras en mayúscula:  
>   `colorPrimaryTheme` → `colorPT`  
> - Para nombres cortos: usa camelCase:  
>   `textRed` → correcto ✅, `textred` → incorrecto ❌

---

### 2. **Uso de colores**

- ✅ **Formatos permitidos**:
  - Hexadecimal: `#178C72`
  - RGBA: `rgba(23, 140, 114, 0.8)`
- ❌ **No usar**:
  - Nombres de colores (`"red"`, `"blue"`)
  - RGB sin alfa si se necesita transparencia
  - HSL/HSV (a menos que sea necesario)

> 💡 **Recomendación**: Usa hexadecimales para colores sólidos y RGBA cuando necesites transparencia (ej: bordes, overlays).

---

### 3. **Tipografía (Fuentes)**

Se definen **4 tamaños estándar** para texto:

| Clave | Tamaño (px) | Uso recomendado |
|------|-------------|------------------|
| `small` | 14 | Ayuda, subtítulos, etiquetas |
| `regular` | 16 | Texto base, cuerpo |
| `large` | 18 | Subtítulos, encabezados secundarios |
| `big` | 28 | Títulos principales, cabeceras |

> ✅ Ejemplo:  
> ```js
> fontSize: FONTS.regular
> ```

---

### 4. **Radios (Border Radius)**

Se usan **3 niveles** de redondeo:

| Clave | Valor (px) | Uso recomendado |
|------|------------|------------------|
| `sm` | 10 | Botones, inputs pequeños |
| `md` | 12 | Tarjetas, contenedores medianos |
| `lg` | 15 | Tarjetas destacadas, banners |

> ✅ Ejemplo:  
> ```js
> borderRadius: RADIUS.md
> ```

---

### 5. **Sombras (Shadows)**

Se definen **3 niveles** de sombra para diferentes estados de elevación:

| Nivel | Uso recomendado |
|------|------------------|
| `light` | Elementos con poca elevación (inputs, cards base) |
| `medium` | Botones elevados, cards con contenido |
| `dark` | Elementos destacados (modales, botones principales) |

> ✅ Incluye `elevation` para Android y `shadow*` para iOS.

---

## 🛠️ Buenas Prácticas

### ✅ Agregar nuevas variables
- Si necesitas agregar una nueva constante:
  1. Usa el formato correcto de nomenclatura.
  2. Agrupa por categoría (`COLORS`, `FONTS`, etc.).
  3. **Comunica el cambio en el PR (Pull Request)**.

### ✅ Mantenibilidad
- No uses valores "mágicos" en componentes. Siempre usa las constantes del tema.
- Evita duplicar colores o tamaños en varios archivos.

### ✅ Escalabilidad
- Si el proyecto crece, considera migrar a un sistema de diseño más robusto (ej: `styled-components` theming, `ThemeProvider`).

---

## 📣 ¿Cómo contribuir?

### 1. **Agregar nuevas variables**
- Sigue las reglas de nomenclatura.
- Usa nombres descriptivos y consistentes.
- Documenta si es necesario.

### 2. **Modificar reglas de nomenclatura**
- Si propones una nueva regla o mejora:
  - Abre una discusión con el equipo.
  - Actualiza este documento si se aprueba.

### 3. **Ejemplo de contribución válida**
```js
// ✅ Correcto
export const COLORS = {
  primary: '#178C72',
  secondary: '#CDE6DC',
  background: '#F4F8F6',
  backgroundBP: '#178C72', // Botón principal
  backgroundBS: '#CDE6DC', // Botón secundario
  textWhite: '#FFFFFF',
  error: '#D0342C',
};