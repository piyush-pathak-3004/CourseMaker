# Course Maker Application - Frontend

This is the frontend part of the Course Maker application, built using React. The application allows users to enter a topic and generate a detailed course using the Cohere API.

## Getting Started

To get started with the frontend application, follow these steps:

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd course-maker-app/frontend
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Run the application**:
   ```
   npm start
   ```

   This will start the development server and open the application in your default web browser.

## Folder Structure

- `src/`: Contains all the source code for the frontend application.
  - `App.jsx`: The main component that sets up routing and renders the application layout.
  - `components/`: Contains reusable components.
    - `CourseForm.jsx`: The form component for users to input their desired course topic.
  - `pages/`: Contains the different pages of the application.
    - `Home.jsx`: The landing page that renders the CourseForm component.
  - `utils/`: Contains utility functions for API calls.
    - `api.js`: Function to make API calls to the backend for course generation.

## Usage

1. Navigate to the home page to enter a course topic.
2. Fill in the form and click the "Generate Course" button.
3. The application will communicate with the backend to generate a detailed course based on the provided topic.

## Contributing

If you would like to contribute to this project, please fork the repository and submit a pull request with your changes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.