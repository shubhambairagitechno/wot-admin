import { apiCall } from './config';

// Admin Login
export const loginAdmin = async (email, password) => {
  try {
    const response = await fetch('https://api.wayoftrading.com/aitredding/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'accept': 'application/json',
      },
      body: new URLSearchParams({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (data.status === 1) {
      return {
        success: true,
        data: data.data,
        message: data.message,
      };
    } else {
      return {
        success: false,
        message: data.message || 'Login failed',
      };
    }
  } catch (error) {
    console.error('Login API Error:', error);
    return {
      success: false,
      message: error.message || 'An error occurred during login',
    };
  }
};

// Add more admin endpoints here as needed
export const getAdminProfile = async (token) => {
  return apiCall('/admin/profile', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'accept': 'application/json',
    },
  });
};

export const updateAdminProfile = async (token, profileData) => {
  return apiCall('/admin/profile', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'accept': 'application/json',
    },
    body: JSON.stringify(profileData),
  });
};
