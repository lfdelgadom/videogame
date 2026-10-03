Actúa como un equipo multidisciplinario integrado por:

1. Un desarrollador web front-end senior especializado en HTML5, CSS3 y JavaScript puro.
2. Un diseñador de videojuegos educativos y simulaciones interactivas.
3. Un diseñador UX/UI especializado en accesibilidad para público adulto.
4. Un diseñador de aprendizaje especializado en capacitación corporativa.
5. Un asesor conceptual en Seguridad y Salud en el Trabajo, SG-SST, prevención, preparación y respuesta ante emergencias.
6. Un especialista en control de calidad de aplicaciones web desplegables en GitHub Pages.

Tu tarea es diseñar, desarrollar, probar y entregar un videojuego web educativo completo llamado:

“MISIÓN EVACUACIÓN 8-BIT: CADA DECISIÓN CUENTA”

El videojuego estará orientado a capacitar colaboradores adultos en temas relacionados con Seguridad y Salud en el Trabajo, evacuación, identificación de riesgos y actuación frente a emergencias como incendios y sismos.

No te limites a explicar cómo construir el proyecto. Debes generar directamente todos los archivos completos, funcionales y listos para descargar, abrir en el navegador y publicar en GitHub Pages.

==================================================
1. OBJETIVO GENERAL DEL VIDEOJUEGO
==================================================

Desarrolla un videojuego web educativo con estética retro de 8 bits, en el que una persona deba tomar decisiones seguras durante diferentes emergencias simuladas dentro de una organización.

El videojuego debe enseñar, reforzar y evaluar temas como:

- Reconocimiento de alarmas.
- Identificación del tipo de emergencia.
- Identificación de peligros y condiciones inseguras.
- Seguimiento de rutas de evacuación.
- Reconocimiento de rutas alternativas.
- Conducta segura durante un incendio.
- Conducta segura durante y después de un sismo.
- Uso adecuado de salidas y escaleras.
- Comportamiento en el punto de encuentro.
- Importancia de no regresar por objetos personales.
- Orientación de visitantes.
- Apoyo seguro a otras personas.
- Reporte de novedades.
- Seguimiento de instrucciones de brigadistas y responsables de emergencia.

El juego debe dejar claro que su contenido es educativo y complementario. No reemplaza:

- El plan de emergencias de la organización.
- Los simulacros presenciales.
- La capacitación institucional.
- Las instrucciones de los brigadistas.
- Los procedimientos internos.
- Las recomendaciones de las autoridades competentes.

Incluye este aviso dentro de la pantalla de bienvenida y en una sección de información.

==================================================
2. PÚBLICO OBJETIVO
==================================================

El público objetivo está formado por colaboradores adultos de diferentes edades, aproximadamente entre los 25 años y la edad de pensión aplicable en Colombia.

Por esta razón, el videojuego debe:

- Tener controles sencillos.
- Evitar depender de reflejos rápidos.
- Evitar una presentación excesivamente infantil.
- Utilizar un lenguaje profesional, claro y cercano.
- Tener botones grandes.
- Usar textos legibles.
- Ofrecer alto contraste.
- Permitir jugar sin límite estricto de tiempo en el modo de entrenamiento.
- Explicar por qué una decisión es correcta o incorrecta.
- Permitir volver a intentar una situación.
- Incluir instrucciones visibles y comprensibles.
- Ser accesible para personas que no están familiarizadas con videojuegos.
- Poder utilizarse individualmente o proyectarse durante una capacitación grupal.

La estética debe ser retro, llamativa y nostálgica, pero también adulta, académica e institucional.

==================================================
3. REQUISITOS TÉCNICOS OBLIGATORIOS
==================================================

Desarrolla el proyecto utilizando exclusivamente:

- HTML5.
- CSS3.
- JavaScript puro o Vanilla JavaScript.
- Canvas 2D de HTML5, si resulta útil para construir el mapa y los personajes.

No utilices:

- React.
- Angular.
- Vue.
- TypeScript.
- Node.js.
- PHP.
- Python.
- Bases de datos.
- Servidores.
- APIs que requieran claves.
- Sistemas de autenticación.
- Dependencias que requieran instalación.
- Procesos de compilación.
- npm.
- Frameworks de videojuegos.
- Librerías obligatorias que puedan impedir la ejecución directa.
- Rutas absolutas.
- Rutas locales del computador del desarrollador.

La aplicación debe funcionar abriendo el archivo index.html desde un navegador moderno y también al publicarla mediante GitHub Pages.

Todos los archivos deben utilizar rutas relativas.

El proyecto debe ser completamente estático y funcionar en:

- Google Chrome.
- Microsoft Edge.
- Mozilla Firefox.
- Safari, cuando las funciones utilizadas sean compatibles.

==================================================
4. ESTRUCTURA DEL PROYECTO
==================================================

Todos los archivos deben encontrarse en el mismo directorio raíz.

No crees subdirectorios ni carpetas como:

