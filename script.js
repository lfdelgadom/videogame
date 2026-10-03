/* =========================================================================
   MISIÓN EVACUACIÓN 8-BIT: CADA DECISIÓN CUENTA
   script.js — Lógica completa del videojuego (JavaScript puro, sin dependencias)

   ÍNDICE
    1. Configuración institucional (CONFIG)  ← personalización principal
    2. Colores del mapa, rutas y textos institucionales
    3. Banco de decisiones y preguntas
    4. Peligros, mapa y escenarios
    5. Utilidades
    6. Almacenamiento local
    7. Sonido (Web Audio API)
    8. Estado general
    9. Navegación entre pantallas y modales
   10. Accesibilidad y preferencias
   11. Interfaz de decisión (compartida por ambos modos)
   12. Modo entrenamiento
   13. Simulación: preparación y eventos aleatorios
   14. Simulación: movimiento, colisiones e interacciones
   15. Simulación: disparadores, decisiones y fases
   16. Puntuación, riesgo y temporizador
   17. Dibujo del mapa (Canvas 2D)
   18. Informe final
   19. Historial y configuración
   20. Eventos e inicialización
   ========================================================================= */
'use strict';

/* =========================================================================
   1. CONFIGURACIÓN INSTITUCIONAL
   -------------------------------------------------------------------------
   Modifica estos valores para adaptar el juego a tu organización.
   No incluyas números de emergencia ni procedimientos que no estén
   aprobados en el plan de emergencias vigente.
   ========================================================================= */
const CONFIG = {
  // Nombre de la organización (encabezado, bienvenida, créditos e informe).
  organizationName: 'Mi organización',
  // Identificador institucional: iniciales que se muestran en el distintivo del encabezado.
  logoText: 'MO',
  // Logo opcional: ruta RELATIVA a una imagen ubicada en la misma carpeta (ej.: 'logo.png').
  // Déjalo vacío para usar logoText.
  logoImage: '',
  // Título y subtítulo del juego.
  gameTitle: 'Misión Evacuación 8-Bit',
  gameSubtitle: 'Cada decisión cuenta',
  // Nombre genérico de la instalación representada en el mapa.
  buildingName: 'Sede administrativa (mapa genérico de ejemplo)',
  // Nombre del punto de encuentro (cámbialo por el definido en tu plan).
  meetingPoint: 'Punto de encuentro principal',
  // Canal interno de reporte o contacto (texto configurable, sin números inventados).
  emergencyContact: 'Canal interno definido por la organización',
  // Nombre del grupo de respuesta.
  brigadeName: 'brigada de emergencias',
  // Tipos de alarma: describe cómo suena o se anuncia cada emergencia en tu sede.
  alarmTypes: {
    fire: 'alarma de evacuación (sonora y luminosa)',
    quake: 'alerta sísmica o aviso de la brigada'
  },
  // Acción de protección durante un sismo, según el protocolo de la organización.
  quakeProtectiveAction: 'agacharse, cubrirse y sujetarse, lejos de ventanas y de objetos que puedan caer',
  // Mensaje institucional que se muestra en el menú.
  institutionalMessage: 'Conoce las rutas de evacuación y el punto de encuentro de tu sede.',
  // Activar o desactivar escenarios.
  enableFireScenario: true,
  enableEarthquakeScenario: true,
  // Preferencias iniciales (el usuario puede cambiarlas en Configuración).
  soundEnabled: true,
  reducedMotionDefault: false,
  defaultTheme: 'dark', // 'dark' | 'light'
  // Número de situaciones por sesión de entrenamiento.
  trainingQuestionsPerSession: 12,
  // Tiempo de referencia (segundos activos) para los 5 puntos de tiempo de respuesta.
  referenceTimeSeconds: { fire: 150, quake: 240 },
  // Colores institucionales opcionales (formato CSS, ej.: '#0055a4'). Vacío = paleta por defecto.
  // También puedes cambiar todos los colores en las variables de styles.css.
  themeColors: { accent: '', safe: '', danger: '' }
};

