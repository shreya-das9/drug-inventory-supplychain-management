import api from './api';

export const authAPI = {
  // Login
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Register
  register: async (userData) => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },

  // Refresh token
  refreshToken: async () => {
    const response = await api.post('/auth/refresh');
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  // Get user profile
  getProfile: async () => {
    const response = await api.get('/user/profile');
    return response.data;
  },

  // Get dashboard data based on role
  getDashboard: async (role) => {
    let endpoint = '/user/dashboard';
    
    switch (role) {
      case 'ADMIN':
        endpoint = '/admin/dashboard';
        break;
      case 'WAREHOUSE':
        endpoint = '/admin/warehouse/dashboard';
        break;
      case 'RETAILER':
        endpoint = '/admin/retailer/dashboard';
        break;
      default:
        endpoint = '/user/dashboard';
    }

    const response = await api.get(endpoint);
    return response.data;
  }
};