- assets
- images
- css
- js
- sounds
- fonts
- components

Entrega como mínimo los siguientes archivos:

- index.html
- styles.css
- script.js
- README.md

Si utilizas imágenes, iconos, personajes o sonidos adicionales, también deben estar directamente en el directorio principal. Sin embargo, prioriza recursos creados con:

- CSS.
- HTML.
- Canvas.
- Emojis accesibles.
- Formas geométricas.
- Sprites dibujados directamente mediante Canvas.
- Sonidos generados con Web Audio API.

No dependas de recursos externos que puedan desaparecer o generar errores de CORS.

El proyecto final debe entregarse también como un archivo ZIP descargable que contenga todos los archivos directamente en la raíz, sin una carpeta adicional envolviendo el proyecto.

==================================================
5. CONCEPTO GENERAL DEL JUEGO
==================================================

El jugador controla un personaje dentro de una instalación representada mediante un mapa retro de vista superior.

El mapa puede representar:

- Una oficina.
- Una universidad.
- Un edificio administrativo.
- Un laboratorio.
- Una planta de trabajo simplificada.

Durante una jornada aparentemente normal se activa una emergencia. El jugador debe interpretar la situación, tomar decisiones seguras, desplazarse por la instalación y llegar correctamente al punto de encuentro.

El objetivo no debe ser escapar a cualquier costo. El objetivo debe ser:

- Tomar decisiones seguras.
- Reconocer peligros.
- Seguir el procedimiento.
- Utilizar una ruta adecuada.
- Orientar a otras personas cuando sea seguro.
- Reportarse en el punto de encuentro.
- No regresar al edificio sin autorización.

La velocidad debe tener una importancia menor que la calidad de las decisiones.

==================================================
6. MODOS DE JUEGO
==================================================

La pantalla principal debe permitir seleccionar al menos dos modos.

------------------------------
6.1. MODO ENTRENAMIENTO
------------------------------

Este modo debe funcionar mediante situaciones y preguntas de toma de decisiones.

Características:

- Sin límite de tiempo obligatorio.
- Explicación después de cada respuesta.
- Posibilidad de volver a intentar.
- Indicador de progreso.
- Retroalimentación educativa.
- Puntuación secundaria.
- Enfoque centrado en el aprendizaje.
- Al menos 12 situaciones diferentes.
- Orden aleatorio o parcialmente aleatorio.
- Evitar que siempre aparezcan las opciones en la misma posición.

Cada situación debe contener:

- Un contexto breve.
- Una pregunta.
- Entre tres y cuatro opciones.
- Una respuesta recomendada.
- Una explicación.
- El riesgo que se evita.
- La categoría temática.
- Los puntos obtenidos.
- Una advertencia para validar el contenido con el protocolo institucional.

Ejemplo de estructura conceptual:

Situación:
“Se activa la alarma y observas humo en el corredor que utilizas habitualmente.”

Pregunta:
“¿Qué deberías hacer?”

Opciones:
A. Atravesar rápidamente el corredor con humo.
B. Regresar a buscar tus objetos personales.
C. Utilizar la ruta alternativa prevista y seguir las instrucciones.
D. Usar el ascensor para salir más rápido.

Después de responder, mostrar:

- Respuesta recomendada.
- Explicación pedagógica.
- Riesgo evitado.
- Puntuación obtenida.
- Botón “Continuar”.
- Botón “Intentar nuevamente”, cuando corresponda.

No presentes las respuestas como universales si pueden depender del protocolo de la organización. Usa expresiones como:

- “Según el protocolo configurado para esta simulación…”
- “En una implementación institucional, esta instrucción debe ajustarse al plan de emergencias vigente.”
- “Sigue siempre la señalización y las instrucciones oficiales de tu organización.”

------------------------------
6.2. MODO SIMULACIÓN
------------------------------

Este modo debe representar una instalación mediante un mapa retro interactivo.

El jugador debe poder desplazarse utilizando:

- Flechas del teclado.
- Teclas WASD.
- Botones direccionales en pantalla para dispositivos táctiles.

Incluye un botón de interacción con una tecla asociada, por ejemplo:

- Tecla E.
- Barra espaciadora.
- Botón táctil “Interactuar”.

El mapa inicial debe incluir como mínimo:

- Puesto de trabajo inicial.
- Oficina o aula.
- Corredores.
- Salida principal.
- Salida alternativa.
- Escalera.
- Ascensor.
- Señales de evacuación.
- Extintor decorativo o interactivo.
- Botiquín.
- Zona con peligro.
- Visitante desorientado.
- Colaborador que intenta regresar.
- Brigadista o responsable de evacuación.
- Punto de encuentro exterior.

El ascensor debe representar una decisión que debe evaluarse de acuerdo con el escenario y el protocolo configurado.

El jugador debe poder interactuar con objetos y personajes. Al acercarse, debe aparecer una indicación como:

“Presiona E para interactuar”.

==================================================
7. ESCENARIOS OBLIGATORIOS
==================================================

