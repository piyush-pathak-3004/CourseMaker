import React, { useState } from 'react';
import { generateCourse } from '../utils/api';
import { useAuth0 } from '@auth0/auth0-react'; // <-- Import the hook

const CourseForm = () => {
  const [topic, setTopic] = useState('');
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { getAccessTokenSilently } = useAuth0(); // <-- Use the hook inside the component

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setCourse(null);

    try {
      const data = await generateCourse(topic, getAccessTokenSilently);
      console.log("Backend raw response:", data);

      // ⬇️ Extract and parse actual JSON string
      const rawText = data.course.message.content[0].text;
      const parsedCourse = JSON.parse(rawText);

      setCourse(parsedCourse); // ✅ Now this will have course_title and modules
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
          <h2>{course.course_title}</h2>
          {course.modules.map((mod) => (
            <div key={mod.module_number} style={{ marginBottom: '1em' }}>
              <h3>
                Module {mod.module_number}: {mod.module_title}
              </h3>
              <ul>
                {mod.subtopics.map((sub, idx) => (
                  <li key={idx}>{sub}</li>
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