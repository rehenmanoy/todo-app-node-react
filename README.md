# 📝 ToDo App (Node.js + React + PostgreSQL)

A full-stack **To-Do application** built using **Node.js, Express, PostgreSQL, and React (Vite)**.  
This project focuses on **learning backend–frontend integration**, **JWT authentication**, and **user-specific data handling**.

---

## 🚀 Features

### ✅ Implemented
- User registration (with password hashing)
- User login with JWT authentication
- Token storage using `localStorage`
- Protected backend routes using JWT middleware
- User-specific tasks (each user sees only their own tasks)
- Create, read, update, and delete (CRUD) tasks
- Modern notebook-style UI
- Clean project separation (frontend & backend)

### 🛠 In Progress / Learning Focus
- Frontend route protection
- Token reuse & refresh strategy
- Better error handling and UI feedback
- Logout flow improvements

---

## 🧱 Tech Stack

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT (jsonwebtoken)
- bcrypt
- pg (node-postgres)
- dotenv

### Frontend
- React (Vite)
- React Router
- Lucide Icons
- CSS (custom notebook theme)

---

## 📁 Project Structure

```
ToDo-APP
│
├── backend
│ ├── middleware
│ │ └── auth.js
│ ├── src
│ │ ├── db.js
│ │ └── server.js
│ ├── .env
│ ├── package.json
│ └── node_modules
│
├── frontend
│ ├── public
│ │ ├── tick.svg
│ │ └── vite.svg
│ ├── src
│ │ ├── assets
│ │ │ └── react.svg
│ │ ├── pages
│ │ │ ├── Login
│ │ │ │ ├── login.jsx
│ │ │ │ └── login.css
│ │ │ └── TODO
│ │ │ ├── todo.jsx
│ │ │ └── todo.css
│ │ ├── utils
│ │ │ └── api.js
│ │ ├── App.jsx
│ │ ├── main.jsx
│ │ └── index.css
│ ├── .env
│ ├── index.html
│ ├── package.json
│ └── vite.config.js
│
└── README.md
```
---

▶️ How to Run the Project<br>
1️⃣ Backend Setup
```
cd backend
npm install
npm run devStart
```
Backend runs at:<br>
```
http://localhost:5000
```
---

2️⃣ Frontend Setup
```
cd frontend
npm install
npm run dev
```
Frontend runs at:
```
http://localhost:5173
```
---
### 🔐 Authentication Flow (Simplified)

- User logs in
- Backend generates JWT
- Token stored in localStorage
- Token sent in Authorization header
- Backend middleware validates token
- User ID from token used to fetch tasks

---

### 📌 Learning Goals of This Project

- Understand JWT authentication deeply
- Learn how frontend and backend communicate
- Practice PostgreSQL relational design
- Structure a scalable React project
- Implement protected routes and user-based access

---

### 👤 Author

***Rehen Manoy***
