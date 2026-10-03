# MISIÓN EVACUACIÓN 8-BIT: CADA DECISIÓN CUENTA

Videojuego web educativo con estética retro de 8 bits para capacitar a colaboradores adultos en **Seguridad y Salud en el Trabajo (SG-SST)**: evacuación, identificación de peligros y actuación frente a incendios y sismos.

> **Aviso educativo.** Este videojuego es una herramienta educativa de apoyo. Las decisiones, rutas, puntos de encuentro y procedimientos deben ser revisados y adaptados al plan de prevención, preparación y respuesta ante emergencias vigente en cada organización. No reemplaza el plan de emergencias de la organización, los simulacros presenciales, la capacitación institucional, las instrucciones de los brigadistas, los procedimientos internos ni las recomendaciones de las autoridades competentes.

---

## Descripción

La persona jugadora recorre un mapa pixelado de una sede administrativa (oficina, aula, corredores, escaleras, ascensor, depósito y zona exterior). Durante una jornada aparentemente normal se activa una emergencia y debe tomar decisiones seguras, identificar peligros, orientar a otras personas y llegar al punto de encuentro. **Lo importante es la calidad de las decisiones, no la velocidad.**

### Objetivo educativo

Reforzar y evaluar estos temas: reconocimiento de alarmas, identificación del tipo de emergencia, peligros y condiciones inseguras, rutas de evacuación y rutas alternas, conducta segura durante un incendio y antes, durante y después de un sismo, uso de salidas y escaleras, comportamiento en el punto de encuentro, no regresar por objetos personales, orientación de visitantes, apoyo seguro a otras personas, reporte de novedades y seguimiento de las instrucciones de la brigada.

### Qué se ve en el juego

- **Pantallas:** carga, bienvenida, aviso educativo, menú principal, selección de modo y de escenario, instrucciones, entrenamiento, simulación, pausa, retroalimentación, informe final, historial, configuración, información, créditos y confirmaciones.
- **Modo entrenamiento:** 28 situaciones en el banco de preguntas (12 por sesión, en orden aleatorio y con las opciones mezcladas). Después de cada respuesta se muestran la respuesta recomendada, la explicación, el riesgo que se evita, la categoría y los puntos. Permite «Intentar nuevamente». No tiene límite de tiempo.
- **Modo simulación:** mapa por casillas dibujado con Canvas. El personaje se mueve casilla por casilla (no depende de reflejos), interactúa con personas y objetos, y responde decisiones contextuales.
  - **CÓDIGO ROJO: RUTA SEGURA (incendio):** alarma, humo en el corredor habitual, ruta principal bloqueada, ruta alterna por la escalera de emergencia, ascensor, puerta que no es salida, persona visitante desorientada, alguien que quiere regresar por su teléfono, brigadista, reporte de novedades y punto de encuentro.
  - **ALERTA SÍSMICA: ANTES, DURANTE Y DESPUÉS (sismo):** inspección preventiva (objetos pesados en altura, estanterías sin anclaje, salidas obstruidas, señalización ausente, objetos que pueden caer, plano de evacuación), decisiones durante el movimiento (con vibración moderada que se puede desactivar) y evacuación posterior evitando los elementos caídos.
- **Eventos aleatorios:** cambian el paso habilitado, la extensión del humo, la ruta bloqueada en el sismo, la posición de la persona visitante, la ubicación y selección de los peligros, el orden de las preguntas y de las opciones. Antes de cada partida, el juego verifica con un algoritmo de búsqueda de rutas que siempre exista un camino válido hasta el punto de encuentro.
- **Informe final:** puntuación, nivel, tiempo, decisiones seguras, aspectos por reforzar, peligros identificados y no identificados, ruta utilizada, personas orientadas, objetivos, intentos de regresar al edificio y una recomendación personalizada. Permite revisar las respuestas, imprimir o guardar como PDF, y descargar un resumen en `.txt`.

### Sistema de puntuación (100 puntos)

| Componente | Puntos |
|---|---|
| Decisiones seguras (primer intento) | 40 |
| Identificación de peligros | 25 |
| Cumplimiento de la ruta y del procedimiento | 20 |
| Orientación o apoyo a otras personas | 10 |
| Tiempo de respuesta | 5 |

Niveles: **0–49** Aprendiz preventivo · **50–69** Observador de riesgos · **70–84** Guardián de la seguridad · **85–94** Líder de evacuación · **95–100** Brigadista retro.

> Los niveles obtenidos en este videojuego son reconocimientos educativos y no constituyen una certificación oficial en Seguridad y Salud en el Trabajo ni acreditan al participante como brigadista.

