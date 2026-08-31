/* Service worker del cuaderno de practicas.
 *
 * El laboratorio del sotano de Farmacia tiene mala cobertura: sin una copia
 * local, abrir el protocolo o el guion de seguridad con el movil en la mano
 * falla justo cuando hace falta. Estrategia:
 *   - navegacion: red primero, y si no hay red se sirve el index cacheado;
 *   - recursos propios (JS, CSS, imagenes de esquemas y espectros): cache
 *     primero, con revalidacion en segundo plano.
 * No se cachea nada de otros dominios ni las llamadas al Apps Script.
 */
const VERSION = 'practicas-v4-1';
const CACHE = `${VERSION}`;
const AMBITO = new URL(self.registration.scope);

self.addEventListener('install', (evento) => {
  evento.waitUntil(
    caches.open(CACHE).then((c) => c.addAll([AMBITO.pathname, `${AMBITO.pathname}manifest.webmanifest`]))
      .catch(() => undefined)
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (evento) => {
  evento.waitUntil(
    caches.keys()
      .then((claves) => Promise.all(claves.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (evento) => {
  const peticion = evento.request;
  if (peticion.method !== 'GET') return;

  const url = new URL(peticion.url);
  if (url.origin !== AMBITO.origin || !url.pathname.startsWith(AMBITO.pathname)) return;

  if (peticion.mode === 'navigate') {
    evento.respondWith(
      fetch(peticion)
        .then((respuesta) => {
          const copia = respuesta.clone();
          caches.open(CACHE).then((c) => c.put(AMBITO.pathname, copia)).catch(() => undefined);
          return respuesta;
        })
        .catch(() => caches.match(AMBITO.pathname).then((r) => r || Response.error()))
    );
    return;
  }

  evento.respondWith(
    caches.match(peticion).then((guardada) => {
      const red = fetch(peticion)
        .then((respuesta) => {
          if (respuesta.ok && respuesta.type === 'basic') {
            const copia = respuesta.clone();
            caches.open(CACHE).then((c) => c.put(peticion, copia)).catch(() => undefined);
          }
          return respuesta;
        })
        .catch(() => guardada);
      return guardada || red;
    })
  );
});
