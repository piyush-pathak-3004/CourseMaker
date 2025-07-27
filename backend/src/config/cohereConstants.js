const COHERE_API_URL = 'https://api.cohere.com/v2/chat';

const COHERE_MODEL = 'command-a-03-2025';
const COHERE_TEMPERATURE = 0.3;
const SYSTEM_PROMPT = `You are an expert course designer. Help students and professionals learn any given topic by providing a clear, progressive learning roadmap. Break down the topic into 5 well-structured modules, where each module includes: module_number: number from 1 to 5, module_title: a short, descriptive title for the module, subtopics: a list of 3 to 5 subtopics that logically belong to the module, Modules should flow from beginner to advanced concepts in a logical order.`; // full prompt here
const RESPONSE_FORMAT = {
  type: "json_object",
  jsonSchema: {
    type: "object",
    properties: {
      course_title: { type: "string", description: "The title of the course" },
      modules: {
        type: "array",
        description: "List of modules in the course",
        items: {
          type: "object",
          properties: {
            module_number: { type: "number", description: "The module's sequence number" },
            module_title: { type: "string", description: "The title of the module" },
            subtopics: {
              type: "array",
              description: "List of subtopics under this module",
              items: { type: "string" }
            }
          },
          required: ["module_number", "module_title", "subtopics"]
        }
      }
    },
    required: ["course_title", "modules"]
  }
};

module.exports = {
  COHERE_API_URL,
  COHERE_MODEL,
  COHERE_TEMPERATURE,
  SYSTEM_PROMPT,
  RESPONSE_FORMAT
};