Incluye por lo menos dos escenarios completamente funcionales.

------------------------------
7.1. ESCENARIO DE INCENDIO
------------------------------

Nombre sugerido:

“CÓDIGO ROJO: RUTA SEGURA”

El escenario debe comenzar con una alarma y una señal visual de humo o peligro.

Incluye situaciones como:

- Corredor habitual con humo.
- Ruta principal bloqueada.
- Ruta alternativa disponible.
- Persona que intenta devolverse por su teléfono.
- Visitante que no conoce la salida.
- Puerta que no corresponde a una salida.
- Ascensor visible.
- Señalización de emergencia.
- Punto de encuentro.

El jugador debe:

1. Reconocer la alarma.
2. Evitar la ruta peligrosa.
3. Identificar una ruta alternativa.
4. Seguir la señalización.
5. Orientar al visitante de manera segura.
6. Evitar regresar por objetos.
7. Llegar al punto de encuentro.
8. Reportarse.
9. Esperar instrucciones.

Agrega un indicador llamado “Nivel de riesgo” o “Nivel de humo”. No lo utilices para fomentar que el jugador corra descontroladamente. Debe funcionar como un recurso visual y educativo.

No incluyas:

- Imágenes gráficas.
- Lesiones explícitas.
- Personas quemándose.
- Muerte.
- Escenas que puedan resultar perturbadoras.

------------------------------
7.2. ESCENARIO DE SISMO
------------------------------

Nombre sugerido:

“ALERTA SÍSMICA: ANTES, DURANTE Y DESPUÉS”

Divide el escenario en tres momentos:

1. Antes.
2. Durante.
3. Después.

En la fase “Antes”, el jugador debe identificar condiciones como:

- Objetos pesados ubicados en altura.
- Estanterías inestables.
- Salidas bloqueadas.
- Señalización ausente.
- Elementos que pueden caer.
- Desconocimiento del punto de encuentro.

En la fase “Durante”, presenta diferentes decisiones y evalúalas según el protocolo definido para la simulación.

En la fase “Después”, el jugador debe:

- Evaluar visualmente riesgos cercanos.
- Seguir las instrucciones.
- Evacuar cuando el procedimiento lo indique.
- Evitar zonas con elementos caídos.
- Utilizar la ruta segura.
- Llegar al punto de encuentro.
- Reportar novedades observadas.
- Permanecer en el sitio hasta recibir instrucciones.

Incluye un efecto visual de movimiento moderado. Agrega una opción para reducir o desactivar este efecto por accesibilidad.

==================================================
8. EVENTOS ALEATORIOS
==================================================

Para que las partidas no sean idénticas, implementa eventos aleatorios controlados.

En cada partida puede cambiar:

- La emergencia inicial.
- La ubicación de ciertos obstáculos.
- La ruta bloqueada.
- La posición del visitante.
- Las preguntas de decisión.
- El orden de las opciones.
- Uno o dos riesgos visibles.
- La ubicación de un objeto inseguro.
- La disponibilidad de una ruta.

La aleatoriedad no debe generar escenarios imposibles. Siempre debe existir al menos una ruta válida para completar la misión.

Utiliza estructuras de datos de JavaScript para organizar:

- Escenarios.
- Preguntas.
- Opciones.
- Explicaciones.
- Peligros.
- Eventos.
- Objetivos.
- Retroalimentaciones.

==================================================
9. MECÁNICA DE DECISIONES
==================================================

Durante la simulación deben aparecer momentos de decisión.

Ejemplos:

- Se activa la alarma.
- Hay humo en el corredor habitual.
- Un visitante pregunta qué debe hacer.
- Un compañero desea regresar por un objeto.
- La salida principal está bloqueada.
- El ascensor está disponible.
- Una persona informa sobre un posible lesionado.
- El jugador llega al punto de encuentro.
- Alguien propone volver al edificio.
- Se observa una condición insegura durante el recorrido.

Cada decisión debe incluir:

- Contexto.
- Opciones.
- Consecuencia educativa.
- Puntos.
- Cambio del nivel de riesgo.
- Explicación.
- Posibilidad de continuar.

Las decisiones incorrectas no deben terminar automáticamente la partida, salvo que sea necesario para enseñar una consecuencia crítica. En general, deben producir:

- Pérdida de puntos.
- Aumento del nivel de riesgo.
- Explicación del error.
- Oportunidad de corregir.
- Reinicio desde un punto seguro, si corresponde.

==================================================
10. SISTEMA DE PUNTUACIÓN
==================================================

Implementa una puntuación total de 100 puntos con esta distribución:

- 40 puntos: decisiones seguras.
- 25 puntos: identificación de peligros.
- 20 puntos: cumplimiento de la ruta y del procedimiento.
- 10 puntos: orientación o apoyo adecuado a otras personas.
- 5 puntos: tiempo de respuesta.

La velocidad nunca debe valer más que la seguridad.

Evita premiar comportamientos como:

