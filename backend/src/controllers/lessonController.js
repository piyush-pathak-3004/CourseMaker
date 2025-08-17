import {getOrGenerateLesson}  from "../services/lessonService.js";

export async function generateLesson(req, res) {
    const { courseTitle, moduleTitle, lessonTitle } = req.body;

    if (!courseTitle || !moduleTitle || !lessonTitle) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const userId = req.user?.sub || 'anonymous';
        // call service method to getOrGenerateLesson
        const lessonContent = await getOrGenerateLesson(courseTitle, moduleTitle, lessonTitle, userId);
        return res.status(200).json({ lesson: lessonContent });
    } catch (error) {
        console.error('Error generating lesson:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}