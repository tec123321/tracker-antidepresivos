# Tracker de progreso de medicación

Aplicación web ligera en español para registrar el progreso de tratamientos (por ejemplo, antidepresivos) con seguimiento semanal, recordatorios personalizables y notas.

## Uso rápido
1. Abre `index.html` en tu navegador (no requiere servidor). La portada muestra solo medicamentos organizados por categoría (antidepresivos, benzodiacepinas, hipnóticos, etc.). Consulta `interacciones.html` para ver suplementos y combinaciones, y `retiro.html` para las pautas de retiro gradual.
2. Añade un plan con nombre del medicamento, dosis, fecha de inicio, duración y frecuencia de recordatorio semanal.
3. Desde la sección de recordatorios o del listado, registra el progreso de la semana: estado de ánimo, efectos, notas y adherencia.
4. Usa el botón de aplazar para posponer el próximo aviso por 1 semana o ajusta el intervalo de recordatorio según necesites.
5. La información se guarda en `localStorage`, por lo que permanece disponible en tu navegador.
6. El alta de medicamentos cruza interacciones conocidas (antidepresivos, ansiolíticos y suplementos frecuentes) y muestra notas para tu próxima cita antes de confirmar.

## Funcionalidades
- Recordatorios semanales con pausa temporal (aplazar) o ajuste de intervalo.
- Línea de tiempo por semanas que muestra registros completados, pendientes y futuros.
- Historial de notas con síntomas, efectos secundarios y adherencia.
- Panel de alertas bidireccional que detecta combinaciones relevantes y guarda las últimas recomendaciones con nivel de severidad.
- Catálogo por categorías separado entre medicamentos y suplementos.
- Página dedicada a interacciones probables (medicamentos + suplementos) y otra con pautas de retiro gradual.
- Estadísticas rápidas de planes activos, recordatorios pendientes y semana en curso.

## Tecnologías
- HTML, CSS y JavaScript sin dependencias externas.
