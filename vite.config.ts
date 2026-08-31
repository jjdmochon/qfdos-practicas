import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

/**
 * Base de publicacion.
 *
 * En local la app se sirve desde la raiz. En GitHub Pages cuelga de
 * /practicas/, y si la base no lo refleja el HTML pide sus recursos a la raiz
 * del dominio: Pages devuelve 404 y la pagina sale en blanco sin error visible.
 *
 * Se define al compilar:  PAGES_BASE=/practicas/ npm run build
 */
const base = process.env.PAGES_BASE || '/';

export default defineConfig({
  base,
  plugins: [react()],
  build: {
    outDir: process.env.PAGES_OUT || 'dist',
    // Los datos de practicas y los visores de espectros pesan; separarlos evita
    // que el movil tenga que descargar todo el modulo antes de pintar nada.
    chunkSizeWarningLimit: 900
  },
  server: {
    port: 3002,
    open: true,
    host: true,          // accesible desde el movil en la misma red Wi-Fi
    watch: { usePolling: true, interval: 800 }
  }
});
