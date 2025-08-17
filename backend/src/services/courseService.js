// services/courseService.js
import Course from '../models/CourseModel.js';
import Module from '../models/ModuleModel.js';
import Lesson from '../models/LessonModel.js';
import cohereService from '../services/cohereService.js';
import {
  COURSE_SYSTEM_PROMPT,
  COURSE_RESPONSE_FORMAT,
} from '../config/cohereConstants.js';

export async function getOrGenerateCourse(topic, userId) {
  const normalizedTopic = topic.trim().toLowerCase();

  // 1. Check if course already exists (case-insensitive match)
  const existingCourse = await Course.findOne({ title: new RegExp(`^${normalizedTopic}$`, 'i') })
    .populate({ path: 'modules', populate: { path: 'lessons' } });

  if (existingCourse) {
    return existingCourse;
  }

  // 2. Call Cohere to generate course content
  const enrichedPrompt = `Create a detailed course on the topic: ${topic}`;
  const aiResponse = await cohereService.callCohereAPI(enrichedPrompt, COURSE_SYSTEM_PROMPT, COURSE_RESPONSE_FORMAT);

  // 3. Extract and parse actual JSON string from response
  const rawText = aiResponse.message.content[0].text;
  const parsedCourse = JSON.parse(rawText);

  const courseTitle = parsedCourse.course_title;
  const modules = parsedCourse.modules;

  // 4. Save course to DB
  const courseDoc = await Course.create({
    title: normalizedTopic,
    description: '', // Can be enriched later
    creator: userId,
    tags: [] // Tags can be added later
  });

  for (const mod of modules) {
    const moduleDoc = await Module.create({
      title: mod.module_title,
      course: courseDoc._id
    });

    const lessonIds = [];

    for (const subtopic of mod.subtopics) {
      const lessonDoc = await Lesson.create({
        title: subtopic,
        content: [], // Can be enriched later
        module: moduleDoc._id
      });
      lessonIds.push(lessonDoc._id);
    }

    moduleDoc.lessons = lessonIds;
    await moduleDoc.save();
    courseDoc.modules.push(moduleDoc._id);
  }

  await courseDoc.save();

  // 5. Return fully populated course
  const fullCourse = await Course.findById(courseDoc._id).populate({
    path: 'modules',
    populate: { path: 'lessons' }
});

    console.log("✅ Final saved course structure:", JSON.stringify(fullCourse, null, 2));

    return fullCourse;
}