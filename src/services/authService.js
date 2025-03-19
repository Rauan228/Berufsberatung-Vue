import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

export const login = async (userData) => {
  const response = await axios.post(`${API_URL}/user-login`, userData);
  if (response.data.access_token) {
    localStorage.setItem('token', response.data.access_token);
  }
  return response.data;
};

export const logout = async () => {
  const token = localStorage.getItem('token');
  if (!token) return;

  await axios.post(`${API_URL}/user-logout`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });

  localStorage.removeItem('token');
};

export const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};
