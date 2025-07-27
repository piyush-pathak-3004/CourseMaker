import React from 'react';
import CourseForm from '../components/CourseForm';

const Home = () => {
    return (
        <div>
            <h1>Welcome to the Course Maker Application</h1>
            <p>Enter a topic below to generate a detailed course.</p>
            <CourseForm />
        </div>
    );
};

export default Home;