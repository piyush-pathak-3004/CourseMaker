import express from "express";

import { generateLesson } from '../controllers/lessonController.js';


const router = express.Router();


router.post('/generate-lesson', async (req, res) => {
    if (!req.auth) return res.status(401).json({ error: 'Unauthorized' });
    try {
        const course = await generateLesson(req, res);
        return res.status(200).json(course);
    } catch (error) {
        console.error('Error in route:', error);
        return res.status(500).json({ error: 'An error occurred while generating the lesson' });
    }
});

export default router;