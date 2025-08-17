// src/components/CourseForm.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateCourse } from '../utils/api';
import { useAuth0 } from '@auth0/auth0-react';

const STORAGE_KEY = 'myapp_current_course_v1';

const CourseForm = () => {
  const [topic, setTopic] = useState('');
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();

  // Load course from sessionStorage on mount (so back/refresh preserves it)
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        setCourse(JSON.parse(raw));
      }
    } catch (e) {
      console.warn('Failed to read course from sessionStorage', e);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setCourse(null);

    try {
      console.log("here....");

      const data = await generateCourse(topic, getAccessTokenSilently);
      const rawCourse = data.course;
      setCourse(rawCourse);

      // persist to sessionStorage so back/refresh keeps it
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(rawCourse));
      } catch (err) {
        console.warn('Failed to save course to sessionStorage', err);
      }
    } catch (err) {
      setError('Failed to generate course.');
    } finally {
      setLoading(false);
    }
  };

  const handleLessonClick = (lessonIdx, moduleIdx) => {
    // pass course in state for immediate use in LessonPage
    navigate(`/authorised/lesson/${moduleIdx}/${lessonIdx}`, { state: { course } });
  };

  const clearCourse = () => {
    setCourse(null);
    sessionStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div style={{ padding: '1rem' }}>
      <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter a topic"
          required
          style={{ padding: '0.5rem', marginRight: '0.5rem' }}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Course'}
        </button>
        <button type="button" onClick={clearCourse} style={{ marginLeft: '0.5rem' }}>
          Clear course
        </button>
      </form>

      {error && <div style={{ color: 'red' }}>{error}</div>}

      {course ? (
        <div>
          <h2>{course.title}</h2>
          {course.modules.map((mod, midx) => (
            <div key={midx} style={{ marginBottom: '1em' }}>
              <h3>
                Module {midx + 1}: {mod.title}
              </h3>
              <ul>
                {mod.lessons.map((lesson, lidx) => (
                  <li key={lidx} style={{ marginBottom: '0.25rem' }}>
                    {lesson.title}{' '}
                    <button onClick={() => handleLessonClick(lidx, midx)}>View Lesson</button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <p>No course generated yet.</p>
      )}
    </div>
  );
};

export default CourseForm;
