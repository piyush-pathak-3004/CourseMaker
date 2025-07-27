# Course Maker Application - Backend

## Overview
This is the backend part of the Course Maker Application, which allows users to generate detailed courses based on a specified topic. The backend is built using Node.js and Express, and it interacts with the Cohere API to generate course content.

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm (Node package manager)

### Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the backend directory:
   ```
   cd course-maker-app/backend
   ```
3. Install the dependencies:
   ```
   npm install
   ```

### Running the Application
To start the backend server, run:
```
npm start
```
The server will be running on `http://localhost:3000`.

## API Endpoints

### Generate Course
- **Endpoint:** `POST /api/course/generate`
- **Description:** Generates a course based on the provided topic.
- **Request Body:**
  ```json
  {
    "topic": "string"
  }
  ```
- **Response:**
  ```json
  {
    "course": "string"
  }
  ```

## Cohere API Integration
This application uses the Cohere API to generate course content. Ensure you have the necessary API key and set it in your environment variables.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.