import axios from 'axios';

const API_URL = 'https://api.openai.com/v1/completions'; // Ensure this is the correct endpoint
const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

if (!API_KEY) {
  throw new Error('API key is not set in the environment variables');
}

export const analyzeTrends = async (data: string) => {
  try {
    const response = await axios.post(
      API_URL,
      {
        model: 'text-davinci-003', // or replace with the latest model
        prompt: `Analyze the following data for trends: ${data}`,
        max_tokens: 100
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0]?.text.trim() || 'No response text available';
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error analyzing trends:', error.response?.data || error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    throw error; // Propagate error for further handling
  }
};