- Correr sin control.
- Ignorar a otras personas.
- Atravesar zonas de peligro.
- Tomar atajos inseguros.
- Regresar por pertenencias.
- Usar una ruta no autorizada.

Utiliza los siguientes niveles:

- 0 a 49 puntos: Aprendiz preventivo.
- 50 a 69 puntos: Observador de riesgos.
- 70 a 84 puntos: Guardián de la seguridad.
- 85 a 94 puntos: Líder de evacuación.
- 95 a 100 puntos: Brigadista retro.

Incluye una aclaración visible:

“Los niveles obtenidos en este videojuego son reconocimientos educativos y no constituyen una certificación oficial en Seguridad y Salud en el Trabajo ni acreditan al participante como brigadista.”

==================================================
11. SISTEMA DE VIDAS Y RIESGO
==================================================

No utilices un sistema violento de vidas o muertes.

En su lugar, utiliza:

- Tres oportunidades de corrección.
- Barra de nivel de riesgo.
- Puntos de seguridad.
- Alertas preventivas.
- Reinicio desde el último punto seguro.

Cuando el nivel de riesgo aumente, muestra mensajes educativos, por ejemplo:

- “Esta decisión incrementó el riesgo.”
- “Observa la señalización antes de continuar.”
- “La velocidad no reemplaza una decisión segura.”
- “Consulta la ruta alternativa.”
- “No regreses por objetos personales.”

==================================================
12. INFORME FINAL DE LA PARTIDA
==================================================

Al completar una misión, muestra una pantalla detallada de resultados.

Incluye:

- Nombre del escenario.
- Puntuación total.
- Nivel alcanzado.
- Tiempo empleado.
- Decisiones seguras.
- Decisiones por reforzar.
- Peligros identificados.
- Peligros no identificados.
- Ruta utilizada.
- Personas orientadas.
- Objetivos completados.
- Intentos de regresar al edificio.
- Recomendación educativa personalizada.
- Botón para jugar nuevamente.
- Botón para volver al menú.
- Botón para revisar respuestas.
- Botón para descargar o imprimir el resultado.

Ejemplo visual:

“MISIÓN COMPLETADA

Escenario: Código Rojo
Puntuación: 86/100
Nivel: Líder de evacuación
Decisiones seguras: 8 de 10
Peligros identificados: 4 de 5
Personas orientadas: 2
Tiempo: 03:14

Aspecto por reforzar:
Identifica la ruta alternativa antes de acercarte a un corredor con humo.”

Permite imprimir el reporte utilizando estilos CSS para impresión.

No recopiles información personal sensible.

==================================================
13. HISTORIAL Y ALMACENAMIENTO LOCAL
==================================================

Utiliza localStorage únicamente para guardar datos locales como:

- Mejor puntuación.
- Últimas partidas.
- Escenarios completados.
- Preferencia de sonido.
- Preferencia de modo claro u oscuro.
- Preferencia de reducción de movimiento.
- Alias opcional del jugador.

No almacenes:

- Documentos de identidad.
- Correos.
- Teléfonos.
- Información médica.
- Datos sensibles.

Incluye un botón:

“Borrar progreso local”.

Solicita confirmación antes de eliminar los datos.

La aplicación debe seguir funcionando si localStorage no está disponible. Maneja los errores mediante try/catch.

==================================================
14. PERSONALIZACIÓN INSTITUCIONAL
==================================================

Crea dentro de script.js un objeto de configuración claramente identificado al comienzo del archivo.

Ejemplo conceptual:

const CONFIG = {
  organizationName: "Mi organización",
  gameTitle: "Misión Evacuación 8-Bit",
  meetingPoint: "Punto de encuentro principal",
  emergencyContact: "Canal interno definido por la organización",
  enableFireScenario: true,
  enableEarthquakeScenario: true,
  soundEnabled: true,
  reducedMotionDefault: false
};

El contenido del videojuego debe poder modificarse fácilmente desde este objeto o desde arreglos claramente organizados.

Agrega comentarios en el código para indicar dónde personalizar:

- Nombre de la organización.
- Logo o identificador institucional.
- Colores.
- Nombre del punto de encuentro.
- Mensajes institucionales.
- Tipos de alarma.
- Rutas.
- Escenarios.
- Preguntas.
- Respuestas recomendadas.
- Retroalimentaciones.
- Datos de contacto interno.

No incluyas números de emergencia o instrucciones institucionales inventadas. Usa textos configurables.

==================================================
15. DISEÑO VISUAL RETRO
==================================================

Crea una identidad visual inspirada en videojuegos de 8 y 16 bits.

El diseño debe incluir:

- Pixel art generado con CSS o Canvas.
- Bordes pixelados.
- Paneles retro.
- Sombras duras controladas.
- Indicadores tipo arcade.
- Transiciones cortas.
- Paleta de colores consistente.
- Fondo inspirado en instalaciones corporativas.
- Personajes sencillos pero reconocibles.
- Señales claras de salida y peligro.
- Animaciones moderadas.
- Pantallas de misión.
- Pantalla de puntuación.
- Insignias o medallas.

