// api.js
import axios from 'axios';

/**
 * Sends a request to the backend to process user input and returns the response.
 * @param {string} content - The user input to process.
 * @returns {Promise<Object>} - A promise that resolves to an object containing the response.
 * @throws {Error} - Throws an error if the request fails.
 */
export async function processRequest(content) {
  try {
    const response = await axios.post('/backend/process-request', { content });
    return response.data;
  } catch (error) {
    console.error('Error processing request:', error);
    throw error;
  }
}
