// Centralized Frontend Network & API Configuration
// Resolves local LAN IP dynamically when accessed via mobile phone or desktop

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  `${window.location.protocol}//${window.location.hostname}:8000`;

export const FRONTEND_BASE_URL =
  `${window.location.protocol}//${window.location.host}`;

export const WS_BASE_URL = API_BASE_URL.replace(/^http/, 'ws');
