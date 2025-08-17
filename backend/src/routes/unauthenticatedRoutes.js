import express from 'express'; 
import { generateCourse } from '../controllers/courseController.js';
import { generateLesson } from '../controllers/lessonController.js';

const router = express.Router();

router.post('/generate-course', generateCourse);
router.post('/generate-lesson', generateLesson);

export default router;