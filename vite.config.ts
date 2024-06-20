// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { UserConfigExport, ProxyOptions } from 'vite';


// Se vuoi essere esplicito sui tipi di configurazione, puoi utilizzare UserConfigExport
export default defineConfig({
  define: {
    'global': 'window'  // Definisce `global` come un alias di `window`
  },
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Puoi anche specificare il tipo per proxy se desideri avere un controllo tipo più stretto
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      } as ProxyOptions,
    },
  },
} as UserConfigExport);
