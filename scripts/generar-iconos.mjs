/**
 * Genera los iconos PNG de la aplicacion (granada nazari) sin dependencias.
 *
 * iOS solo acepta PNG en apple-touch-icon: un SVG no basta para que el atajo
 * de la pantalla de inicio tenga icono propio. Se rasteriza aqui con campos de
 * distancia y 4x de supermuestreo, y se escribe el PNG a mano con zlib.
 *
 *   node scripts/generar-iconos.mjs
 */
import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const DESTINO = join(RAIZ, 'public', 'iconos');

const GRANATE = [0x7c, 0x1c, 0x2c];
const GRANATE_HONDO = [0x4e, 0x0f, 0x1c];
const ORO = [0xd8, 0xa6, 0x4b];
const ORO_CLARO = [0xf0, 0xd7, 0x9b];
const HOJA = [0x4e, 0x6b, 0x3f];

const mezcla = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));

/** Distancia con signo a un circulo (negativa dentro). */
const circulo = (x, y, cx, cy, r) => Math.hypot(x - cx, y - cy) - r;

/** Distancia con signo a un rectangulo redondeado centrado en (cx, cy). */
function caja(x, y, cx, cy, ancho, alto, radio) {
  const dx = Math.abs(x - cx) - (ancho - radio);
  const dy = Math.abs(y - cy) - (alto - radio);
  const fuera = Math.hypot(Math.max(dx, 0), Math.max(dy, 0));
  return fuera + Math.min(Math.max(dx, dy), 0) - radio;
}

/**
 * Color de la granada en coordenadas normalizadas (0..1).
 * `margen` encoge el dibujo para dejar la zona segura de los iconos maskable.
 */
function pintar(u, v, margen) {
  // Fondo: degradado diagonal granate
  const fondo = mezcla(GRANATE, GRANATE_HONDO, Math.min(1, (u + v) / 2));

  // Coordenadas del motivo, centradas y escaladas segun el margen
  const x = (u - 0.5) / margen + 0.5;
  const y = (v - 0.5) / margen + 0.5;

  // Cuerpo del fruto
  const cuerpo = circulo(x, y, 0.5, 0.565, 0.255);
  // Corona (caliz) del granado
  const coronaBase = caja(x, y, 0.5, 0.295, 0.052, 0.055, 0.018);
  const punta = (dx) => circulo(x, y, 0.5 + dx, 0.245, 0.036);
  const corona = Math.min(coronaBase, punta(-0.055), punta(0), punta(0.055));

  const fruto = Math.min(cuerpo, corona);

  if (fruto < 0) {
    // Granos: rejilla hexagonal dentro del fruto
    let grano = 1;
    for (const [gx, gy] of SEMILLAS) {
      grano = Math.min(grano, circulo(x, y, gx, gy, 0.043));
    }
    const dentro = Math.min(1, -fruto / 0.02);
    const cara = grano < 0 ? ORO_CLARO : ORO;
    const base = mezcla(ORO, cara, grano < 0 ? Math.min(1, -grano / 0.02) : 0);
    return mezcla(fondo, base, dentro);
  }

  // Hoja lateral
  const hoja = Math.max(
    circulo(x, y, 0.615, 0.245, 0.075),
    -circulo(x, y, 0.70, 0.185, 0.078)
  );
  if (hoja < 0) return mezcla(fondo, HOJA, Math.min(1, -hoja / 0.012));

  // Halo suave alrededor del fruto
  const halo = Math.max(0, 1 - fruto / 0.06) * 0.16;
  return mezcla(fondo, ORO, halo);
}

const SEMILLAS = [
  [0.5, 0.47], [0.41, 0.535], [0.59, 0.535],
  [0.5, 0.60], [0.41, 0.665], [0.59, 0.665],
  [0.5, 0.725]
];

function trozo(tipo, datos) {
  const largo = Buffer.alloc(4);
  largo.writeUInt32BE(datos.length);
  const cuerpo = Buffer.concat([Buffer.from(tipo, 'latin1'), datos]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(cuerpo) >>> 0);
  return Buffer.concat([largo, cuerpo, crc]);
}

const TABLA_CRC = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = TABLA_CRC[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return c ^ -1;
}

function png(lado, margen) {
  const M = 4; // supermuestreo
  const filas = Buffer.alloc(lado * (lado * 3 + 1));
  for (let py = 0; py < lado; py++) {
    const inicio = py * (lado * 3 + 1);
    filas[inicio] = 0; // filtro None
    for (let px = 0; px < lado; px++) {
      let r = 0, g = 0, b = 0;
      for (let sy = 0; sy < M; sy++) {
        for (let sx = 0; sx < M; sx++) {
          const c = pintar((px + (sx + 0.5) / M) / lado, (py + (sy + 0.5) / M) / lado, margen);
          r += c[0]; g += c[1]; b += c[2];
        }
      }
      const o = inicio + 1 + px * 3;
      filas[o] = Math.round(r / (M * M));
      filas[o + 1] = Math.round(g / (M * M));
      filas[o + 2] = Math.round(b / (M * M));
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(lado, 0);
  ihdr.writeUInt32BE(lado, 4);
  ihdr[8] = 8;   // bits por canal
  ihdr[9] = 2;   // color RGB
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    trozo('IHDR', ihdr),
    trozo('IDAT', deflateSync(filas, { level: 9 })),
    trozo('IEND', Buffer.alloc(0))
  ]);
}

mkdirSync(DESTINO, { recursive: true });
const salidas = [
  ['icono-180.png', 180, 1],      // apple-touch-icon (iOS)
  ['icono-192.png', 192, 1],
  ['icono-512.png', 512, 1],
  ['icono-maskable-512.png', 512, 0.62]  // zona segura de Android
];
for (const [nombre, lado, margen] of salidas) {
  writeFileSync(join(DESTINO, nombre), png(lado, margen));
  console.log('escrito', nombre, lado + 'px');
}
