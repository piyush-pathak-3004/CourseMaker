import axios from 'axios';
import {
  COHERE_API_URL,
  COHERE_MODEL,
  COHERE_TEMPERATURE,
  RESPONSE_FORMAT,
  SYSTEM_PROMPT
} from '../config/cohereConstants.js';
import dotenv from 'dotenv';
dotenv.config();

const COHERE_API_KEY = process.env.COHERE_API_KEY;

if (!COHERE_API_KEY) {
  throw new Error('COHERE_API_KEY is not set in the environment variables');
}

async function callCohereAPI(userPrompt) {
  try {
    const payload = {
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT
        },
        {
          role: "user",
          content: userPrompt
        }
      ],
      temperature: COHERE_TEMPERATURE,
      model: COHERE_MODEL,
      response_format: RESPONSE_FORMAT
    };
    console.log("Calling Cohere API with payload:", JSON.stringify(payload, null, 2));
    console.log("Using API URL:", COHERE_API_URL);
    console.log("Using API Key:", COHERE_API_KEY ? COHERE_API_KEY : 'Not Set');


    const response = await axios.post(COHERE_API_URL, payload, {
      headers: {
        'Authorization': `bearer ${COHERE_API_KEY}`,
        'Content-Type': 'application/json',
        'accept': 'application/json'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error calling Cohere API:', error?.response?.data || error.message, error?.response?.status);
    throw new Error('Failed to generate course content');
  }
}

export default {
  callCohereAPI
};