Evita:

- Diseño infantil.
- Exceso de colores fluorescentes.
- Animaciones constantes.
- Texto demasiado pequeño.
- Parpadeos rápidos.
- Efectos que dificulten la lectura.
- Saturación visual.
- Representaciones gráficas de lesiones.

La interfaz debe conservar una presentación profesional y apropiada para capacitación institucional.

==================================================
16. SONIDO
==================================================

Agrega efectos de sonido retro utilizando Web Audio API o archivos locales ligeros.

Incluye sonidos para:

- Selección de botones.
- Respuesta correcta.
- Respuesta por reforzar.
- Inicio de misión.
- Identificación de peligro.
- Llegada al punto de encuentro.
- Finalización de nivel.

Implementa:

- Botón para activar o desactivar sonido.
- Volumen moderado.
- Preferencia guardada localmente.
- Ningún sonido automático antes de una interacción del usuario.
- Ningún sonido estridente o prolongado.
- Alternativas visuales para todas las alertas auditivas.

La aplicación debe funcionar correctamente aunque el navegador bloquee el audio.

==================================================
17. ACCESIBILIDAD
==================================================

Aplica buenas prácticas de accesibilidad.

Incluye obligatoriamente:

- HTML semántico.
- Atributo lang="es".
- Etiquetas visibles.
- Texto alternativo cuando corresponda.
- Navegación mediante teclado.
- Indicadores claros de foco.
- Botón para reducir movimiento.
- Botón para activar o desactivar sonido.
- Alto contraste.
- Tamaño de texto legible.
- Botones táctiles grandes.
- Instrucciones que no dependan exclusivamente del color.
- Mensajes comprensibles.
- Modales accesibles.
- Atributos ARIA únicamente cuando sean necesarios.
- Regiones aria-live para mensajes importantes.
- Posibilidad de cerrar ventanas mediante Escape.
- Control completo sin utilizar un ratón.
- Compatibilidad razonable con lectores de pantalla en menús, preguntas y resultados.

No utilices:

- Destellos rápidos.
- Parpadeos.
- Vibraciones visuales intensas.
- Texto sobre fondos con bajo contraste.
- Controles reconocibles únicamente por color.
- Límites de tiempo obligatorios en el modo de entrenamiento.

==================================================
18. DISEÑO RESPONSIVE
==================================================

La aplicación debe adaptarse a:

- Computadores de escritorio.
- Portátiles.
- Tabletas.
- Teléfonos móviles.

En pantallas táctiles:

- Mostrar controles direccionales.
- Mostrar botón de interacción.
- Usar botones con tamaño táctil cómodo.
- Evitar desplazamientos involuntarios de la página durante el juego.
- Mantener el mapa visible.
- Ajustar paneles y textos.
- Permitir orientación vertical y horizontal.

En computadores:

- Permitir teclado.
- Mostrar las teclas disponibles.
- Mantener el área de juego centrada.
- Ofrecer un tamaño máximo legible.
- Evitar que el mapa se deforme.

==================================================
19. PANTALLAS DE LA APLICACIÓN
==================================================

Implementa como mínimo las siguientes pantallas o vistas:

1. Pantalla de carga breve.
2. Pantalla de bienvenida.
3. Aviso educativo y de uso.
4. Menú principal.
5. Selección de modo.
6. Selección de escenario.
7. Instrucciones y controles.
8. Modo entrenamiento.
9. Modo simulación.
10. Pantalla de pausa.
11. Retroalimentación de decisiones.
12. Informe final.
13. Historial local.
14. Configuración.
15. Información sobre el proyecto.
16. Créditos.
17. Confirmación para reiniciar progreso.

El cambio entre pantallas debe realizarse sin recargar innecesariamente la página.

==================================================
20. MENÚ PRINCIPAL
==================================================

El menú debe incluir:

- Jugar.
- Modo entrenamiento.
- Modo simulación.
- Cómo jugar.
- Historial.
- Configuración.
- Información.
- Borrar progreso local.

Muestra en el encabezado:

- Nombre del videojuego.
- Subtítulo.
- Estado del sonido.
- Estado de reducción de movimiento.
- Mejor puntuación local.

==================================================
21. PAUSA Y REINICIO
==================================================

Permite pausar la simulación mediante:

- Tecla Escape.
- Tecla P.
- Botón visible.

El menú de pausa debe permitir:

- Continuar.
- Reiniciar escenario.
- Ver controles.
- Activar o desactivar sonido.
- Volver al menú principal.

Solicita confirmación antes de abandonar una partida con progreso.

==================================================
22. CONTENIDO EDUCATIVO
==================================================

Incluye una sección educativa breve sobre:

