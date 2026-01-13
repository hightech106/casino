/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly REACT_APP_API_URL: string;
  readonly REACT_APP_SOCKET_URL: string;
  readonly REACT_APP_MODE: string;
  readonly REACT_APP_DICE_HOUSE_EDGE: string;
  // Add other REACT_APP_* variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

