// ==========================================================================
// Consulta de entregas del estudiante
//
// Las entregas viajan al Apps Script del profesor y quedan en una hoja de
// cálculo. Aquí solo se leen: «Mi progreso» necesita saber qué consta ya a
// nombre de quien ha entrado, para no depender de la memoria del navegador,
// que se vacía al cambiar de dispositivo.
//
// Versión reducida de la del curso completo: el módulo de prácticas no
// publica ni edita el temario, así que esa parte no viaja hasta aquí.
// ==========================================================================

const WEBAPP_URL = (import.meta.env.VITE_PRACTICAS_WEBAPP_URL ?? '').trim();

/** Sin URL de recepción configurada no hay nada que consultar. */
export function publicacionDisponible(): boolean {
  return WEBAPP_URL.length > 0;
}

// ==========================================================================
// Entregas de un estudiante
// ==========================================================================

export interface EntregaPropia {
  hoja: string;
  fila: number;
  datos: Record<string, string>;
}

/** Lo que esa persona ha entregado, buscando su correo en todas las hojas. */
export async function misEntregas(email: string): Promise<EntregaPropia[] | null> {
  if (!publicacionDisponible() || !email) return null;

  try {
    const resp = await fetch(
      `${WEBAPP_URL}?accion=misEntregas&email=${encodeURIComponent(email)}&t=${Date.now()}`,
      { method: 'GET', redirect: 'follow' }
    );
    if (!resp.ok) return null;
    const cuerpo = await resp.json();
    return cuerpo?.ok ? (cuerpo.entregas ?? []) : null;
  } catch {
    return null;
  }
}
