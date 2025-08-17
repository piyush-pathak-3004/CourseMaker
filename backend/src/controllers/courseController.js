// controllers/courseController.js

import { getOrGenerateCourse } from '../services/courseService.js';

export async function generateCourse(req, res) {
    
    console.log("controller here....");
    
    try {
        const { topic } = req.body;

        if (!topic) {
            return res.status(400).json({ error: 'Topic is required' });
        }
        
        const userId = req.user?.sub || 'anonymous';

        // Call Course Service
        const courseContent = await getOrGenerateCourse(topic, userId);

        return res.status(200).json({ course: courseContent });
    } catch (error) {
        console.error('Error generating course:', error);
        return res.status(500).json({ error: 'An error occurred while generating the course' });
    }
}
