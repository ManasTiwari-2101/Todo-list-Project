# 📝 Full Stack Todo List Application

A secure full-stack Todo List application with user authentication, built using modern web technologies. Users can sign up, log in, and manage their personal tasks with persistent storage.

## 🚀 Live Demo
Frontend: https://my-todolist-fullstack-app.netlify.app  
Backend API: https://todo-backend-obhg.onrender.com  

---

## 🛠️ Tech Stack

### Frontend
- HTML
- CSS
- JavaScript

### Backend
- Node.js
- Express.js
- JWT Authentication

### Database
- MongoDB Atlas (Mongoose)

### Deployment
- Frontend: Netlify
- Backend: Render

---

## 🔐 Features

- User authentication (Signup/Login)
- JWT-based authorization
- User-specific todo lists
- Add, update, delete tasks
- Persistent storage with MongoDB
- Secure API routes
- Responsive UI

---

## 📁 Project Structure

Todo-list-Project/

├── todo-backhend

├── todo-frontend

├── .gitignore

└── README.md
---

## ⚙️ How It Works

- Users authenticate using email & password
- JWT token is stored in browser storage
- Token is sent with every protected API request
- Backend validates token and user identity
- Tasks are stored and fetched per user

---

## 🧠 What I Learned

- Building REST APIs with Express
- JWT authentication and authorization
- Secure password handling
- MongoDB schema design
- Full-stack deployment workflow
- Environment variable management
- CORS handling
