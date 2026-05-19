import axios from 'axios';
import { getToken } from './authService';

const API_URL = import.meta.env.VITE_API_URL || '';

export async function getHistory() {
  try {
    const response = await axios.get(`${API_URL}/api/history`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data.history;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to load history. Please try again.');
  }
}

export async function deleteHistoryItem(itemId) {
  try {
    const response = await axios.delete(`${API_URL}/api/history/${itemId}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to delete history item. Please try again.');
  }
}
