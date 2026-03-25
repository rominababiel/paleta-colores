// ============================================================
// CONVERSIÓN DE COLOR
// ============================================================

function hexToRgb(hex) {
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  };
}

function rgbToHsl(r, g, b) {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;

  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;

  if (max === min) {
    return { h: 0, s: 0, l: Math.round(l * 100) };
  }

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

  let h;
  if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
  else if (max === gn) h = ((bn - rn) / d + 2) / 6;
  else h = ((rn - gn) / d + 4) / 6;

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hslToRgb(h, s, l) {
  const sn = s / 100;
  const ln = l / 100;
  const k = (n) => (n + h / 30) % 12;
  const a = sn * Math.min(ln, 1 - ln);
  const channel = (n) => ln - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

  return {
    r: Math.round(channel(0) * 255),
    g: Math.round(channel(8) * 255),
    b: Math.round(channel(4) * 255),
  };
}

function hslToHex(h, s, l) {
  const { r, g, b } = hslToRgb(h, s, l);
  return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
}

function colorAleatorio() {
  const h = Math.floor(Math.random() * 360);
  const s = Math.floor(Math.random() * 40) + 40; // 40–80%
  const l = Math.floor(Math.random() * 30) + 35; // 35–65%
  return hslToHex(h, s, l);
}

// ============================================================
// GENERACIÓN DE PALETA
// ============================================================

const ARMONIAS = {
  complementario: (h) => [h, (h + 180) % 360],
  analogo:        (h) => [(h - 30 + 360) % 360, h, (h + 30) % 360],
  triadico:       (h) => [h, (h + 120) % 360, (h + 240) % 360],
  monocromatico:  (h) => [h],
};

function getHarmonyHues(baseH, tipo) {
  const fn = ARMONIAS[tipo] || ARMONIAS.monocromatico;
  return fn(baseH);
}

function buildColorList(hues, baseS, baseL, tipo, count) {
  const colors = [];

  for (let i = 0; i < count; i++) {
    const hue = hues[i % hues.length];
    let lightness;

    if (tipo === "monocromatico") {
      lightness = Math.round(15 + (i / Math.max(count - 1, 1)) * 65);
    } else {
      const step = Math.floor(i / hues.length);
      const totalSteps = Math.ceil(count / hues.length);
      const offset = step / Math.max(totalSteps - 1, 1);
      lightness = Math.round(baseL - 15 + offset * 30);
      lightness = Math.max(15, Math.min(85, lightness));
    }

    colors.push({ h: hue, s: baseS, l: lightness });
  }

  return colors;
}

function generatePalette(baseH, baseS, baseL, tipo, count) {
  const hues = getHarmonyHues(baseH, tipo);
  return buildColorList(hues, baseS, baseL, tipo, count);
}

// ============================================================
// FORMATO DE DISPLAY
// ============================================================

function formatColor(hslColor, formato) {
  const { h, s, l } = hslColor;
  if (formato === "hsl") return `hsl(${h}, ${s}%, ${l}%)`;
  return hslToHex(h, s, l);
}

// ============================================================
// BLOQUEO DE COLORES
// ============================================================

let lockedColors = [];

function toggleLock(index, color) {
  lockedColors[index] = lockedColors[index] ? null : color;
}

function applyLocks(newColors) {
  return newColors.map((color, i) => lockedColors[i] || color);
}

// ============================================================
// PORTAPAPELES Y TOAST
// ============================================================

let toastTimer = null;

function mostrarToast(mensaje) {
  const toast = document.getElementById("toast");
  toast.textContent = mensaje;
  toast.classList.add("visible");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 2000);
}

async function copiarAlPortapapeles(hex) {
  try {
    await navigator.clipboard.writeText(hex);
    mostrarToast(`Copiado ${hex}`);
  } catch {
    mostrarToast("No se pudo copiar");
  }
}

// ============================================================
// SWATCH DOM
// ============================================================

