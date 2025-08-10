import axios from 'axios';

// Pass getAccessTokenSilently from useAuth0 as an argument
export const generateCourse = async (topic, getAccessTokenSilently) => {
  // const token = await getAccessTokenSilently();
  const response = await axios.post(
    '/api/v2/courses/generate-course',
    { topic },
    {
      headers: {
        // Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};