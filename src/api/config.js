// API Configuration
const API_BASE_URL = 'https://api.wayoftrading.com/aitredding/api';

export const apiConfig = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'accept': 'application/json',
  },
};

// Helper function to make API calls
export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultOptions = {
    ...apiConfig,
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    const data = await response.json();
    return { success: response.ok, data, status: response.status };
  } catch (error) {
    console.error(`API Error at ${endpoint}:`, error);
    return { success: false, error: error.message };
  }
};
