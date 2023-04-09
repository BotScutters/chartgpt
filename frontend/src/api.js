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

/**
 * Retrieves a list of datasets from the backend.
 * @returns {Promise<Array>} - A promise that resolves to an array of datasets.
 * @throws {Error} - Throws an error if the request fails.
 */
export async function getDatasets() {
  const response = await fetch('/backend/datasets');
  if (!response.ok) {
    throw new Error(`Failed to fetch datasets: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  return data;
}

/**
 * Sends a request to the backend to load a dataset by name and returns the response.
 * @param {string} datasetName - The name of the dataset to load.
 * @returns {Promise<Object>} - A promise that resolves to an object containing the loaded dataset.
 * @throws {Error} - Throws an error if the request fails.
 */
export async function loadDataset(datasetName) {
  const formData = new FormData();
  formData.append('dataset_name', datasetName);

  const response = await fetch('/backend/load-dataset', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Failed to load dataset ${datasetName}`);
  }

  const data = await response.json();
  return data;
}