- Qué es una evacuación.
- Qué es una ruta de evacuación.
- Qué es un punto de encuentro.
- Importancia de la señalización.
- Diferencia entre una práctica digital y un simulacro real.
- Importancia de seguir el plan institucional.
- Función general de la brigada de emergencias.
- Identificación de peligros.
- Conductas que pueden aumentar el riesgo.
- Importancia de reportar novedades.

Redacta el contenido en español claro.

No presentes el videojuego como asesoría legal, certificación profesional ni sustituto de protocolos oficiales.

==================================================
23. ARQUITECTURA DE JAVASCRIPT
==================================================

Organiza script.js de forma clara y mantenible.

Utiliza secciones o módulos lógicos para:

- Configuración.
- Estado general.
- Navegación entre pantallas.
- Datos de escenarios.
- Banco de preguntas.
- Mapa.
- Jugador.
- Movimiento.
- Colisiones.
- Interacciones.
- Eventos aleatorios.
- Sistema de decisiones.
- Sistema de puntuación.
- Temporizador.
- Sonido.
- Accesibilidad.
- localStorage.
- Informe final.
- Utilidades.
- Inicialización.

Puedes utilizar clases, objetos o funciones modulares, pero evita una arquitectura innecesariamente compleja.

Agrega comentarios claros en español.

Evita:

- Variables globales innecesarias.
- Funciones excesivamente largas.
- Código duplicado.
- innerHTML con contenido proveniente del usuario.
- eval().
- Errores silenciosos.
- Eventos registrados varias veces.
- Bucles que consuman recursos innecesariamente.

Utiliza requestAnimationFrame para el bucle del juego si empleas Canvas.

==================================================
24. ESTADO DEL JUEGO
==================================================

Crea un objeto central de estado que contenga, como mínimo:

- Pantalla actual.
- Modo seleccionado.
- Escenario seleccionado.
- Posición del jugador.
- Objetivos completados.
- Puntuación.
- Nivel de riesgo.
- Tiempo.
- Decisiones tomadas.
- Peligros identificados.
- Personas orientadas.
- Ruta utilizada.
- Estado de pausa.
- Estado del sonido.
- Preferencia de movimiento reducido.
- Historial de eventos.

Asegúrate de reiniciar correctamente este estado al comenzar una nueva partida.

==================================================
25. MECÁNICA DEL MAPA
==================================================

Si utilizas Canvas, implementa el mapa mediante una cuadrícula o sistema de tiles.

Define tipos de casilla como:

- Suelo.
- Pared.
- Puerta.
- Salida.
- Escalera.
- Ascensor.
- Obstáculo.
- Humo.
- Señal.
- Extintor.
- Botiquín.
- Personaje no jugador.
- Punto de encuentro.

Incluye:

- Detección de colisiones.
- Límites del mapa.
- Interacciones por proximidad.
- Cámara fija o seguimiento suave.
- Indicador del objetivo.
- Señales visuales claras.
- Animación básica del personaje.
- Bloqueo de rutas peligrosas.
- Al menos una ruta alternativa válida.

No permitas atravesar paredes, humo peligroso, obstáculos ni zonas bloqueadas.

==================================================
26. PERSONAJES NO JUGADORES
==================================================

Incluye personajes como:

- Visitante desorientado.
- Colaborador que intenta regresar.
- Brigadista.
- Persona que informa una novedad.
- Responsable del punto de encuentro.

Cada personaje debe tener:

- Nombre genérico o rol.
- Diálogo breve.
- Interacción.
- Decisión asociada, cuando corresponda.
- Respuesta del personaje.
- Consecuencia educativa.

Evita estereotipos relacionados con:

- Edad.
- Género.
- Condición física.
- Cargo.
- Nivel educativo.

==================================================
27. VALIDACIONES Y MANEJO DE ERRORES
==================================================

La aplicación debe:

- Impedir iniciar una simulación sin seleccionar escenario.
- Evitar puntuaciones inferiores a 0 o superiores a 100.
- Evitar temporizadores duplicados.
- Detener el tiempo durante la pausa.
- Manejar correctamente el reinicio.
- Evitar que una interacción otorgue puntos varias veces.
- Evitar que un objetivo pueda completarse repetidamente.
- Mantener siempre una ruta válida.
- Manejar errores de localStorage.
- Manejar bloqueo de audio.
- Evitar errores si un elemento HTML no se encuentra.
- Evitar errores en consola.
- Recuperarse de estados inesperados.

Muestra mensajes claros, no mensajes técnicos, al usuario.

==================================================
28. PRUEBAS FUNCIONALES OBLIGATORIAS
==================================================

Antes de entregar el proyecto, verifica:

