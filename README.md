# 🚀 JobTrack — College Placement & Job Application Tracker

A modern, responsive full-stack web application built with the **MERN Stack** (MongoDB, Express, React, Node.js) designed to manage campus placements, off-campus applications, interview schedules, and job offers.

---

## 📌 Project Milestones

- [x] **Milestone 1: Frontend UI Dashboard**
  - Modern, responsive React dashboard with dark-mode slate theme.
  - KPI summary metrics: Total Applications, Interviews, Offers Received, Rejections.
  - Dynamic filtering & multi-field search (company, role, location).
  - Interactive job applications table with inline status changer and row deletion.
  - Accessible modal form with client-side validation.
  - Realistic placement sample data (Google, Microsoft, Stripe, AWS, Swiggy, etc.).
- [x] **Milestone 2: Backend REST API & Database Integration (Node.js, Express, MongoDB & Mongoose)**
  - Express server running on port 5000 with CORS and JSON middleware.
  - Full CRUD REST API endpoints (`GET`, `POST`, `PUT`, `DELETE`).
  - Mongoose schema with data validation, enums, and timestamps.
  - Database connection module (`config/db.js`) supporting local MongoDB and MongoDB Atlas.
  - Intelligent fallback store ensuring zero downtime even before cloud database is provisioned.
  - Frontend API service (`services/api.js`) connecting React to Express with live API status badge.
- [ ] **Milestone 3: Advanced Placement Features & Analytics** *(Upcoming)*

---

## 🛠️ Full Tech Stack

- **Frontend**: React 18+ with Vite, Vanilla CSS design tokens, zero-dependency inline SVGs
- **Backend**: Node.js & Express 4.x
- **Database**: MongoDB with Mongoose ODM
- **Environment**: dotenv (`.env` configuration)
- **Dev Tools**: Nodemon for backend live reload, Vite dev server

---

## 📡 Backend REST API Endpoints

| Method | Endpoint | Description | Query / Body Params |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | API health check & uptime status | None |
| `GET` | `/api/applications` | Get all applications | `?search=google&status=Interviewing` |
| `GET` | `/api/applications/:id` | Get single application by ID | None |
| `POST` | `/api/applications` | Create new application | JSON body (`company`, `role`, `date`, ...) |
| `PUT` | `/api/applications/:id` | Update application or status | JSON body (`status`, etc.) |
| `DELETE` | `/api/applications/:id` | Delete application by ID | None |
| `POST` | `/api/applications/seed` | Seed database with sample applications | None |

---

## ⚡ How to Run Locally

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

### 1. Configure Backend Environment (Optional)
Navigate to `backend/` and check `.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/jobtrack
```
*(If you use MongoDB Atlas, replace `MONGODB_URI` with your connection string: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/jobtrack?retryWrites=true&w=majority`).*

### 2. Start the Applications

#### Option A: Run from Project Root (Two Terminals)
**Terminal 1 (Backend):**
```bash
npm run dev:backend
```
*(Server starts at `http://localhost:5000`)*

**Terminal 2 (Frontend):**
```bash
npm run dev:frontend
```
*(Frontend starts at `http://localhost:5173`)*

#### Option B: Run from Individual Folders
**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

Open your browser at:
👉 **`http://localhost:5173/`**

---

## 📂 Project Architecture

```text
Job Application Tracker/
├── backend/                              # Express & Node.js REST API
│   ├── config/
│   │   └── db.js                         # Mongoose MongoDB connection
│   ├── controllers/
│   │   └── applicationController.js      # CRUD controllers & logic
│   ├── models/
│   │   └── Application.js                # Mongoose Schema & validation
│   ├── routes/
│   │   └── applicationRoutes.js          # REST API route definitions
│   ├── .env                              # Environment variables
│   ├── .env.example                      # Template for environment variables
│   ├── package.json                      # Backend dependencies (express, mongoose, cors...)
│   └── server.js                         # Express entry point & middleware
├── frontend/                             # React + Vite client-side SPA
│   ├── src/
│   │   ├── components/                   # Modular components (Navbar, Table, Form, Cards...)
│   │   ├── data/                         # Sample placement dataset
│   │   ├── services/
│   │   │   └── api.js                    # API client wrapper
│   │   ├── App.jsx                       # State coordinator & API integration
│   │   ├── App.css                       # Layout & component CSS
│   │   └── index.css                     # Design tokens & dark slate theme
│   ├── index.html                        # HTML entry point with fonts
│   ├── package.json                      # Frontend dependencies
│   └── vite.config.js                    # Vite config with API proxy
├── package.json                          # Root runner scripts
└── README.md                             # Project documentation
```
