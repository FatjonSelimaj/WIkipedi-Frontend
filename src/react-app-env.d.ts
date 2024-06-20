/// <reference types="react-scripts" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_BACKEND_URL: string;
    // Altre variabili d'ambiente che vuoi usare
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  