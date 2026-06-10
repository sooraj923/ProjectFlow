# 🚀 Project Flow

Project Flow is a full-stack project management web application that helps teams organize projects, manage tasks, and track progress efficiently.

## Features

- User Registration & Login
- JWT Authentication
- Create, Edit, and Delete Projects
- Create, Assign, Update, and Delete Tasks
- Task Status Management (Todo, In Progress, Done)
- Team Collaboration
- Protected Routes
- Responsive User Interface

## Tech Stack

**Frontend**
- React.js
- React Router
- Axios
- CSS

**Backend**
- Node.js
- Express.js

**Database**
- MongoDB
- Mongoose

**Authentication**
- JWT
- bcrypt.js

## Project Structure

```bash
Project-Flow/
├── frontend/
├── backend/
└── README.md
```

## Installation

### Clone the Repository

```bash
git clone https://github.com/your-username/project-flow.git
cd project-flow
```

### Install Dependencies

Backend:

```bash
cd backend
npm install
```

Frontend:

```bash
cd frontend
npm install
```

### Configure Environment Variables

Create a `.env` file in the backend folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### Run the Application

Start Backend:

```bash
cd backend
npm start
```

Start Frontend:

```bash
cd frontend
npm start
```

The application will run at:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

## Future Improvements

- File Upload Support
- Email Notifications
- Activity Logs
- Dark Mode
- Calendar Integration

## Author

**Sooraj**

## License

This project is created for learning and educational purposes.

⭐ If you like this project, consider giving it a star.
