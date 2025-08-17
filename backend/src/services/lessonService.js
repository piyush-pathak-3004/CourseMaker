import Lesson from "../models/LessonModel.js";
import cohereService from "./cohereService.js";
import {
  LESSON_SYSTEM_PROMPT,
  LESSON_RESPONSE_FORMAT
} from '../config/cohereConstants.js';

export async function getOrGenerateLesson(courseTitle, moduleTitle, lessonTitle, userId) {
    // Check if the lesson already exists
    let lesson = await Lesson.findOne({ title: lessonTitle });

    if (!lesson) {
        // lesson will always exist
    } else {
        // check of content array is empty or not
        if (!lesson.content || lesson.content.length === 0) {
            // call cohere api to get lesson content
            const enrichedPrompt = `Create a detailed lesson on the topic: ${lessonTitle} of ${moduleTitle} in the course ${courseTitle}`;
            const aiResponse = await cohereService.callCohereAPI(enrichedPrompt, LESSON_SYSTEM_PROMPT, LESSON_RESPONSE_FORMAT);
            lesson.content = aiResponse;
            await lesson.save();
        }
        // return lesson.content;
    }

    return lesson;
}
