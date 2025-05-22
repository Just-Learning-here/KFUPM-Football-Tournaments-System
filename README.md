# ICS321 Project - Phase 2

This is a full-stack web application built with React.js for the frontend and Node.js/Express for the backend. The project implements a modern web application with user authentication and database integration.

## 🚀 Technologies Used

### Frontend

- React.js
- React Router DOM
- Tailwind CSS
- Testing Library
- Web Vitals

### Backend

- Node.js
- Express.js
- MySQL/PostgreSQL
- JWT Authentication
- Bcrypt for password hashing
- CORS enabled
- Environment variables support

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- Node.js (Latest LTS version recommended)
- npm (comes with Node.js)
- MySQL or PostgreSQL database

## 🛠️ Installation

1. Clone the repository:

```bash
git clone [your-repository-url]
cd ICS321Project
```

2. Install frontend dependencies:

```bash
cd phase2/frontend
npm install
```

3. Install backend dependencies:

```bash
cd ../backend
npm install
```

4. Create a `.env` file in the backend directory with the following variables:

```
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
JWT_SECRET=your_jwt_secret
PORT=6969
```

## 🚀 Running the Application

1. Start the backend server:

```bash
cd phase2/backend
npm run dev
```

2. Start the frontend development server:

```bash
cd phase2/frontend
npm start
```

The frontend will be available at `http://localhost:3000` and the backend at `http://localhost:6969`.

## 📁 Project Structure

```
phase2/
├── frontend/           # React frontend application
│   ├── public/        # Static files
│   ├── src/          # Source files
│   └── package.json  # Frontend dependencies
│
└── backend/          # Node.js backend application
    ├── src/         # Source files
    ├── public/      # Static files
    └── package.json # Backend dependencies
```

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Environment variables for sensitive data

## 🧪 Testing

To run frontend tests:

```bash
cd phase2/frontend
npm test
```

## 📝 License

This project is licensed under the ISC License.

## 👥 Authors

Bader Almutairi
Mohammed Alsahli
Yazeed Alamri

## 🙏 Acknowledgments

- ICS321 Course Team
- All contributors to the project