(function () {
  'use strict';

  /* =======================================================================
     2. COLORES DEL MAPA, RUTAS Y TEXTOS INSTITUCIONALES
     ======================================================================= */

  // Colores del mapa dibujado en Canvas (personalizables).
  const MAP_COLORS = {
    floor: '#c9c4b6', floorLine: '#b3ad9d',
    carpet: '#7f93ad', carpetLine: '#72859e',
    wood: '#b58d5e', woodLine: '#9f7a4f',
    wall: '#353d52', wallTop: '#5a647f', wallLine: '#232838',
    grass: '#4f8a4b', grassDot: '#63a35c', fence: '#7a5a3a',
    exit: '#1f8a4c', exitStripe: '#29a35c', sign: '#1f8a4c',
    meet: '#d8e86a', meetLine: '#8ea52c',
    door: '#8a5a32', doorDark: '#5e3b1f',
    elevator: '#9aa3b5', elevatorDark: '#5f6779',
    stairs: '#959baa', stairsDark: '#5b6170',
    desk: '#8b6a45', deskTop: '#a98257', monitor: '#1f2533', table: '#7d5c3b',
    debris: '#7b6a58', debrisDark: '#4e4338',
    hazard: '#f4c430', hazardText: '#1b1405', ok: '#3cc47c', target: '#f4b740', alarm: '#d6402b'
  };

  // Nombres de las rutas (ajústalos a la nomenclatura de tu plan).
  const ROUTE_NAMES = {
    main: 'ruta principal (corredor principal y salida principal)',
    alt: 'ruta alterna (corredor sur, escalera de emergencia y salida alterna)'
  };

  // Nota que acompaña cada retroalimentación.
  const PROTOCOL_NOTE = 'Según el protocolo configurado para esta simulación. En una implementación institucional, esta instrucción debe ajustarse al plan de emergencias vigente. Sigue siempre la señalización y las instrucciones oficiales de tu organización.';

  // Mensajes educativos cuando aumenta el riesgo.
  const RISK_MESSAGES = [
    'Esta decisión incrementó el riesgo.',
    'Observa la señalización antes de continuar.',
    'La velocidad no reemplaza una decisión segura.',
    'Consulta la ruta alternativa.',
    'No regreses por objetos personales.'
  ];

  const MAX_OPPORTUNITIES = 3;

  // Niveles de reconocimiento educativo.
  const LEVELS = [
    { min: 95, name: 'Brigadista retro', rank: 5, icon: '★' },
    { min: 85, name: 'Líder de evacuación', rank: 4, icon: '◆' },
    { min: 70, name: 'Guardián de la seguridad', rank: 3, icon: '▲' },
    { min: 50, name: 'Observador de riesgos', rank: 2, icon: '●' },
    { min: 0, name: 'Aprendiz preventivo', rank: 1, icon: '■' }
  ];

  // Categorías temáticas.
  const THEMES = {
    alarm: 'Reconocimiento de alarmas',
    emergencyType: 'Identificación del tipo de emergencia',
    hazards: 'Identificación de peligros',
    routes: 'Rutas de evacuación',
    exits: 'Uso de salidas y escaleras',
    brigade: 'Instrucciones de la brigada',
    visitors: 'Orientación de visitantes',
    noReturn: 'No regresar por objetos',
    news: 'Reporte de novedades',
    meeting: 'Punto de encuentro',
    quakeBefore: 'Prevención antes de un sismo',
    quakeDuring: 'Conducta durante un sismo',
    quakeAfter: 'Conducta después de un sismo',
    support: 'Apoyo seguro a otras personas',
    resources: 'Recursos de emergencia'
  };

  // Recomendaciones educativas personalizadas por categoría.
  const RECOMMENDATIONS = {
    [THEMES.alarm]: 'Cuando escuches la alarma, suspende tus actividades y activa el procedimiento sin esperar confirmaciones informales.',
    [THEMES.emergencyType]: 'Identifica el tipo de emergencia a partir de la alarma y de los anuncios oficiales; cada tipo puede requerir acciones distintas según el plan.',
    [THEMES.hazards]: 'Observa el entorno antes de avanzar e identifica humo, obstáculos u objetos inseguros; repórtalos por el canal definido.',
    [THEMES.routes]: 'Identifica la ruta alternativa antes de acercarte a un corredor con humo y sigue la señalización.',
    [THEMES.exits]: 'Durante una evacuación usa las escaleras y salidas señalizadas; evita el ascensor según el protocolo.',
    [THEMES.brigade]: 'Sigue las instrucciones de la brigada y avanza en orden, sin correr ni discutir la ruta.',
    [THEMES.visitors]: 'Orienta a los visitantes con calma hacia la ruta señalizada e informa a la brigada que vienen contigo.',
    [THEMES.noReturn]: 'No regreses por objetos personales ni permitas que otros lo hagan; informa a la brigada si algo es importante.',
    [THEMES.news]: 'Reporta de inmediato las novedades al responsable del punto de encuentro o a la brigada, sin intentar resolverlas por tu cuenta.',
    [THEMES.meeting]: 'Al llegar al punto de encuentro, repórtate, informa novedades y permanece allí hasta recibir instrucciones.',
    [THEMES.quakeBefore]: 'Antes de un sismo, identifica objetos en altura, estanterías sin anclaje y salidas obstruidas, y repórtalos a tiempo.',
    [THEMES.quakeDuring]: 'Durante el movimiento aplica la acción de protección definida en tu protocolo y no te desplaces hasta que termine.',
    [THEMES.quakeAfter]: 'Después del sismo evalúa el entorno, evita elementos caídos y evacúa solo cuando el procedimiento lo indique.',
    [THEMES.support]: 'Apoya a otras personas sin ponerte en riesgo y comunica a la brigada cualquier necesidad de asistencia.',
    [THEMES.resources]: 'Verifica que extintores, botiquines y señales permanezcan visibles, accesibles y sin obstrucciones.'
  };

  /* =======================================================================
     3. BANCO DE DECISIONES Y PREGUNTAS
     -------------------------------------------------------------------------
     Cada situación incluye: contexto, pregunta, opciones (una segura),
     explicación, riesgo que se evita y categoría temática.
     - category: 'decision' (suma a los 40 puntos) o 'apoyo' (suma a los 10).
     - scenario: 'fire' | 'quake' | 'general' (para el modo entrenamiento).
     - reentry: true marca opciones que implican regresar al edificio.
     Los textos pueden ser funciones que reciben la partida (o null).
     ======================================================================= */

  function quakeRouteLabel(run) {
    return run && run.blockedRoute === 'alt' ? 'ruta principal' : 'ruta alterna por la escalera de emergencia';
  }

  const DECISIONS = {
    /* ---------- Escenario de incendio ---------- */
    fire_alarm: {
      scenario: 'fire', category: 'decision', theme: THEMES.alarm,
      title: 'Se activa la alarma',
      context: `Estás en tu puesto de trabajo. Se activa la ${CONFIG.alarmTypes.fire} y percibes olor a humo.`,
      question: '¿Cuál es tu primera acción?',
      options: [
        { text: 'Suspender lo que haces, mantener la calma y prepararte para evacuar según el procedimiento.', safe: true, feedback: 'La alarma es la señal para activar el procedimiento, sin esperar confirmaciones informales.' },
        { text: 'Terminar el correo que estabas escribiendo y luego ver qué pasa.', safe: false, feedback: 'Retrasar la respuesta reduce el tiempo disponible para evacuar con calma.' },
        { text: 'Ir hacia el lugar del humo para confirmar si la emergencia es real.', safe: false, feedback: 'Acercarte al origen te expone al humo y puede interferir con la brigada.' },
        { text: 'Recoger tu computador, tu bolso y tus documentos antes de salir.', safe: false, feedback: 'Recoger pertenencias retrasa la evacuación y te puede entorpecer en la ruta.' }
      ],
      explanation: 'La alarma indica que debe activarse el procedimiento de evacuación. Según el protocolo configurado para esta simulación, se suspenden las actividades y se evacúa de forma ordenada, sin llevar objetos.',
      riskAvoided: 'Exposición al humo por demora en la evacuación.'
    },
    fire_smoke: {
      scenario: 'fire', category: 'decision', theme: THEMES.routes,
      title: 'Humo en el corredor habitual',
      context: 'Al salir de la oficina observas humo en el corredor que usas todos los días para llegar a la salida principal.',
      question: '¿Qué deberías hacer?',
      options: [
        { text: 'Atravesar rápidamente el corredor con humo.', safe: false, feedback: 'El humo reduce la visibilidad y puede afectar la respiración en pocos segundos.' },
        { text: 'Regresar a buscar tus objetos personales.', safe: false, feedback: 'Regresar por objetos te mantiene más tiempo dentro del edificio.' },
        { text: 'Utilizar la ruta alterna prevista y seguir la señalización y las instrucciones.', safe: true, feedback: 'Las rutas alternas existen precisamente para cuando la principal queda bloqueada.' },
        { text: 'Usar el ascensor para salir más rápido.', safe: false, feedback: 'El ascensor no es una ruta de evacuación durante un incendio en esta simulación.' }
      ],
      explanation: 'Cuando la ruta habitual presenta humo, se utiliza la ruta alterna señalizada. Conocer de antemano ambas rutas evita improvisar.',
      riskAvoided: 'Inhalación de humo y desorientación por baja visibilidad.'
    },
    fire_elevator: {
      scenario: 'fire', category: 'decision', theme: THEMES.exits,
      title: 'El ascensor está disponible',
      context: 'Frente a ti, el ascensor está abierto y vacío. Una persona dice: «¡Vamos en ascensor, es más rápido!».',
      question: '¿Qué haces?',
      options: [
        { text: 'No usar el ascensor; continuar por la ruta señalizada e invitar a esa persona a hacer lo mismo.', safe: true, feedback: 'Correcto: además de protegerte, ayudas a que otra persona tome una decisión segura.' },
        { text: 'Subir al ascensor porque está disponible y vacío.', safe: false, feedback: 'Un ascensor puede detenerse por fallas eléctricas o abrirse en un piso con humo.' },
        { text: 'Esperar a que el ascensor regrese para bajar con más personas.', safe: false, feedback: 'Esperar el ascensor retrasa la evacuación y concentra personas en un punto.' },
        { text: 'Usarlo solo para bajar un piso y luego seguir por la escalera.', safe: false, feedback: 'Aun un trayecto corto implica el riesgo de quedar atrapado.' }
      ],
      explanation: 'Según el protocolo configurado para esta simulación, los ascensores no se utilizan durante una evacuación por incendio: pueden detenerse o llevar a zonas afectadas.',
      riskAvoided: 'Quedar atrapado en el ascensor o llegar a un piso afectado por el humo.'
    },
    fire_brigade: {
      scenario: 'fire', category: 'decision', theme: THEMES.brigade, speaker: 'Brigadista',
      title: 'Instrucción de la brigada',
      context: 'Una persona de la brigada de emergencias indica: «La ruta principal está bloqueada. Continúen por la escalera de emergencia, en fila, sin correr y por el lado derecho».',
      question: '¿Cómo respondes?',
      options: [
        { text: 'Seguir la instrucción y avanzar en orden, sin correr ni empujar.', safe: true, feedback: 'La brigada tiene información actualizada de la emergencia.' },
        { text: 'Discutir porque la ruta principal te parece más corta.', safe: false, feedback: 'Discutir retrasa a todos y la ruta principal puede estar comprometida.' },
        { text: 'Correr para adelantar a las demás personas.', safe: false, feedback: 'Correr en una evacuación provoca caídas y congestión.' },
        { text: 'Detenerte en la escalera a grabar un video.', safe: false, feedback: 'Detenerse en la ruta bloquea el paso de las demás personas.' }
      ],
      explanation: 'Las instrucciones de la brigada se siguen de inmediato. Avanzar en orden, sin correr, reduce caídas y bloqueos en escaleras y corredores.',
      riskAvoided: 'Congestión, caídas y conflictos en la ruta de evacuación.'
    },
    fire_visitor: {
      scenario: 'fire', category: 'apoyo', theme: THEMES.visitors, speaker: 'Persona visitante',
      title: 'Una persona visitante desorientada',
      context: 'Una persona visitante, con escarapela de visitante, está detenida y te pregunta: «No conozco el edificio, ¿qué hago?».',
      question: '¿Cómo la orientas?',
      options: [
        { text: 'Pedirle con calma que te acompañe por la ruta señalizada hacia el punto de encuentro e informar a la brigada que viene contigo.', safe: true, feedback: 'Orientar sin exponerte es una forma segura y valiosa de apoyo.' },
        { text: 'Decirle que busque la salida por su cuenta porque tienes prisa.', safe: false, feedback: 'Una persona que no conoce la instalación puede tomar una ruta peligrosa.' },
        { text: 'Pedirle que espere en una oficina hasta que alguien venga por ella.', safe: false, feedback: 'Dejarla dentro del edificio la mantiene expuesta.' },
        { text: 'Enviarla por el corredor principal porque es el más conocido.', safe: false, feedback: 'El corredor principal tiene humo; la enviarías a una zona de peligro.' }
      ],
      explanation: 'Los visitantes no conocen las rutas. Acompañarlos por la ruta señalizada e informar a la brigada facilita el conteo y evita que alguien quede atrás.',
      riskAvoided: 'Persona visitante desorientada o expuesta al humo.'
    },
    fire_coworker: {
      scenario: 'fire', category: 'apoyo', theme: THEMES.noReturn, speaker: 'Colega de trabajo',
      title: 'Alguien quiere regresar',
      context: 'Ya afuera, una persona de tu equipo se detiene y dice: «Dejé mi teléfono en el escritorio, regreso en un minuto».',
      question: '¿Qué le dices?',
      options: [
        { text: 'Pedirle que no regrese, que continúe contigo al punto de encuentro y que informe a la brigada si necesita algo.', safe: true, feedback: 'Ningún objeto vale más que la seguridad de una persona.' },
        { text: 'Acompañarla para que vaya más rápido.', safe: false, feedback: 'Serían dos personas expuestas en lugar de una.', reentry: true },
        { text: 'Dejar que vaya: es su decisión.', safe: false, feedback: 'Puedes influir positivamente sin ponerte en riesgo.' },
        { text: 'Ofrecerte a buscar el teléfono tú mismo.', safe: false, feedback: 'Regresar al edificio sin autorización te expone a ti.', reentry: true }
      ],
      explanation: 'Nadie debe regresar al edificio por pertenencias. El reingreso solo ocurre cuando la brigada o el responsable lo autoriza.',
      riskAvoided: 'Reingreso a una zona de peligro por objetos personales.'
    },
    fire_news: {
      scenario: 'fire', category: 'decision', theme: THEMES.news, speaker: 'Persona que reporta una novedad',
      title: 'Una posible persona faltante',
      context: 'Al llegar al punto de encuentro, una persona te comenta: «Creo que alguien del aula no salió».',
      question: '¿Qué haces con esta información?',
      options: [
        { text: 'Informar de inmediato al responsable del punto de encuentro o a la brigada, indicando lo que sabes y dónde podría estar la persona.', safe: true, feedback: 'Reportar con datos concretos permite una búsqueda organizada y segura.' },
        { text: 'Entrar al edificio a buscarla.', safe: false, feedback: 'La búsqueda corresponde a personal entrenado y equipado.', reentry: true },
        { text: 'No decir nada para no generar alarma.', safe: false, feedback: 'Callar una novedad puede retrasar la ayuda a alguien que la necesita.' },
        { text: 'Publicarlo en un grupo de mensajería y esperar respuestas.', safe: false, feedback: 'La información debe llegar directamente a quien coordina la emergencia.' }
      ],
      explanation: 'Las novedades se reportan al responsable del punto de encuentro o a la brigada, que decide cómo actuar. No se realizan búsquedas por cuenta propia.',
      riskAvoided: 'Retraso en la búsqueda o nuevas personas expuestas.'
    },
    fire_report: {
      scenario: 'fire', category: 'decision', theme: THEMES.meeting, speaker: 'Responsable del punto de encuentro',
      title: 'Reporte en el punto de encuentro',
      context: `Estás en ${CONFIG.meetingPoint}. La persona responsable está haciendo el conteo.`,
      question: '¿Qué haces?',
      options: [
        { text: 'Reportarte, confirmar tu área y quiénes venían contigo, e informar cualquier novedad observada.', safe: true, feedback: 'Tu reporte permite completar el conteo con precisión.' },
        { text: 'Irte a casa porque ya estás fuera del edificio.', safe: false, feedback: 'Si no te reportas, la brigada podría buscarte dentro del edificio.' },
        { text: 'Quedarte apartado sin avisar que llegaste.', safe: false, feedback: 'El conteo quedaría incompleto.' },
        { text: 'Ir al parqueadero a mover tu vehículo.', safe: false, feedback: 'Abandonar el punto de encuentro dificulta el conteo y puede obstaculizar a los organismos de respuesta.' }
      ],
      explanation: 'En el punto de encuentro cada persona se reporta y comparte las novedades. Esto evita búsquedas innecesarias de personas que ya están a salvo.',
      riskAvoided: 'Conteo incompleto que obliga a buscar personas que ya están a salvo.'
    },
    fire_return: {
      scenario: 'fire', category: 'decision', theme: THEMES.meeting,
      title: 'Propuesta de volver',
      context: 'Después de unos minutos, alguien propone: «Ya no se ve humo, volvamos a la oficina».',
      question: '¿Qué decides?',
      options: [
        { text: 'Permanecer en el punto de encuentro hasta que la brigada o el responsable autorice el regreso.', safe: true, feedback: 'Solo quien coordina la emergencia puede confirmar que es seguro regresar.' },
        { text: 'Regresar porque ya no se ve humo.', safe: false, feedback: 'Que no se vea humo no significa que el edificio sea seguro.', reentry: true },
        { text: 'Volver solo por tus pertenencias y salir de nuevo.', safe: false, feedback: 'El reingreso sin autorización expone a riesgos no evaluados.', reentry: true },
        { text: 'Ir a revisar desde la puerta si todo está bien.', safe: false, feedback: 'Acercarte al edificio también puede exponerte y entorpecer la respuesta.', reentry: true }
      ],
      explanation: 'El regreso a la edificación ocurre únicamente con autorización de la brigada o del responsable de la emergencia, después de verificar las condiciones.',
      riskAvoided: 'Reingreso a una edificación sin verificación de seguridad.'
    },

    /* ---------- Escenario de sismo ---------- */
    quake_during_1: {
      scenario: 'quake', category: 'decision', theme: THEMES.quakeDuring,
      title: 'Comienza el movimiento',
      context: 'Estás en tu puesto y el piso comienza a moverse con fuerza. Se escuchan objetos cayendo.',
      question: '¿Qué haces mientras dura el movimiento?',
      options: [
        { text: `Aplicar la acción de protección definida en el protocolo (en esta simulación: ${CONFIG.quakeProtectiveAction}).`, safe: true, feedback: 'Protegerte en el sitio reduce el riesgo de golpes y caídas durante el movimiento.' },
        { text: 'Correr hacia la salida mientras el piso se mueve.', safe: false, feedback: 'Desplazarte durante el movimiento aumenta el riesgo de caídas y golpes.' },
        { text: 'Ir al ascensor para bajar rápido.', safe: false, feedback: 'Los ascensores pueden detenerse o dañarse durante un sismo.' },
        { text: 'Quedarte de pie junto a la estantería para sostenerla.', safe: false, feedback: 'Una estantería puede volcarse sobre ti.' }
      ],
      explanation: 'Según el protocolo configurado para esta simulación, durante el movimiento se aplica la acción de protección y se evacúa cuando termina el movimiento y lo indica el procedimiento.',
      riskAvoided: 'Caídas y golpes por objetos durante el movimiento.'
    },
    quake_during_2: {
      scenario: 'quake', category: 'decision', theme: THEMES.quakeDuring,
      title: 'Cerca de una ventana',
      context: 'Notas que estás cerca de una ventana grande y de un archivador alto.',
      question: '¿Cuál es la decisión más segura?',
      options: [
        { text: 'Alejarte de la ventana y del archivador hacia un lugar más protegido y mantener la acción de protección.', safe: true, feedback: 'Alejarte de vidrios y objetos altos reduce el riesgo de lesiones.' },
        { text: 'Quedarte junto a la ventana para ver qué ocurre afuera.', safe: false, feedback: 'Los vidrios pueden romperse con el movimiento.' },
        { text: 'Abrir la ventana para salir por ahí.', safe: false, feedback: 'Las ventanas no son salidas y aumentan el riesgo de caída.' },
        { text: 'Sostener el archivador para que no caiga.', safe: false, feedback: 'No intentes sostener muebles: pueden caer sobre ti.' }
      ],
      explanation: 'Durante el movimiento conviene alejarse de ventanas, vidrios y elementos altos que puedan caer, sin desplazarse largas distancias.',
      riskAvoided: 'Golpes por vidrios u objetos que caen.'
    },
    quake_during_3: {
      scenario: 'quake', category: 'decision', theme: THEMES.quakeDuring,
      title: 'Alguien grita «¡corran!»',
      context: 'Mientras el movimiento continúa, alguien grita: «¡Todos afuera ya, corran!».',
      question: '¿Qué haces?',
      options: [
        { text: 'Mantener la acción de protección hasta que el movimiento termine y esperar la instrucción de la brigada o del procedimiento.', safe: true, feedback: 'Mantener la calma evita caídas y estampidas en escaleras.' },
        { text: 'Correr hacia las escaleras con el grupo.', safe: false, feedback: 'Correr durante el movimiento provoca caídas y aglomeraciones.' },
        { text: 'Empujar para salir de primero.', safe: false, feedback: 'Empujar pone en riesgo a todas las personas.' },
        { text: 'Bajar las escaleras saltando de dos en dos.', safe: false, feedback: 'Las escaleras son un punto crítico de caídas durante un sismo.' }
      ],
      explanation: 'Las instrucciones informales o el pánico no reemplazan el procedimiento. La evacuación inicia cuando termina el movimiento y lo indica la brigada o el plan.',
      riskAvoided: 'Caídas, aglomeraciones y lesiones en escaleras.'
    },
    quake_after: {
      scenario: 'quake', category: 'decision', theme: THEMES.quakeAfter,
      title: 'Terminó el movimiento',
      context: 'El movimiento terminó. Hay objetos en el piso y algo de polvo. La brigada anuncia que se evacuará por la ruta habilitada.',
      question: '¿Qué haces ahora?',
      options: [
        { text: 'Observar rápidamente el entorno, evitar los elementos caídos y prepararte para evacuar según las instrucciones.', safe: true, feedback: 'Evaluar antes de moverte evita tropiezos y cortes.' },
        { text: 'Quedarte recogiendo los objetos caídos de tu escritorio.', safe: false, feedback: 'Recoger objetos retrasa la evacuación y te expone a réplicas.' },
        { text: 'Salir corriendo sin mirar por dónde pisas.', safe: false, feedback: 'Después de un sismo puede haber vidrios y objetos en el piso.' },
        { text: 'Volver a trabajar como si nada hubiera pasado.', safe: false, feedback: 'Puede haber daños no visibles; sigue el procedimiento de evacuación.' }
      ],
      explanation: 'Después del sismo se evalúa visualmente el entorno, se evitan zonas con elementos caídos y se evacúa cuando el procedimiento lo indica. Pueden presentarse réplicas.',
      riskAvoided: 'Tropiezos, cortes y exposición a réplicas.'
    },
    quake_elevator: {
      scenario: 'quake', category: 'decision', theme: THEMES.exits,
      title: 'El ascensor después del sismo',
      context: 'Al salir al corredor ves el ascensor. Una persona comenta: «Bajemos en ascensor, así evitamos las escaleras».',
      question: '¿Qué haces?',
      options: [
        { text: 'No usar el ascensor; evacuar por la ruta habilitada e invitar a esa persona a hacer lo mismo.', safe: true, feedback: 'Correcto: el ascensor pudo quedar afectado por el sismo.' },
        { text: 'Usar el ascensor porque el movimiento ya terminó.', safe: false, feedback: 'Puede haber daños no visibles y pueden ocurrir réplicas.' },
        { text: 'Probar el ascensor primero para ver si funciona.', safe: false, feedback: 'Probarlo implica el riesgo de quedar atrapado.' },
        { text: 'Esperar a que alguien confirme si el ascensor sirve.', safe: false, feedback: 'Esperar retrasa la evacuación; existe una ruta habilitada.' }
      ],
      explanation: 'Según el protocolo configurado para esta simulación, después de un sismo no se usan ascensores: pueden estar dañados o detenerse con una réplica.',
      riskAvoided: 'Quedar atrapado por una falla o una réplica.'
    },
    quake_brigade: {
      scenario: 'quake', category: 'decision', theme: THEMES.brigade, speaker: 'Brigadista',
      title: 'Instrucción de la brigada',
      context: (run) => `Una persona de la brigada indica: «Evacuamos por la ${quakeRouteLabel(run)}. Avancen en orden, sin correr, y eviten la zona con elementos caídos».`,
      question: '¿Cómo respondes?',
      options: [
        { text: 'Seguir la instrucción y la ruta indicada, avanzando en orden y observando el piso.', safe: true, feedback: 'La brigada conoce qué rutas están habilitadas.' },
        { text: 'Tomar la otra ruta porque es la que siempre usas.', safe: false, feedback: 'La otra ruta puede estar obstruida o dañada.' },
        { text: 'Pasar por encima de los elementos caídos para acortar camino.', safe: false, feedback: 'Los escombros pueden ser inestables o cortantes.' },
        { text: 'Quedarte esperando a que todos salgan antes de moverte.', safe: false, feedback: 'Se evacúa cuando la brigada lo indica, no al final por decisión propia.' }
      ],
      explanation: 'Tras un sismo, solo se utilizan las rutas que la brigada o el procedimiento indican como habilitadas, evitando zonas con daños.',
      riskAvoided: 'Lesiones por escombros o rutas dañadas.'
    },
    quake_visitor: {
      scenario: 'quake', category: 'apoyo', theme: THEMES.visitors, speaker: 'Persona visitante',
      title: 'Una persona visitante confundida',
      context: 'Una persona visitante está quieta en el corredor y te dice: «Nunca había vivido un sismo aquí. ¿Hacia dónde voy?».',
      question: '¿Cómo la apoyas?',
      options: [
        { text: 'Indicarle con calma que te acompañe por la ruta habilitada hasta el punto de encuentro e informar a la brigada que viene contigo.', safe: true, feedback: 'Orientar con calma y por la ruta habilitada es apoyo seguro.' },
        { text: 'Decirle que espere en el corredor a que pase todo.', safe: false, feedback: 'Permanecer dentro la expone a réplicas y daños.' },
        { text: 'Señalarle la ruta que tiene elementos caídos porque es más corta.', safe: false, feedback: 'La enviarías a una zona de riesgo.' },
        { text: 'Ignorarla para salir más rápido.', safe: false, feedback: 'Los visitantes no conocen la instalación y necesitan orientación.' }
      ],
      explanation: 'Apoyar a otras personas forma parte de una evacuación segura, siempre sin exponerse y siguiendo la ruta habilitada.',
      riskAvoided: 'Persona visitante expuesta a réplicas o a rutas dañadas.'
    },
    quake_coworker: {
      scenario: 'quake', category: 'apoyo', theme: THEMES.noReturn, speaker: 'Colega de trabajo',
      title: 'Alguien quiere volver por su portátil',
      context: 'Ya afuera, una persona de tu equipo dice: «Mi portátil quedó sobre el escritorio. Voy rápido antes de que haya una réplica».',
      question: '¿Qué le dices?',
      options: [
        { text: 'Pedirle que no regrese, que vaya contigo al punto de encuentro y que informe a la brigada sobre el equipo si es necesario.', safe: true, feedback: 'Evitas que alguien vuelva a una edificación sin evaluar.' },
        { text: 'Acompañarla para ayudarle a cargar el equipo.', safe: false, feedback: 'Serían dos personas expuestas a una posible réplica.', reentry: true },
        { text: 'Decirle que vaya, pero que se apure.', safe: false, feedback: 'Apurarse no reduce el riesgo de daños o réplicas.' },
        { text: 'No decir nada.', safe: false, feedback: 'Puedes influir positivamente sin ponerte en riesgo.' }
      ],
      explanation: 'Después de un sismo nadie debe regresar a la edificación hasta que se evalúen sus condiciones y se autorice el reingreso.',
      riskAvoided: 'Reingreso a una edificación sin evaluar durante posibles réplicas.'
    },
    quake_news: {
      scenario: 'quake', category: 'decision', theme: THEMES.news, speaker: 'Persona que reporta una novedad',
      title: 'Una novedad en el punto de encuentro',
      context: 'Una persona te cuenta que un compañero se golpeó el brazo con un objeto que cayó y se quedó sentado en el aula.',
      question: '¿Qué haces?',
      options: [
        { text: 'Informar de inmediato a la brigada o al responsable del punto de encuentro, indicando dónde está la persona.', safe: true, feedback: 'La brigada puede activar la atención con el personal capacitado.' },
        { text: 'Regresar al aula a ayudarle.', safe: false, feedback: 'Regresar te expone a ti; la brigada coordina la atención.', reentry: true },
        { text: 'Esperar a ver si sale solo.', safe: false, feedback: 'Esperar puede retrasar la ayuda que necesita.' },
        { text: 'Llamarlo varias veces al celular hasta que conteste.', safe: false, feedback: 'La información debe llegar a quien coordina la respuesta.' }
      ],
      explanation: 'Las novedades sobre personas lesionadas o faltantes se reportan a la brigada o al responsable, que coordina la atención según el plan.',
      riskAvoided: 'Retraso en la atención o nuevas personas expuestas.'
    },
    quake_report: {
      scenario: 'quake', category: 'decision', theme: THEMES.meeting, speaker: 'Responsable del punto de encuentro',
      title: 'Reporte de novedades observadas',
      context: `Llegas a ${CONFIG.meetingPoint}. En el recorrido viste una grieta en una pared y vidrios rotos en el corredor.`,
      question: '¿Qué haces?',
      options: [
        { text: 'Reportarte con el responsable y describir las novedades observadas (grieta, vidrios y elementos caídos) y su ubicación.', safe: true, feedback: 'Esta información ayuda a evaluar la edificación.' },
        { text: 'Reportarte, pero no mencionar los daños para no preocupar a nadie.', safe: false, feedback: 'Los daños observados son información clave para la evaluación.' },
        { text: 'Tomar fotos de los daños y publicarlas en redes sociales.', safe: false, feedback: 'La información debe llegar primero a quien coordina la emergencia.' },
        { text: 'Irte sin reportarte porque ya estás afuera.', safe: false, feedback: 'Sin tu reporte, el conteo queda incompleto.' }
      ],
      explanation: 'Reportarse y describir los daños observados permite completar el conteo y apoyar la evaluación de la edificación.',
      riskAvoided: 'Conteo incompleto y daños estructurales no informados.'
    },
    quake_return: {
      scenario: 'quake', category: 'decision', theme: THEMES.quakeAfter,
      title: 'Propuesta de volver',
      context: 'Alguien dice: «Ya pasó el temblor, volvamos a trabajar».',
      question: '¿Qué decides?',
      options: [
        { text: 'Permanecer en el punto de encuentro hasta recibir instrucciones; pueden presentarse réplicas y la edificación debe evaluarse.', safe: true, feedback: 'El reingreso depende de la evaluación y de la autorización.' },
        { text: 'Volver porque el edificio se ve bien desde afuera.', safe: false, feedback: 'Muchos daños no son visibles desde el exterior.', reentry: true },
        { text: 'Entrar solo a recoger tus cosas.', safe: false, feedback: 'Un reingreso corto también expone a réplicas.', reentry: true },
        { text: 'Irte sin avisar a nadie.', safe: false, feedback: 'Abandonar el punto de encuentro sin avisar afecta el conteo.' }
      ],
      explanation: 'Después de un sismo, el reingreso ocurre solo cuando la brigada o el responsable lo autorizan tras evaluar la edificación.',
      riskAvoided: 'Exposición a réplicas o a una edificación con daños.'
    },

    /* ---------- Preguntas adicionales para el modo entrenamiento ---------- */
    gen_type: {
      scenario: 'general', category: 'decision', theme: THEMES.emergencyType,
      title: 'Identifica el tipo de emergencia',
      context: 'Suena el tono configurado para evacuación y, por altavoz, se anuncia un incendio en otra área del edificio.',
      question: '¿Qué conclusión es la más adecuada?',
      options: [
        { text: 'Es una emergencia por incendio: corresponde activar el procedimiento de evacuación y seguir las rutas señalizadas.', safe: true, feedback: 'La alarma y el anuncio oficial identifican el tipo de emergencia.' },
        { text: 'Como el incendio es en otra área, puedes seguir trabajando.', safe: false, feedback: 'El humo y el fuego pueden propagarse a otras áreas.' },
        { text: 'Debes ir al área afectada para ayudar a apagarlo.', safe: false, feedback: 'Combatir un incendio requiere entrenamiento y equipos específicos.' },
        { text: 'Es mejor esperar a que suene una segunda vez.', safe: false, feedback: 'Esperar reduce el tiempo disponible para evacuar.' }
      ],
      explanation: 'Reconocer el tipo de emergencia a partir de la alarma y de los anuncios oficiales permite aplicar el procedimiento correcto del plan.',
      riskAvoided: 'Demora o acciones inadecuadas ante la emergencia.'
    },
    gen_drill: {
      scenario: 'general', category: 'decision', theme: THEMES.alarm,
      title: 'Un simulacro programado',
      context: 'Se anuncia un simulacro de evacuación. Una persona de tu equipo dice: «Es solo un simulacro, quedémonos trabajando».',
      question: '¿Qué haces?',
      options: [
        { text: 'Participar como si fuera real, siguiendo la ruta y reportándote en el punto de encuentro.', safe: true, feedback: 'Los simulacros entrenan la respuesta y permiten detectar mejoras.' },
        { text: 'Quedarte trabajando porque no es una emergencia real.', safe: false, feedback: 'Sin práctica, la respuesta real suele ser más lenta y confusa.' },
        { text: 'Salir, pero tomar cualquier ruta porque no importa.', safe: false, feedback: 'El simulacro sirve justamente para practicar las rutas correctas.' },
        { text: 'Esconderte en una sala para que no te cuenten.', safe: false, feedback: 'Esto afecta el conteo y la evaluación del ejercicio.' }
      ],
      explanation: 'El simulacro presencial complementa esta práctica digital: permite recorrer las rutas reales, medir tiempos y coordinar con la brigada.',
      riskAvoided: 'Falta de preparación ante una emergencia real.'
    },
    gen_extinguisher: {
      scenario: 'general', category: 'decision', theme: THEMES.resources,
      title: 'Extintor obstruido',
      context: 'Observas que el extintor del pasillo está tapado por cajas.',
      question: '¿Qué es lo más adecuado?',
      options: [
        { text: 'Reportar la obstrucción para que se despeje: el extintor debe permanecer visible, señalizado y accesible.', safe: true, feedback: 'Los equipos de emergencia deben estar siempre disponibles para el personal capacitado.' },
        { text: 'Dejarlo así porque casi nunca se usa.', safe: false, feedback: 'En una emergencia no habría tiempo para despejarlo.' },
        { text: 'Moverlo a otro lugar que te parezca mejor.', safe: false, feedback: 'La ubicación de los equipos responde al plan; no debe cambiarse sin autorización.' },
        { text: 'Usarlo como soporte para las cajas.', safe: false, feedback: 'Ocultarlo o dañarlo lo deja inservible.' }
      ],
      explanation: 'Los extintores deben permanecer identificados y sin obstrucciones. Este juego no instruye su uso: combatir un incendio requiere entrenamiento específico.',
      riskAvoided: 'Equipos de emergencia inaccesibles cuando se necesitan.'
    },
    gen_sign: {
      scenario: 'general', category: 'decision', theme: THEMES.hazards,
      title: 'Señal de salida tapada',
      context: 'Notas que una señal de salida está cubierta por un afiche de un evento.',
      question: '¿Qué haces?',
      options: [
        { text: 'Reportarla por el canal definido para que se despeje la señal.', safe: true, feedback: 'Una señal visible orienta a todas las personas en una emergencia.' },
        { text: 'No hacer nada; tú ya conoces la salida.', safe: false, feedback: 'Otras personas y visitantes dependen de esa señal.' },
        { text: 'Retirar la señal porque el afiche se ve mejor.', safe: false, feedback: 'La señalización no debe retirarse.' },
        { text: 'Poner otro afiche encima para que combine.', safe: false, feedback: 'Empeora la visibilidad de la señal.' }
      ],
      explanation: 'La señalización de evacuación debe estar visible y despejada. Reportar obstrucciones es una forma sencilla de prevenir.',
      riskAvoided: 'Desorientación durante una evacuación.'
    },
    gen_meeting: {
      scenario: 'general', category: 'apoyo', theme: THEMES.meeting,
      title: '¿Dónde queda el punto de encuentro?',
      context: 'Una persona que acaba de ingresar a la organización te pregunta dónde queda el punto de encuentro.',
      question: '¿Cómo respondes?',
      options: [
        { text: 'Mostrarle el plano de evacuación y sugerirle confirmar la información con la brigada o con el área de SG-SST.', safe: true, feedback: 'Conocer el punto de encuentro antes de una emergencia es clave.' },
        { text: 'Decirle que siga a los demás cuando haya una emergencia.', safe: false, feedback: 'Depender de otros puede llevar a rutas equivocadas.' },
        { text: 'Indicarle un lugar al azar.', safe: false, feedback: 'Una información equivocada puede ponerla en riesgo.' },
        { text: 'Decirle que eso no es importante.', safe: false, feedback: 'Conocer el punto de encuentro es parte de la preparación.' }
      ],
      explanation: 'Cada persona debe conocer de antemano las rutas y el punto de encuentro de su sede, según el plano oficial de evacuación.',
      riskAvoided: 'Personas que no saben a dónde dirigirse en una emergencia.'
    },
    gen_support: {
      scenario: 'general', category: 'apoyo', theme: THEMES.support,
      title: 'Apoyo en la escalera',
      context: 'Durante una evacuación, una persona con una lesión temporal en el tobillo baja despacio por la escalera.',
      question: '¿Qué haces?',
      options: [
        { text: 'Ofrecerle apoyo si lo acepta, avanzar a su ritmo sin bloquear la ruta e informar a la brigada.', safe: true, feedback: 'Apoyar con respeto y avisar a la brigada es la forma segura de ayudar.' },
        { text: 'Pasarla rápidamente para no retrasarte.', safe: false, feedback: 'Empujar o adelantar en la escalera puede provocar caídas.' },
        { text: 'Cargarla sin preguntarle.', safe: false, feedback: 'Sin entrenamiento ni consentimiento puedes lesionarla o lesionarte.' },
        { text: 'Pedirle que se quede en un rincón hasta que todos salgan.', safe: false, feedback: 'Dejarla atrás la expone y dificulta el conteo.' }
      ],
      explanation: 'Apoyar a otras personas es valioso cuando se hace sin ponerse en riesgo, con su consentimiento y en coordinación con la brigada.',
      riskAvoided: 'Caídas en escaleras y personas rezagadas sin apoyo.'
    },
    gen_nonexit: {
      scenario: 'general', category: 'decision', theme: THEMES.routes,
      title: 'Una puerta sin señal',
      context: 'Durante la evacuación encuentras una puerta sin señal de salida que parece llevar hacia afuera.',
      question: '¿Qué haces?',
      options: [
        { text: 'Continuar por la ruta señalizada y seguir las instrucciones de la brigada.', safe: true, feedback: 'Las rutas señalizadas están verificadas para la evacuación.' },
        { text: 'Abrirla para ver si es un atajo.', safe: false, feedback: 'Puede conducir a un depósito, a una zona sin salida o con peligros.' },
        { text: 'Esperar a que otra persona la abra primero.', safe: false, feedback: 'Detenerte retrasa la evacuación.' },
        { text: 'Llevar al grupo por esa puerta.', safe: false, feedback: 'Podrías conducir a otras personas a una zona peligrosa.' }
      ],
      explanation: 'Solo se usan las salidas y rutas señalizadas en el plan. Las puertas sin señal pueden no tener salida.',
      riskAvoided: 'Quedar en un área sin salida o con peligros.'
    },
    quake_before_shelf: {
      scenario: 'quake', category: 'decision', theme: THEMES.quakeBefore,
      title: 'Objetos pesados en altura',
      context: 'En una revisión preventiva observas cajas pesadas en el último nivel de una estantería sin anclaje.',
      question: '¿Cuál es la mejor acción preventiva?',
      options: [
        { text: 'Reportar la condición para reubicar los objetos pesados en la parte baja y evaluar el anclaje de la estantería.', safe: true, feedback: 'Prevenir antes del sismo reduce el riesgo de caída de objetos.' },
        { text: 'Dejarlas porque nunca se han caído.', safe: false, feedback: 'Que no hayan caído no significa que no puedan caer con un sismo.' },
        { text: 'Agregar más cajas para que la estantería pese más.', safe: false, feedback: 'Más peso en altura aumenta el riesgo de volcamiento.' },
        { text: 'Trepar a la estantería para revisar las cajas.', safe: false, feedback: 'Trepar puede provocar una caída o el volcamiento del mueble.' }
      ],
      explanation: 'La fase «antes» del sismo incluye identificar y reportar condiciones como objetos pesados en altura y estanterías sin anclaje.',
      riskAvoided: 'Golpes por caída de objetos o volcamiento de muebles.'
    }
  };

  // Banco del modo entrenamiento: todas las situaciones anteriores.
  const TRAINING_BANK = Object.keys(DECISIONS).map((id) => Object.assign({ id }, DECISIONS[id]));

  /* =======================================================================
     4. PELIGROS, MAPA Y ESCENARIOS
     ======================================================================= */

  // Peligros identificables por escenario. Las posiciones son alternativas
  // aleatorias; "wall: true" indica que el objeto está montado en una pared.
  const HAZARD_POOLS = {
    fire: [
      { id: 'ext_blocked', type: 'extinguisherBlocked', label: 'Extintor obstruido por cajas', wall: true, positions: [{ x: 8, y: 6 }],
        info: 'El extintor está tapado por cajas. Los equipos de emergencia deben permanecer identificados, visibles y libres de obstáculos.',
        action: 'Reporta la obstrucción por el canal definido para que se despeje. Esta simulación no instruye el uso del extintor: combatir un incendio requiere entrenamiento específico.' },
      { id: 'cables', type: 'cables', label: 'Cables sueltos en el piso', positions: [{ x: 2, y: 5 }, { x: 6, y: 7 }, { x: 5, y: 14 }, { x: 11, y: 13 }],
        info: 'Hay cables atravesados en el piso. Durante una evacuación pueden causar tropiezos y caídas.',
        action: 'Rodéalos con cuidado, avisa a quienes vienen detrás y repórtalos en el punto de encuentro.' },
      { id: 'nonexit', type: 'nonExitDoor', label: 'Puerta que no corresponde a una salida', wall: true, positions: [{ x: 5, y: 9 }],
        info: 'Esta puerta conduce a un depósito y no tiene señal de salida. Tomar puertas desconocidas puede llevarte a un lugar sin salida.',
        action: 'Sigue únicamente las rutas y salidas señalizadas.' },
      { id: 'sign_covered', type: 'signCovered', label: 'Señal de evacuación tapada', wall: true, positions: [{ x: 6, y: 9 }, { x: 9, y: 15 }, { x: 12, y: 15 }],
        info: 'Un afiche cubre parcialmente una señal de evacuación. Si la señal no se ve, las personas pueden desorientarse.',
        action: 'Repórtala para que se despeje. Mientras tanto, guíate por las demás señales y por la brigada.' },
      { id: 'combustible', type: 'boxes', label: 'Papel y cajas acumulados junto a un tomacorriente', positions: [{ x: 6, y: 5 }, { x: 13, y: 14 }, { x: 1, y: 3 }],
        info: 'El material combustible acumulado cerca de fuentes eléctricas aumenta el riesgo de incendio y obstruye el paso.',
        action: 'Repórtalo para que se retire y se mantengan el orden y el aseo del área.' }
    ],
    quake: [
      { id: 'heavy_high', type: 'shelfHeavy', label: 'Objetos pesados en la parte alta de una estantería', positions: [{ x: 1, y: 1 }, { x: 6, y: 1 }],
        info: 'Las cajas pesadas en altura pueden caer durante un sismo y golpear a las personas.',
        action: 'Repórtalo para reubicar los objetos pesados en la parte baja, según el procedimiento.' },
      { id: 'unstable_shelf', type: 'shelf', label: 'Estantería alta sin anclaje', positions: [{ x: 16, y: 1 }, { x: 9, y: 5 }],
        info: 'Una estantería alta sin fijación puede volcarse con el movimiento.',
        action: 'Repórtala para que se evalúe su anclaje a la pared o al piso.' },
      { id: 'blocked_exit', type: 'boxes', label: 'Ruta hacia la salida alterna obstruida', positions: [{ x: 14, y: 13 }, { x: 14, y: 14 }, { x: 13, y: 13 }],
        info: 'Hay cajas apiladas en el corredor que conduce a la escalera de emergencia. Una ruta obstruida retrasa la evacuación.',
        action: 'Repórtalo para despejar la ruta; las rutas de evacuación deben permanecer libres.' },
      { id: 'no_sign', type: 'signMissing', label: 'Señalización de evacuación ausente', wall: true, positions: [{ x: 12, y: 6 }, { x: 6, y: 9 }, { x: 10, y: 15 }],
        info: 'En este punto debería haber una señal de evacuación y no la hay.',
        action: 'Repórtalo para que se instale la señalización prevista en el plan.' },
      { id: 'falling_items', type: 'falling', label: 'Monitor y matera al borde de un mueble alto', positions: [{ x: 16, y: 5 }, { x: 6, y: 3 }],
        info: 'Los objetos ubicados al borde de muebles altos pueden caer con una vibración.',
        action: 'Repórtalo o ubícalos en una posición estable si el procedimiento lo permite.' },
      { id: 'meeting_unknown', type: 'mapBoard', label: 'Plano de evacuación: ¿conoces el punto de encuentro?', wall: true, positions: [{ x: 2, y: 6 }, { x: 10, y: 6 }],
        info: `Revisaste el plano de evacuación. El punto de encuentro configurado para esta simulación es: ${CONFIG.meetingPoint}.`,
        action: 'Conoce de antemano las rutas y el punto de encuentro de tu sede; consulta el plano oficial de tu organización.' }
    ]
  };

  /* Mapa por casillas (24 x 16). Leyenda:
     #  pared            .  suelo           D  puerta interior
     E  salida principal A  salida alterna  S  escalera de emergencia
     L  ascensor         X  puerta sin salida (depósito)
     K  extintor (pared) B  botiquín        W  escritorio   T  mesa
     g  zona exterior    P  punto de encuentro              f  cerca      */
  const MAP = [
    '##################ffffff',
    '#......B#........#gggggf',
    '#.WW.WW.#.TT.TT..#gggggf',
    '#.......#........#gPPPgf',
    '#.WW.WW.#.TT.TT..#gPPPgf',
    '#.......#........#gggggf',
    '####D###K####D####gggggf',
    '#................Egggggf',
    '#................Egggggf',
    '#..LLX#.##########gggggf',
    '#..####.##########gggggf',
    '#..####.##########gggggf',
    '#..####.##########gggggf',
    '#..............SSAgggggf',
    '#..............SSAgggggf',
    '##################ffffff'
  ];
  const COLS = 24;
  const ROWS = 16;
  const TILE = 32;
  const SCALE = 2;
  const PASSABLE = new Set(['.', 'D', 'E', 'A', 'S', 'g', 'P']);
  const START = { x: 3, y: 3 };
  const WORKSTATION = { x: 3, y: 2 };
  const MEETING_ZONE = { x1: 19, y1: 3, x2: 21, y2: 4 };
  const MEETING_TARGET = { x: 20, y: 3 };
  const STEP_TIME = 0.17;

  // Señales de evacuación (decorativas, montadas en paredes).
  const SIGNS = [
    { x: 6, y: 6, dir: 'down' }, { x: 15, y: 6, dir: 'right' }, { x: 16, y: 9, dir: 'right' },
    { x: 3, y: 10, dir: 'down' }, { x: 8, y: 10, dir: 'down' }, { x: 4, y: 15, dir: 'right' }, { x: 14, y: 15, dir: 'right' }
  ];

  // Apariencia de los personajes (colores de los sprites).
  const LOOKS = {
    player: { skin: '#c68a5e', hair: '#2b1d14', shirt: '#2bb3c0', pants: '#28324a' },
    visitor: { skin: '#e0b48c', hair: '#6b4a2b', shirt: '#8e6cc9', pants: '#3a3f55', badge: '#f4c430' },
    coworker: { skin: '#8d5a3b', hair: '#1a1a1a', shirt: '#d97b3a', pants: '#2e3b55' },
    brigade: { skin: '#b77b52', hair: '#3a2a1c', shirt: '#2a2f3d', vest: '#f26b21', stripe: '#f2f2f2', helmet: '#f2f2f2', pants: '#2a2f3d' },
    responsible: { skin: '#d9a37a', hair: '#8a8a8a', shirt: '#2d6a4f', vest: '#3cc47c', stripe: '#f2f2f2', pants: '#2a2f3d', clipboard: true },
    informant: { skin: '#a86b45', hair: '#4a3020', shirt: '#5b7db1', pants: '#3b3b3b' }
  };

  // Personajes no jugadores: rol, diálogo posterior y apariencia.
  const NPC_INFO = {
    visitor: { role: 'Persona visitante', line: 'Gracias. Voy contigo hacia el punto de encuentro.' },
    coworker: { role: 'Colega de trabajo', line: 'Tienes razón. Si necesito algo, lo informaré a la brigada.' },
    brigade: { role: 'Brigadista', line: 'Continúa por la ruta indicada, sin correr.' },
    informant: { role: 'Persona que reporta una novedad', line: 'Gracias por avisar al responsable.' },
    responsible: { role: 'Responsable del punto de encuentro', line: 'Permanece aquí hasta nuevas instrucciones.' }
  };

  // Definición de escenarios: decisiones, objetivos y textos.
  const SCENARIOS = {
    fire: {
      key: 'fire', short: 'Incendio', code: 'CÓDIGO ROJO', name: 'CÓDIGO ROJO: RUTA SEGURA', enabledKey: 'enableFireScenario',
      description: 'Se activa la alarma y hay humo en tu corredor habitual. Encuentra la ruta alterna, orienta a otras personas y repórtate en el punto de encuentro.',
      decisions: ['fire_alarm', 'fire_smoke', 'fire_elevator', 'fire_brigade', 'fire_visitor', 'fire_coworker', 'fire_news', 'fire_report', 'fire_return'],
      objectives: [
        { id: 'alarm', label: 'Reconocer la alarma' },
        { id: 'avoid', label: 'Evitar la ruta con humo' },
        { id: 'alt', label: 'Identificar y usar la ruta alterna' },
        { id: 'signs', label: 'Seguir la señalización hasta la escalera de emergencia' },
        { id: 'visitor', label: 'Orientar a la persona visitante' },
        { id: 'noreturn', label: 'No regresar por objetos personales' },
        { id: 'meeting', label: 'Llegar al punto de encuentro' },
        { id: 'report', label: 'Reportarse e informar novedades' },
        { id: 'wait', label: 'Esperar instrucciones' }
      ]
    },
    quake: {
      key: 'quake', short: 'Sismo', code: 'ALERTA SÍSMICA', name: 'ALERTA SÍSMICA: ANTES, DURANTE Y DESPUÉS', enabledKey: 'enableEarthquakeScenario',
      description: 'Inspecciona tu área antes del sismo, protégete durante el movimiento y evacúa por la ruta habilitada después.',
      decisions: ['quake_during_1', 'quake_during_2', 'quake_during_3', 'quake_after', 'quake_elevator', 'quake_brigade', 'quake_visitor', 'quake_coworker', 'quake_news', 'quake_report', 'quake_return'],
      objectives: [
        { id: 'inspect', label: 'Identificar condiciones inseguras (fase Antes)' },
        { id: 'protect', label: 'Protegerse durante el movimiento (fase Durante)' },
        { id: 'assess', label: 'Evaluar el entorno y seguir instrucciones (fase Después)' },
        { id: 'route', label: 'Evacuar por la ruta habilitada' },
        { id: 'debris', label: 'Evitar zonas con elementos caídos' },
        { id: 'visitor', label: 'Orientar a la persona visitante' },
        { id: 'noreturn', label: 'No regresar por objetos personales' },
        { id: 'meeting', label: 'Llegar al punto de encuentro' },
        { id: 'report', label: 'Reportar novedades observadas' },
        { id: 'wait', label: 'Permanecer hasta recibir instrucciones' }
      ]
    }
  };

  const PHASE_NAMES = { evacuacion: 'Evacuación', antes: 'Antes', durante: 'Durante', despues: 'Después' };

  /* =======================================================================
     5. UTILIDADES
     ======================================================================= */
  const $ = (id) => document.getElementById(id);
  const on = (target, type, handler, options) => { if (target) target.addEventListener(type, handler, options); };
  const setText = (id, text) => { const node = typeof id === 'string' ? $(id) : id; if (node) node.textContent = text; };
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const randInt = (n) => Math.floor(Math.random() * n);
  const pick = (arr) => arr[randInt(arr.length)];
  const keyOf = (x, y) => x + ',' + y;
  const txt = (value, ctx) => (typeof value === 'function' ? value(ctx) : value);
  const chebyshev = (a, b) => Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
  const LETTERS = ['A', 'B', 'C', 'D'];

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = randInt(i + 1);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function formatTime(seconds) {
    const s = Math.max(0, Math.floor(seconds));
    return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
  }
  function fmt1(n) {
    return (Math.round(n * 10) / 10).toString().replace('.', ',');
  }
  // Crea elementos del DOM de forma segura (sin innerHTML).
  function el(tag, props, children) {
    const node = document.createElement(tag);
    if (props) {
      Object.keys(props).forEach((k) => {
        const v = props[k];
        if (v === null || v === undefined || v === false) return;
        if (k === 'text') node.textContent = v;
        else if (k === 'className') node.className = v;
        else node.setAttribute(k, v === true ? '' : String(v));
      });
    }
    (children || []).forEach((c) => {
      if (c === null || c === undefined || c === false) return;
      node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return node;
  }
  function isVisible(node) {
    return !!(node && node.isConnected && (node.offsetParent !== null || node === document.activeElement));
  }
  function levelFor(score) {
    return LEVELS.find((l) => score >= l.min) || LEVELS[LEVELS.length - 1];
  }
  function scenarioEnabled(key) {
    const sc = SCENARIOS[key];
    return !!(sc && CONFIG[sc.enabledKey]);
  }

  /* =======================================================================
     6. ALMACENAMIENTO LOCAL (con respaldo en memoria si no está disponible)
     ======================================================================= */
  const Store = (function () {
    const KEY = 'mision-evacuacion-8bit:v1';
    let available = false;
    let data = defaults();

    function defaults() {
      return { best: 0, history: [], completed: {}, prefs: {}, alias: '' };
    }
    // Valida los datos leídos para evitar estados inesperados.
    function sanitize(raw) {
      const d = defaults();
      if (!raw || typeof raw !== 'object') return d;
      d.best = clamp(Number(raw.best) || 0, 0, 100);
      if (Array.isArray(raw.history)) {
        d.history = raw.history.slice(0, 15).filter((h) => h && typeof h === 'object').map((h) => ({
          date: String(h.date || ''), mode: h.mode === 'training' ? 'training' : 'simulation',
          scenario: String(h.scenario || '').slice(0, 80), score: clamp(Number(h.score) || 0, 0, 100),
          level: String(h.level || '').slice(0, 40), time: Math.max(0, Number(h.time) || 0)
        }));
      }
      if (raw.completed && typeof raw.completed === 'object') {
        ['fire', 'quake', 'training'].forEach((k) => { if (raw.completed[k]) d.completed[k] = true; });
      }
      if (raw.prefs && typeof raw.prefs === 'object') {
        const p = raw.prefs;
        if (typeof p.sound === 'boolean') d.prefs.sound = p.sound;
        if (typeof p.reducedMotion === 'boolean') d.prefs.reducedMotion = p.reducedMotion;
        if (p.theme === 'dark' || p.theme === 'light') d.prefs.theme = p.theme;
        if (p.textSize === 'normal' || p.textSize === 'large') d.prefs.textSize = p.textSize;
      }
      if (typeof raw.alias === 'string') d.alias = raw.alias.slice(0, 20);
      return d;
    }
    function load() {
      try {
        const raw = window.localStorage.getItem(KEY);
        available = true;
        data = raw ? sanitize(JSON.parse(raw)) : defaults();
      } catch (err) {
        available = false;
        data = defaults();
      }
      return data;
    }
    function save() {
      try {
        window.localStorage.setItem(KEY, JSON.stringify(data));
        available = true;
        return true;
      } catch (err) {
        available = false;
        return false;
      }
    }
    function clear() {
      data = defaults();
      try { window.localStorage.removeItem(KEY); } catch (err) { available = false; }
    }
    return {
      load, save, clear,
      get data() { return data; },
      get available() { return available; }
    };
  })();

  /* =======================================================================
     7. SONIDO (Web Audio API). Nunca suena antes de una interacción.
     ======================================================================= */
  const Sound = (function () {
    let ctx = null;
    let master = null;
    let unavailable = false;
    const PATTERNS = {
      select: { type: 'square', vol: 0.035, notes: [[660, 0, 0.05]] },
      correct: { type: 'square', vol: 0.05, notes: [[523, 0, 0.09], [784, 0.1, 0.14]] },
      wrong: { type: 'triangle', vol: 0.07, notes: [[330, 0, 0.12], [247, 0.13, 0.18]] },
      start: { type: 'square', vol: 0.045, notes: [[392, 0, 0.08], [523, 0.09, 0.08], [659, 0.18, 0.12]] },
      hazard: { type: 'square', vol: 0.045, notes: [[880, 0, 0.07], [1175, 0.08, 0.09]] },
      arrive: { type: 'square', vol: 0.05, notes: [[523, 0, 0.1], [659, 0.11, 0.1], [784, 0.22, 0.16]] },
      complete: { type: 'square', vol: 0.05, notes: [[523, 0, 0.1], [659, 0.1, 0.1], [784, 0.2, 0.1], [1047, 0.32, 0.22]] },
      alarm: { type: 'triangle', vol: 0.05, notes: [[740, 0, 0.18], [554, 0.22, 0.18], [740, 0.44, 0.18], [554, 0.66, 0.18]] },
      quake: { type: 'sawtooth', vol: 0.04, notes: [[92, 0, 0.25], [78, 0.25, 0.3], [86, 0.55, 0.3]] }
    };
    function getContext() {
      if (!state.sound || unavailable) return null;
      try {
        if (!ctx) {
          const AC = window.AudioContext || window.webkitAudioContext;
          if (!AC) { unavailable = true; return null; }
          ctx = new AC();
          master = ctx.createGain();
          master.gain.value = 0.7;
          master.connect(ctx.destination);
        }
        if (ctx.state === 'suspended') ctx.resume().catch(() => { /* el navegador bloqueó el audio: hay alternativas visuales */ });
        return ctx;
      } catch (err) {
        unavailable = true;
        return null;
      }
    }
    function play(name) {
      const pattern = PATTERNS[name];
      const c = pattern ? getContext() : null;
      if (!c) return;
      try {
        const now = c.currentTime + 0.01;
        pattern.notes.forEach(([freq, start, dur]) => {
          const osc = c.createOscillator();
          const gain = c.createGain();
          osc.type = pattern.type;
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0.0001, now + start);
          gain.gain.exponentialRampToValueAtTime(pattern.vol, now + start + 0.012);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + start + dur);
          osc.connect(gain);
          gain.connect(master);
          osc.start(now + start);
          osc.stop(now + start + dur + 0.03);
        });
      } catch (err) {
        unavailable = true;
      }
    }
    return { play };
  })();

  /* =======================================================================
     8. ESTADO GENERAL
     ======================================================================= */
  const state = {
    screen: 'loading',       // pantalla actual
    previousScreen: 'menu',  // para el botón «Volver»
    mode: null,              // 'training' | 'simulation'
    selection: null,         // opción elegida en la selección de escenario
    scenarioKey: null,       // escenario efectivo de la simulación
    sound: true,
    reducedMotion: false,
    theme: 'dark',
    textSize: 'normal',
    alias: '',
    run: null,               // partida de simulación en curso (ver createRun)
    training: null,          // sesión de entrenamiento en curso
    lastResult: null         // último informe generado
  };
  let runCounter = 0;

  // Estado de una partida de simulación. Se crea de nuevo en cada inicio o reinicio.
  function createRun(key) {
    return {
      id: ++runCounter,
      scenarioKey: key,
      scenario: SCENARIOS[key],
      phase: key === 'fire' ? 'evacuacion' : 'antes',
      player: { x: START.x, y: START.y, fromX: START.x, fromY: START.y, t: 1, moving: false, dir: 'down', step: 0 },
      entities: [],
      overlay: new Map(),          // humo o elementos caídos por casilla
      triggers: [],
      triggersDone: new Set(),
      decisions: {},               // estado de cada decisión
      decisionLog: [],             // respuestas para la revisión
      pendingDecision: null,
      hazards: [],
      identified: new Set(),       // peligros identificados
      objectives: new Set(),       // objetivos completados
      penalties: [],
      penaltyOnce: new Set(),
      reentryAttempts: 0,
      risk: key === 'fire' ? 30 : 10,
      opportunities: MAX_OPPORTUNITIES,
      restarts: 0,
      time: 0,                     // tiempo activo en segundos
      paused: false,
      completed: false,
      hasExited: false,
      route: null,                 // ruta utilizada
      connector: null,
      blockedRoute: null,
      openConnector: null,
      followers: [],               // personas orientadas que te acompañan
      lastSafe: { x: START.x, y: START.y },
      events: [],                  // historial de eventos de la partida
      lastBump: 0,
      lastReentry: 0,
      anim: 0
    };
  }
  function logEvent(text) {
    const run = state.run;
    if (run) run.events.push({ time: run.time, text });
  }

  /* =======================================================================
     9. NAVEGACIÓN ENTRE PANTALLAS Y MODALES
     ======================================================================= */
  const SCREENS = ['loading', 'welcome', 'notice', 'menu', 'mode', 'scenario', 'howto', 'training', 'sim', 'report', 'history', 'settings', 'info', 'credits'];
  const SECONDARY = ['howto', 'history', 'settings', 'info', 'credits'];

  function showScreen(name) {
    if (!SCREENS.includes(name)) name = 'menu';
    if (state.screen !== 'sim' && name === 'sim') releaseAllDirs();
    if (state.screen === 'sim' && name !== 'sim') { stopLoop(); releaseAllDirs(); }
    if (SECONDARY.includes(name) && !SECONDARY.includes(state.screen)) state.previousScreen = state.screen;
    state.screen = name;
    document.body.setAttribute('data-screen', name);
    SCREENS.forEach((s) => { const node = $('screen-' + s); if (node) node.hidden = s !== name; });
    const header = $('appHeader');
    if (header) header.hidden = name === 'loading';
    // Preparación específica de cada pantalla.
    if (name === 'menu') renderMenu();
    if (name === 'scenario') renderScenarioOptions();
    if (name === 'history') renderHistory();
    if (name === 'settings') syncSettingsUI();
    const heading = $('h-' + name);
    if (heading && name !== 'sim') heading.focus({ preventScroll: false });
    window.scrollTo(0, 0);
  }
  function goBack() {
    const target = state.previousScreen && state.previousScreen !== state.screen ? state.previousScreen : 'menu';
    showScreen(['sim', 'training', 'loading'].includes(target) ? 'menu' : target);
  }

  // Pila de modales con foco atrapado y cierre con Escape.
  const modalStack = [];
  function openModal(id, opts) {
    const options = opts || {};
    const layer = $(id);
    if (!layer) return;
    const existing = modalStack.findIndex((m) => m.id === id);
    if (existing >= 0) modalStack.splice(existing, 1);
    const returnFocus = existing >= 0 ? null : document.activeElement;
    layer.hidden = false;
    layer.style.zIndex = String(100 + modalStack.length * 2);
    modalStack.push({ id, returnFocus, onEscape: options.onEscape || null });
    releaseAllDirs();
    const focusTarget = options.focus ? $(options.focus) : firstFocusable(layer);
    if (focusTarget) focusTarget.focus();
  }
  function closeModal(id) {
    const idx = modalStack.findIndex((m) => m.id === id);
    if (idx < 0) return;
    const entry = modalStack.splice(idx, 1)[0];
    const layer = $(id);
    if (layer) layer.hidden = true;
    if (modalStack.length) {
      const top = $(modalStack[modalStack.length - 1].id);
      const f = top ? firstFocusable(top) : null;
      if (entry.returnFocus && isVisible(entry.returnFocus)) entry.returnFocus.focus();
      else if (f) f.focus();
      return;
    }
    if (entry.returnFocus && isVisible(entry.returnFocus)) entry.returnFocus.focus();
    else if (state.screen === 'sim') { const map = $('mapWrap'); if (map) map.focus(); }
    else { const h = $('h-' + state.screen); if (h) h.focus(); }
    if (state.screen === 'sim') scheduleTriggerCheck();
  }
  function closeAllModals() {
    while (modalStack.length) {
      const entry = modalStack.pop();
      const layer = $(entry.id);
      if (layer) layer.hidden = true;
    }
    activeDecisionUI = null;
  }
  const isModalOpen = () => modalStack.length > 0;
  const topModal = () => modalStack[modalStack.length - 1] || null;

  function focusables(container) {
    return Array.from(container.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'))
      .filter((n) => n.offsetParent !== null);
  }
  function firstFocusable(container) {
    return focusables(container)[0] || null;
  }
  function trapFocus(e) {
    const top = topModal();
    const layer = top ? $(top.id) : null;
    if (!layer) return;
    const items = focusables(layer);
    if (!items.length) { e.preventDefault(); return; }
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && (document.activeElement === first || !layer.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && (document.activeElement === last || !layer.contains(document.activeElement))) { e.preventDefault(); first.focus(); }
  }

  // Ventana de confirmación reutilizable.
  let confirmHandlers = null;
  function confirmAction(opts) {
    setText('confirmTitle', opts.title || '¿Confirmas?');
    setText('confirmMessage', opts.message || '');
    setText('confirmYes', opts.confirmText || 'Sí');
    setText('confirmNo', opts.cancelText || 'Cancelar');
    confirmHandlers = { onConfirm: opts.onConfirm, onCancel: opts.onCancel };
    openModal('modal-confirm', { focus: 'confirmNo', onEscape: () => resolveConfirm(false) });
  }
  function resolveConfirm(accepted) {
    const handlers = confirmHandlers;
    confirmHandlers = null;
    closeModal('modal-confirm');
    if (!handlers) return;
    if (accepted && typeof handlers.onConfirm === 'function') handlers.onConfirm();
    if (!accepted && typeof handlers.onCancel === 'function') handlers.onCancel();
  }

  // Ventana de mensaje (inspecciones, diálogos y avisos).
  let messageHandler = null;
  function showMessage(opts) {
    const body = $('messageBody');
    const tag = $('messageTag');
    if (!body) return;
    setText('messageTitle', opts.title || 'Mensaje');
    if (tag) { tag.hidden = !opts.tag; tag.textContent = opts.tag || ''; }
    body.textContent = '';
    (Array.isArray(opts.body) ? opts.body : [opts.body]).forEach((item) => {
      if (!item) return;
      body.appendChild(typeof item === 'string' ? el('p', { text: item }) : item);
    });
    setText('messageOk', opts.okText || 'Continuar');
    messageHandler = opts.onClose || null;
    openModal('modal-message', { focus: 'messageTitle', onEscape: resolveMessage });
  }
  function resolveMessage() {
    const handler = messageHandler;
    messageHandler = null;
    closeModal('modal-message');
    if (typeof handler === 'function') handler();
  }

  // Avisos visuales + región viva para lectores de pantalla.
  function announce(message, opts) {
    const options = opts || {};
    const live = $(options.assertive ? 'liveAssertive' : 'livePolite');
    if (live) {
      live.textContent = '';
      window.setTimeout(() => { live.textContent = message; }, 40);
    }
    if (options.toast === false) return;
    const area = $('toastArea');
    if (!area) return;
    const toast = el('div', { className: 'toast' + (options.type ? ' toast-' + options.type : ''), text: message });
    area.appendChild(toast);
    while (area.children.length > 3) area.removeChild(area.firstChild);
    window.setTimeout(() => { if (toast.parentNode) toast.parentNode.removeChild(toast); }, options.duration || 3800);
  }

  /* =======================================================================
     10. ACCESIBILIDAD Y PREFERENCIAS
     ======================================================================= */
  function loadPreferences() {
    const data = Store.load();
    const p = data.prefs;
    let prefersReduced = false;
    try { prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (err) { prefersReduced = false; }
    state.sound = typeof p.sound === 'boolean' ? p.sound : !!CONFIG.soundEnabled;
    state.reducedMotion = typeof p.reducedMotion === 'boolean' ? p.reducedMotion : (!!CONFIG.reducedMotionDefault || prefersReduced);
    state.theme = p.theme || (CONFIG.defaultTheme === 'light' ? 'light' : 'dark');
    state.textSize = p.textSize || 'normal';
    state.alias = data.alias || '';
  }
  function savePreferences() {
    const data = Store.data;
    data.prefs = { sound: state.sound, reducedMotion: state.reducedMotion, theme: state.theme, textSize: state.textSize };
    data.alias = state.alias;
    Store.save();
  }
  function applyPreferences() {
    const root = document.documentElement;
    root.setAttribute('data-theme', state.theme);
    root.setAttribute('data-text', state.textSize);
    root.classList.toggle('reduce-motion', state.reducedMotion);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', state.theme === 'light' ? '#e8e2d0' : '#121826');
    setText('chipSoundValue', state.sound ? 'Sí' : 'No');
    setText('chipMotionValue', state.reducedMotion ? 'Reducido' : 'Normal');
    const chipSound = $('chipSound');
    if (chipSound) chipSound.setAttribute('aria-pressed', String(state.sound));
    const chipMotion = $('chipMotion');
    if (chipMotion) chipMotion.setAttribute('aria-pressed', String(state.reducedMotion));
    setText('pauseSoundBtn', 'Sonido: ' + (state.sound ? 'Sí (desactivar)' : 'No (activar)'));
    syncSettingsUI();
    updateHeaderBest();
  }
  function toggleSound() {
    state.sound = !state.sound;
    savePreferences();
    applyPreferences();
    if (state.sound) Sound.play('select');
    announce(state.sound ? 'Sonido activado.' : 'Sonido desactivado. Los avisos seguirán apareciendo en pantalla.');
  }
  function toggleMotion() {
    state.reducedMotion = !state.reducedMotion;
    savePreferences();
    applyPreferences();
    announce(state.reducedMotion ? 'Movimiento reducido activado: sin vibración ni animaciones.' : 'Movimiento normal activado.');
  }
  function applyInstitutionalTexts() {
    const root = document.documentElement;
    const colors = CONFIG.themeColors || {};
    ['accent', 'safe', 'danger'].forEach((k) => { if (colors[k]) root.style.setProperty('--' + k, colors[k]); });
    setText('headerOrg', CONFIG.organizationName);
    setText('headerSubtitle', CONFIG.gameSubtitle);
    setText('headerTitle', CONFIG.gameTitle.toUpperCase());
    setText('welcomeOrg', CONFIG.organizationName);
    setText('creditsOrg', CONFIG.organizationName);
    setText('infoMeetingPoint', CONFIG.meetingPoint);
    setText('infoContact', CONFIG.emergencyContact);
    document.title = CONFIG.gameTitle + ': ' + CONFIG.gameSubtitle;
    const badge = $('logoBadge');
    if (badge) {
      badge.textContent = (CONFIG.logoText || 'SG').slice(0, 3);
      if (CONFIG.logoImage) {
        const img = el('img', { src: CONFIG.logoImage, alt: 'Logo de ' + CONFIG.organizationName });
        img.addEventListener('error', () => { badge.textContent = (CONFIG.logoText || 'SG').slice(0, 3); badge.setAttribute('aria-hidden', 'true'); });
        badge.textContent = '';
        badge.removeAttribute('aria-hidden');
        badge.appendChild(img);
      }
    }
  }
  function updateHeaderBest() {
    const best = Store.data.best;
    setText('chipBestValue', best > 0 ? best + '/100' : '—');
  }

  /* =======================================================================
     11. INTERFAZ DE DECISIÓN (compartida por entrenamiento y simulación)
     ======================================================================= */
  let activeDecisionUI = null;

  /**
   * Dibuja una situación de decisión dentro de un contenedor.
   * cfg = { decision, ctx, titleId, progress, evaluate(opt) → resultado,
   *         onContinue(), onRetry(), retryLabel, allowContinueOnError }
   */
  function renderDecisionUI(container, cfg) {
    if (!container || !cfg || !cfg.decision) return;
    const d = cfg.decision;
    const ctx = cfg.ctx || null;
    container.textContent = '';
    const meta = el('div', { className: 'decision-meta' }, [
      el('span', { className: 'tag tag-accent', text: d.theme }),
      cfg.progress ? el('span', { className: 'tag', text: cfg.progress }) : null
    ]);
    const title = el('h2', { className: 'decision-title', id: cfg.titleId, tabindex: '-1', text: txt(d.title, ctx) });
    const speaker = d.speaker ? el('p', { className: 'decision-speaker', text: 'Interlocutor: ' + d.speaker }) : null;
    const context = el('p', { className: 'decision-context', text: txt(d.context, ctx) });
    const question = el('p', { className: 'decision-question', text: txt(d.question, ctx) });
    const list = el('ul', { className: 'options', 'aria-label': 'Opciones de respuesta. Usa las teclas 1 a 4 o Tab y Enter.' });
    const feedbackBox = el('div', { className: 'feedback' });
    const options = shuffle(d.options);
    const ui = { container, options, answered: false, lastSafe: false, choose: null };

    ui.choose = function choose(opt) {
      if (ui.answered) return;
      ui.answered = true;
      ui.lastSafe = !!opt.safe;
      const result = cfg.evaluate(opt) || {};
      Sound.play(opt.safe ? 'correct' : 'wrong');
      list.remove();
      renderFeedback(feedbackBox, d, opt, result, ctx, cfg, container);
    };

    options.forEach((opt, i) => {
      const btn = el('button', { type: 'button', className: 'option-btn' }, [
        el('span', { className: 'option-key', 'aria-hidden': 'true', text: LETTERS[i] }),
        el('span', { text: txt(opt.text, ctx) })
      ]);
      btn.setAttribute('aria-label', 'Opción ' + LETTERS[i] + ': ' + txt(opt.text, ctx));
      btn.addEventListener('click', () => ui.choose(opt));
      list.appendChild(el('li', null, [btn]));
    });
    container.append(meta, title);
    if (speaker) container.append(speaker);
    container.append(context, question, list, feedbackBox);
    activeDecisionUI = ui;
  }

  function renderFeedback(box, d, opt, result, ctx, cfg, container) {
    const safeOpt = d.options.find((o) => o.safe);
    const verdict = el('p', { className: 'verdict ' + (opt.safe ? 'verdict-safe' : 'verdict-warn'), id: (cfg.titleId || 'd') + '-verdict', tabindex: '-1' }, [
      el('span', { className: 'verdict-icon', 'aria-hidden': 'true', text: opt.safe ? '✔' : '✖' }),
      opt.safe ? 'Decisión segura' : 'Decisión por reforzar'
    ]);
    const items = el('div', { className: 'fb-grid' }, [
      fbItem('Tu respuesta', txt(opt.text, ctx) + ' — ' + opt.feedback),
      fbItem('Respuesta recomendada', txt(safeOpt.text, ctx)),
      fbItem('Explicación', txt(d.explanation, ctx)),
      fbItem('Riesgo que se evita', txt(d.riskAvoided, ctx))
    ]);
    const stats = el('div', { className: 'fb-stats' }, [
      el('span', { className: 'tag', text: 'Puntos obtenidos: ' + (result.pointsText || '0') }),
      result.riskText ? el('span', { className: 'tag', text: 'Nivel de riesgo: ' + result.riskText }) : null,
      el('span', { className: 'tag', text: 'Categoría: ' + d.theme })
    ]);
    box.append(verdict, items, stats);
    if (result.extra) box.append(el('p', { className: 'callout', text: result.extra }));
    box.append(el('p', { className: 'protocol-note', text: PROTOCOL_NOTE }));

    const row = el('div', { className: 'button-row' });
    const continueBtn = el('button', { type: 'button', className: 'btn btn-primary', text: 'Continuar ▶' });
    continueBtn.addEventListener('click', () => { Sound.play('select'); cfg.onContinue(); });
    if (opt.safe) {
      row.append(continueBtn);
    } else {
      const retryBtn = el('button', { type: 'button', className: 'btn ' + (cfg.allowContinueOnError ? '' : 'btn-primary'), text: '↻ ' + (cfg.retryLabel || 'Intentar nuevamente') });
      retryBtn.addEventListener('click', () => {
        Sound.play('select');
        if (typeof cfg.onRetry === 'function') cfg.onRetry();
        renderDecisionUI(container, cfg);
        const t = $(cfg.titleId);
        if (t) t.focus();
      });
      row.append(retryBtn);
      if (cfg.allowContinueOnError) row.append(continueBtn);
    }
    box.append(row);
    verdict.focus();
  }
  function fbItem(label, value) {
    return el('div', { className: 'fb-item' }, [el('span', { className: 'fb-label', text: label }), el('span', { text: value })]);
  }
  function decisionUIVisible() {
    if (!activeDecisionUI || activeDecisionUI.answered) return false;
    const c = activeDecisionUI.container;
    if (c.id === 'decisionBody') { const top = topModal(); return !!top && top.id === 'modal-decision'; }
    return state.screen === 'training' && !isModalOpen();
  }

  /* =======================================================================
     12. MODO ENTRENAMIENTO
     ======================================================================= */
  const TOPIC_NAMES = { fire: 'Incendio', quake: 'Sismo', mixed: 'Mixto' };

  function startTraining(topic) {
    const t = TOPIC_NAMES[topic] ? topic : 'mixed';
    const pool = TRAINING_BANK.filter((q) => {
      if (q.scenario === 'fire' && !CONFIG.enableFireScenario) return false;
      if (q.scenario === 'quake' && !CONFIG.enableEarthquakeScenario) return false;
      return t === 'mixed' || q.scenario === t || q.scenario === 'general';
    });
    if (!pool.length) { showMessage({ title: 'Sin preguntas disponibles', body: 'Revisa la configuración de escenarios.' }); return; }
    const n = Math.min(Math.max(1, CONFIG.trainingQuestionsPerSession | 0), pool.length);
    state.training = {
      topic: t, questions: shuffle(pool).slice(0, n), index: 0, score: 0,
      perQuestion: 100 / n, results: [], startTime: performance.now(), reentry: 0, finished: false
    };
    showScreen('training');
    renderTrainingQuestion();
  }

  function renderTrainingQuestion() {
    const t = state.training;
    if (!t) return;
    const q = t.questions[t.index];
    const total = t.questions.length;
    setText('trainingProgressText', 'Situación ' + (t.index + 1) + ' de ' + total);
    const fill = $('trainingProgressFill');
    if (fill) fill.style.width = (t.index / total * 100) + '%';
    setText('trainingScore', String(Math.round(t.score)));
    const record = { decision: q, attempts: 0, firstSafe: null, firstText: '', scored: false };
    renderDecisionUI($('trainingCard'), {
      decision: q, ctx: null, titleId: 'trainingQTitle',
      progress: 'Situación ' + (t.index + 1) + '/' + total,
      allowContinueOnError: true,
      retryLabel: 'Intentar nuevamente',
      evaluate(opt) {
        record.attempts++;
        if (record.attempts === 1) { record.firstSafe = !!opt.safe; record.firstText = txt(opt.text, null); }
        if (opt.reentry) t.reentry++;
        let pts = 0;
        if (opt.safe && !record.scored) {
          pts = record.attempts === 1 ? t.perQuestion : t.perQuestion / 2;
          record.scored = true;
          t.score = clamp(t.score + pts, 0, 100);
        }
        setText('trainingScore', String(Math.round(t.score)));
        return {
          pointsText: opt.safe ? '+' + fmt1(pts) + (record.attempts > 1 ? ' (segundo intento: la mitad del valor)' : '') : '0',
          extra: opt.safe ? null : 'Puedes intentarlo nuevamente o continuar con la siguiente situación.'
        };
      },
      onContinue() {
        if (!t.results.includes(record)) t.results.push(record);
        t.index++;
        if (t.index >= t.questions.length) finishTraining();
        else { renderTrainingQuestion(); const h = $('trainingQTitle'); if (h) h.focus(); }
      }
    });
    const h = $('trainingQTitle');
    if (h) h.focus();
  }

  function finishTraining() {
    const t = state.training;
    if (!t || t.finished) return;
    t.finished = true;
    activeDecisionUI = null;
    Sound.play('complete');
    showReport(buildTrainingResult(t));
  }

  function exitTraining() {
    const t = state.training;
    const leave = () => { state.training = null; activeDecisionUI = null; showScreen('menu'); };
    if (t && !t.finished && (t.index > 0 || t.results.length)) {
      confirmAction({ title: 'Salir del entrenamiento', message: 'Perderás el progreso de esta sesión. ¿Deseas volver al menú?', confirmText: 'Salir', onConfirm: leave });
    } else leave();
  }

  /* =======================================================================
     13. SIMULACIÓN: PREPARACIÓN Y EVENTOS ALEATORIOS
     ======================================================================= */
  const tileAt = (x, y) => (x < 0 || y < 0 || x >= COLS || y >= ROWS ? '#' : MAP[y][x]);
  const inZone = (z, x, y) => x >= z.x1 && x <= z.x2 && y >= z.y1 && y <= z.y2;

  function solidEntityAt(run, x, y) {
    return run.entities.find((e) => e.solid && e.x === x && e.y === y) || null;
  }
  function npcById(run, id) {
    return run.entities.find((e) => e.kind === 'npc' && e.npc === id) || null;
  }
  function occupied(run, x, y) {
    return run.entities.some((e) => e.x === x && e.y === y) || run.overlay.has(keyOf(x, y)) || (x === START.x && y === START.y);
  }
  // Casilla transitable para el cálculo de rutas.
  function walkableForPath(run, x, y, avoidLight) {
    if (!PASSABLE.has(tileAt(x, y))) return false;
    if (solidEntityAt(run, x, y)) return false;
    const ov = run.overlay.get(keyOf(x, y));
    if (ov && (ov.level === 2 || (avoidLight && ov.level === 1))) return false;
    return true;
  }
  // Búsqueda en anchura: devuelve la lista de direcciones o null.
  function findPath(run, from, to, opts) {
    const options = opts || {};
    const start = keyOf(from.x, from.y);
    const prev = new Map([[start, null]]);
    const queue = [{ x: from.x, y: from.y }];
    const dirs = [['up', 0, -1], ['down', 0, 1], ['left', -1, 0], ['right', 1, 0]];
    while (queue.length) {
      const cur = queue.shift();
      const reached = options.adjacent ? chebyshev(cur, to) <= 1 && !(cur.x === to.x && cur.y === to.y) : (cur.x === to.x && cur.y === to.y);
      if (reached) {
        const path = [];
        let k = keyOf(cur.x, cur.y);
        while (prev.get(k)) { const p = prev.get(k); path.unshift(p.dir); k = p.from; }
        return path;
      }
      for (const [dir, dx, dy] of dirs) {
        const nx = cur.x + dx;
        const ny = cur.y + dy;
        const k = keyOf(nx, ny);
        if (prev.has(k)) continue;
        if (!walkableForPath(run, nx, ny, options.avoidLight)) continue;
        prev.set(k, { from: keyOf(cur.x, cur.y), dir });
        queue.push({ x: nx, y: ny });
      }
    }
    return null;
  }
  // Garantiza que siempre exista una ruta válida hasta el punto de encuentro.
  // strict = true exige una ruta que no obligue a pisar humo leve ni elementos caídos.
  function routeIsValid(run, strict) {
    return findPath(run, { x: run.player.x, y: run.player.y }, MEETING_TARGET, { avoidLight: !!strict }) !== null;
  }
  function ensureValidRoute(run) {
    if (routeIsValid(run)) return;
    run.entities = run.entities.filter((e) => e.kind !== 'obstacle');
    if (routeIsValid(run)) return;
    run.entities = run.entities.filter((e) => !(e.kind === 'hazard' && !e.wall));
    run.hazards = run.entities.filter((e) => e.kind === 'hazard');
  }

  function addSigns(run) {
    SIGNS.forEach((s) => run.entities.push({ kind: 'sign', x: s.x, y: s.y, dir: s.dir, solid: false, label: 'Señal de evacuación' }));
    run.entities.push({ kind: 'workstation', x: WORKSTATION.x, y: WORKSTATION.y, solid: false, label: 'Tu puesto de trabajo' });
  }
  function addNpc(run, npc, x, y) {
    const info = NPC_INFO[npc];
    const entity = { kind: 'npc', npc, x, y, fromX: x, fromY: y, solid: true, label: info.role, line: info.line };
    run.entities.push(entity);
    return entity;
  }
  function addClosure(run, connector) {
    const cells = connector === 'west' ? [{ x: 1, y: 10 }, { x: 2, y: 10 }] : [{ x: 7, y: 10 }];
    cells.forEach((c) => run.entities.push({ kind: 'obstacle', x: c.x, y: c.y, solid: true, label: 'Paso cerrado temporalmente' }));
  }
  function setOverlay(run, kind, level, x1, x2, y1, y2) {
    for (let y = y1; y <= y2; y++) {
      for (let x = x1; x <= x2; x++) run.overlay.set(keyOf(x, y), { kind, level });
    }
  }
  // Ubica una persona en una de las posiciones candidatas sin bloquear la ruta.
  function placeNpcSafely(run, npc, candidates) {
    for (const c of shuffle(candidates)) {
      if (occupied(run, c.x, c.y)) continue;
      const entity = addNpc(run, npc, c.x, c.y);
      if (routeIsValid(run, true)) return entity;
      run.entities.splice(run.entities.indexOf(entity), 1);
    }
    return null;
  }
  // Selecciona y ubica peligros de forma aleatoria, verificando la ruta.
  function placeHazards(run, pool, count) {
    shuffle(pool).slice(0, count).forEach((def) => {
      for (const pos of shuffle(def.positions)) {
        if (run.entities.some((e) => e.x === pos.x && e.y === pos.y && e.kind !== 'workstation')) continue;
        if (!def.wall && occupied(run, pos.x, pos.y)) continue;
        const h = { kind: 'hazard', hazardId: def.id, type: def.type, label: def.label, info: def.info, action: def.action, wall: !!def.wall, x: pos.x, y: pos.y, solid: !def.wall };
        run.entities.push(h);
        if (!h.solid || routeIsValid(run, true)) { run.hazards.push(h); return; }
        run.entities.splice(run.entities.indexOf(h), 1);
      }
    });
  }
  function laneCandidates(cols, rows) {
    const out = [];
    cols.forEach((x) => rows.forEach((y) => out.push({ x, y })));
    return out;
  }

  // Escenario de incendio: humo en el corredor principal, paso abierto aleatorio.
  function setupFire(run) {
    addSigns(run);
    run.blockedRoute = 'main';
    run.openConnector = pick(['west', 'central']);
    const denseStart = pick([11, 12]);
    setOverlay(run, 'smoke', 2, denseStart, 17, 7, 8);
    setOverlay(run, 'smoke', 1, denseStart - 2, denseStart - 1, 7, 8);
    setOverlay(run, 'smoke', 2, 13, 13, 6, 6);
    addClosure(run, run.openConnector === 'west' ? 'central' : 'west');
    addNpc(run, 'brigade', run.openConnector === 'west' ? 4 : 8, 14);
    placeNpcSafely(run, 'visitor', laneCandidates([9, 10, 11, 12], [13, 14]));
    addNpc(run, 'coworker', 19, 13);
    addNpc(run, 'informant', 22, 4);
    addNpc(run, 'responsible', 20, 2);
    placeHazards(run, HAZARD_POOLS.fire, 5);
    ensureValidRoute(run);
    const westZone = { x1: 1, y1: 7, x2: 8, y2: 8 };
    run.triggers = [
      { id: 'fire_alarm', when: 'start' },
      { id: 'fire_smoke', when: 'zone', zone: westZone, requires: ['fire_alarm'] },
      { id: 'fire_elevator', when: 'zone', zone: { x1: 1, y1: 8, x2: 7, y2: 8 }, requires: ['fire_smoke'] },
      { id: 'fire_brigade', when: 'zone', zone: { x1: 1, y1: 13, x2: 8, y2: 14 }, requires: ['fire_elevator'], npc: 'brigade' },
      { id: 'fire_visitor', when: 'near', npc: 'visitor', requires: ['fire_alarm'] },
      { id: 'fire_coworker', when: 'near', npc: 'coworker', requires: ['fire_alarm'] },
      { id: 'fire_news', when: 'zone', zone: MEETING_ZONE, requires: ['fire_alarm'], npc: 'informant' },
      { id: 'fire_report', when: 'zone', zone: MEETING_ZONE, requires: ['fire_news'], npc: 'responsible' },
      { id: 'fire_return', when: 'zone', zone: MEETING_ZONE, requires: ['fire_report'], npc: 'responsible' }
    ];
    logEvent('Inicio del escenario de incendio. Paso habilitado: ' + (run.openConnector === 'west' ? 'occidental' : 'central') + '.');
  }

  // Escenario de sismo: fase «Antes» con peligros aleatorios.
  function setupQuake(run) {
    addSigns(run);
    placeHazards(run, HAZARD_POOLS.quake, 5);
    ensureValidRoute(run);
    const corridor = { x1: 1, y1: 7, x2: 7, y2: 8 };
    run.triggers = [
      { id: 'quake_during_1', when: 'phase', phase: 'durante' },
      { id: 'quake_during_2', when: 'phase', phase: 'durante', requires: ['quake_during_1'] },
      { id: 'quake_during_3', when: 'phase', phase: 'durante', requires: ['quake_during_2'] },
      { id: 'quake_after', when: 'phase', phase: 'despues' },
      { id: 'quake_elevator', when: 'zone', phase: 'despues', zone: corridor, requires: ['quake_after'] },
      { id: 'quake_brigade', when: 'zone', phase: 'despues', zone: corridor, requires: ['quake_elevator'], npc: 'brigade' },
      { id: 'quake_visitor', when: 'near', phase: 'despues', npc: 'visitor', requires: ['quake_after'] },
      { id: 'quake_coworker', when: 'near', phase: 'despues', npc: 'coworker', requires: ['quake_after'] },
      { id: 'quake_news', when: 'zone', phase: 'despues', zone: MEETING_ZONE, requires: ['quake_after'], npc: 'informant' },
      { id: 'quake_report', when: 'zone', phase: 'despues', zone: MEETING_ZONE, requires: ['quake_news'], npc: 'responsible' },
      { id: 'quake_return', when: 'zone', phase: 'despues', zone: MEETING_ZONE, requires: ['quake_report'], npc: 'responsible' }
    ];
    logEvent('Inicio del escenario de sismo: fase Antes.');
  }

  // Fase «Después»: elementos caídos y ruta bloqueada aleatoria.
  function setupQuakeAfter(run) {
    run.phase = 'despues';
    run.blockedRoute = pick(['main', 'alt']);
    if (run.blockedRoute === 'main') {
      setOverlay(run, 'debris', 2, 12, 13, 7, 8);
      [[9, 14], [12, 13], [1, 3]].forEach(([x, y]) => { if (!occupied(run, x, y)) run.overlay.set(keyOf(x, y), { kind: 'debris', level: 1 }); });
      run.openConnector = pick(['west', 'central']);
      addClosure(run, run.openConnector === 'west' ? 'central' : 'west');
    } else {
      setOverlay(run, 'debris', 2, 10, 11, 13, 14);
      [[9, 8], [14, 7], [1, 3]].forEach(([x, y]) => { if (!occupied(run, x, y)) run.overlay.set(keyOf(x, y), { kind: 'debris', level: 1 }); });
    }
    addNpc(run, 'brigade', 6, 8);
    const visitorRows = run.blockedRoute === 'main' ? [13, 14] : [7, 8];
    placeNpcSafely(run, 'visitor', laneCandidates([9, 10, 11, 12], visitorRows));
    addNpc(run, 'coworker', 19, run.blockedRoute === 'main' ? 13 : 7);
    addNpc(run, 'informant', 22, 4);
    addNpc(run, 'responsible', 20, 2);
    ensureValidRoute(run);
    const brigade = npcById(run, 'brigade');
    if (brigade) brigade.line = 'Evacúa por la ' + quakeRouteLabel(run) + ' y evita los elementos caídos.';
    logEvent('Fase Después. Ruta habilitada: ' + (run.blockedRoute === 'main' ? 'alterna' : 'principal') + '.');
  }

  function startSimulation(key) {
    if (!SCENARIOS[key] || !scenarioEnabled(key)) {
      showMessage({ title: 'Escenario no disponible', body: 'Selecciona un escenario habilitado para comenzar.' });
      return;
    }
    stopLoop();
    closeAllModals();
    state.training = null;
    state.scenarioKey = key;
    state.run = createRun(key);
    if (key === 'fire') setupFire(state.run); else setupQuake(state.run);
    lastGuideText = '';
    lastPromptText = null;
    showScreen('sim');
    updateHUD();
    startLoop();
    showBriefing(state.run);
  }

  function showBriefing(run) {
    const sc = run.scenario;
    const controls = 'Controles: flechas o W A S D para moverte, E o Espacio para interactuar, P o Esc para pausar.';
    const body = run.scenarioKey === 'fire'
      ? [
        'Lugar: ' + CONFIG.buildingName + '.',
        'Durante una jornada aparentemente normal se activa la ' + CONFIG.alarmTypes.fire + ' y se observa humo.',
        'Tu misión: reconocer la alarma, evitar la ruta peligrosa, usar la ruta alterna, orientar a quien lo necesite, llegar al ' + CONFIG.meetingPoint + ', reportarte y esperar instrucciones.',
        'No hay límite estricto de tiempo: la calidad de tus decisiones vale más que la velocidad.',
        controls
      ]
      : [
        'Lugar: ' + CONFIG.buildingName + '.',
        'Fase ANTES: recorre tu área e identifica al menos 3 condiciones inseguras (marcadas con ⚠). Acércate y presiona E para inspeccionarlas.',
        'Cuando termines la inspección, vuelve a tu puesto de trabajo y presiona E. Entonces comenzará el sismo.',
        state.reducedMotion ? 'La reducción de movimiento está activa: el sismo se mostrará sin vibración.' : 'El sismo incluye una vibración moderada de la pantalla; puedes desactivarla con el botón «Movimiento».',
        controls
      ];
    showMessage({
      tag: 'Misión', title: sc.name, body, okText: 'Comenzar misión ▶',
      onClose: () => {
        Sound.play('start');
        if (run.scenarioKey === 'fire') window.setTimeout(() => Sound.play('alarm'), 420);
        logEvent('Misión iniciada.');
      }
    });
  }

  /* =======================================================================
     14. SIMULACIÓN: MOVIMIENTO, COLISIONES E INTERACCIONES
     ======================================================================= */
  const DIRS = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } };
  const heldDirs = [];

  function canControl() {
    const run = state.run;
    return !!run && state.screen === 'sim' && !run.paused && !run.completed && !isModalOpen();
  }
  function holdDir(dir) {
    if (!DIRS[dir]) return;
    const i = heldDirs.indexOf(dir);
    if (i >= 0) heldDirs.splice(i, 1);
    heldDirs.push(dir);
    tryMove(dir);
  }
  function releaseDir(dir) {
    const i = heldDirs.indexOf(dir);
    if (i >= 0) heldDirs.splice(i, 1);
    document.querySelectorAll('.dpad-btn[data-dir="' + dir + '"]').forEach((b) => b.classList.remove('is-held'));
  }
  function releaseAllDirs() {
    heldDirs.length = 0;
    document.querySelectorAll('.dpad-btn.is-held').forEach((b) => b.classList.remove('is-held'));
  }

  function tryMove(dir) {
    const run = state.run;
    if (!canControl()) return;
    if (run.pendingDecision) { openSimDecision(run.pendingDecision); return; }
    if (run.phase === 'durante') { throttledNotice('Mantén la acción de protección: no te desplaces mientras dura el movimiento.'); return; }
    const p = run.player;
    if (p.moving) return;
    p.dir = dir;
    const nx = p.x + DIRS[dir].x;
    const ny = p.y + DIRS[dir].y;
    if (!canEnter(run, nx, ny)) return;
    const oldX = p.x;
    const oldY = p.y;
    p.fromX = oldX; p.fromY = oldY;
    p.x = nx; p.y = ny;
    p.t = 0;
    p.moving = true;
    p.step ^= 1;
    moveFollowers(run, oldX, oldY);
  }

  // Colisiones: paredes, humo denso, obstáculos, personas y reingreso.
  function canEnter(run, nx, ny) {
    if (nx < 0 || ny < 0 || nx >= COLS || ny >= ROWS) return false;
    const current = tileAt(run.player.x, run.player.y);
    const tile = tileAt(nx, ny);
    if (run.hasExited && (current === 'g' || current === 'P') && (tile === 'E' || tile === 'A')) {
      registerReentry(run);
      return false;
    }
    if (!PASSABLE.has(tile)) { bumpTile(tile); return false; }
    const ov = run.overlay.get(keyOf(nx, ny));
    if (ov && ov.level === 2) { bumpOverlay(run, ov); return false; }
    const ent = solidEntityAt(run, nx, ny);
    if (ent) { bumpEntity(ent); return false; }
    return true;
  }
  function throttledNotice(message, type) {
    const run = state.run;
    const now = performance.now();
    if (!run || now - run.lastBump < 1100) return false;
    run.lastBump = now;
    announce(message, { type: type || 'warn' });
    return true;
  }
  function bumpTile(tile) {
    const messages = {
      L: 'Ascensor: según el protocolo configurado para esta simulación, no se usa durante la evacuación.',
      X: 'Esta puerta conduce a un depósito: no es una salida. Sigue la señalización.',
      f: 'Permanece en la zona exterior segura, cerca del punto de encuentro.'
    };
    if (messages[tile]) throttledNotice(messages[tile]);
  }
  function bumpOverlay(run, ov) {
    if (ov.kind === 'smoke') {
      if (addPenalty('smoke_dense', 2, 'Intentó avanzar hacia el humo denso.', true)) changeRisk(5);
      throttledNotice('No puedes atravesar el humo denso. La velocidad no reemplaza una decisión segura: consulta la ruta alternativa.');
    } else {
      throttledNotice('Paso bloqueado por elementos caídos. Usa la ruta habilitada.');
    }
  }
  function bumpEntity(ent) {
    if (ent.kind === 'npc') throttledNotice('Presiona E para hablar con: ' + ent.label + '.', 'info');
    else if (ent.kind === 'obstacle') throttledNotice('Paso cerrado temporalmente. Consulta la ruta alternativa y la señalización.');
    else if (ent.kind === 'hazard') throttledNotice('Hay un objeto en el camino: ' + ent.label + '. Rodéalo con cuidado o presiona E para inspeccionarlo.');
  }
  function registerReentry(run) {
    const now = performance.now();
    if (now - run.lastReentry < 1500) return;
    run.lastReentry = now;
    run.reentryAttempts++;
    addPenalty('reentry', 4, 'Intentó regresar al edificio sin autorización.', false);
    changeRisk(10);
    Sound.play('wrong');
    announce('No regreses al edificio sin autorización del personal de emergencias. Dirígete al punto de encuentro.', { type: 'warn', assertive: true });
    updateHUD();
  }
  // Las personas orientadas siguen al jugador (no bloquean el paso).
  function moveFollowers(run, oldX, oldY) {
    let px = oldX;
    let py = oldY;
    run.followers.forEach((f) => {
      const ox = f.x;
      const oy = f.y;
      f.fromX = ox; f.fromY = oy;
      f.x = px; f.y = py;
      px = ox; py = oy;
    });
  }
  function addFollower(run, npcId) {
    const npc = npcById(run, npcId);
    if (!npc || run.followers.includes(npc)) return;
    npc.solid = false;
    npc.fromX = npc.x; npc.fromY = npc.y;
    run.followers.push(npc);
  }

  // Al terminar un paso: humo leve, objetivos, salidas y disparadores.
  function onStepComplete(run) {
    const { x, y } = run.player;
    const tile = tileAt(x, y);
    const ov = run.overlay.get(keyOf(x, y));
    if (ov && ov.level === 1) {
      const isSmoke = ov.kind === 'smoke';
      addPenalty(isSmoke ? 'smoke_light' : 'debris_light', 3, isSmoke ? 'Atravesó una zona con humo.' : 'Pasó por una zona con elementos caídos.', false);
      changeRisk(10);
      Sound.play('wrong');
      announce(isSmoke ? 'Esta decisión incrementó el riesgo: evita el humo y consulta la ruta alternativa.' : 'Esta decisión incrementó el riesgo: evita las zonas con elementos caídos.', { type: 'warn' });
    }
    if (y >= 9 && y <= 12) run.connector = x <= 2 ? 'occidental' : (x === 7 ? 'central' : run.connector);
    if (run.scenarioKey === 'fire' && y >= 13 && y <= 14 && !run.objectives.has('alt')) completeObjective(run, 'alt');
    if (tile === 'S' && !run.objectives.has('signs')) completeObjective(run, 'signs');
    if ((tile === 'E' || tile === 'A') && !run.route) {
      run.route = tile === 'E' ? 'main' : 'alt';
      completeObjective(run, 'route');
      logEvent('Salió por la ' + (tile === 'E' ? 'salida principal' : 'salida alterna') + '.');
      announce('Saliste por la ' + (tile === 'E' ? 'salida principal' : 'salida alterna') + '. Dirígete al ' + CONFIG.meetingPoint + '.', { type: 'ok' });
    }
    if ((tile === 'g' || tile === 'P') && !run.hasExited) run.hasExited = true;
    if (tile === 'P' && !run.objectives.has('meeting')) {
      completeObjective(run, 'meeting');
      Sound.play('arrive');
      announce('Llegaste al ' + CONFIG.meetingPoint + '.', { type: 'ok' });
    }
    updateHUD();
    checkTriggers();
  }
  function completeObjective(run, id) {
    if (run.objectives.has(id)) return;
    run.objectives.add(id);
    const def = run.scenario.objectives.find((o) => o.id === id);
    if (def) logEvent('Objetivo completado: ' + def.label + '.');
  }

  // Interacción por proximidad (casillas vecinas, incluidas diagonales).
  function findInteractable(run) {
    const p = run.player;
    const found = [];
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const x = p.x + dx;
        const y = p.y + dy;
        run.entities.forEach((e) => {
          if (e.x !== x || e.y !== y) return;
          if (e.kind === 'npc' && run.followers.includes(e)) return;
          let priority = 1;
          if (e.kind === 'npc') priority = npcHasAvailableTrigger(run, e.npc) ? 10 : 5;
          else if (e.kind === 'hazard') priority = run.identified.has(e.hazardId) ? 2 : (hazardInspectable(run) ? 8 : 2);
          else if (e.kind === 'workstation') priority = run.phase === 'antes' ? 7 : 2;
          else if (e.kind === 'sign') priority = 1;
          found.push({ priority, entity: e, label: interactLabel(run, e) });
        });
        const tile = tileAt(x, y);
        if (['L', 'X', 'K', 'B'].includes(tile) && !found.some((f) => f.entity.x === x && f.entity.y === y && f.entity.kind === 'hazard')) {
          const names = { L: 'Ascensor', X: 'Puerta de depósito', K: 'Extintor', B: 'Botiquín' };
          found.push({ priority: tile === 'L' && elevatorTriggerAvailable(run) ? 9 : 3, entity: { kind: 'tile', tile, x, y, label: names[tile] }, label: 'revisar: ' + names[tile] });
        }
      }
    }
    found.sort((a, b) => b.priority - a.priority);
    return found[0] || null;
  }
  function interactLabel(run, e) {
    if (e.kind === 'npc') return 'hablar con ' + e.label;
    if (e.kind === 'hazard') return run.identified.has(e.hazardId) ? 'revisar: ' + e.label + ' (ya identificado)' : 'inspeccionar: ' + e.label;
    if (e.kind === 'workstation') return run.phase === 'antes' ? 'volver a tu puesto y continuar' : 'revisar tu puesto de trabajo';
    if (e.kind === 'obstacle') return 'revisar: ' + e.label;
    return 'revisar: ' + e.label;
  }
  function hazardInspectable(run) {
    return run.scenarioKey === 'fire' || run.phase === 'antes';
  }
  function availableTriggerFor(run, predicate) {
    return run.triggers.find((t) => !run.triggersDone.has(t.id) && predicate(t) &&
      (!t.phase || t.phase === run.phase) && (!t.requires || t.requires.every((r) => run.triggersDone.has(r)))) || null;
  }
  function npcHasAvailableTrigger(run, npcId) {
    return !!availableTriggerFor(run, (t) => t.npc === npcId);
  }
  function elevatorTriggerAvailable(run) {
    return !!availableTriggerFor(run, (t) => t.id.indexOf('elevator') >= 0);
  }

  function interact() {
    const run = state.run;
    if (!canControl()) return;
    if (run.pendingDecision) { openSimDecision(run.pendingDecision); return; }
    const target = findInteractable(run);
    if (!target) { announce('No hay nada para interactuar aquí. Acércate a personas u objetos marcados con «!» o «⚠».', { type: 'info' }); return; }
    const e = target.entity;
    if (e.kind === 'npc') {
      const t = availableTriggerFor(run, (tr) => tr.npc === e.npc);
      if (t) { openSimDecision(t.id); return; }
      announce(e.label + ': «' + e.line + '»', { type: 'info' });
      return;
    }
    if (e.kind === 'hazard') { identifyHazard(run, e); return; }
    if (e.kind === 'workstation') { useWorkstation(run); return; }
    if (e.kind === 'sign') { announce('Señal de evacuación: indica la dirección hacia una salida. Síguela junto con las instrucciones de la brigada.', { type: 'info' }); return; }
    if (e.kind === 'obstacle') { announce('Paso cerrado temporalmente. Usa la otra ruta señalizada.', { type: 'info' }); return; }
    if (e.kind === 'tile') {
      if (e.tile === 'L') {
        const t = availableTriggerFor(run, (tr) => tr.id.indexOf('elevator') >= 0);
        if (t) { openSimDecision(t.id); return; }
        announce('Ascensor: según el protocolo configurado para esta simulación, no se usa durante la evacuación.', { type: 'info' });
      } else if (e.tile === 'X') {
        announce('Puerta de depósito: no es una salida. Sigue únicamente las rutas señalizadas.', { type: 'info' });
      } else if (e.tile === 'K') {
        announce('Extintor identificado: debe permanecer visible, señalizado y sin obstrucciones. Su uso requiere entrenamiento específico.', { type: 'info' });
      } else if (e.tile === 'B') {
        announce('Botiquín identificado: debe estar señalizado y accesible. Su uso corresponde al personal capacitado según el procedimiento.', { type: 'info' });
      }
    }
  }

  function identifyHazard(run, h) {
    if (run.identified.has(h.hazardId)) { announce('Ya identificaste: ' + h.label + '.', { type: 'info' }); return; }
    if (!hazardInspectable(run)) {
      announce('La fase de inspección terminó. Concéntrate en evacuar y reporta las novedades en el punto de encuentro.', { type: 'info' });
      return;
    }
    run.identified.add(h.hazardId);
    Sound.play('hazard');
    changeRisk(-3);
    logEvent('Peligro identificado: ' + h.label + '.');
    updateHUD();
    const pts = 25 / Math.max(1, run.hazards.length);
    showMessage({
      tag: 'Peligro identificado ⚠', title: h.label,
      body: [h.info, 'Acción sugerida: ' + h.action, '+' + fmt1(pts) + ' puntos de identificación de peligros (' + run.identified.size + ' de ' + run.hazards.length + ').', el('p', { className: 'protocol-note', text: PROTOCOL_NOTE })],
      onClose: () => {
        if (run.scenarioKey === 'quake' && run.phase === 'antes' && run.identified.size === 3) {
          announce('Identificaste 3 condiciones. Puedes seguir inspeccionando o volver a tu puesto y presionar E para continuar.', { type: 'ok' });
        }
      }
    });
  }

  function useWorkstation(run) {
    if (run.scenarioKey === 'quake' && run.phase === 'antes') {
      if (run.identified.size >= 3) { startQuakeDuring(run); return; }
      announce('Antes de continuar, identifica al menos 3 condiciones inseguras (' + run.identified.size + '/3).', { type: 'warn' });
      return;
    }
    announce('Tu puesto de trabajo: no regreses por objetos personales; continúa con el procedimiento.', { type: 'info' });
  }

  /* =======================================================================
     15. SIMULACIÓN: DISPARADORES, DECISIONES Y FASES
     ======================================================================= */
  function scheduleTriggerCheck(delay) {
    const run = state.run;
    if (!run) return;
    const id = run.id;
    window.setTimeout(() => {
      if (state.run && state.run.id === id && state.screen === 'sim') checkTriggers();
    }, typeof delay === 'number' ? delay : 300);
  }

  function checkTriggers() {
    const run = state.run;
    if (!run || run.completed || run.paused || run.pendingDecision || isModalOpen() || run.player.moving) return false;
    const p = run.player;
    const trigger = availableTriggerFor(run, (t) => {
      if (t.when === 'start' || t.when === 'phase') return true;
      if (t.when === 'zone') return inZone(t.zone, p.x, p.y);
      if (t.when === 'near') { const npc = npcById(run, t.npc); return !!npc && !run.followers.includes(npc) && chebyshev(npc, p) <= 1; }
      return false;
    });
    if (trigger) { openSimDecision(trigger.id); return true; }
    return false;
  }

  function decisionWeight(run, d) {
    const ids = run.scenario.decisions;
    const same = ids.filter((id) => (DECISIONS[id].category === 'apoyo') === (d.category === 'apoyo')).length || 1;
    return (d.category === 'apoyo' ? 10 : 40) / same;
  }

  function openSimDecision(id) {
    const run = state.run;
    const d = DECISIONS[id];
    if (!run || !d) return;
    run.pendingDecision = id;
    const rec = run.decisions[id] || (run.decisions[id] = { attempts: 0, firstSafe: null, firstText: '', done: false, points: 0 });
    if (rec.attempts === 0 && !rec.opened) { rec.opened = true; logEvent('Situación: ' + txt(d.title, run) + '.'); }
    renderDecisionUI($('decisionBody'), {
      decision: d, ctx: run, titleId: 'decisionTitle',
      progress: PHASE_NAMES[run.phase] ? 'Fase: ' + PHASE_NAMES[run.phase] : null,
      allowContinueOnError: false,
      retryLabel: 'Corregir decisión',
      evaluate: (opt) => evaluateSimOption(run, id, opt),
      onRetry: () => { if (run.opportunities <= 0) restoreFromCheckpoint(run); },
      onContinue: () => completeSimDecision(run, id)
    });
    if (!topModal() || topModal().id !== 'modal-decision') {
      openModal('modal-decision', { focus: 'decisionTitle', onEscape: () => escapeDecision(run, id) });
    } else {
      const t = $('decisionTitle');
      if (t) t.focus();
    }
  }

  function escapeDecision(run, id) {
    if (activeDecisionUI && activeDecisionUI.answered && activeDecisionUI.lastSafe) { completeSimDecision(run, id); return; }
    if (run.opportunities <= 0) restoreFromCheckpoint(run);
    closeModal('modal-decision');
    activeDecisionUI = null;
    announce('Decisión pendiente. Presiona E o intenta moverte para retomarla.', { type: 'info' });
    updateHUD();
  }

  function evaluateSimOption(run, id, opt) {
    const d = DECISIONS[id];
    const rec = run.decisions[id];
    rec.attempts++;
    if (rec.attempts === 1) {
      rec.firstSafe = !!opt.safe;
      rec.firstText = txt(opt.text, run);
      run.decisionLog.push({ id, title: txt(d.title, run), theme: d.theme, question: txt(d.context, run) + ' ' + txt(d.question, run), first: rec.firstText, firstSafe: rec.firstSafe, recommended: txt(d.options.find((o) => o.safe).text, run), explanation: txt(d.explanation, run) });
    }
    const weight = decisionWeight(run, d);
    let pointsText;
    let extra = null;
    let riskDelta;
    if (opt.safe) {
      riskDelta = -5;
      if (rec.attempts === 1) { rec.points = weight; pointsText = '+' + fmt1(weight); }
      else pointsText = '0 (decisión corregida en un nuevo intento)';
      run.lastSafe = { x: run.player.x, y: run.player.y };
      logEvent('Decisión segura: ' + txt(d.title, run) + '.');
    } else {
      riskDelta = 15;
      pointsText = '0';
      run.opportunities = Math.max(0, run.opportunities - 1);
      if (opt.reentry) run.reentryAttempts++;
      logEvent('Decisión por reforzar: ' + txt(d.title, run) + '.');
      extra = pick(RISK_MESSAGES) + ' Te quedan ' + run.opportunities + ' de ' + MAX_OPPORTUNITIES + ' oportunidades de corrección.';
      if (run.opportunities === 0) extra += ' Agotaste tus oportunidades: volverás al último punto seguro para repasar la situación.';
    }
    changeRisk(riskDelta);
    updateHUD();
    return { pointsText, riskText: (riskDelta > 0 ? '+' : '') + riskDelta + ' → ' + riskLabel(run.risk), extra };
  }

  function restoreFromCheckpoint(run) {
    run.opportunities = MAX_OPPORTUNITIES;
    run.restarts++;
    addPenalty('checkpoint', 3, 'Reinicio desde el último punto seguro.', false);
    const pos = run.lastSafe;
    const p = run.player;
    p.x = pos.x; p.y = pos.y; p.fromX = pos.x; p.fromY = pos.y; p.moving = false; p.t = 1;
    run.followers.forEach((f) => { f.x = pos.x; f.y = pos.y; f.fromX = pos.x; f.fromY = pos.y; });
    logEvent('Volvió al último punto seguro.');
    announce('Volviste al último punto seguro. Tus oportunidades de corrección se restablecieron.', { type: 'info' });
    updateHUD();
  }

  function completeSimDecision(run, id) {
    const rec = run.decisions[id];
    if (!rec || rec.done) return;
    rec.done = true;
    run.triggersDone.add(id);
    run.pendingDecision = null;
    activeDecisionUI = null;
    applyDecisionEffects(run, id);
    if (state.run !== run) return;
    if (topModal() && topModal().id === 'modal-decision') closeModal('modal-decision');
    updateHUD();
  }

  // Efectos de cada decisión: objetivos, acompañantes, fases y final.
  function applyDecisionEffects(run, id) {
    switch (id) {
      case 'fire_alarm': completeObjective(run, 'alarm'); break;
      case 'fire_smoke': completeObjective(run, 'avoid'); break;
      case 'fire_visitor':
      case 'quake_visitor': completeObjective(run, 'visitor'); addFollower(run, 'visitor'); announce('La persona visitante te acompaña hacia el punto de encuentro.', { type: 'ok' }); break;
      case 'fire_coworker':
      case 'quake_coworker': completeObjective(run, 'noreturn'); addFollower(run, 'coworker'); break;
      case 'fire_report':
      case 'quake_report': completeObjective(run, 'report'); break;
      case 'quake_brigade': completeObjective(run, 'assess'); break;
      case 'quake_during_3': completeObjective(run, 'protect'); endQuakeShaking(run); break;
      case 'fire_return':
      case 'quake_return': completeObjective(run, 'wait'); window.setTimeout(() => { if (state.run === run) completeMission(run); }, 120); break;
      default: break;
    }
  }

  function startQuakeDuring(run) {
    run.phase = 'durante';
    completeObjective(run, 'inspect');
    changeRisk(30);
    Sound.play('quake');
    logEvent('Inicio del movimiento sísmico (fase Durante).');
    announce('Movimiento sísmico en curso.', { type: 'warn', assertive: true });
    updateHUD();
    showMessage({
      tag: 'Fase Durante', title: '¡Movimiento sísmico!',
      body: [
        'El piso comienza a moverse. Durante esta fase no te desplazas: responde cómo actuar mientras dura el movimiento.',
        state.reducedMotion ? 'Movimiento reducido activo: el sismo se representa con un aviso en pantalla, sin vibración.' : 'La pantalla vibrará de forma moderada. Puedes desactivar este efecto con el botón «Movimiento» del encabezado.'
      ],
      okText: 'Continuar'
    });
  }

  function endQuakeShaking(run) {
    setupQuakeAfter(run);
    changeRisk(-15);
    announce('El movimiento terminó. Fase Después: evalúa el entorno y sigue las instrucciones.', { type: 'info' });
    updateHUD();
  }

  function completeMission(run) {
    if (run.completed) return;
    run.completed = true;
    releaseAllDirs();
    if (run.reentryAttempts > 0) run.objectives.delete('noreturn');
    if (run.scenarioKey === 'quake' && !run.penalties.some((p) => p.code === 'debris_light')) run.objectives.add('debris');
    Sound.play('complete');
    logEvent('Misión completada.');
    showMessage({
      tag: 'Misión completada', title: 'Permanece en el punto de encuentro',
      body: ['La persona responsable de ' + CONFIG.meetingPoint + ' confirma tu reporte.', 'Permanece en el sitio hasta recibir nuevas instrucciones de la ' + CONFIG.brigadeName + ' o del responsable de la emergencia.'],
      okText: 'Ver informe ▶',
      onClose: () => showReport(buildSimResult(run))
    });
  }

  // Pausa, reinicio y abandono.
  function pauseGame() {
    const run = state.run;
    if (!run || state.screen !== 'sim' || run.completed || isModalOpen()) return;
    run.paused = true;
    releaseAllDirs();
    openModal('modal-pause', { focus: 'pauseTitle', onEscape: resumeGame });
    announce('Juego en pausa. El tiempo está detenido.', { toast: false });
  }
  function resumeGame() {
    const run = state.run;
    if (!run) return;
    run.paused = false;
    closeModal('modal-pause');
    const map = $('mapWrap');
    if (map) map.focus();
    announce('Juego reanudado.', { toast: false });
  }
  function restartScenario() {
    confirmAction({
      title: 'Reiniciar escenario', message: 'Se perderá el progreso de esta partida y el escenario comenzará de nuevo con eventos aleatorios.', confirmText: 'Reiniciar',
      onConfirm: () => { const key = state.scenarioKey; closeAllModals(); startSimulation(key); }
    });
  }
  function quitToMenu() {
    confirmAction({
      title: 'Abandonar la partida', message: 'La partida en curso no se guardará. ¿Deseas volver al menú principal?', confirmText: 'Volver al menú',
      onConfirm: () => { closeAllModals(); state.run = null; showScreen('menu'); }
    });
  }

  /* =======================================================================
     16. PUNTUACIÓN, RIESGO Y TEMPORIZADOR
     ======================================================================= */
  function addPenalty(code, points, message, once) {
    const run = state.run;
    if (!run || run.completed) return false;
    if (once && run.penaltyOnce.has(code)) return false;
    run.penaltyOnce.add(code);
    run.penalties.push({ code, points, message });
    logEvent(message);
    return true;
  }
  function riskLabel(risk) {
    if (risk >= 75) return 'Muy alto';
    if (risk >= 50) return 'Alto';
    if (risk >= 25) return 'Moderado';
    return 'Bajo';
  }
  function changeRisk(delta) {
    const run = state.run;
    if (!run) return;
    const before = run.risk;
    // Durante una emergencia activa el riesgo nunca baja de 10: siempre se debe actuar con precaución.
    run.risk = clamp(run.risk + delta, run.phase === 'antes' ? 0 : 10, 100);
    if (before < 70 && run.risk >= 70) announce('Nivel de riesgo alto: detente, observa la señalización y sigue las instrucciones.', { type: 'warn' });
  }
  function timeScore(run) {
    const ref = (CONFIG.referenceTimeSeconds && CONFIG.referenceTimeSeconds[run.scenarioKey]) || 200;
    const t = run.time;
    if (t <= ref) return 5;
    if (t <= ref * 1.5) return 4;
    if (t <= ref * 2) return 3;
    if (t <= ref * 3) return 2;
    return 1;
  }
  // Puntuación total (máximo 100). La velocidad vale como máximo 5 puntos.
  function computeSimScore(run, final) {
    const ids = run.scenario.decisions;
    const dec = ids.filter((id) => DECISIONS[id].category !== 'apoyo');
    const sup = ids.filter((id) => DECISIONS[id].category === 'apoyo');
    const firstSafe = (id) => !!(run.decisions[id] && run.decisions[id].firstSafe === true);
    const decisionPts = dec.length ? 40 * dec.filter(firstSafe).length / dec.length : 40;
    const supportPts = sup.length ? 10 * sup.filter(firstSafe).length / sup.length : 10;
    const hazardPts = run.hazards.length ? 25 * run.identified.size / run.hazards.length : 25;
    const penalty = run.penalties.reduce((s, p) => s + p.points, 0);
    const procedurePts = final ? clamp(20 - penalty, 0, 20) : 0;
    const timePts = final ? timeScore(run) : 0;
    const total = clamp(Math.round(decisionPts + supportPts + hazardPts + procedurePts + timePts), 0, 100);
    return { decisionPts, supportPts, hazardPts, procedurePts, timePts, total, penalty };
  }

  let lastGuideText = '';
  let lastPromptText = null;
  let lastTimeShown = -1;

  function updateHUD() {
    const run = state.run;
    if (!run) return;
    const score = computeSimScore(run, false);
    setText('hudScenario', run.scenario.short);
    setText('hudPhase', PHASE_NAMES[run.phase] || '—');
    setText('hudScore', String(Math.round(score.decisionPts + score.supportPts + score.hazardPts)));
    setText('hudTime', formatTime(run.time));
    const label = riskLabel(run.risk);
    setText('hudRiskText', label + ' (' + run.risk + '%)');
    const fill = $('riskFill');
    if (fill) {
      fill.style.width = run.risk + '%';
      fill.style.setProperty('--fill', run.risk >= 50 ? 'var(--danger)' : (run.risk >= 25 ? 'var(--accent)' : 'var(--safe)'));
    }
    const bar = $('riskBar');
    if (bar) { bar.setAttribute('aria-valuenow', String(run.risk)); bar.setAttribute('aria-valuetext', label + ', ' + run.risk + ' por ciento'); }
    const lives = '◆'.repeat(run.opportunities) + '◇'.repeat(MAX_OPPORTUNITIES - run.opportunities);
    setText('hudLives', lives + ' ' + run.opportunities + '/' + MAX_OPPORTUNITIES);
    const guide = run.pendingDecision
      ? { text: 'Decisión pendiente: presiona E o intenta moverte para retomarla.' }
      : getGuide(run);
    if (guide.text !== lastGuideText) {
      lastGuideText = guide.text;
      setText('hudObjective', 'Objetivo: ' + guide.text);
      const canvas = $('gameCanvas');
      if (canvas) canvas.setAttribute('aria-label', 'Mapa de la instalación. Estás en: ' + areaName(run.player.x, run.player.y) + '. Objetivo: ' + guide.text);
    }
  }

  function updateInteractPrompt() {
    const run = state.run;
    if (!run) return;
    let text = '';
    if (canControl()) {
      const target = findInteractable(run);
      if (target) text = 'Presiona E (o toca «Interactuar») para ' + target.label + '.';
    }
    if (text !== lastPromptText) {
      lastPromptText = text;
      setText('interactPrompt', text);
    }
  }

  function areaName(x, y) {
    const t = tileAt(x, y);
    if (t === 'P') return 'el punto de encuentro';
    if (t === 'g') return 'la zona exterior';
    if (t === 'S') return 'la escalera de emergencia';
    if (y <= 5 && x <= 7) return 'la oficina';
    if (y <= 5) return 'el aula';
    if (y === 7 || y === 8) return 'el corredor principal';
    if (y >= 9 && y <= 12) return 'un paso hacia el corredor sur';
    return 'el corredor sur';
  }

  // Objetivo actual y casilla destacada en el mapa.
  function getGuide(run) {
    const done = (id) => run.triggersDone.has(id);
    const meeting = () => {
      if (!run.objectives.has('meeting')) return { text: 'Dirígete al ' + CONFIG.meetingPoint + ' (PE).', target: MEETING_TARGET };
      return { text: 'Repórtate con la persona responsable del punto de encuentro.', target: { x: 20, y: 2 } };
    };
    if (run.completed) return { text: 'Misión completada. Permanece en el punto de encuentro.', target: null };
    if (run.scenarioKey === 'fire') {
      if (!done('fire_alarm')) return { text: 'Responde a la alarma de evacuación.', target: null };
      if (!done('fire_smoke')) return { text: 'Sal con calma de la oficina por la puerta.', target: { x: 4, y: 6 } };
      if (!done('fire_elevator')) return { text: 'Observa el entorno antes de continuar.', target: { x: 4, y: 8 } };
      if (!done('fire_brigade')) {
        const west = run.openConnector === 'west';
        return { text: 'Toma la ruta alterna: baja por el paso ' + (west ? 'occidental' : 'central') + ' hacia el corredor sur.', target: west ? { x: 1, y: 9 } : { x: 7, y: 9 } };
      }
      if (!run.route) return { text: 'Sigue la señalización por el corredor sur hasta la escalera de emergencia y la salida alterna.', target: { x: 17, y: 13 } };
      return meeting();
    }
    if (run.phase === 'antes') {
      const n = run.identified.size;
      if (n < 3) {
        const pending = run.hazards.filter((h) => !run.identified.has(h.hazardId));
        pending.sort((a, b) => chebyshev(a, run.player) - chebyshev(b, run.player));
        return { text: 'Fase ANTES: identifica condiciones inseguras (' + n + '/3 como mínimo; ' + run.hazards.length + ' en total). Acércate a los objetos con ⚠ y presiona E.', target: pending[0] ? { x: pending[0].x, y: pending[0].y } : null };
      }
      return { text: 'Identificaste ' + n + ' de ' + run.hazards.length + '. Sigue inspeccionando o vuelve a tu puesto y presiona E para continuar.', target: WORKSTATION };
    }
    if (run.phase === 'durante') return { text: 'Fase DURANTE: decide cómo actuar mientras dura el movimiento.', target: null };
    if (!done('quake_after')) return { text: 'Fase DESPUÉS: evalúa el entorno.', target: null };
    if (!done('quake_brigade')) return { text: 'Sal con calma de la oficina hacia el corredor y atiende las instrucciones.', target: { x: 4, y: 6 } };
    if (!run.route) {
      const mainOpen = run.blockedRoute === 'alt';
      return { text: 'Evacúa por la ' + (mainOpen ? ROUTE_NAMES.main : ROUTE_NAMES.alt) + ' y evita los elementos caídos.', target: mainOpen ? { x: 17, y: 7 } : { x: 17, y: 13 } };
    }
    return meeting();
  }

  /* ---------- Bucle del juego (requestAnimationFrame) ---------- */
  let rafId = 0;
  let loopToken = 0;
  let lastFrame = 0;
  let lastRender = 0;

  function startLoop() {
    stopLoop();
    const token = ++loopToken;
    lastFrame = performance.now();
    const frame = (now) => {
      if (token !== loopToken) return;
      try {
        update(Math.min(0.05, (now - lastFrame) / 1000));
        lastFrame = now;
        const run = state.run;
        const active = run && !run.paused && !isModalOpen();
        if (active || now - lastRender > 250) { renderGame(now / 1000); lastRender = now; }
      } catch (err) {
        handleUnexpected(err);
        return;
      }
      rafId = window.requestAnimationFrame(frame);
    };
    rafId = window.requestAnimationFrame(frame);
  }
  function stopLoop() {
    loopToken++;
    if (rafId) window.cancelAnimationFrame(rafId);
    rafId = 0;
  }
  function update(dt) {
    const run = state.run;
    if (!run || state.screen !== 'sim') return;
    const active = !run.paused && !isModalOpen() && !run.completed;
    if (!state.reducedMotion) run.anim += dt;
    if (active) {
      run.time += dt; // el tiempo se detiene en pausa y en ventanas de decisión
      const sec = Math.floor(run.time);
      if (sec !== lastTimeShown) { lastTimeShown = sec; setText('hudTime', formatTime(run.time)); }
    }
    const p = run.player;
    if (p.moving) {
      p.t = Math.min(1, p.t + dt / STEP_TIME);
      if (p.t >= 1) { p.moving = false; onStepComplete(run); }
    } else if (active && heldDirs.length) {
      tryMove(heldDirs[heldDirs.length - 1]);
    }
    updateInteractPrompt();
  }

  function handleUnexpected(err) {
    stopLoop();
    closeAllModals();
    if (window.console && console.error) console.error(err);
    showMessage({
      title: 'Algo no salió como se esperaba',
      body: ['La partida se detuvo para evitar errores. Puedes volver al menú y comenzar de nuevo.'],
      okText: 'Ir al menú',
      onClose: () => { state.run = null; showScreen('menu'); }
    });
  }

  /* =======================================================================
     17. DIBUJO DEL MAPA (Canvas 2D, pixel art generado por código)
     ======================================================================= */
  const canvas = $('gameCanvas');
  const gctx = canvas ? canvas.getContext('2d') : null;
  const FONT = 'bold 9px "Courier New", monospace';

  const rect = (c, x, y, w, h, color) => { c.fillStyle = color; c.fillRect(x, y, w, h); };
  const hash = (x, y) => ((x * 73856093) ^ (y * 19349663)) >>> 0;

  function drawFloor(c, x, y) {
    const px = x * TILE;
    const py = y * TILE;
    const C = MAP_COLORS;
    if (y >= 1 && y <= 5 && x >= 1 && x <= 7) {
      rect(c, px, py, TILE, TILE, C.carpet);
      if (hash(x, y) % 3 === 0) rect(c, px + 8, py + 20, 2, 2, C.carpetLine);
    } else if (y >= 1 && y <= 5 && x >= 9 && x <= 16) {
      rect(c, px, py, TILE, TILE, C.wood);
      rect(c, px, py + 10, TILE, 1, C.woodLine);
      rect(c, px, py + 21, TILE, 1, C.woodLine);
    } else {
      rect(c, px, py, TILE, TILE, C.floor);
      rect(c, px, py + TILE - 1, TILE, 1, C.floorLine);
      rect(c, px + TILE - 1, py, 1, TILE, C.floorLine);
    }
  }
  function drawGrass(c, x, y) {
    const px = x * TILE;
    const py = y * TILE;
    rect(c, px, py, TILE, TILE, MAP_COLORS.grass);
    const h = hash(x, y);
    rect(c, px + (h % 24) + 2, py + ((h >> 5) % 24) + 2, 2, 2, MAP_COLORS.grassDot);
    rect(c, px + ((h >> 9) % 24) + 3, py + ((h >> 13) % 24) + 4, 2, 2, MAP_COLORS.grassDot);
  }
  function drawWall(c, px, py, y) {
    const C = MAP_COLORS;
    rect(c, px, py, TILE, TILE, C.wall);
    rect(c, px, py, TILE, 6, C.wallTop);
    rect(c, px, py + 18, TILE, 1, C.wallLine);
    rect(c, px + (y % 2 ? 6 : 20), py + 7, 1, 11, C.wallLine);
    rect(c, px, py + TILE - 2, TILE, 2, C.wallLine);
  }
  function drawArrow(c, cx, cy, dir, color, size) {
    const s = size || 1;
    const angle = { right: 0, down: Math.PI / 2, left: Math.PI, up: -Math.PI / 2 }[dir] || 0;
    c.save();
    c.translate(cx, cy);
    c.rotate(angle);
    c.fillStyle = color;
    c.fillRect(-7 * s, -2 * s, 9 * s, 4 * s);
    c.beginPath();
    c.moveTo(2 * s, -6 * s); c.lineTo(8 * s, 0); c.lineTo(2 * s, 6 * s);
    c.closePath();
    c.fill();
    c.restore();
  }

  function drawTile(c, ch, x, y) {
    const px = x * TILE;
    const py = y * TILE;
    const C = MAP_COLORS;
    switch (ch) {
      case '#': drawWall(c, px, py, y); break;
      case 'f':
        drawGrass(c, x, y);
        if (y === 0 || y === ROWS - 1) { rect(c, px, py + 12, TILE, 3, C.fence); rect(c, px + 4, py + 6, 4, 18, C.fence); rect(c, px + 22, py + 6, 4, 18, C.fence); }
        else { rect(c, px + 14, py, 3, TILE, C.fence); rect(c, px + 10, py + 4, 11, 4, C.fence); rect(c, px + 10, py + 22, 11, 4, C.fence); }
        break;
      case 'g': case 'P': drawGrass(c, x, y); break;
      case 'E': case 'A':
        rect(c, px, py, TILE, TILE, C.exit);
        for (let i = 0; i < TILE; i += 8) rect(c, px, py + i, TILE, 3, C.exitStripe);
        drawArrow(c, px + 16, py + 16, 'right', '#ffffff', 1.4);
        break;
      case 'S':
        rect(c, px, py, TILE, TILE, C.stairs);
        for (let i = 2; i < TILE; i += 6) rect(c, px, py + i, TILE, 3, C.stairsDark);
        rect(c, px, py, 2, TILE, C.stairsDark);
        rect(c, px + TILE - 2, py, 2, TILE, C.stairsDark);
        break;
      case 'L':
        drawWall(c, px, py, y);
        rect(c, px + 3, py + 4, 26, 27, C.elevator);
        rect(c, px + 15, py + 4, 2, 27, C.elevatorDark);
        rect(c, px + 3, py + 4, 26, 2, C.elevatorDark);
        rect(c, px + 7, py + 9, 4, 2, '#1d2333'); rect(c, px + 8, py + 8, 2, 1, '#1d2333');
        rect(c, px + 21, py + 9, 4, 2, '#1d2333'); rect(c, px + 22, py + 11, 2, 1, '#1d2333');
        break;
      case 'X':
        drawWall(c, px, py, y);
        rect(c, px + 5, py + 4, 22, 27, C.door);
        rect(c, px + 5, py + 4, 22, 3, C.doorDark);
        rect(c, px + 21, py + 18, 3, 3, '#e8d27a');
        rect(c, px + 9, py + 9, 12, 7, '#e9e4d2');
        rect(c, px + 11, py + 11, 8, 2, '#b3261e');
        break;
      case 'K':
        drawWall(c, px, py, y);
        rect(c, px + 12, py + 9, 8, 18, '#c62828');
        rect(c, px + 13, py + 6, 6, 4, '#2b2b2b');
        rect(c, px + 19, py + 10, 4, 2, '#2b2b2b');
        rect(c, px + 13, py + 15, 6, 3, '#f2f2f2');
        break;
      case 'B':
        drawFloor(c, x, y);
        rect(c, px + 6, py + 8, 20, 16, '#f2f2f2');
        rect(c, px + 6, py + 8, 20, 2, '#b9b9b9');
        rect(c, px + 14, py + 11, 4, 11, '#1f8a4c');
        rect(c, px + 10, py + 15, 12, 4, '#1f8a4c');
        break;
      case 'W':
        drawFloor(c, x, y);
        rect(c, px + 2, py + 7, 28, 18, C.desk);
        rect(c, px + 2, py + 7, 28, 4, C.deskTop);
        rect(c, px + 9, py + 9, 14, 9, C.monitor);
        rect(c, px + 10, py + 10, 12, 6, '#3b5a7a');
        rect(c, px + 14, py + 18, 4, 3, C.monitor);
        rect(c, px + 9, py + 21, 14, 2, '#d0d0d0');
        break;
      case 'T':
        drawFloor(c, x, y);
        rect(c, px + 2, py + 9, 28, 15, C.table);
        rect(c, px + 2, py + 9, 28, 3, '#9a7650');
        break;
      case 'D':
        drawFloor(c, x, y);
        rect(c, px, py, 3, TILE, C.doorDark);
        rect(c, px + TILE - 3, py, 3, TILE, C.doorDark);
        rect(c, px + 3, py + TILE - 5, TILE - 6, 5, '#a58a6a');
        break;
      default: drawFloor(c, x, y);
    }
  }

  function drawMeetingPoint(c) {
    const px = MEETING_ZONE.x1 * TILE + 3;
    const py = MEETING_ZONE.y1 * TILE + 3;
    const w = (MEETING_ZONE.x2 - MEETING_ZONE.x1 + 1) * TILE - 6;
    const h = (MEETING_ZONE.y2 - MEETING_ZONE.y1 + 1) * TILE - 6;
    rect(c, px, py, w, h, MAP_COLORS.meet);
    c.strokeStyle = MAP_COLORS.meetLine;
    c.lineWidth = 3;
    c.strokeRect(px + 1.5, py + 1.5, w - 3, h - 3);
    const cx = px + w / 2;
    const cy = py + h / 2;
    drawArrow(c, px + 18, cy, 'right', '#2d4a0f', 1);
    drawArrow(c, px + w - 18, cy, 'left', '#2d4a0f', 1);
    c.fillStyle = '#1b2a0a';
    c.font = 'bold 13px "Courier New", monospace';
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillText('PE', cx, cy + 1);
  }

  function drawSign(c, s, covered, missing) {
    const px = s.x * TILE;
    const py = s.y * TILE;
    if (missing) {
      c.strokeStyle = '#e9e4d2';
      c.setLineDash([3, 3]);
      c.lineWidth = 1.5;
      c.strokeRect(px + 5.5, py + 8.5, 21, 13);
      c.setLineDash([]);
      return;
    }
    rect(c, px + 5, py + 8, 22, 14, MAP_COLORS.sign);
    rect(c, px + 5, py + 8, 22, 1, '#7fe0a8');
    drawArrow(c, px + 16, py + 15, s.dir || 'right', '#ffffff', 0.8);
    if (covered) { rect(c, px + 12, py + 6, 14, 15, '#f2efe4'); rect(c, px + 14, py + 9, 9, 2, '#8a8a8a'); rect(c, px + 14, py + 13, 7, 2, '#8a8a8a'); }
  }

  function drawHazardObject(c, h) {
    const px = h.x * TILE;
    const py = h.y * TILE;
    switch (h.type) {
      case 'extinguisherBlocked':
        rect(c, px + 4, py + 18, 13, 12, '#a07444'); rect(c, px + 4, py + 18, 13, 2, '#7d5a33');
        rect(c, px + 15, py + 21, 13, 10, '#b98a55'); rect(c, px + 15, py + 21, 13, 2, '#7d5a33');
        break;
      case 'cables':
        c.strokeStyle = '#151515'; c.lineWidth = 2;
        c.beginPath(); c.moveTo(px + 2, py + 12); c.bezierCurveTo(px + 10, py + 4, px + 20, py + 26, px + 30, py + 14); c.stroke();
        c.strokeStyle = '#e07b39';
        c.beginPath(); c.moveTo(px + 2, py + 22); c.bezierCurveTo(px + 12, py + 14, px + 18, py + 30, px + 30, py + 22); c.stroke();
        break;
      case 'boxes':
        rect(c, px + 3, py + 12, 14, 14, '#a07444'); rect(c, px + 3, py + 12, 14, 2, '#7d5a33');
        rect(c, px + 15, py + 8, 14, 18, '#b98a55'); rect(c, px + 15, py + 8, 14, 2, '#7d5a33');
        rect(c, px + 8, py + 4, 12, 8, '#efe9d8');
        break;
      case 'shelfHeavy':
      case 'shelf':
        rect(c, px + 4, py + 2, 24, 28, '#6d7383');
        for (let i = 0; i < 3; i++) rect(c, px + 4, py + 9 + i * 8, 24, 2, '#4a4f5c');
        if (h.type === 'shelfHeavy') { rect(c, px + 6, py + 3, 9, 6, '#3d2f22'); rect(c, px + 17, py + 3, 9, 6, '#4a3828'); }
        else { rect(c, px + 7, py + 11, 5, 5, '#c94f4f'); rect(c, px + 18, py + 19, 6, 5, '#4f7fc9'); rect(c, px + 26, py + 4, 3, 26, '#4a4f5c'); }
        break;
      case 'falling':
        rect(c, px + 2, py + 16, 28, 12, MAP_COLORS.desk);
        rect(c, px + 18, py + 6, 12, 9, MAP_COLORS.monitor);
        rect(c, px + 19, py + 7, 10, 6, '#3b5a7a');
        rect(c, px + 4, py + 9, 7, 7, '#9a5b33'); rect(c, px + 3, py + 4, 9, 6, '#3f8f3f');
        break;
      case 'mapBoard':
        rect(c, px + 4, py + 7, 24, 17, '#c9a56b');
        rect(c, px + 6, py + 9, 20, 13, '#f2efe4');
        rect(c, px + 8, py + 11, 8, 2, '#1f8a4c'); rect(c, px + 16, py + 11, 2, 8, '#1f8a4c'); rect(c, px + 20, py + 16, 4, 4, '#d8b02a');
        break;
      default: break;
    }
  }

  function drawMarker(c, x, y, identified) {
    const px = x * TILE + 21;
    const py = y * TILE + 1;
    if (identified) {
      rect(c, px, py, 10, 10, MAP_COLORS.ok);
      rect(c, px + 2, py + 5, 2, 2, '#06301a'); rect(c, px + 4, py + 6, 2, 2, '#06301a'); rect(c, px + 6, py + 3, 2, 3, '#06301a');
      return;
    }
    c.fillStyle = MAP_COLORS.hazard;
    c.beginPath(); c.moveTo(px + 5, py - 1); c.lineTo(px + 11, py + 10); c.lineTo(px - 1, py + 10); c.closePath(); c.fill();
    c.strokeStyle = '#1b1405'; c.lineWidth = 1; c.stroke();
    rect(c, px + 4, py + 3, 2, 4, '#1b1405');
    rect(c, px + 4, py + 8, 2, 1, '#1b1405');
  }

  // Personaje pixelado (32 x 32) con animación básica de pasos.
  function drawPerson(c, px, py, look, frame) {
    rect(c, px + 8, py + 27, 16, 3, 'rgba(0,0,0,0.28)');
    const a = frame ? 2 : 0;
    rect(c, px + 11, py + 20, 4, 8 - a, look.pants);
    rect(c, px + 17, py + 20, 4, 6 + a, look.pants);
    rect(c, px + 9, py + 12, 14, 10, look.shirt);
    if (look.vest) { rect(c, px + 9, py + 12, 14, 10, look.vest); rect(c, px + 9, py + 17, 14, 2, look.stripe); }
    if (look.badge) { rect(c, px + 14, py + 12, 1, 5, '#1d2333'); rect(c, px + 13, py + 16, 4, 4, look.badge); }
    rect(c, px + 7, py + 13 + (frame ? 1 : 0), 2, 7, look.skin);
    rect(c, px + 23, py + 13 + (frame ? 0 : 1), 2, 7, look.skin);
    if (look.clipboard) { rect(c, px + 22, py + 15, 6, 8, '#d9c7a1'); rect(c, px + 23, py + 17, 4, 1, '#555'); }
    rect(c, px + 11, py + 3, 10, 9, look.skin);
    rect(c, px + 11, py + 2, 10, 3, look.hair);
    rect(c, px + 10, py + 3, 2, 5, look.hair);
    if (look.helmet) { rect(c, px + 10, py + 1, 12, 4, look.helmet); rect(c, px + 9, py + 4, 14, 1, look.helmet); }
    rect(c, px + 13, py + 7, 2, 2, '#1b1b1b');
    rect(c, px + 17, py + 7, 2, 2, '#1b1b1b');
  }
  function drawTag(c, text, cx, y, bg, fg) {
    c.font = FONT;
    const w = Math.ceil(c.measureText(text).width) + 8;
    cx = clamp(cx, w / 2 + 1, COLS * TILE - w / 2 - 1);
    rect(c, Math.round(cx - w / 2), y, w, 12, bg);
    c.fillStyle = fg;
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillText(text, cx, y + 6.5);
  }
  function drawLabel(c, text, x, y, align) {
    c.font = FONT;
    c.textAlign = align || 'left';
    c.textBaseline = 'middle';
    c.fillStyle = 'rgba(10,12,20,0.55)';
    const w = c.measureText(text).width + 6;
    c.fillRect(align === 'center' ? x - w / 2 : x - 3, y - 6, w, 12);
    c.fillStyle = '#f3efe2';
    c.fillText(text, x, y + 0.5);
  }

  function lerpPos(obj, t) {
    const k = obj.moving === false ? 1 : t;
    return { x: (obj.fromX + (obj.x - obj.fromX) * k) * TILE, y: (obj.fromY + (obj.y - obj.fromY) * k) * TILE };
  }

  function renderGame(time) {
    const run = state.run;
    if (!gctx || !run) return;
    const c = gctx;
    c.setTransform(SCALE, 0, 0, SCALE, 0, 0);
    c.imageSmoothingEnabled = false;
    rect(c, 0, 0, COLS * TILE, ROWS * TILE, '#0b0e16');
    let ox = 0;
    let oy = 0;
    if (run.phase === 'durante' && !state.reducedMotion) {
      ox = Math.round(Math.sin(time * 21) * 2.5);
      oy = Math.round(Math.cos(time * 17) * 1.5);
    }
    c.save();
    c.translate(ox, oy);
    for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) drawTile(c, MAP[y][x], x, y);
    drawMeetingPoint(c);
    drawStaticLabels(c, run);

    // Elementos caídos (debajo de los personajes).
    run.overlay.forEach((ov, k) => {
      if (ov.kind !== 'debris') return;
      const [x, y] = k.split(',').map(Number);
      drawDebris(c, x, y, ov.level);
    });

    // Señales, peligros y obstáculos.
    run.entities.forEach((e) => {
      if (e.kind === 'sign') drawSign(c, e, false, false);
      else if (e.kind === 'obstacle') drawClosure(c, e.x, e.y);
      else if (e.kind === 'hazard') {
        if (e.type === 'signCovered') drawSign(c, { x: e.x, y: e.y, dir: 'right' }, true, false);
        else if (e.type === 'signMissing') drawSign(c, e, false, true);
        else drawHazardObject(c, e);
      }
    });
    run.entities.forEach((e) => {
      if (e.kind !== 'hazard') return;
      const identified = run.identified.has(e.hazardId);
      if (identified || hazardInspectable(run)) drawMarker(c, e.x, e.y, identified);
    });
    if (run.scenarioKey === 'fire') drawAlarmBeacons(c);

    // Personajes no jugadores.
    const p = run.player;
    run.entities.forEach((e) => {
      if (e.kind !== 'npc') return;
      const isFollower = run.followers.includes(e);
      const pos = isFollower ? lerpPos({ fromX: e.fromX, fromY: e.fromY, x: e.x, y: e.y, moving: p.moving }, p.t) : { x: e.x * TILE, y: e.y * TILE };
      drawPerson(c, Math.round(pos.x), Math.round(pos.y), LOOKS[e.npc], isFollower && p.moving ? p.step : 0);
      if (!isFollower && npcHasAvailableTrigger(run, e.npc)) {
        const bob = state.reducedMotion ? 0 : Math.round(Math.sin(time * 3) * 1.5);
        rect(c, pos.x + 11, pos.y - 13 + bob, 10, 12, '#ffffff');
        rect(c, pos.x + 15, pos.y - 11 + bob, 2, 5, '#b3261e');
        rect(c, pos.x + 15, pos.y - 4 + bob, 2, 2, '#b3261e');
      } else if (!isFollower && chebyshev(e, p) <= 2) {
        drawTag(c, e.label, pos.x + 16, pos.y - 13, 'rgba(10,12,20,0.8)', '#f3efe2');
      }
    });

    // Jugador.
    const pp = lerpPos(p, p.t);
    drawPerson(c, Math.round(pp.x), Math.round(pp.y), LOOKS.player, p.moving ? p.step : 0);
    drawTag(c, 'TÚ', pp.x + 16, pp.y - 12, '#2bb3c0', '#0b1a1d');

    // Humo (sobre los personajes, semitransparente).
    run.overlay.forEach((ov, k) => {
      if (ov.kind !== 'smoke') return;
      const [x, y] = k.split(',').map(Number);
      drawSmoke(c, x, y, ov.level, run.anim);
    });

    // Indicador del objetivo e indicación de interacción.
    if (!run.completed) {
      const guide = getGuide(run);
      if (guide.target && !run.pendingDecision) drawTargetMarker(c, guide.target.x, guide.target.y, time);
      if (canControl()) {
        const target = findInteractable(run);
        if (target) drawTag(c, 'E', target.entity.x * TILE + 16, target.entity.y * TILE + 2, MAP_COLORS.target, '#1b1405');
      }
    }
    c.restore();

    if (run.phase === 'durante') {
      rect(c, 0, ROWS * TILE / 2 - 22, COLS * TILE, 44, 'rgba(10,12,20,0.78)');
      c.fillStyle = '#f4b740';
      c.font = 'bold 18px "Courier New", monospace';
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.fillText('≋ MOVIMIENTO SÍSMICO EN CURSO ≋', COLS * TILE / 2, ROWS * TILE / 2);
    }
  }

  function drawStaticLabels(c, run) {
    drawLabel(c, 'OFICINA', 1 * TILE + 4, 16);
    drawLabel(c, 'AULA · SALA DE REUNIONES', 9 * TILE + 4, 16);
    drawLabel(c, 'EXTERIOR', 18 * TILE + 4, 16);
    drawLabel(c, 'CORREDOR PRINCIPAL (ARRIBA)', 12.5 * TILE, 10.4 * TILE, 'center');
    drawLabel(c, 'ÁREA SIN ACCESO', 12.5 * TILE, 11.5 * TILE, 'center');
    drawLabel(c, 'CORREDOR SUR (ABAJO)', 12.5 * TILE, 12.6 * TILE, 'center');
    drawLabel(c, 'DEPÓSITO', 5 * TILE, 11.5 * TILE, 'center');
    drawLabel(c, 'PUNTO DE ENCUENTRO', 20.5 * TILE, 5.5 * TILE, 'center');
    drawLabel(c, 'ESCALERA', 16 * TILE, 15.5 * TILE, 'center');
    drawLabel(c, 'SALIDA PRINCIPAL', 17.5 * TILE, 6.5 * TILE, 'center');
    drawLabel(c, 'SALIDA ALTERNA', 17.5 * TILE, 12.5 * TILE, 'center');
  }

  function drawClosure(c, x, y) {
    const px = x * TILE;
    const py = y * TILE;
    rect(c, px + 3, py + 18, 3, 12, '#555');
    rect(c, px + 26, py + 18, 3, 12, '#555');
    for (let i = 0; i < 6; i++) rect(c, px + 1 + i * 5, py + 10, 5, 9, i % 2 ? '#1b1b1b' : '#f4c430');
  }
  function drawDebris(c, x, y, level) {
    const px = x * TILE;
    const py = y * TILE;
    const h = hash(x, y);
    if (level === 2) {
      rect(c, px + 2, py + 12, 28, 18, MAP_COLORS.debrisDark);
      rect(c, px + 4, py + 6, 12, 10, MAP_COLORS.debris);
      rect(c, px + 16, py + 9, 13, 9, '#8f8173');
      rect(c, px + 8, py + 18, 10, 8, '#6b5c4d');
      rect(c, px + 22, py + 20, 6, 6, '#9a9a9a');
    } else {
      rect(c, px + 4 + (h % 6), py + 8, 6, 4, MAP_COLORS.debris);
      rect(c, px + 18, py + 16 + (h % 5), 7, 5, '#8f8173');
      rect(c, px + 10, py + 24, 4, 3, '#cfd8dc');
      rect(c, px + 24, py + 6, 3, 3, '#cfd8dc');
    }
  }
  function drawSmoke(c, x, y, level, anim) {
    const px = x * TILE;
    const py = y * TILE;
    const drift = Math.sin(anim * 0.9 + x * 1.7 + y) * 2.5;
    c.fillStyle = level === 2 ? 'rgba(62,64,72,0.82)' : 'rgba(150,150,160,0.5)';
    c.fillRect(px, py, TILE, TILE);
    c.fillStyle = level === 2 ? 'rgba(95,97,106,0.85)' : 'rgba(190,190,198,0.45)';
    c.beginPath(); c.arc(px + 9 + drift, py + 11, 9, 0, Math.PI * 2); c.fill();
    c.beginPath(); c.arc(px + 22 - drift, py + 20, 10, 0, Math.PI * 2); c.fill();
  }
  function drawAlarmBeacons(c) {
    [[7, 0], [16, 0], [0, 10], [17, 11]].forEach(([x, y]) => {
      const px = x * TILE;
      const py = y * TILE;
      rect(c, px + 10, py + 10, 12, 10, MAP_COLORS.alarm);
      rect(c, px + 12, py + 11, 4, 3, '#ffb3a8');
      rect(c, px + 8, py + 20, 16, 3, '#2b2b2b');
    });
  }
  function drawTargetMarker(c, x, y, time) {
    const bob = state.reducedMotion ? 0 : Math.round(Math.sin(time * 3) * 2);
    const px = x * TILE;
    const py = y * TILE;
    c.strokeStyle = MAP_COLORS.target;
    c.lineWidth = 2;
    c.setLineDash([4, 3]);
    c.strokeRect(px + 1, py + 1, TILE - 2, TILE - 2);
    c.setLineDash([]);
    c.fillStyle = MAP_COLORS.target;
    c.beginPath();
    c.moveTo(px + 8, py - 12 + bob); c.lineTo(px + 24, py - 12 + bob); c.lineTo(px + 16, py - 3 + bob);
    c.closePath(); c.fill();
    c.strokeStyle = '#1b1405'; c.lineWidth = 1; c.stroke();
  }

  // Ilustración de la pantalla de bienvenida (reutiliza los sprites).
  function drawWelcomeArt() {
    const art = $('welcomeArt');
    const c = art ? art.getContext('2d') : null;
    if (!c) return;
    c.setTransform(3, 0, 0, 3, 0, 0);
    c.imageSmoothingEnabled = false;
    for (let x = 0; x < 10; x++) {
      drawWall(c, x * TILE, 0, 0);
      drawTile(c, x === 8 ? 'E' : (x === 9 ? 'g' : '.'), x, 1);
      drawTile(c, x === 9 ? 'g' : '.', x, 2);
    }
    drawSign(c, { x: 6, y: 0, dir: 'right' }, false, false);
    drawPerson(c, 2 * TILE, TILE + 6, LOOKS.visitor, 1);
    drawPerson(c, 4 * TILE, TILE + 6, LOOKS.player, 0);
    drawTag(c, 'TÚ', 4 * TILE + 16, TILE - 6, '#2bb3c0', '#0b1a1d');
    drawPerson(c, 9 * TILE, TILE + 2, LOOKS.responsible, 0);
    drawTag(c, 'PE', 9 * TILE + 16, 50, MAP_COLORS.meet, '#1b2a0a');
  }

  /* =======================================================================
     18. INFORME FINAL
     ======================================================================= */
  function buildRecommendation(info) {
    const recs = [];
    const push = (r) => { if (r && !recs.includes(r)) recs.push(r); };
    info.weakThemes.forEach((t) => push(RECOMMENDATIONS[t]));
    if (info.missedHazards > 0) push(RECOMMENDATIONS[info.scenarioKey === 'quake' ? THEMES.quakeBefore : THEMES.hazards]);
    if (info.reentry > 0) push(RECOMMENDATIONS[THEMES.noReturn]);
    if (info.penalties.some((p) => p.code.indexOf('smoke') === 0)) push(RECOMMENDATIONS[THEMES.routes]);
    if (info.penalties.some((p) => p.code === 'debris_light')) push('Después de un sismo, evita pasar sobre o junto a elementos caídos: usa la ruta habilitada aunque parezca más larga.');
    if (!recs.length) push('Excelente desempeño. Mantén estos hábitos, participa en los simulacros presenciales y comparte con tu equipo lo que aprendiste. Valida siempre las acciones con el plan de emergencias vigente.');
    return recs.slice(0, 3);
  }

  function buildSimResult(run) {
    const s = computeSimScore(run, true);
    const ids = run.scenario.decisions;
    const sup = ids.filter((id) => DECISIONS[id].category === 'apoyo');
    const firstSafe = (id) => !!(run.decisions[id] && run.decisions[id].firstSafe === true);
    const weak = ids.filter((id) => run.decisions[id] && run.decisions[id].firstSafe === false);
    const found = run.hazards.filter((h) => run.identified.has(h.hazardId)).map((h) => h.label);
    const missed = run.hazards.filter((h) => !run.identified.has(h.hazardId)).map((h) => h.label);
    let route = 'No registrada';
    if (run.route === 'alt') route = 'Ruta alterna: ' + (run.connector ? 'paso ' + run.connector + ', ' : '') + 'corredor sur, escalera de emergencia y salida alterna';
    if (run.route === 'main') route = 'Ruta principal: corredor principal y salida principal';
    const level = levelFor(s.total);
    return {
      mode: 'simulation', completedKey: run.scenarioKey, scenarioKey: run.scenarioKey,
      scenarioName: run.scenario.name, score: s.total, level: level.name, levelRank: level.rank, levelIcon: level.icon,
      timeSec: run.time,
      safeCount: ids.filter(firstSafe).length, totalDecisions: ids.length,
      reinforce: weak.map((id) => txt(DECISIONS[id].title, run)),
      hazardsFound: found, hazardsMissed: missed,
      route,
      people: { oriented: sup.filter(firstSafe).length, total: sup.length },
      objectives: run.scenario.objectives.map((o) => ({ label: o.label, done: run.objectives.has(o.id) })),
      reentryAttempts: run.reentryAttempts,
      restarts: run.restarts,
      recommendation: buildRecommendation({ weakThemes: weak.map((id) => DECISIONS[id].theme), missedHazards: missed.length, reentry: run.reentryAttempts, penalties: run.penalties, scenarioKey: run.scenarioKey }),
      breakdown: [
        { label: 'Decisiones seguras', points: s.decisionPts, max: 40 },
        { label: 'Identificación de peligros', points: s.hazardPts, max: 25 },
        { label: 'Ruta y procedimiento', points: s.procedurePts, max: 20 },
        { label: 'Orientación y apoyo a otras personas', points: s.supportPts, max: 10 },
        { label: 'Tiempo de respuesta', points: s.timePts, max: 5 }
      ],
      penalties: run.penalties.slice(),
      review: run.decisionLog.slice(),
      events: run.events.slice(),
      date: new Date()
    };
  }

  function buildTrainingResult(t) {
    const score = clamp(Math.round(t.score), 0, 100);
    const level = levelFor(score);
    const weak = t.results.filter((r) => r.firstSafe === false);
    return {
      mode: 'training', completedKey: 'training', scenarioKey: null,
      scenarioName: 'Entrenamiento · ' + TOPIC_NAMES[t.topic], score, level: level.name, levelRank: level.rank, levelIcon: level.icon,
      timeSec: (performance.now() - t.startTime) / 1000,
      safeCount: t.results.filter((r) => r.firstSafe).length, totalDecisions: t.results.length,
      reinforce: weak.map((r) => r.decision.title),
      hazardsFound: null, hazardsMissed: null, route: null,
      people: null,
      objectives: [
        { label: 'Situaciones respondidas: ' + t.results.length + ' de ' + t.questions.length, done: t.results.length === t.questions.length },
        { label: 'Todas las respuestas seguras en el primer intento', done: weak.length === 0 }
      ],
      reentryAttempts: t.reentry, restarts: 0,
      recommendation: buildRecommendation({ weakThemes: weak.map((r) => r.decision.theme), missedHazards: 0, reentry: t.reentry, penalties: [], scenarioKey: null }),
      breakdown: [{ label: 'Respuestas seguras (primer intento: valor completo; segundo: la mitad)', points: t.score, max: 100 }],
      penalties: [],
      review: t.results.map((r) => ({ title: r.decision.title, theme: r.decision.theme, question: txt(r.decision.context, null) + ' ' + txt(r.decision.question, null), first: r.firstText, firstSafe: r.firstSafe, recommended: txt(r.decision.options.find((o) => o.safe).text, null), explanation: txt(r.decision.explanation, null) })),
      events: [],
      date: new Date()
    };
  }

  function statBox(label, value) {
    return el('div', { className: 'stat-box' }, [el('span', { className: 'fb-label', text: label }), el('strong', { text: value })]);
  }
  function listSection(title, items, mark, empty) {
    const ul = el('ul');
    if (!items || !items.length) ul.appendChild(el('li', null, [el('span', { className: 'mark', 'aria-hidden': 'true', text: '–' }), empty]));
    else items.forEach((it) => {
      const done = typeof it === 'object' ? it.done : mark === 'ok';
      const label = typeof it === 'object' ? it.label : it;
      ul.appendChild(el('li', null, [
        el('span', { className: 'mark ' + (done ? 'mark-ok' : 'mark-no'), 'aria-hidden': 'true', text: done ? '✔' : '✖' }),
        el('span', { className: 'sr-only', text: done ? 'Cumplido: ' : 'Pendiente: ' }),
        label
      ]));
    });
    return el('section', { className: 'report-section' }, [el('h2', { text: title }), ul]);
  }

  function showReport(result) {
    state.lastResult = result;
    const toasts = $('toastArea');
    if (toasts) toasts.textContent = '';
    saveResult(result);
    const isSim = result.mode === 'simulation';
    setText('h-report', isSim ? 'Misión completada' : 'Entrenamiento completado');
    setText('reportScenario', 'Escenario: ' + result.scenarioName + (state.alias ? ' · Participante: ' + state.alias : '') + ' · ' + result.date.toLocaleDateString('es-CO'));
    setText('reportScore', String(result.score));
    setText('reportLevel', result.level);
    const medal = $('reportMedal');
    if (medal) medal.setAttribute('data-level', String(result.levelRank));
    setText('reportMedalText', result.levelIcon);

    const body = $('reportBody');
    if (body) {
      body.textContent = '';
      const na = 'No aplica';
      const grid = el('div', { className: 'report-grid' }, [
        statBox('Tiempo empleado', formatTime(result.timeSec)),
        statBox('Decisiones seguras', result.safeCount + ' de ' + result.totalDecisions),
        statBox('Peligros identificados', result.hazardsFound ? result.hazardsFound.length + ' de ' + (result.hazardsFound.length + result.hazardsMissed.length) : na),
        statBox('Personas orientadas', result.people ? result.people.oriented + ' de ' + result.people.total : na),
        statBox('Intentos de regresar al edificio', String(result.reentryAttempts)),
        statBox('Ruta utilizada', result.route || na),
        statBox('Reinicios desde punto seguro', String(result.restarts)),
        statBox('Nivel alcanzado', result.level)
      ]);
      const table = el('table', { className: 'breakdown' }, [el('caption', { className: 'sr-only', text: 'Desglose de la puntuación' })]);
      result.breakdown.forEach((b) => table.appendChild(el('tr', null, [el('td', { text: b.label }), el('td', { text: fmt1(b.points) + ' / ' + b.max })])));
      const breakdown = el('section', { className: 'report-section' }, [el('h2', { text: 'Desglose de puntos' }), table]);
      const cols = el('div', { className: 'report-cols' }, [
        breakdown,
        listSection('Objetivos', result.objectives, null, 'Sin objetivos registrados.'),
        listSection('Decisiones seguras: aspectos por reforzar', result.reinforce, 'no', 'Ninguna: todas tus primeras respuestas fueron seguras.'),
        isSim ? listSection('Peligros identificados', result.hazardsFound, 'ok', 'No identificaste peligros en esta partida.') : null,
        isSim ? listSection('Peligros no identificados', result.hazardsMissed, 'no', 'Ninguno: identificaste todos los peligros.') : null
      ]);
      const rec = el('section', { className: 'recommendation' }, [el('h2', { text: 'Aspecto por reforzar / recomendación' })]);
      result.recommendation.forEach((r) => rec.appendChild(el('p', { text: r })));
      body.append(grid, cols, rec);
    }
    showScreen('report');
  }

  function saveResult(result) {
    const data = Store.data;
    data.history.unshift({
      date: result.date.toISOString(), mode: result.mode, scenario: result.scenarioName,
      score: result.score, level: result.level, time: Math.round(result.timeSec)
    });
    data.history = data.history.slice(0, 15);
    data.best = Math.max(data.best || 0, result.score);
    data.completed[result.completedKey] = true;
    if (!Store.save() && !saveResult.warned) {
      saveResult.warned = true;
      announce('No fue posible guardar el historial en este navegador. El juego sigue funcionando normalmente.', { type: 'warn' });
    }
    updateHeaderBest();
  }

  function showReview() {
    const r = state.lastResult;
    const list = $('reviewList');
    if (!r || !list) return;
    list.textContent = '';
    if (!r.review.length) list.appendChild(el('li', { text: 'No hay respuestas registradas.' }));
    r.review.forEach((item) => {
      list.appendChild(el('li', null, [
        el('p', null, [el('strong', { text: item.title }), ' · ' + item.theme]),
        el('p', { text: item.question }),
        el('p', null, [el('strong', { text: (item.firstSafe ? '✔ ' : '✖ ') + 'Tu primera respuesta: ' }), item.first]),
        el('p', null, [el('strong', { text: 'Respuesta recomendada: ' }), item.recommended]),
        el('p', null, [el('strong', { text: 'Explicación: ' }), item.explanation])
      ]));
    });
    openModal('modal-review', { focus: 'reviewTitle' });
  }

  function reportAsText(r) {
    const lines = [
      CONFIG.gameTitle.toUpperCase() + ': ' + CONFIG.gameSubtitle.toUpperCase(),
      'Organización: ' + CONFIG.organizationName,
      state.alias ? 'Participante (alias): ' + state.alias : null,
      'Fecha: ' + r.date.toLocaleString('es-CO'),
      '',
      (r.mode === 'simulation' ? 'MISIÓN COMPLETADA' : 'ENTRENAMIENTO COMPLETADO'),
      'Escenario: ' + r.scenarioName,
      'Puntuación: ' + r.score + '/100',
      'Nivel: ' + r.level,
      'Tiempo: ' + formatTime(r.timeSec),
      'Decisiones seguras: ' + r.safeCount + ' de ' + r.totalDecisions,
      r.hazardsFound ? 'Peligros identificados: ' + r.hazardsFound.length + ' de ' + (r.hazardsFound.length + r.hazardsMissed.length) : null,
      r.people ? 'Personas orientadas: ' + r.people.oriented + ' de ' + r.people.total : null,
      r.route ? 'Ruta utilizada: ' + r.route : null,
      'Intentos de regresar al edificio: ' + r.reentryAttempts,
      '',
      'DESGLOSE',
      ...r.breakdown.map((b) => '- ' + b.label + ': ' + fmt1(b.points) + ' / ' + b.max),
      '',
      'OBJETIVOS',
      ...r.objectives.map((o) => (o.done ? '[x] ' : '[ ] ') + o.label),
      '',
      'DECISIONES POR REFORZAR',
      ...(r.reinforce.length ? r.reinforce.map((x) => '- ' + x) : ['- Ninguna']),
      r.hazardsMissed ? '' : null,
      r.hazardsMissed ? 'PELIGROS NO IDENTIFICADOS' : null,
      ...(r.hazardsMissed ? (r.hazardsMissed.length ? r.hazardsMissed.map((x) => '- ' + x) : ['- Ninguno']) : []),
      '',
      'RECOMENDACIÓN',
      ...r.recommendation.map((x) => '- ' + x),
      '',
      'Los niveles obtenidos en este videojuego son reconocimientos educativos y no constituyen una certificación oficial en Seguridad y Salud en el Trabajo ni acreditan al participante como brigadista.',
      'Este videojuego es una herramienta educativa de apoyo. Las decisiones, rutas, puntos de encuentro y procedimientos deben ser revisados y adaptados al plan de prevención, preparación y respuesta ante emergencias vigente en cada organización.'
    ];
    return lines.filter((l) => l !== null).join('\r\n');
  }
  function downloadReport() {
    const r = state.lastResult;
    if (!r) return;
    try {
      const blob = new Blob(['﻿' + reportAsText(r)], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = el('a', { href: url, download: 'informe-mision-evacuacion-' + r.date.toISOString().slice(0, 10) + '.txt' });
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      announce('Resumen descargado.', { type: 'ok' });
    } catch (err) {
      announce('No fue posible descargar el archivo. Usa la opción «Imprimir / guardar PDF».', { type: 'warn' });
    }
  }
  function printReport() {
    try { window.print(); } catch (err) { announce('La impresión no está disponible en este navegador.', { type: 'warn' }); }
  }
  function playAgain() {
    const r = state.lastResult;
    if (r && r.mode === 'training') { startTraining(state.training ? state.training.topic : (state.selection || 'mixed')); return; }
    if (state.selection === 'random') startSimulation(randomScenario());
    else startSimulation(state.scenarioKey || 'fire');
  }
  function randomScenario() {
    const keys = Object.keys(SCENARIOS).filter(scenarioEnabled);
    return keys.length ? pick(keys) : 'fire';
  }

  /* =======================================================================
     19. MENÚ, SELECCIÓN DE ESCENARIO, HISTORIAL Y CONFIGURACIÓN
     ======================================================================= */
  function renderMenu() {
    const greeting = state.alias ? 'Hola, ' + state.alias + '. ' : '';
    setText('menuGreeting', greeting + CONFIG.institutionalMessage + ' Selecciona una opción para comenzar.');
    setText('menuStorageNote', Store.available ? '' : 'Aviso: el almacenamiento local no está disponible. Puedes jugar normalmente, pero el historial no se conservará al cerrar.');
  }

  function renderScenarioOptions() {
    const wrap = $('scenarioOptions');
    if (!wrap) return;
    if (!state.mode) state.mode = 'simulation';
    const training = state.mode === 'training';
    setText('h-scenario', training ? 'Selecciona el tema de entrenamiento' : 'Selecciona el escenario');
    setText('scenarioIntro', training ? 'Elige los temas de las situaciones. Sin límite de tiempo y con explicación después de cada respuesta.' : 'Elige la emergencia que quieres practicar en el mapa.');
    setText('scenarioLegend', training ? 'Temas de entrenamiento disponibles' : 'Escenarios disponibles');
    const fireOn = CONFIG.enableFireScenario;
    const quakeOn = CONFIG.enableEarthquakeScenario;
    const items = training
      ? [
        { value: 'fire', code: 'Incendio', title: 'Alarmas, humo, rutas y punto de encuentro', tag: 'Entrenamiento', enabled: fireOn },
        { value: 'quake', code: 'Sismo', title: 'Antes, durante y después del movimiento', tag: 'Entrenamiento', enabled: quakeOn },
        { value: 'mixed', code: 'Mixto', title: 'Situaciones combinadas de todos los temas', tag: 'Entrenamiento', enabled: fireOn || quakeOn }
      ]
      : [
        { value: 'fire', code: SCENARIOS.fire.name, title: SCENARIOS.fire.description, tag: 'Incendio', enabled: fireOn },
        { value: 'quake', code: SCENARIOS.quake.name, title: SCENARIOS.quake.description, tag: 'Sismo', enabled: quakeOn },
        { value: 'random', code: 'Emergencia sorpresa', title: 'El juego elige al azar entre los escenarios habilitados.', tag: 'Aleatorio', enabled: fireOn && quakeOn }
      ];
    wrap.textContent = '';
    state.selection = null;
    const err = $('scenarioError');
    if (err) err.hidden = true;
    items.forEach((it) => {
      const input = el('input', { type: 'radio', name: 'scenario', value: it.value, disabled: !it.enabled });
      input.addEventListener('change', () => { state.selection = it.value; if (err) err.hidden = true; Sound.play('select'); });
      const card = el('span', { className: 'scenario-card' }, [
        el('span', { className: 'scenario-tag', text: it.tag }),
        el('span', { className: 'scenario-code', text: it.code }),
        el('span', { text: it.title }),
        it.enabled ? el('span', { className: 'scenario-check', text: '▶ Seleccionado' }) : el('span', { className: 'small-note', text: 'Desactivado en la configuración.' })
      ]);
      wrap.appendChild(el('label', { className: 'scenario-option' }, [input, card]));
    });
  }

  function submitScenario(e) {
    e.preventDefault();
    const err = $('scenarioError');
    if (!state.selection) {
      if (err) { err.textContent = state.mode === 'training' ? 'Selecciona un tema antes de comenzar.' : 'Selecciona un escenario antes de comenzar.'; err.hidden = false; }
      const first = document.querySelector('#scenarioOptions input:not([disabled])');
      if (first) first.focus();
      Sound.play('wrong');
      return;
    }
    Sound.play('select');
    if (state.mode === 'training') startTraining(state.selection);
    else startSimulation(state.selection === 'random' ? randomScenario() : state.selection);
  }

  function renderHistory() {
    const data = Store.data;
    const summary = $('historySummary');
    const wrap = $('historyTableWrap');
    if (summary) {
      summary.textContent = '';
      const done = data.completed;
      summary.append(
        el('span', { className: 'tag tag-accent', text: 'Mejor puntuación: ' + (data.best > 0 ? data.best + '/100' : '—') }),
        el('span', { className: 'tag', text: 'Partidas registradas: ' + data.history.length }),
        el('span', { className: 'tag', text: (done.fire ? '✔' : '✖') + ' Incendio' }),
        el('span', { className: 'tag', text: (done.quake ? '✔' : '✖') + ' Sismo' }),
        el('span', { className: 'tag', text: (done.training ? '✔' : '✖') + ' Entrenamiento' })
      );
    }
    if (!wrap) return;
    wrap.textContent = '';
    if (!data.history.length) {
      wrap.appendChild(el('p', { className: 'callout callout-soft', text: 'Aún no hay partidas registradas. ¡Completa una misión o un entrenamiento!' }));
      return;
    }
    const table = el('table', { className: 'pixel-table' }, [
      el('caption', { className: 'sr-only', text: 'Últimas partidas' }),
      el('thead', null, [el('tr', null, ['Fecha', 'Modo', 'Escenario', 'Puntos', 'Nivel', 'Tiempo'].map((h) => el('th', { scope: 'col', text: h })))])
    ]);
    const tbody = el('tbody');
    data.history.forEach((h) => {
      const d = new Date(h.date);
      tbody.appendChild(el('tr', null, [
        el('td', { text: isNaN(d) ? '—' : d.toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' }) }),
        el('td', { text: h.mode === 'training' ? 'Entrenamiento' : 'Simulación' }),
        el('td', { text: h.scenario }),
        el('td', { className: 'num', text: String(h.score) }),
        el('td', { text: h.level }),
        el('td', { text: formatTime(h.time) })
      ]));
    });
    table.appendChild(tbody);
    wrap.appendChild(table);
  }

  function syncSettingsUI() {
    const sound = $('setSound');
    if (sound) { sound.setAttribute('aria-checked', String(state.sound)); setText(sound.querySelector('.switch-text'), state.sound ? 'Sí' : 'No'); }
    const motion = $('setMotion');
    if (motion) { motion.setAttribute('aria-checked', String(state.reducedMotion)); setText(motion.querySelector('.switch-text'), state.reducedMotion ? 'Sí' : 'No'); }
    const theme = $('setTheme');
    if (theme) theme.value = state.theme;
    const size = $('setTextSize');
    if (size) size.value = state.textSize;
    const alias = $('setAlias');
    if (alias && document.activeElement !== alias) alias.value = state.alias;
    setText('storageStatus', Store.available
      ? 'Tus preferencias, alias e historial se guardan solo en este navegador.'
      : 'El almacenamiento local no está disponible: el juego funciona, pero los cambios no se conservarán al cerrar.');
  }

  function saveAlias(e) {
    e.preventDefault();
    const input = $('setAlias');
    const error = $('aliasError');
    if (!input) return;
    const value = input.value.trim().replace(/\s+/g, ' ');
    let message = '';
    if (value.length > 20) message = 'El alias puede tener como máximo 20 caracteres.';
    else if (value && !/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9 ]+$/.test(value)) message = 'Usa solo letras, números y espacios.';
    else if (/\d{6,}/.test(value.replace(/\s/g, ''))) message = 'Por privacidad, no uses números largos como documentos o teléfonos.';
    if (message) {
      if (error) { error.textContent = message; error.hidden = false; }
      input.setAttribute('aria-invalid', 'true');
      input.focus();
      return;
    }
    if (error) error.hidden = true;
    input.removeAttribute('aria-invalid');
    state.alias = value;
    savePreferences();
    announce(value ? 'Alias guardado: ' + value + '.' : 'Alias eliminado.', { type: 'ok' });
  }

  function resetProgress() {
    confirmAction({
      title: 'Borrar progreso local',
      message: 'Se eliminarán la mejor puntuación, el historial, los escenarios completados, el alias y las preferencias guardadas en este navegador. Esta acción no se puede deshacer.',
      confirmText: 'Borrar progreso',
      onConfirm: () => {
        Store.clear();
        loadPreferences();
        applyPreferences();
        if (state.screen === 'history') renderHistory();
        if (state.screen === 'menu') renderMenu();
        announce('Progreso local eliminado.', { type: 'ok' });
      }
    });
  }

  /* =======================================================================
     20. EVENTOS E INICIALIZACIÓN
     ======================================================================= */
  const KEY_DIRS = {
    ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
    w: 'up', W: 'up', s: 'down', S: 'down', a: 'left', A: 'left', d: 'right', D: 'right'
  };

  const ACTIONS = {
    goto: (btn) => { Sound.play('select'); showScreen(btn.getAttribute('data-target')); },
    back: () => { Sound.play('select'); goBack(); },
    'choose-mode': (btn) => { Sound.play('select'); state.mode = btn.getAttribute('data-mode') === 'training' ? 'training' : 'simulation'; showScreen('scenario'); },
    'toggle-sound': toggleSound,
    'toggle-motion': toggleMotion,
    'reset-progress': resetProgress,
    'exit-training': exitTraining,
    pause: pauseGame,
    resume: resumeGame,
    'restart-scenario': restartScenario,
    'show-controls': () => openModal('modal-controls', { focus: 'controlsTitle' }),
    'quit-to-menu': quitToMenu,
    interact: () => interact(),
    'play-again': () => { Sound.play('select'); playAgain(); },
    'review-answers': showReview,
    'print-report': printReport,
    'download-report': downloadReport,
    'close-modal': () => { const top = topModal(); if (top) closeModal(top.id); }
  };

  function handleKeydown(e) {
    if (e.key === 'Tab' && isModalOpen()) { trapFocus(e); return; }
    if (e.key === 'Escape') {
      if (isModalOpen()) {
        e.preventDefault();
        const top = topModal();
        if (top.onEscape) top.onEscape(); else closeModal(top.id);
        return;
      }
      if (state.screen === 'sim') { e.preventDefault(); pauseGame(); return; }
      if (state.screen === 'training') { e.preventDefault(); exitTraining(); return; }
      if (SECONDARY.includes(state.screen) || state.screen === 'mode' || state.screen === 'scenario') { e.preventDefault(); goBack(); }
      return;
    }
    // Atajos 1-4 para elegir opciones.
    if (/^[1-4]$/.test(e.key) && decisionUIVisible()) {
      const opt = activeDecisionUI.options[Number(e.key) - 1];
      if (opt) { e.preventDefault(); activeDecisionUI.choose(opt); }
      return;
    }
    if (state.screen !== 'sim' || isModalOpen()) return;
    const tag = e.target && e.target.tagName;
    if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return;
    const onButton = tag === 'BUTTON';
    const dir = KEY_DIRS[e.key];
    if (dir) {
      e.preventDefault();
      if (!e.repeat || !heldDirs.includes(dir)) holdDir(dir);
      return;
    }
    if (e.key === 'p' || e.key === 'P') { e.preventDefault(); pauseGame(); return; }
    if ((e.key === 'e' || e.key === 'E') || (!onButton && (e.key === ' ' || e.key === 'Enter'))) {
      e.preventDefault();
      if (!e.repeat) interact();
    }
  }
  function handleKeyup(e) {
    const dir = KEY_DIRS[e.key];
    if (dir) releaseDir(dir);
  }

  function bindEvents() {
    // Acciones declarativas mediante data-action (un único registro).
    on(document, 'click', (e) => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      const action = ACTIONS[btn.getAttribute('data-action')];
      if (action) action(btn);
    });
    on(document, 'keydown', handleKeydown);
    on(document, 'keyup', handleKeyup);
    on(window, 'blur', releaseAllDirs);
    on(document, 'visibilitychange', () => {
      if (document.hidden && state.screen === 'sim' && state.run && !state.run.completed && !isModalOpen()) pauseGame();
    });
    on($('confirmYes'), 'click', () => resolveConfirm(true));
    on($('confirmNo'), 'click', () => resolveConfirm(false));
    on($('messageOk'), 'click', resolveMessage);
    on($('scenarioForm'), 'submit', submitScenario);
    on($('aliasForm'), 'submit', saveAlias);
    on($('setTheme'), 'change', (e) => { state.theme = e.target.value === 'light' ? 'light' : 'dark'; savePreferences(); applyPreferences(); });
    on($('setTextSize'), 'change', (e) => { state.textSize = e.target.value === 'large' ? 'large' : 'normal'; savePreferences(); applyPreferences(); });
    on($('mapWrap'), 'pointerdown', () => { const map = $('mapWrap'); if (map) map.focus({ preventScroll: true }); });

    // Controles táctiles: mantener presionado para avanzar de casilla en casilla.
    document.querySelectorAll('.dpad-btn').forEach((btn) => {
      const dir = btn.getAttribute('data-dir');
      on(btn, 'pointerdown', (e) => {
        e.preventDefault();
        try { btn.setPointerCapture(e.pointerId); } catch (err) { /* algunos navegadores no admiten la captura */ }
        btn.classList.add('is-held');
        holdDir(dir);
      });
      const release = () => releaseDir(dir);
      on(btn, 'pointerup', release);
      on(btn, 'pointercancel', release);
      on(btn, 'lostpointercapture', release);
      // Activación por teclado (Enter/Espacio sobre el botón): un paso.
      on(btn, 'click', (e) => { if (e.detail === 0) tryMove(dir); });
      on(btn, 'contextmenu', (e) => e.preventDefault());
    });

    on(window, 'error', () => {
      announce('Ocurrió un problema inesperado. Si el juego no responde, vuelve al menú principal.', { type: 'warn' });
    });
  }

  function runLoadingScreen() {
    const fill = $('loadingFill');
    const bar = $('loadingBar');
    const steps = state.reducedMotion ? [100] : [20, 45, 70, 90, 100];
    let i = 0;
    const tick = () => {
      const v = steps[i];
      if (fill) fill.style.width = v + '%';
      if (bar) bar.setAttribute('aria-valuenow', String(v));
      i++;
      if (i < steps.length) window.setTimeout(tick, 150);
      else window.setTimeout(() => showScreen('welcome'), 220);
    };
    tick();
  }

  // Herramientas de verificación de solo lectura (útiles para pruebas automatizadas).
  window.MisionEvacuacion = {
    version: '1.0.0',
    qa: {
      snapshot() {
        const run = state.run;
        return {
          screen: state.screen, mode: state.mode, sound: state.sound, reducedMotion: state.reducedMotion,
          run: run ? {
            scenario: run.scenarioKey, phase: run.phase, player: { x: run.player.x, y: run.player.y, moving: run.player.moving },
            risk: run.risk, opportunities: run.opportunities, time: run.time, paused: run.paused, completed: run.completed,
            pending: run.pendingDecision, done: Array.from(run.triggersDone), identified: Array.from(run.identified),
            hazards: run.hazards.map((h) => ({ id: h.hazardId, x: h.x, y: h.y, wall: h.wall })),
            npcs: run.entities.filter((e) => e.kind === 'npc').map((e) => ({ id: e.npc, x: e.x, y: e.y })),
            route: run.route, reentry: run.reentryAttempts, objectives: Array.from(run.objectives),
            score: computeSimScore(run, false), penalties: run.penalties.map((p) => p.code)
          } : null,
          training: state.training ? { index: state.training.index, total: state.training.questions.length, score: state.training.score } : null,
          lastResult: state.lastResult ? { score: state.lastResult.score, level: state.lastResult.level, safe: state.lastResult.safeCount, total: state.lastResult.totalDecisions } : null
        };
      },
      pathTo(x, y, adjacent) {
        const run = state.run;
        if (!run) return null;
        return findPath(run, { x: run.player.x, y: run.player.y }, { x, y }, { adjacent: !!adjacent, avoidLight: true }) ||
          findPath(run, { x: run.player.x, y: run.player.y }, { x, y }, { adjacent: !!adjacent });
      },
      safeOptionIndex() {
        if (!activeDecisionUI || activeDecisionUI.answered) return -1;
        return activeDecisionUI.options.findIndex((o) => o.safe);
      }
    }
  };

  function init() {
    loadPreferences();
    applyInstitutionalTexts();
    applyPreferences();
    bindEvents();
    drawWelcomeArt();
    renderMenu();
    runLoadingScreen();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
