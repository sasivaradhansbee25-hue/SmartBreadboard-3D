// Centralized Frontend Network & API Configuration
// Resolves production base URL (https://smartbreadboard-3d.vercel.app) or local development

const metaEnv = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : {};
const win = typeof window !== 'undefined' ? window : { location: { protocol: 'http:', hostname: 'localhost', host: 'localhost:5173' } };

export const API_BASE_URL =
  metaEnv.VITE_API_BASE_URL ||
  `${win.location.protocol}//${win.location.hostname}:8000`;

export const FRONTEND_BASE_URL =
  metaEnv.VITE_FRONTEND_BASE_URL ||
  (metaEnv.PROD
    ? 'https://smartbreadboard-3d.vercel.app'
    : `${win.location.protocol}//${win.location.host}`);

export const WS_BASE_URL = API_BASE_URL.replace(/^http/, 'ws');

