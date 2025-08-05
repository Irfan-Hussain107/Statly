import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  withCredentials: true, 
});

API.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});


API.interceptors.response.use(
  (response) => response, 
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && originalRequest.url !== '/auth/refresh-token' && !originalRequest._retry) {
      originalRequest._retry = true; 
      try {
        const res = await API.post('/auth/refresh-token');
        if (res.status === 200) {
          setAccessToken(res.data.accessToken);
          API.defaults.headers.common['Authorization'] = 'Bearer ' + res.data.accessToken;
          return API(originalRequest);
        }
      } catch (refreshError) {
        console.error("Session expired. Please login again.");
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);


let accessToken = '';

const getAccessToken = () => accessToken;
const setAccessToken = (token) => {
  accessToken = token;
};

export const updateAccessToken = setAccessToken;

export default API;
