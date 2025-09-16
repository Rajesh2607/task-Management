// API Configuration for different environments
const getApiBaseUrl = () => {
  // Check if we're in development or production
  if (import.meta.env.DEV) {
    // Development environment - use local server first, fallback to deployed
    return import.meta.env.VITE_API_URL || 'http://localhost:5002';
  } else {
    // Production environment - use the deployed backend URL
    return import.meta.env.VITE_API_URL || 'https://server-dzbq.onrender.com';
  }
};

export const API_BASE_URL = getApiBaseUrl();

// API endpoints
export const API_ENDPOINTS = {
  TASKS: `${API_BASE_URL}/api/tasks`,
  TASK_BY_ID: (id: string) => `${API_BASE_URL}/api/tasks/${id}`,
  TASK_STATS: `${API_BASE_URL}/api/tasks/stats`,
  DASHBOARD: `${API_BASE_URL}/api/dashboard`,
  SETTINGS: `${API_BASE_URL}/api/settings`,
};

// For network access (when accessing from other devices on same network)
export const getNetworkApiUrl = () => {
  if (import.meta.env.DEV) {
    // Get the local IP address - you'll need to replace this with your actual IP
    // You can find your IP with: ipconfig (Windows) or ifconfig (Mac/Linux)
    const localIP = import.meta.env.VITE_LOCAL_IP || 'localhost';
    return `http://${localIP}:5002`;
  }
  return API_BASE_URL;
};

export default API_BASE_URL;
