import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://a950858c5b66.ngrok-free.app',
  headers: {
    'ngrok-skip-browser-warning': 'true',
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor - Add auth token and other headers
axiosInstance.interceptors.request.use(
  (config) => {
    // Get auth token from localStorage if available
    const platformUser = localStorage.getItem('platform_user');
    if (platformUser) {
      try {
        const user = JSON.parse(platformUser);
        // Add authorization header if token exists
        if (user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
        // Add user email for backend identification
        if (user.email) {
          config.headers['X-User-Email'] = user.email;
        }
      } catch (error) {
        console.error('Error parsing platform user:', error);
      }
    }

    // Add request timestamp for debugging
    config.headers['X-Request-Time'] = new Date().toISOString();

    return config;
  },
  (error) => {
    // Handle request error
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle responses and errors
axiosInstance.interceptors.response.use(
  (response) => {
    // Handle successful responses
    return response;
  },
  (error) => {
    // Handle response errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - clear auth and redirect to sign in
          localStorage.removeItem('platform_user');
          if (window.location.pathname === '/platform') {
            window.location.reload();
          }
          break;
        case 403:
          // Forbidden - user doesn't have permission
          console.error('Access forbidden:', data?.message || 'You do not have permission to access this resource');
          break;
        case 404:
          // Not found
          console.error('Resource not found:', data?.message || 'The requested resource was not found');
          break;
        case 500:
          // Server error
          console.error('Server error:', data?.message || 'An internal server error occurred');
          break;
        default:
          console.error('API error:', data?.message || error.message);
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network error:', 'No response received from server');
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }

    return Promise.reject(error);
  }
);

// Optional: If your backend expects JSON
axiosInstance.defaults.headers.post['Content-Type'] = 'application/json';
axiosInstance.defaults.headers.put['Content-Type'] = 'application/json';
axiosInstance.defaults.headers.patch['Content-Type'] = 'application/json';

export default axiosInstance;

