# Course Maker Application

This is a full-stack Course Maker application that allows users to generate detailed courses based on a specified topic. The application consists of a Node.js backend that interacts with the Cohere API and a React frontend for user interaction.

## Project Structure

```
course-maker-app
├── backend
│   ├── src
│   │   ├── app.js
│   │   ├── routes
│   │   │   └── course.js
│   │   ├── controllers
│   │   │   └── courseController.js
│   │   ├── services
│   │   │   └── cohereService.js
│   │   └── utils
│   │       └── index.js
│   ├── package.json
│   └── README.md
├── frontend
│   ├── src
│   │   ├── App.jsx
│   │   ├── components
│   │   │   └── CourseForm.jsx
│   │   ├── pages
│   │   │   └── Home.jsx
│   │   └── utils
│   │       └── api.js
│   ├── package.json
│   └── README.md
└── README.md
```

## Backend Setup

1. Navigate to the `backend` directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the backend server:
   ```
   npm start
   ```

## Frontend Setup

1. Navigate to the `frontend` directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the frontend application:
   ```
   npm start
   ```

## Usage

- Open your browser and go to `http://localhost:3000` to access the application.
- Enter a topic in the form provided and click the button to generate a course.
- The application will communicate with the backend to process the request and return the generated course details.

## Technologies Used

- Node.js
- Express.js
- React
- Cohere API

## License

This project is licensed under the MIT License.