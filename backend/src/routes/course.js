const express = require('express');
const { generateCourse } = require('../controllers/courseController');

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

module.exports = router;
