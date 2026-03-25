# Generador de Paleta de Colores

Aplicación web que genera paletas de colores armónicas a partir de un color base, con soporte para múltiples tipos de armonía, historial persistente y funcionalidades de accesibilidad.

---

## Funcionalidades

- **Selección de formato**: HSL o HEX para visualizar los códigos de color.
- **Color base**: Elige un color con el selector nativo o genera uno aleatorio.
- **Tipos de paleta**:
  - **Complementario**: color base + color opuesto (hue +180°).
  - **Análogo**: tres colores adyacentes (hue ±30°).
  - **Triádico**: tres colores equidistantes (hue +120°, +240°).
  - **Monocromático**: mismo tono con variación de luminosidad (15% → 80%).
- **Tamaño de paleta**: 6, 8 o 9 colores.
- **Bloqueo de colores**: fija colores individuales para que no cambien al regenerar.
- **Copiar al portapapeles**: clic sobre cualquier swatch copia su código HEX.
- **Microfeedback (toast)**: notificación visible al copiar, bloquear o generar.
- **Historial**: guarda hasta 10 paletas anteriores en `localStorage`.
- **Responsive**: diseño adaptable a pantallas pequeñas (≤ 768 px).
- **Accesible**: etiquetas semánticas, foco visible, `aria-live`, `aria-label`.

---

## Estructura del proyecto

```
Generador de Paleta Colores-Projecto 1/
├── index.html        # Estructura semántica de la app
├── index.js          # Lógica de la aplicación (vanilla JS)
├── css/
│   └── estilos.css   # Estilos, layout Flexbox, animaciones, responsive
└── README.md
```

---

## Cómo ejecutar localmente

### Opción A — Abrir directamente

Hacé doble clic en `index.html` para abrirlo en el navegador.

> **Nota**: la API `navigator.clipboard` requiere contexto seguro (`https://` o `localhost`). Para garantizar que el copiado al portapapeles funcione correctamente, usá la Opción B.

### Opción B — Live Server (recomendado)

1. Instalá la extensión **Live Server** en VS Code.
2. Hacé clic derecho sobre `index.html` → **Open with Live Server**.
3. El navegador abrirá `http://127.0.0.1:5500/index.html`.

---

## Cómo desplegar en GitHub Pages

1. Subí el repositorio a GitHub.
2. En el repositorio, andá a **Settings → Pages**.
3. En _Source_, seleccioná la rama `main` y la carpeta `/ (root)`.
4. Guardá. GitHub Pages publicará la app en:
   ```
   https://<tu-usuario>.github.io/<nombre-del-repo>/
   ```

---

## Decisiones técnicas

| Decisión                              | Motivo                                                                                                                                  |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| **Vanilla JS** (sin frameworks)       | El proyecto no requiere estado reactivo complejo; JS puro mantiene la dependencia cero.                                                 |
| **CSS Flexbox**                       | Suficiente para el layout de dos columnas y el grid de swatches con `flex-wrap`.                                                        |
| **CSS custom properties (`--delay`)** | Permite controlar el stagger de animaciones desde JS sin duplicar lógica.                                                               |
| **`localStorage`**                    | Persistencia simple del historial, sin necesidad de backend.                                                                            |
| **`navigator.clipboard`**             | API moderna y asíncrona para copiar texto, con manejo de error si no está disponible.                                                   |
| **Armonía por HSL**                   | HSL permite manipular tono (H), saturación (S) y luminosidad (L) de forma intuitiva y matemáticamente predecible para generar armonías. |
| **Formato HEX como segunda opción**   | HEX es el estándar más reconocido en diseño, más corto que `rgb()` y compatible con todos los entornos.                                 |
| **`fieldset` + `legend` para radios** | Semántica correcta para agrupar controles relacionados; mejora la experiencia con lectores de pantalla.                                 |
| **`aria-live="polite"` en toast**     | Anuncia cambios al usuario sin interrumpir la navegación actual.                                                                        |

---

## Flujo de uso

1. Seleccioná el **formato** de visualización (HSL o HEX).
2. Elegí un **color base** con el picker o hacé clic en **Aleatorio**.
3. Seleccioná el **tipo de paleta** y la **cantidad de colores**.
4. Presioná **Generar paleta**.
5. Hacé clic en un swatch para **copiar su código HEX**.
6. Presioná 🔓 en cualquier swatch para **bloquearlo** antes de regenerar.
7. El **historial** de paletas anteriores queda disponible debajo.
