const axios = require('axios');
const { COHERE_API_URL, COHERE_MODEL, COHERE_TEMPERATURE, RESPONSE_FORMAT, SYSTEM_PROMPT } = require('../config/cohereConstants.js');
const COHERE_API_KEY = process.env.COHERE_API_KEY;
// Constants

async function callCohereAPI(userPrompt) {
    console.log(" inside service....Calling Cohere API with prompt:");
    console.log("Cohere API URL:", COHERE_API_URL);
    console.log("Cohere API Key:", COHERE_API_KEY);
    console.log("Cohere Model:", COHERE_MODEL);
    console.log("Cohere Temperature:", COHERE_TEMPERATURE);
    console.log("System Prompt:", SYSTEM_PROMPT);
    console.log("Response Format:", RESPONSE_FORMAT);
    console.log("User Prompt:", userPrompt);
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

    const response = await axios.post(COHERE_API_URL, payload, {
      headers: {
        'Authorization': `bearer ${COHERE_API_KEY}`,
        'Content-Type': 'application/json',
        'accept': 'application/json'
      }
    });
    console.log("success response from Cohere API:", response.data);
    
    return response.data;
  } catch (error) {
    console.error('Error calling Cohere API:', error?.response?.data || error.message, error?.response?.status);
    throw new Error('Failed to generate course content');
  }
}

module.exports = {
  callCohereAPI
};