1. El menú principal funciona.
2. Todas las pantallas pueden abrirse y cerrarse.
3. El modo entrenamiento funciona.
4. Las preguntas muestran retroalimentación.
5. El modo simulación funciona.
6. El jugador se mueve con flechas.
7. El jugador se mueve con WASD.
8. Los controles táctiles funcionan.
9. Las colisiones funcionan.
10. Los obstáculos no pueden atravesarse.
11. Las interacciones se activan una sola vez.
12. Los escenarios de incendio y sismo pueden completarse.
13. La puntuación se calcula correctamente.
14. El nivel se asigna correctamente.
15. El informe final muestra datos reales de la partida.
16. El historial local se guarda.
17. El progreso local puede borrarse.
18. El sonido puede desactivarse.
19. La reducción de movimiento funciona.
20. La pausa detiene el juego.
21. El reinicio limpia el estado anterior.
22. El diseño se adapta a teléfonos.
23. No existen errores en la consola.
24. Todas las rutas de archivos son relativas.
25. La aplicación funciona en GitHub Pages.
26. La aplicación funciona sin conexión después de cargar los archivos locales, siempre que no utilice recursos externos.
27. No se requieren instalaciones.
28. No se requiere servidor.
29. El enlace de impresión del reporte funciona.
30. Los botones tienen estados de foco visibles.

==================================================
29. PRUEBAS DE ESCENARIOS
==================================================

Realiza conceptualmente los siguientes recorridos:

RECORRIDO A: INCENDIO CORRECTO

- Iniciar escenario de incendio.
- Reconocer alarma.
- Identificar corredor con humo.
- Seleccionar ruta alternativa.
- Orientar al visitante.
- Evitar el ascensor.
- No regresar por objetos.
- Llegar al punto de encuentro.
- Reportarse.
- Recibir informe final.

RECORRIDO B: INCENDIO CON ERRORES

- Seleccionar una decisión insegura.
- Mostrar retroalimentación.
- Restar puntos.
- Aumentar nivel de riesgo.
- Permitir corregir.
- Completar el escenario.
- Mostrar aspectos por reforzar.

RECORRIDO C: SISMO

- Completar identificación previa de peligros.
- Activar evento de movimiento.
- Mostrar decisiones.
- Aplicar configuración de movimiento reducido.
- Iniciar fase posterior.
- Evacuar por ruta habilitada.
- Llegar al punto de encuentro.
- Generar informe.

RECORRIDO D: ACCESIBILIDAD

- Navegar el menú con Tab.
- Activar opciones con Enter.
- Cerrar modal con Escape.
- Desactivar sonido.
- Activar reducción de movimiento.
- Completar preguntas sin utilizar ratón.

==================================================
30. README.MD
==================================================

Crea un README.md completo y en español.

Debe incluir:

- Nombre del proyecto.
- Descripción.
- Objetivo educativo.
- Captura o descripción del juego.
- Tecnologías utilizadas.
- Lista de archivos.
- Instrucciones para ejecutar localmente.
- Instrucciones para publicar en GitHub Pages.
- Instrucciones para personalizar la organización.
- Ubicación del objeto CONFIG.
- Cómo modificar preguntas.
- Cómo modificar escenarios.
- Cómo cambiar colores.
- Cómo cambiar el punto de encuentro.
- Cómo activar o desactivar escenarios.
- Controles del juego.
- Funciones de accesibilidad.
- Limitaciones.
- Aviso educativo.
- Recomendación de validación por el responsable de SG-SST.
- Información sobre almacenamiento local.
- Compatibilidad con navegadores.
- Créditos.
- Licencia sugerida.

Incluye instrucciones claras para publicar en GitHub Pages:

1. Crear un repositorio.
2. Subir todos los archivos al directorio principal.
3. Verificar que index.html esté en la raíz.
4. Abrir la configuración del repositorio.
5. Acceder a la sección Pages.
6. Seleccionar la rama correspondiente.
7. Elegir la carpeta raíz.
8. Guardar la configuración.
9. Abrir la dirección publicada cuando GitHub la genere.

No incluyas una dirección inventada del repositorio.

==================================================
31. CALIDAD DEL CÓDIGO
==================================================

El código debe:

- Estar completo.
- Ser legible.
- Estar comentado en español.
- Utilizar nombres descriptivos.
- Evitar código innecesario.
- Separar contenido, estilos y lógica.
- No contener pseudocódigo.
- No contener marcadores como “TODO”.
- No contener frases como “agregar aquí”.
- No omitir funciones esenciales.
- No depender de una explicación posterior.
- Poder ejecutarse inmediatamente.

Usa:

- Variables CSS para colores y dimensiones.
- Funciones reutilizables.
- Manejo de eventos organizado.
- Constantes para valores inmutables.
- CSS responsive.
- Media queries.
- prefers-reduced-motion.
- Estilos de impresión.
- Validación defensiva en JavaScript.

==================================================
32. CRITERIOS VISUALES DE ACEPTACIÓN
==================================================

El resultado será aceptable si:

- Parece un videojuego y no un formulario convencional.
- La estética retro es evidente.
- La interfaz se percibe profesional.
- Los textos son legibles.
- El mapa es comprensible.
- Los personajes pueden distinguirse.
- Los peligros son visibles.
- La ruta segura puede identificarse.
- La puntuación está siempre clara.
- La pantalla final es atractiva.
- La versión móvil es funcional.
- El contenido es apropiado para adultos.
- No hay saturación visual.
- No hay contenido gráfico perturbador.

