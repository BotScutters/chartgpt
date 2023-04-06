import axios from 'axios';

// 
export async function generateChart(content) {
  try {
    const response = await axios.post('/backend/generate-chart', { content });
    return response.data;
  } catch (error) {
    console.error('Error generating chart:', error);
    throw error;
  }
}