No hay vidas ni representaciones de lesiones: hay **tres oportunidades de corrección**, una **barra de nivel de riesgo** y, si se agotan las oportunidades, un **reinicio desde el último punto seguro**. Atravesar humo leve o elementos caídos, intentar pasar por humo denso o regresar al edificio resta puntos de procedimiento y aumenta el riesgo.

---

## Tecnologías utilizadas

- HTML5 semántico
- CSS3 (variables, media queries, `prefers-reduced-motion`, estilos de impresión)
- JavaScript puro (sin frameworks ni dependencias)
- Canvas 2D (mapa, personajes y efectos dibujados por código)
- Web Audio API (efectos de sonido generados; no se usan archivos de audio)
- `localStorage` (solo para datos locales no sensibles)

No requiere Node.js, npm, servidores, bases de datos, compilación ni conexión a internet.

## Archivos

Todos los archivos están en el mismo directorio raíz, sin subcarpetas:

```
index.html   → estructura, pantallas y ventanas
styles.css   → sistema visual retro, temas, responsive e impresión
script.js    → configuración, contenidos, motor del juego, puntuación e informe
README.md    → este documento
```

## Ejecutar localmente

1. Descomprime el archivo ZIP.
2. Abre `index.html` con doble clic en Chrome, Edge, Firefox o Safari.

Eso es todo: no se necesita instalar nada ni iniciar un servidor.

## Publicar en GitHub Pages

1. Crea un repositorio nuevo en GitHub (por ejemplo, con el nombre que prefieras para el juego).
2. Sube **todos los archivos al directorio principal** del repositorio (botón *Add file → Upload files*). No los subas dentro de una carpeta.
3. Verifica que `index.html` aparezca en la raíz del repositorio.
4. Abre la configuración del repositorio: pestaña **Settings**.
5. Entra a la sección **Pages** (menú lateral).
6. En *Build and deployment → Source*, elige **Deploy from a branch** y selecciona la rama correspondiente (normalmente `main`).
7. Elige la carpeta raíz: **/ (root)**.
8. Pulsa **Save** para guardar la configuración.
9. Espera uno o dos minutos y abre la dirección publicada que GitHub muestra en esa misma sección.

Todas las rutas entre archivos son relativas, por lo que el juego funciona igual de forma local y en GitHub Pages.

---

## Personalizar para tu organización

### Ubicación del objeto CONFIG

Al comienzo de `script.js` se encuentra el objeto **`CONFIG`**, con comentarios en cada campo:

```js
const CONFIG = {
  organizationName: 'Mi organización',
  logoText: 'MO',
  logoImage: '',
  gameTitle: 'Misión Evacuación 8-Bit',
  meetingPoint: 'Punto de encuentro principal',
  emergencyContact: 'Canal interno definido por la organización',
  alarmTypes: { fire: '...', quake: '...' },
  quakeProtectiveAction: '...',
  enableFireScenario: true,
  enableEarthquakeScenario: true,
  soundEnabled: true,
  reducedMotionDefault: false,
  ...
};
```

- **Nombre de la organización:** `organizationName`.
- **Logo o identificador institucional:** `logoText` (iniciales) o `logoImage` con la ruta relativa de una imagen ubicada en la misma carpeta, por ejemplo `'logo.png'`.
- **Punto de encuentro:** cambia `meetingPoint`. El nuevo nombre aparece en las preguntas, la información y el informe.
- **Mensajes institucionales y contacto interno:** `institutionalMessage` y `emergencyContact`. Usa textos aprobados por tu organización; **no incluyas números de emergencia inventados**.
- **Tipos de alarma:** `alarmTypes.fire` y `alarmTypes.quake`.
- **Acción de protección ante sismos:** `quakeProtectiveAction`, según tu protocolo.
- **Activar o desactivar escenarios:** `enableFireScenario` y `enableEarthquakeScenario` en `true` o `false`.
- **Preferencias iniciales:** `soundEnabled`, `reducedMotionDefault`, `defaultTheme` y `trainingQuestionsPerSession`.
- **Nombres de rutas:** objeto `ROUTE_NAMES` (sección 2 de `script.js`).

### Cómo modificar las preguntas

Las situaciones están en el objeto **`DECISIONS`** (sección 3 de `script.js`). Cada una tiene esta estructura:

```js
fire_alarm: {
  scenario: 'fire',            // 'fire', 'quake' o 'general'
  category: 'decision',        // 'decision' (40 pts) o 'apoyo' (10 pts)
  theme: THEMES.alarm,         // categoría temática
  title: 'Se activa la alarma',
  context: 'Contexto breve…',
  question: '¿Cuál es tu primera acción?',
  options: [
    { text: 'Opción segura…', safe: true, feedback: 'Por qué es correcta…' },
    { text: 'Opción por reforzar…', safe: false, feedback: 'Por qué no…', reentry: true }
  ],
  explanation: 'Explicación pedagógica…',
  riskAvoided: 'Riesgo que se evita…'
}
```

