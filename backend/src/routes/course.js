import express from 'express';
import { generateCourse } from '../controllers/courseController.js';

const router = express.Router();

router.post('/generate-course', async (req, res) => {
    if (!req.auth) return res.status(401).json({ error: 'Unauthorized' });
    try {
        const course = await generateCourse(req, res);
        return res.status(200).json(course);
    } catch (error) {
        console.error('Error in route:', error);
        return res.status(500).json({ error: 'An error occurred while generating the course' });
    }
});

export default router;
