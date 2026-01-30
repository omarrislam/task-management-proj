# Task Management System (Full Stack)

A full-stack team task management system with JWT auth, role-based access, projects, tasks, comments, deadlines, and activity logs.

## Features
- JWT login/register
- Roles: Admin / Manager / User
- Projects with members
- Tasks with status (todo / doing / done) and deadlines
- Comments on tasks
- Activity log tracking

## Tech Stack
**Backend:** Node.js, Express, MongoDB, Mongoose, JWT  
**Frontend:** React (Vite), React Router

---

## Project Structure
```
TaskManagementSysAPI/
  Backend/
  Frontend/
```

---

## Backend Setup (API)

### 1) Install dependencies
```
cd Backend
npm install
```

### 2) Configure environment
Create `.env` based on `.env.example`:
```
NODE_ENV=development
PORT=4000
MONGO_URI=mongodb://localhost:27017/task_management_sys
JWT_SECRET=replace_with_strong_secret
JWT_EXPIRES_IN=7d
```

### 3) Run the backend
```
npm run dev
```

### Base URL
```
http://localhost:4000/api
```

---

## Frontend Setup (React)

### 1) Install dependencies
```
cd Frontend
npm install
```

### 2) Configure environment
Create `.env` based on `.env.example`:
```
VITE_API_URL=http://localhost:4000/api
```

### 3) Run the frontend
```
npm run dev
```

---

## API Routes (Summary)

### Auth
- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/auth/me`

### Projects
- GET `/api/projects`
- POST `/api/projects`
- GET `/api/projects/:id`
- PATCH `/api/projects/:id`
- POST `/api/projects/:id/members`

### Tasks
- GET `/api/tasks`
- POST `/api/tasks`
- GET `/api/tasks/:id`
- PATCH `/api/tasks/:id`
- DELETE `/api/tasks/:id`

### Comments
- GET `/api/tasks/:taskId/comments`
- POST `/api/tasks/:taskId/comments`

### Activity
- GET `/api/activity` (admin/manager only)

---

## Notes
- Registration always creates a `user` role. Admin/manager should be seeded or promoted manually.
- All protected routes require `Authorization: Bearer <token>`.

---

## GitHub Upload Checklist
- Ensure `.env` files are NOT committed (see `.gitignore`).
- Commit `.env.example` files for reference.
- Run `npm install` in both folders after cloning.

---

## License
MIT
