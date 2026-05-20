import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '';
const TOKEN_KEY = 'authToken';

export async function register(username, password) {
  try {
    const response = await axios.post(
      `${API_URL}/api/auth/register`,
      { username, password }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || error.message || 'Failed to register. Please try again.'
    );
  }
}

export async function login(username, password) {
  try {
    const response = await axios.post(
      `${API_URL}/api/auth/login`,
      { username, password }
    );
    const token = response.data?.token;
    if (!token) {
      throw new Error('Login failed. Invalid server response.');
    }
    localStorage.setItem(TOKEN_KEY, token);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || error.message || 'Failed to login. Please check your credentials and try again.'
    );
  }
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
}

export function getToken() {
  return 'demo-token';
}

export function isAuthenticated() {
  return true;
}
