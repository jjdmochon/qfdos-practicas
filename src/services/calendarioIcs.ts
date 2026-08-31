// ==========================================================================
// Exportación de la semana de prácticas a formato iCalendar (.ics)
//
// El cuaderno se consulta, pero no avisa. Exportando la semana asignada a
// Google Calendar, Outlook o el calendario del móvil, las sesiones entran
// donde el alumnado ya mira cada día, con su recordatorio la víspera.
//
// Versión reducida de la del curso completo: aquí solo hay prácticas, así que
// no se arrastran el calendario académico ni los horarios de examen.
// ==========================================================================

import { TEMPORIZACION } from '../data/practicasData';

/** Escapa los caracteres que en iCalendar tienen significado propio. */
function escapar(texto: string): string {
  return texto
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

/** YYYY-MM-DD → YYYYMMDD */
function aFecha(iso: string): string {
  return iso.replace(/-/g, '');
}

/**
 * En iCalendar, DTEND de un evento de día completo es EXCLUSIVO: para que el
 * último día se vea, hay que apuntar al día siguiente.
 */
function diaSiguiente(iso: string): string {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return aFecha(d.toISOString().slice(0, 10));
}

/** Las líneas de más de 75 octetos deben plegarse con un espacio inicial. */
function plegar(linea: string): string {
  if (linea.length <= 74) return linea;
  const trozos: string[] = [linea.slice(0, 74)];
  let resto = linea.slice(74);
  while (resto.length > 73) {
    trozos.push(' ' + resto.slice(0, 73));
    resto = resto.slice(73);
  }
  if (resto) trozos.push(' ' + resto);
  return trozos.join('\r\n');
}


// ==========================================================================
// Semana de prácticas
// ==========================================================================

/**
 * Genera las cinco sesiones de laboratorio de la semana asignada.
 *
 * Se emiten de día completo y no a una hora concreta: el cuaderno fija el
 * contenido de cada jornada, pero no el turno, que varía por grupo. Poner una
 * hora inventada sería peor que no ponerla — el alumno se fiaría de ella.
 */
export function generarSemanaPracticas(lunesIso: string): string {
  const ahora = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const lineas: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//UGR//QFDOS 2627 Practicas//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:QFDOS · Mi semana de prácticas',
    'X-WR-TIMEZONE:Europe/Madrid'
  ];

  TEMPORIZACION.forEach((dia, i) => {
    const f = new Date(`${lunesIso}T12:00:00Z`);
    f.setUTCDate(f.getUTCDate() + i);
    const iso = f.toISOString().slice(0, 10);

    const descripcion = [
      `${dia.dia} de prácticas de Química Farmacéutica II.`,
      '',
      'Guion de la sesión:',
      ...dia.tareas.map(t => `· ${t}`),
      '',
      'Bata y gafas de protección obligatorias. La asistencia a las cinco sesiones',
      'es imprescindible para superar la asignatura.',
      'Laboratorio de prácticas · Facultad de Farmacia · Campus de Cartuja'
    ].join('\n');

    lineas.push(
      'BEGIN:VEVENT',
      `UID:qfdos-practicas-${iso}@qfdos.ugr.es`,
      `DTSTAMP:${ahora}`,
      `DTSTART;VALUE=DATE:${aFecha(iso)}`,
      `DTEND;VALUE=DATE:${diaSiguiente(iso)}`,
      plegar(`SUMMARY:${escapar(`🧪 Prácticas QFDOS · ${dia.dia}`)}`),
      plegar(`DESCRIPTION:${escapar(descripcion)}`),
      plegar(`LOCATION:${escapar('Laboratorio de prácticas, Facultad de Farmacia, Universidad de Granada, Campus de Cartuja, Granada')}`),
      'CATEGORIES:Prácticas',
      'TRANSP:OPAQUE',
      'BEGIN:VALARM',
      'TRIGGER:-PT15H',
      'ACTION:DISPLAY',
      plegar(`DESCRIPTION:${escapar(`Mañana: ${dia.dia} de prácticas QFDOS`)}`),
      'END:VALARM',
      'END:VEVENT'
    );
  });

  lineas.push('END:VCALENDAR');
  return lineas.join('\r\n');
}

/** Descarga la semana de prácticas asignada. */
export function descargarSemanaPracticas(lunesIso: string): void {
  const blob = new Blob([generarSemanaPracticas(lunesIso)], {
    type: 'text/calendar;charset=utf-8'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `qfdos-practicas-semana-${lunesIso}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