function crearSwatch(hslColor, formato, index) {
  const hex = hslToHex(hslColor.h, hslColor.s, hslColor.l);
  const label = formatColor(hslColor, formato);
  const bloqueado = Boolean(lockedColors[index]);

  const el = document.createElement("div");
  el.className = "elemento" + (bloqueado ? " bloqueado" : "");
  el.style.backgroundColor = hex;
  el.style.setProperty("--delay", `${index * 50}ms`);
  el.setAttribute("role", "button");
  el.setAttribute("tabindex", "0");
  el.setAttribute("aria-label", `Copiar ${hex}`);

  el.innerHTML = `
    <span class="color-label">${label}</span>
    <button
      type="button"
      class="lock-btn"
      aria-label="${bloqueado ? "Desbloquear color" : "Bloquear color"}"
      aria-pressed="${bloqueado}"
    >${bloqueado ? "🔒" : "🔓"}</button>
  `;

  // Copiar HEX al hacer click en el swatch (no en el botón lock)
  el.addEventListener("click", (e) => {
    if (e.target.closest(".lock-btn")) return;
    copiarAlPortapapeles(hex);
  });

  el.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      copiarAlPortapapeles(hex);
    }
  });

  // Botón lock
  el.querySelector(".lock-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    toggleLock(index, hslColor);
    const btn = e.currentTarget;
    const ahora = Boolean(lockedColors[index]);
    btn.textContent = ahora ? "🔒" : "🔓";
    btn.setAttribute("aria-pressed", ahora);
    btn.setAttribute("aria-label", ahora ? "Desbloquear color" : "Bloquear color");
    el.classList.toggle("bloqueado", ahora);
    mostrarToast(ahora ? "Color bloqueado" : "Color desbloqueado");
  });

  return el;
}

// ============================================================
// LOCALSTORAGE
// ============================================================

function guardarPaleta(data) {
  const historial = JSON.parse(localStorage.getItem("paletaHistorial") || "[]");
  historial.unshift(data);
  if (historial.length > 10) historial.pop();
  localStorage.setItem("paletaHistorial", JSON.stringify(historial));
}

function cargarHistorial() {
  return JSON.parse(localStorage.getItem("paletaHistorial") || "[]");
}

// ============================================================
// RENDER
// ============================================================

function renderPaleta(colores, formato) {
  const contenedor = document.getElementById("paleta");
  contenedor.innerHTML = "";
  colores.forEach((color, i) => {
    contenedor.appendChild(crearSwatch(color, formato, i));
  });
}

function crearItemHistorial(item) {
  const swatches = item.colores
    .map((c) => `<div class="historial-color" style="background-color:${c.hex}" title="${c.label}"></div>`)
    .join("");

  const div = document.createElement("div");
  div.className = "historial-item";
  div.innerHTML = `
    <div class="historial-meta">
      <span class="historial-fecha">${item.fecha}</span>
      <span class="historial-tipo">${item.tipo} · ${item.formato.toUpperCase()}</span>
    </div>
    <div class="historial-colores">${swatches}</div>
  `;
  return div;
}

function renderHistorial() {
  const lista = document.getElementById("historial-lista");
  const historial = cargarHistorial();

  if (historial.length === 0) {
    lista.innerHTML = '<p class="sin-historial">No hay paletas guardadas aún.</p>';
    return;
  }

  lista.innerHTML = "";
  historial.forEach((item) => lista.appendChild(crearItemHistorial(item)));
}

// ============================================================
// LEER CONFIGURACIÓN DEL FORMULARIO
// ============================================================

function leerConfiguracion() {
  return {
    formato:  document.querySelector('input[name="formato"]:checked')?.value || "hsl",
    hex:      document.getElementById("selector-color").value,
    tipo:     document.getElementById("tipo-paleta").value,
    cantidad: parseInt(document.getElementById("cantidad").value),
  };
}

// ============================================================
// MAIN — EVENTOS
// ============================================================

function onGenerar() {
  const { formato, hex, tipo, cantidad } = leerConfiguracion();

  const { r, g, b } = hexToRgb(hex);
  const { h, s, l } = rgbToHsl(r, g, b);

  const coloresBrutos = generatePalette(h, s, l, tipo, cantidad);
  const colores = applyLocks(coloresBrutos);

  // Resetear locks que queden fuera del nuevo tamaño
  lockedColors = lockedColors.slice(0, cantidad);

  renderPaleta(colores, formato);

  const tipoLabel = document.getElementById("tipo-paleta").selectedOptions[0].text;
  guardarPaleta({
    fecha:   new Date().toLocaleString("es-AR"),
    tipo:    tipoLabel,
    formato,
    colores: colores.map((c) => ({
      hex:   hslToHex(c.h, c.s, c.l),
      label: formatColor(c, formato),
    })),
  });

  renderHistorial();
  mostrarToast("Paleta generada");
}

function onAleatorio() {
  const input = document.getElementById("selector-color");
  input.value = colorAleatorio();
}

document.getElementById("btn-generar").addEventListener("click", onGenerar);
document.getElementById("btn-aleatorio").addEventListener("click", onAleatorio);

// ============================================================
// INIT
// ============================================================
renderHistorial();
