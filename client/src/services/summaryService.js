import axios from 'axios';
import { getToken } from './authService';

const API_URL = import.meta.env.VITE_API_URL || '';

/**
 * Submit a note for AI summarization.
 * @param {string} note - The plain-text note to summarize
 * @returns {Promise<string>} The generated summary string on success
 */
export async function generateSummary(note) {
  try {
    const response = await axios.post(
      `${API_URL}/api/summarize`,
      { note },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response.data.summary;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || 'Network error, please try again'
    );
  }
}
