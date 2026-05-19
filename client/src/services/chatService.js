import axios from 'axios';
import { getToken } from './authService';

const API_URL = import.meta.env.VITE_API_URL || '';

/**
 * Upload a file and receive extracted text.
 * @param {File} file - The file to upload (PDF, DOCX, or TXT)
 * @returns {Promise<{ text: string, filename: string }>}
 */
export async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(`${API_URL}/api/upload`, formData, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to upload file. Please try again.');
  }
}

/**
 * Send a chat message with document context and conversation history.
 * @param {string} context - The extracted document text
 * @param {{ role: string, content: string }[]} messages - Full chat history
 * @returns {Promise<string>} The AI's reply
 */
export async function sendMessage(context, messages) {
  try {
    const response = await axios.post(
      `${API_URL}/api/chat`,
      { context, messages },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response.data.reply;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to get a response. Please try again.');
  }
}
