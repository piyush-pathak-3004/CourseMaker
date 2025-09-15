import axios from 'axios';

// Pass getAccessTokenSilently from useAuth0 as an argument
export const generateCourse = async (topic, getAccessTokenSilently) => {

  console.log("at generateCourse fn....");
  try {
    const token = await getAccessTokenSilently();
    
    console.log("at generate Coursse");
    console.log(topic, token);
  
    const response = await axios.post(
      '/api/v2/courses/generate-course',
      { topic },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response);
  
    return response.data;
  } catch (error) {
    console.log(error);
  }
  
};



export const generateLesson = async (courseTitle, moduleTitle, lessonTitle, getAccessTokenSilently) => {
  console.log("generateLesson got called");
  const token = await getAccessTokenSilently();
  const response = await axios.post(
    '/api/v2/lessons/generate-lesson',
    {
      courseTitle: courseTitle,
      moduleTitle: moduleTitle,
      lessonTitle: lessonTitle
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        // Content-Type: 'application/json'
      }
    }
  );
  return response.data;
}