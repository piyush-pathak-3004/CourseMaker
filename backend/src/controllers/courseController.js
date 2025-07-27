// controllers/courseController.js

import cohereService from '../services/cohereService.js';

export async function generateCourse(req, res) {
    
    console.log("controller here....");
    
    try {
        const { topic } = req.body;

        if (!topic) {
            return res.status(400).json({ error: 'Topic is required' });
        }

        // Enrich the prompt (you can customize this further)
        const enrichedPrompt = `Create a detailed course on the topic: ${topic}`;

        // Call Cohere API
        const courseContent = await cohereService.callCohereAPI(enrichedPrompt);

        return res.status(200).json({ course: courseContent });
    } catch (error) {
        console.error('Error generating course:', error);
        return res.status(500).json({ error: 'An error occurred while generating the course' });
    }
}
