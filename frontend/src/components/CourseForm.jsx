import React, { useState } from 'react';
import { generateCourse } from '../utils/api';
// import { useAuth0 } from '@auth0/auth0-react'; // <-- Import the hook

const CourseForm = () => {

  console.log("✅ CourseForm component rendered");
  const [topic, setTopic] = useState('');
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // const { getAccessTokenSilently } = useAuth0(); // <-- Use the hook inside the component

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setCourse(null);

    try {
      console.log("Submitting topic:", topic);
      // const data = await generateCourse(topic, getAccessTokenSilently);
      const data = await generateCourse(topic);
      console.log("Backend raw response:", data);

      // ⬇️ Extract and parse actual JSON string
      const rawText = data.course;
      // const parsedCourse = JSON.parse(rawText);

      setCourse(rawText); // ✅ Now this will have course_title and modules
    } catch (err) {
      console.error("Error:", err);
      setError('Failed to generate course.');
    }

    setLoading(false);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter a topic"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Course'}
        </button>
      </form>

      {error && <div style={{ color: 'red' }}>{error}</div>}

      {course && (
        <div>
          <h2>{course.title}</h2>
          {course.modules.map((mod, idx) => (
            <div key={idx+1} style={{ marginBottom: '1em' }}>
              <h3>
                Module {idx+1}: {mod.title}
              </h3>
              <ul>
                {mod.lessons.map((lesson, idx) => (
                  <li key={idx}>{lesson.title}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseForm;