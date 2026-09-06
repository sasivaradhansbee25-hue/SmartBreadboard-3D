// Centralized Service Layer Base HTTP API Client
// Abstracted service layer decoupling UI components from hardcoded URLs
// Reads VITE_API_BASE_URL in production or defaults to http://127.0.0.1:8000 in local development

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');

export async function apiRequest(endpoint, method = 'GET', body = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    if (body) {
      options.body = JSON.stringify(body);
    }

    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const fullUrl = cleanEndpoint.startsWith('/api') 
      ? `${API_BASE_URL}${cleanEndpoint}`
      : `${API_BASE_URL}/api${cleanEndpoint}`;

    const response = await fetch(fullUrl, options);
    if (!response.ok) {
      throw new Error(`API HTTP Error ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    // Fallback to local mock data response when backend server is offline
    return {
      status: 'offline_mock_fallback',
      source: 'mock',
      endpoint,
      timestamp: new Date().toISOString()
    };
  }
}