Cada situación debe tener entre 3 y 4 opciones y exactamente una con `safe: true`. Las preguntas con `scenario: 'general'` solo aparecen en el modo entrenamiento. Las recomendaciones personalizadas del informe están en `RECOMMENDATIONS`.

### Cómo modificar los escenarios

- **Peligros:** `HAZARD_POOLS` (sección 4), con texto, acción sugerida y posiciones alternativas aleatorias.
- **Mapa:** el arreglo `MAP` (24 × 16 casillas) incluye una leyenda de símbolos. Si cambias el mapa, revisa también las posiciones de las personas, los cierres de paso y las zonas de los disparadores en `setupFire`, `setupQuake` y `setupQuakeAfter`.
- **Decisiones por escenario y objetivos:** objeto `SCENARIOS`.
- **Personajes:** `NPC_INFO` (rol y diálogo) y `LOOKS` (colores de los sprites).

### Cómo cambiar los colores

- Interfaz: variables CSS al inicio de `styles.css` (`:root` para el tema oscuro y `[data-theme="light"]` para el claro).
- Colores principales sin editar CSS: `CONFIG.themeColors` (`accent`, `safe`, `danger`).
- Mapa: objeto `MAP_COLORS` en `script.js`.

---

## Controles

| Acción | Teclado | Pantalla táctil |
|---|---|---|
| Moverse | Flechas o W, A, S, D | Botones direccionales |
| Interactuar / inspeccionar | E, Espacio o Enter | Botón «Interactuar» |
| Elegir una opción | Teclas 1 a 4, o Tab + Enter | Tocar la opción |
| Pausa | P o Esc | Botón «Pausa» |
| Cerrar ventanas | Esc | Botón de cierre |

## Accesibilidad

- HTML semántico, `lang="es"`, etiquetas visibles y textos alternativos.
- Control completo con teclado, foco visible y foco atrapado en las ventanas modales (que se cierran con Esc).
- Regiones `aria-live` para avisos importantes; todos los sonidos tienen una alternativa visual.
- Botones grandes, alto contraste, tema claro u oscuro y opción de texto grande para proyección.
- Botón para reducir el movimiento: desactiva la vibración del sismo, el humo animado y las transiciones. También respeta la preferencia del sistema operativo.
- Sin límite de tiempo en el entrenamiento, sin destellos ni parpadeos, e instrucciones que no dependen solo del color (símbolos ✔, ✖, ⚠ y textos).
- Diseño responsive para escritorio, portátil, tableta y teléfono, en orientación vertical u horizontal.

## Almacenamiento local

`localStorage` guarda únicamente, en el navegador del dispositivo: la mejor puntuación, las últimas 15 partidas, los escenarios completados, las preferencias (sonido, movimiento, tema, tamaño de texto) y un alias opcional. **No** se guardan documentos de identidad, correos, teléfonos, información médica ni otros datos sensibles; el alias rechaza correos y números largos. El botón **«Borrar progreso local»** elimina todo, previa confirmación. Si `localStorage` no está disponible, el juego sigue funcionando sin guardar.

## Compatibilidad con navegadores

Probado en Chromium (Google Chrome y Microsoft Edge usan el mismo motor). Usa solo funciones estándar compatibles con versiones recientes de Firefox y Safari. Algunos navegadores bloquean el audio hasta la primera interacción: el juego funciona igualmente, con avisos visuales.

## Limitaciones

- El mapa es genérico y no representa ninguna instalación real.
- El sismo se simula en una sola planta, con la escalera de emergencia como acceso a la salida alterna.
- El modo entrenamiento y los contenidos son de referencia: deben adaptarse al plan de emergencias de cada organización.
- La impresión del informe depende del cuadro de impresión del navegador (puede guardarse como PDF).
- No incluye entrenamiento en el uso de extintores: el extintor se trata solo como un recurso que debe permanecer visible, señalizado y sin obstrucciones.

## Recomendación de validación

Antes de usar el juego en una capacitación, el **responsable del SG-SST** de la organización debe revisar y ajustar las preguntas, las respuestas recomendadas, las rutas, el punto de encuentro, los tipos de alarma y los mensajes institucionales, para que coincidan con el plan de prevención, preparación y respuesta ante emergencias vigente.

## Créditos

Proyecto educativo «Misión Evacuación 8-Bit: Cada decisión cuenta». Gráficos pixelados dibujados por código y sonidos generados con Web Audio API. No usa recursos externos.

## Licencia sugerida

- Código: licencia **MIT**.
- Contenidos educativos (textos y situaciones): **CC BY 4.0**, con la recomendación de validar cualquier adaptación con el responsable del SG-SST.
