export const COHERE_API_URL = 'https://api.cohere.com/v2/chat';

export const COHERE_MODEL = 'command-a-03-2025';
export const COHERE_TEMPERATURE = 0.3;
export const COURSE_SYSTEM_PROMPT = `You are an expert course designer. Help students and professionals learn any given topic by providing a clear, progressive learning roadmap. Break down the topic into 5 well-structured modules, where each module includes: module_number: number from 1 to 5, module_title: a short, descriptive title for the module, subtopics: a list of 3 to 5 subtopics that logically belong to the module, Modules should flow from beginner to advanced concepts in a logical order.`; // full prompt here
export const COURSE_RESPONSE_FORMAT = {
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
export const LESSON_SYSTEM_PROMPT = `You are an expert lesson designer. For a given subtopic, generate a lesson broken into exactly 5 structured content blocks. 
Each block must have a "type" field with one of: "heading", "paragraph", "code", "video", "mcq". 

Required formats:
- heading: { "type": "heading", "text": "..." }
- paragraph: { "type": "paragraph", "text": "..." }
- code: { "type": "code", "language": "...", "text": "..." }
- video: { "type": "video", "url": "..." }
- mcq: { "type": "mcq", "question": "...", "options": ["..."], "answer": <index of correct option> }

Ensure the lesson flows logically from introduction to advanced concepts.`;


// export const LESSON_RESPONSE_FORMAT = {
//   type: "json_schema",
//   json_schema: {
//     name: "lesson_schema",
//     schema: {
//       type: "object",
//       properties: {
//         lesson: {
//           type: "array",
//           minItems: 5,
//           maxItems: 5,
//           items: {
//             oneOf: [
//               {
//                 type: "object",
//                 properties: {
//                   type: { const: "heading" },
//                   text: { type: "string" }
//                 },
//                 required: ["type", "text"]
//               },
//               {
//                 type: "object",
//                 properties: {
//                   type: { const: "paragraph" },
//                   text: { type: "string" }
//                 },
//                 required: ["type", "text"]
//               },
//               {
//                 type: "object",
//                 properties: {
//                   type: { const: "code" },
//                   language: { type: "string" },
//                   text: { type: "string" }
//                 },
//                 required: ["type", "language", "text"]
//               },
//               {
//                 type: "object",
//                 properties: {
//                   type: { const: "video" },
//                   url: { type: "string" }
//                 },
//                 required: ["type", "url"]
//               },
//               {
//                 type: "object",
//                 properties: {
//                   type: { const: "mcq" },
//                   question: { type: "string" },
//                   options: {
//                     type: "array",
//                     items: { type: "string" },
//                     minItems: 1
//                   },
//                   answer: { type: "number" }
//                 },
//                 required: ["type", "question", "options", "answer"]
//               }
//             ]
//           }
//         }
//       },
//       required: ["lesson"]
//     }
//   }
// };


export const LESSON_RESPONSE_FORMAT = {
  type: "json_schema",
  json_schema: {
    name: "lesson_schema",
    schema: {
      type: "object",
      properties: {
        lesson: {
          type: "array",
          minItems: 5,
          maxItems: 5,
          items: {
            oneOf: [
              {
                type: "object",
                properties: {
                  type: { const: "heading" },
                  text: { type: "string" }
                },
                required: ["type", "text"]
              },
              {
                type: "object",
                properties: {
                  type: { const: "paragraph" },
                  text: { type: "string" }
                },
                required: ["type", "text"]
              },
              {
                type: "object",
                properties: {
                  type: { const: "code" },
                  language: { type: "string" },
                  text: { type: "string" }
                },
                required: ["type", "language", "text"]
              },
              {
                type: "object",
                properties: {
                  type: { const: "video" },
                  url: { type: "string" }
                },
                required: ["type", "url"]
              },
              {
                type: "object",
                properties: {
                  type: { const: "mcq" },
                  question: { type: "string" },
                  options: {
                    type: "array",
                    items: { type: "string" },
                    minItems: 1
                  },
                  answer: { type: "number" }
                },
                required: ["type", "question", "options", "answer"]
              }
            ]
          }
        }
      },
      required: ["lesson"]
    }
  }
};
