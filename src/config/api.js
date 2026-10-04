// Centralized Frontend Network & API Configuration
// Resolves production base URL (e.g. Render / Cloud FastAPI) or local development

const metaEnv = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : {};
const win = typeof window !== 'undefined' ? window : {
  location: { protocol: 'http:', hostname: 'localhost', host: 'localhost:5173', origin: 'http://localhost:5173' }
};

export const DEFAULT_PRODUCTION_API_BASE_URL = 'https://smartbreadboard-api.onrender.com';
export const DEFAULT_PRODUCTION_FRONTEND_BASE_URL = 'https://smartbreadboard-3d.vercel.app';

// Detect if running on a local development environment (localhost / private LAN IP)
export const isLocalHost = ['localhost', '127.0.0.1', '0.0.0.0'].includes(win.location.hostname);
export const isLanIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(win.location.hostname) && !['127.0.0.1', '0.0.0.0'].includes(win.location.hostname);
export const isProduction = !isLocalHost && !isLanIp;

/**
 * Resolves the backend FastAPI API base URL.
 * Strictly guarantees that the frontend NEVER falls back to localhost or Vercel origin in production.
 */
export function resolveApiBaseUrl() {
  // 1. Explicit window runtime override (allows test overrides or dynamic injection)
  if (typeof window !== 'undefined' && window.__API_BASE_URL__) {
    const custom = String(window.__API_BASE_URL__).trim().replace(/\/+$/, '');
    if (custom) return custom;
  }

  const envApiUrl = metaEnv.VITE_API_BASE_URL ? String(metaEnv.VITE_API_BASE_URL).trim().replace(/\/+$/, '') : '';

  // 2. Production deployment (Vercel, custom domain, etc.)
  if (isProduction) {
    // If env var is set AND is a valid remote URL (not localhost or loopback)
    if (envApiUrl && !envApiUrl.includes('localhost') && !envApiUrl.includes('127.0.0.1') && !envApiUrl.includes('0.0.0.0')) {
      return envApiUrl;
    }
    // Strictly use configured production backend URL, NEVER fall back to localhost or Vercel origin!
    return DEFAULT_PRODUCTION_API_BASE_URL;
  }

  // 3. Local desktop development
  if (isLocalHost) {
    if (envApiUrl) return envApiUrl;
    return `${win.location.protocol}//localhost:8000`;
  }

  // 4. LAN phone testing (viewed on LAN IP)
  if (isLanIp) {
    if (envApiUrl && !envApiUrl.includes('localhost') && !envApiUrl.includes('127.0.0.1')) {
      return envApiUrl;
    }
    return `${win.location.protocol}//${win.location.hostname}:8000`;
  }

  return DEFAULT_PRODUCTION_API_BASE_URL;
}

/**
 * Resolves the frontend base URL for mobile QR code links.
 */
export function resolveFrontendBaseUrl() {
  const envFrontendUrl = metaEnv.VITE_FRONTEND_BASE_URL ? String(metaEnv.VITE_FRONTEND_BASE_URL).trim().replace(/\/+$/, '') : '';

  if (isProduction) {
    if (envFrontendUrl && !envFrontendUrl.includes('localhost') && !envFrontendUrl.includes('127.0.0.1') && !envFrontendUrl.includes('0.0.0.0')) {
      return envFrontendUrl;
    }
    if (win.location.origin && !win.location.origin.includes('localhost') && !win.location.origin.includes('127.0.0.1')) {
      return win.location.origin;
    }
    return DEFAULT_PRODUCTION_FRONTEND_BASE_URL;
  }

  if (!isLocalHost && win.location.origin) {
    return win.location.origin;
  }

  return DEFAULT_PRODUCTION_FRONTEND_BASE_URL;
}

/**
 * Constructs the mobile scanner URL for QR code generation.
 * Guarantees that localhost / 127.0.0.1 / 0.0.0.0 NEVER appear in the QR code URL.
 * 
 * Production:
 *   https://<DEPLOYED-FRONTEND>/scanner-mobile?session=XXXXXX
 * Development / LAN:
 *   http://<PC-LAN-IP>:5173/scanner-mobile?session=XXXXXX
 * 
 * @param {string} sessionId
 * @param {string|null} lanIp - LAN IP fetched from backend or configured
 * @returns {{ url: string|null, error: string|null }}
 */
export function getMobileScannerUrl(sessionId, lanIp = null) {
  if (!sessionId) return { url: null, error: "Missing session ID" };

  // Case 1: In production (e.g. deployed on Vercel or custom domain)
  if (isProduction) {
    let base = resolveFrontendBaseUrl();
    if (base.includes('localhost') || base.includes('127.0.0.1') || base.includes('0.0.0.0')) {
      base = DEFAULT_PRODUCTION_FRONTEND_BASE_URL;
    }
    return {
      url: `${base.replace(/\/+$/, '')}/scanner-mobile?session=${sessionId}`,
      error: null
    };
  }

  // Case 2: Running directly on LAN IP (e.g. http://192.168.1.15:5173/scanner)
  if (isLanIp) {
    const port = win.location.port ? `:${win.location.port}` : '';
    return {
      url: `${win.location.protocol}//${win.location.hostname}${port}/scanner-mobile?session=${sessionId}`,
      error: null
    };
  }

  // Case 3: Local desktop development (hostname is localhost / 127.0.0.1)
  // Phone CANNOT reach localhost! It MUST use PC LAN IP.
  const validLan = (lanIp && !['localhost', '127.0.0.1', '0.0.0.0'].includes(lanIp)) ? lanIp : null;
  if (validLan) {
    const port = win.location.port ? `:${win.location.port}` : ':5173';
    return {
      url: `http://${validLan}${port}/scanner-mobile?session=${sessionId}`,
      error: null
    };
  }

  return {
    url: null,
    error: "Acquiring PC LAN IP so your phone can reach the scanner..."
  };
}

export const API_BASE_URL = resolveApiBaseUrl();
export const FRONTEND_BASE_URL = resolveFrontendBaseUrl();
export const WS_BASE_URL = API_BASE_URL.replace(/^http/, 'ws');