==================================================
33. CRITERIOS EDUCATIVOS DE ACEPTACIÓN
==================================================

El videojuego debe:

- Explicar las respuestas.
- Reforzar la toma de decisiones.
- No premiar únicamente la velocidad.
- Permitir cometer errores y aprender.
- Promover la observación.
- Reforzar el seguimiento de instrucciones.
- Diferenciar capacitación digital y simulacro real.
- Recordar que cada organización tiene procedimientos propios.
- Evitar afirmaciones absolutas cuando la respuesta dependa del contexto.
- Permitir adaptar el contenido al plan institucional.

==================================================
34. SEGURIDAD DEL CONTENIDO
==================================================

No inventes protocolos específicos de la organización.

No inventes:

- Rutas reales.
- Números internos.
- Nombres de brigadistas.
- Puntos de encuentro.
- Señales particulares.
- Responsables.
- Equipos existentes.
- Procedimientos aprobados.

Utiliza valores genéricos y claramente configurables.

Agrega el siguiente aviso:

“Este videojuego es una herramienta educativa de apoyo. Las decisiones, rutas, puntos de encuentro y procedimientos deben ser revisados y adaptados al plan de prevención, preparación y respuesta ante emergencias vigente en cada organización.”

No conviertas el juego en una capacitación para usar extintores. Si aparece un extintor, trátalo principalmente como un recurso que debe permanecer identificado, accesible y sin obstrucciones. No instruyas al usuario para combatir un incendio sin entrenamiento específico.

==================================================
35. ENTREGABLES FINALES
==================================================

Entrega:

1. index.html completo.
2. styles.css completo.
3. script.js completo.
4. README.md completo.
5. Cualquier archivo adicional estrictamente necesario.
6. Un archivo ZIP descargable.
7. Todos los archivos en un único directorio raíz.
8. Una breve lista de pruebas realizadas.
9. Una explicación breve de dónde personalizar el contenido.

No entregues únicamente fragmentos de código.

No respondas solamente con una arquitectura o una lista de recomendaciones.

No solicites al usuario que complete partes del código.

No dejes funciones vacías.

No uses contenido de ejemplo que impida jugar.

No generes subdirectorios.

==================================================
36. ORDEN DE EJECUCIÓN
==================================================

Desarrolla el proyecto siguiendo internamente este orden:

PASO 1:
Define el objeto de configuración institucional.

PASO 2:
Define el estado central del juego.

PASO 3:
Crea la estructura semántica de index.html.

PASO 4:
Crea todas las pantallas y modales.

PASO 5:
Construye el sistema visual retro en styles.css.

PASO 6:
Implementa la navegación entre pantallas.

PASO 7:
Implementa el modo entrenamiento.

PASO 8:
Implementa el mapa del modo simulación.

PASO 9:
Implementa movimiento y controles táctiles.

PASO 10:
Implementa colisiones.

PASO 11:
Implementa personajes e interacciones.

PASO 12:
Implementa escenarios de incendio y sismo.

PASO 13:
Implementa decisiones y retroalimentación.

PASO 14:
Implementa puntuación y nivel de riesgo.

PASO 15:
Implementa pausa, reinicio y finalización.

PASO 16:
Implementa sonidos y preferencias.

PASO 17:
Implementa accesibilidad.

PASO 18:
Implementa localStorage.

PASO 19:
Implementa informe e impresión.

PASO 20:
Ejecuta las pruebas funcionales.

PASO 21:
Corrige cualquier error detectado.

PASO 22:
Crea README.md.

PASO 23:
Empaqueta el proyecto en ZIP.

==================================================
37. INSTRUCCIÓN FINAL
==================================================

Construye ahora el videojuego completo.

Antes de entregarlo:

- Revisa el HTML.
- Revisa el CSS.
- Revisa el JavaScript.
- Verifica las relaciones entre archivos.
- Verifica las rutas relativas.
- Comprueba el funcionamiento de ambos modos.
- Comprueba los escenarios de incendio y sismo.
- Comprueba las preguntas.
- Comprueba la puntuación.
- Comprueba localStorage.
- Comprueba la pausa.
- Comprueba los controles táctiles.
- Comprueba la accesibilidad.
- Comprueba la visualización móvil.
- Comprueba que no haya errores en consola.
- Comprueba que sea compatible con GitHub Pages.
- Comprueba que no requiera instalaciones.

Si alguna característica avanzada pone en riesgo el funcionamiento global, implementa una alternativa más sencilla pero completamente funcional.

Da prioridad, en este orden, a:

1. Funcionamiento correcto.
2. Seguridad conceptual.
3. Claridad educativa.
4. Accesibilidad.
5. Compatibilidad con GitHub Pages.
6. Diseño visual.
7. Funciones adicionales.

Entrega directamente los archivos funcionales y el ZIP descargable.
