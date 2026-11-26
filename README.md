# 🎓 Campus Placement Portal (MERN Stack)
### Academic Project Assignment • Developed by Team 4 (Students S.No. 23 to 29)

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-800020.svg)](#technologies-used)
[![Frontend](https://img.shields.io/badge/Frontend-React.js%20%7C%20Vite-0ea5e9.svg)](#frontend-features)
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express.js-ea580c.svg)](#backend-architecture)
[![Database](https://img.shields.io/badge/Database-MongoDB%20%7C%20Mongoose-47a248.svg)](#database--models)
[![Role-Based](https://img.shields.io/badge/Roles-Student%20%7C%20Company%20%7C%20Admin-722F37.svg)](#user-roles--features)

---

## 📌 1. Project Overview & Objectives

The **Campus Placement Portal** is a web application designed to digitize and automate the entire campus recruitment and placement lifecycle for universities and colleges.

### 🎯 Primary Objectives:
- **For Students:** Discover active campus recruitment drives, verify personal eligibility (CGPA, branch, backlogs) automatically in real time, apply with one click, manage resumes, and track recruitment progress stage-by-stage (*Applied* ➔ *Under Review* ➔ *Shortlisted* ➔ *Selected* / *Rejected*).
- **For Corporate Recruiters:** Post placement drives with specific cutoffs (Min CGPA, eligible departments, max backlogs, package CTC, deadlines), download applicant resumes, schedule interviews, and issue shortlist/selection offers.
- **For the Placement Cell (Admin):** Command center to monitor batch hiring metrics, evaluate branch-wise placement performance, oversee student profiles, manage recruiting companies, and broadcast urgent placement notices.

---

## 👥 2. Project Team Details (Team 4)

| S.No. | Student Member Role | Key Project Modules Owned |
| :---: | :--- | :--- |
| **23** | **Team Lead & Backend Architecture** | Express REST APIs, JWT Role-based Middleware, Multer File Upload |
| **24** | **Frontend Lead (React.js)** | Component Architecture, React Router, Context API state management |
| **25** | **Database & Schemas Lead** | MongoDB Collections, Mongoose Data Modeling, Seed Scripts |
| **26** | **UI/UX & Design Specialist** | CSS Theme System (Wine Red, Cool Sky Blue, Orange, Light Grey) |
| **27** | **Authentication & Security** | Bcrypt Password Hashing, Role Authorizers, Security Auditing |
| **28** | **Testing & Quality Assurance** | Integration API Tests, Cross-role Edge Cases, Input Validation |
| **29** | **Documentation & Presentation** | Technical Documentation, Readme Specification, Viva Prep |

---

## 🎨 3. Design Philosophy & Color Palette

Designed specifically for students, recruiters, and academic evaluators, featuring clean typography, card layouts, status steppers, and modern gradients:
- **Wine Red (`#722F37` / `#541920`):** Academic dignity, institutional branding, primary buttons.
- **Cool Sky Blue (`#0ea5e9` / `#38bdf8`):** Technology, recruiter hub, interactive tabs, active highlights.
- **Vibrant Orange (`#ea580c` / `#f97316`):** Highlights, metrics, application deadlines, action alerts.
- **Light Grey & Crisp White (`#f8fafc`, `#ffffff`):** Modern clean cards, comfortable reading backgrounds.

---

## 🚀 4. User Roles & Complete Feature Set

### 👨‍🎓 A. Student Portal
1. **Authentication & Profile:**
   - Registration with Roll Number, Branch, CGPA, 10th %, 12th %, Passing Year, Skills, and Bio.
   - Profile editor with live updates.
   - Resume upload (`.pdf`, `.doc`, `.docx`) with preview and direct download link.
2. **Browse & Filter Placement Drives:**
   - Multi-criteria live search (Title, Role, Required Skills, Location).
   - Filter by Eligible Branch (CSE, IT, ECE, EEE, MECH, CIVIL), CTC Package, and CGPA cutoff.
3. **Automated Real-Time Eligibility Evaluator:**
   - When viewing any job drive, the system automatically checks your credentials against the job's cutoffs:
     - ✅ Displays clear confirmation when eligible.
     - ⚠️ Highlights exact disqualification criteria (e.g., *"Requires min 8.0 CGPA, your CGPA is 7.2"* or *"Requires CSE, your branch is MECH"*).
4. **Application History & Visual Stepper:**
   - Visual progress timeline for every applied drive: `Applied` ➔ `Under Review` ➔ `Shortlisted` ➔ `Selected / Offer` (or `Rejected`).
   - Recruiter feedback remarks and scheduled interview timestamps.
5. **Notice Board & Announcements:**
   - Urgent alerts for online assessment test links, pre-placement talks (PPT), and deadlines.

---

### 🏢 B. Company / Recruiter Portal
1. **Recruiter Authentication & Company Profile:**
   - Company branding: Legal Name, Website, Industry, Location, About Description, and Recruiter Contact.
2. **Campus Drive Management:**
   - Create new placement drives with custom CTC (LPA), monthly stipend, vacancies, role, and deadlines.
   - Set strict eligibility criteria: Minimum CGPA, allowed engineering branches, maximum backlogs.
   - Edit, update, close, or delete drives.
3. **Candidate Screening & Shortlisting:**
   - View all applicants for each posted drive in structured tables.
   - Access candidate academic metrics (CGPA, Branch, Backlogs, Skills).
   - 1-click Download candidate resumes.
   - Change candidate recruitment status with custom notes and interview schedule dates.

---

### 🏛️ C. Placement Cell (Admin Portal)
1. **Executive Dashboard & Real-Time Stats:**
   - Total Registered Students, Active Hiring Partners, Posted Drives, Total Applications Processed, Placed Students, and Batch Placement Conversion %.
2. **Visual Analytics & Reporting:**
   - Application Pipeline Distribution chart (Applied, Under Review, Shortlisted, Selected, Rejected).
   - Department-wise placement performance table (CSE, IT, ECE, EEE, MECH).
3. **Student Directory & Account Moderation:**
   - Search students by name or roll number; filter by branch.
   - View complete academic credentials and placement status.
   - Activate / Deactivate student accounts.
4. **Company Verification & Oversight:**
   - Review registered recruiters and their posted drives.
   - Toggle verified status and account access.
5. **Master Placement Report:**
   - Consolidated tabular placement report ready for evaluation, CSV download, and printing.
6. **Campus Broadcast System:**
   - Publish real-time announcements with priority tags (*Urgent*, *Alert*, *Info*, *Success*).

---

## 🛠️ 5. Technologies Used

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React.js 19, Vite, React Router v6, Axios, Lucide React Icons, Modern Custom CSS Theme |
| **Backend** | Node.js, Express.js (REST APIs, CORS, Middleware) |
| **Authentication** | JSON Web Tokens (JWT), Bcrypt.js (10-round salted password hashing) |
| **File Storage** | Multer for handling multi-part resume documents (`/uploads`) |
| **Database** | MongoDB, Mongoose ODM (Schemas, Indexing, Pre-save hooks, Relationships) |
| **In-Memory Store** | Transparent zero-config fallback storage when local MongoDB service is offline |

---

## 📂 6. Project Directory Structure

```text
indian place(MERN)/
├── package.json               # Root scripts (dev, build, test, seed)
├── .gitignore                 # Protected exclusions (.env, node_modules)
├── README.md                  # Comprehensive documentation
│
├── backend/                   # Node.js + Express REST API Server
│   ├── config/
│   │   ├── db.js              # MongoDB connection with graceful fallback
│   │   └── inMemoryStore.js   # Pre-seeded database for zero-config demos
│   ├── controllers/
│   │   ├── adminController.js # Stats, user moderation, notices, reports
│   │   ├── applicationController.js # Job applications, status stepper
│   │   ├── authController.js  # Registration, login, password update
│   │   ├── companyController.js # Recruiter profiles & directory
│   │   ├── jobController.js   # Job drives CRUD, search, filter
│   │   └── studentController.js # Academic profile, resume, eligibility
│   ├── middleware/
│   │   ├── auth.js            # JWT verification & role authorization
│   │   └── upload.js          # Multer resume file upload handler
│   ├── models/
│   │   ├── Application.js     # Mongoose Application Schema
│   │   ├── CompanyProfile.js  # Mongoose Company Profile Schema
│   │   ├── Job.js             # Mongoose Placement Drive Schema
│   │   ├── Notification.js    # Mongoose Campus Notice Schema
│   │   ├── StudentProfile.js  # Mongoose Academic Profile Schema
│   │   └── User.js            # Mongoose User Authentication Schema
│   ├── routes/                # Express API Route Handlers
│   ├── uploads/               # Stored resume documents
│   ├── .env                   # Environment configuration
│   ├── .env.example           # Template for environment variables
│   ├── package.json           # Backend dependencies
│   ├── seeder.js              # Standalone database population script
│   ├── server.js              # Express app entrypoint
│   └── test-api.js            # Integration test suite
│
└── frontend/                  # React.js + Vite Application
    ├── public/                # Static assets & icons
    ├── src/
    │   ├── components/
    │   │   ├── common/
    │   │   │   ├── Footer.jsx # Team 4 project credits & college info
    │   │   │   ├── LoadingSpinner.jsx # Loading state indicator
    │   │   │   ├── Navbar.jsx # Role-aware responsive navigation & alerts
    │   │   │   ├── NotificationModal.jsx # Live announcement board
    │   │   │   ├── ProtectedRoute.jsx # Role-based route guard
    │   │   │   └── StatusBadge.jsx # Color-coded status badge
    │   │   └── jobs/
    │   │       └── JobDetailsModal.jsx # Eligibility evaluation & apply
    │   ├── context/
    │   │   ├── AuthContext.jsx # Global user auth & role state
    │   │   └── ToastContext.jsx # Floating toast alerts system
    │   ├── pages/
    │   │   ├── AdminDashboard.jsx # Admin metrics, moderation, reports
    │   │   ├── CompanyDashboard.jsx # Post jobs, candidate shortlist
    │   │   ├── CompanyDirectory.jsx # List of visiting companies
    │   │   ├── Home.jsx       # Landing page, stats ticker, demo portal
    │   │   ├── JobsPage.jsx   # Search & filter placement drives
    │   │   ├── Login.jsx      # Multi-role login with 1-click demo autofill
    │   │   ├── Register.jsx   # Student & Recruiter registration
    │   │   └── StudentDashboard.jsx # Applications tracker & profile
    │   ├── services/
    │   │   └── api.js         # Axios instance with JWT interceptor
    │   ├── styles/
    │   │   └── theme.css      # Wine red, sky blue, orange theme system
    │   ├── App.jsx            # Router and layout integration
    │   ├── index.css          # Global styling & tables
    │   └── main.jsx           # React DOM root
    ├── index.html             # HTML5 template with Inter font
    └── package.json           # Frontend dependencies
```

---

## 🔑 7. Demo Credentials for Presentation / Viva

The application includes pre-configured demo credentials across all roles. The login page also features **1-Click Autofill Buttons** for presentation convenience:

| Role | Name | Email Address | Password | Key Characteristics |
| :--- | :--- | :--- | :--- | :--- |
| **Placement Admin** | Dr. V. K. Sharma | `admin@placement.edu` | `Admin@123` | Full access to command center, stats & notices |
| **Student (Placed)** | Priya Nair (CSE) | `priya@student.edu` | `Student@123` | 9.42 CGPA, **Selected at Google (24.5 LPA)** |
| **Student (Active)** | Aarav Sharma (CSE) | `aarav@student.edu` | `Student@123` | 8.85 CGPA, Shortlisted at Microsoft, Applied at Google |
| **Student (Seeking)** | Sneha Patel (IT) | `sneha@student.edu` | `Student@123` | 7.95 CGPA, Shortlisted at TCS Digital |
| **Company Recruiter** | Google India | `google@careers.com` | `Company@123` | Recruiter: Megha Sen, Posted 24.5 LPA Drive |
| **Company Recruiter** | Microsoft IDC | `microsoft@careers.com` | `Company@123` | Recruiter: Karan Malhotra, Posted 19.5 LPA Drive |

---

## ⚙️ 8. Step-by-Step Installation & Running Guide

### Prerequisites:
- **Node.js** (v18.0.0 or higher) & **npm** installed on your system.

### Step 1: Open Terminal in Project Directory
```bash
cd "c:\Users\Jagadiswar\Downloads\indian place(MERN)"
```

### Step 2: Run Backend Server
Open your first terminal window:
```bash
cd backend
npm start
```
*Output will display:*
```text
====================================================
 Placement Portal Backend Running on Port 5000
 Developed by Team 4 (Students S.No. 23 to 29)
 Health Check: http://localhost:5000/api/health
====================================================
```

### Step 3: Run Frontend Application
Open a second terminal window:
```bash
cd frontend
npm run dev
```
*Output will display:*
```text
  VITE v8.3.8  ready in 250 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 4: Open in Web Browser
Open your browser and navigate to:
👉 **`http://localhost:5173`**

---

## 🗄️ 9. Database & MongoDB Setup Guide

The application is built with a dual database mechanism:

### Option A: Automatic Zero-Config Mode (Default)
If MongoDB is not running locally on your laptop, the backend **automatically activates its in-memory storage layer** populated with complete sample companies, students, job drives, and applications. All actions (creating jobs, applying, status updates, notifications) work out of the box with zero setup!

### Option B: Local MongoDB Service
If you have MongoDB Community Server installed on your computer:
1. Start the MongoDB service:
   ```bash
   mongod
   ```
2. In `backend/.env`, set:
   ```env
   MONGODB_URI=mongodb://127.0.0.1:27017/placement_portal
   ```
3. Populate realistic sample data:
   ```bash
   cd backend
   npm run seed
   ```

### Option C: Free MongoDB Atlas (Cloud Database)
1. Create a free M0 cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Copy your connection string:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/placement_portal?retryWrites=true&w=majority
   ```
3. Paste it into `backend/.env`.
4. Run `npm run seed` inside the `backend` folder to seed the cloud database.

---

## 🔌 10. REST API Documentation Reference

| Method | Endpoint | Access | Description |
| :---: | :--- | :---: | :--- |
| `GET` | `/api/health` | Public | Backend health check and Team 4 attribution |
| `POST` | `/api/auth/register` | Public | Register new Student or Recruiter account |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT token |
| `GET` | `/api/auth/me` | Private | Retrieve logged-in user profile & role |
| `GET` | `/api/jobs` | Public | Search & filter active campus drives |
| `GET` | `/api/jobs/:id` | Public | Retrieve full job details & applicant count |
| `POST` | `/api/jobs` | Company | Post a new campus drive with cutoffs |
| `PUT` | `/api/jobs/:id` | Company | Edit or update drive specifications |
| `DELETE` | `/api/jobs/:id` | Company | Remove a campus placement drive |
| `GET` | `/api/students/profile` | Student | Get current student academic profile |
| `PUT` | `/api/students/profile` | Student | Update CGPA, branch, backlogs, skills |
| `POST` | `/api/students/upload-resume` | Student | Upload resume PDF or document |
| `GET` | `/api/students/check-eligibility/:jobId` | Student | Evaluate student eligibility for specific job |
| `POST` | `/api/applications/apply/:jobId` | Student | Submit verified application for a drive |
| `GET` | `/api/applications/my-applications` | Student | View student's applications with statuses |
| `GET` | `/api/applications/job/:jobId` | Recruiter | View all candidate applicants for a job |
| `PUT` | `/api/applications/:id/status` | Recruiter | Update status (Shortlist, Select, Reject) |
| `GET` | `/api/admin/stats` | Admin | Placement metrics, charts & pipeline data |
| `GET` | `/api/admin/students` | Admin | Search & moderate all registered students |
| `GET` | `/api/admin/companies` | Admin | Search & verify recruiting companies |
| `PUT` | `/api/admin/users/:id/toggle-status` | Admin | Activate or deactivate user accounts |
| `GET` | `/api/admin/notifications` | Public | Fetch active campus placement notices |
| `POST` | `/api/admin/notifications` | Admin | Broadcast new placement notice |

---

## 🧪 11. Running Automated Integration Tests

A test script is included to test the backend APIs:
```bash
npm run test:backend
```
*Expected Output:*
```text
--- STARTING PLACEMENT PORTAL INTEGRATION TESTS ---
1. Health Check: PASSED ✅ College Placement Portal
2. Admin Login: PASSED ✅ Dr. V. K. Sharma (Placement Head)
3. Student Login: PASSED ✅ Aarav Sharma
4. Jobs Listing: PASSED ✅ (3 drives found)
5. Student Eligibility Check: PASSED ✅ Eligible: true
6. Admin Dashboard Stats: PASSED ✅ Highest: ₹24.5 LPA, Students: 3
7. Student Profile: PASSED ✅ Roll: 23CS0101, CGPA: 8.85
8. Company Login: PASSED ✅ Google India
9. Placement Notices: PASSED ✅ (3 notices)
--- ALL BACKEND TESTS COMPLETED SUCCESSFULLY ---
```

---

## 🔒 12. Security & Deployment Best Practices

- **Password Hashing:** Passwords are never stored in plain text; salted and hashed via `bcryptjs`.
- **JWT Authentication:** Stateless authentication with tokens containing user IDs and 30-day expiration.
- **Role Guards:** Route protection via `authorize('student')`, `authorize('company')`, and `authorize('admin')`.
- **Environment Protection:** `.gitignore` ensures `.env` files, JWT secrets, and database credentials are excluded from version control.
- **Production Ready:** Built with Vite bundling (`npm run build:frontend`) producing optimized static bundles.

---

## 📤 13. GitHub Upload Instructions

To upload this assignment project to your GitHub repository:

```bash
# 1. Initialize Git repository
git init

# 2. Add all files (respects .gitignore)
git add .

# 3. Commit files
git commit -m "feat: complete College Placement Portal project - Team 4 (S.No. 23 to 29)"

# 4. Rename default branch to main
git branch -M main

# 5. Link your remote GitHub repository
git remote add origin https://github.com/<your-username>/placement-portal-mern.git

# 6. Push to GitHub
git push -u origin main
```

---

## 🎓 14. Viva & College Evaluation Walkthrough Guide

When demonstrating this project to the professor or external examiner:

1. **Homepage Walkthrough (`/`):**
   - Highlight the **Team 4 Banner** and campus statistics (Highest package 24.5 LPA, Average 11.2 LPA, 94.6% Placement Rate).
   - Show the quick demo login buttons for instant role switching.
2. **Student Workflow (`aarav@student.edu`):**
   - Open **Student Portal** ➔ Demonstrate the **Academic Details** tab with CGPA and Skills.
   - Click **Browse Campus Drives** ➔ Open **Google Associate Software Engineer (24.5 LPA)**.
   - Show the **Automated Eligibility Checklist** verifying CGPA and Branch.
   - Submit application and view the **Live Visual Status Stepper** (*Applied* ➔ *Under Review*).
3. **Placed Student Showcase (`priya@student.edu`):**
   - Log in as Priya Nair ➔ Demonstrate the green **Selected / Offer** badge with Google India.
4. **Recruiter Workflow (`google@careers.com`):**
   - Log in as Google Recruiter ➔ Demonstrate candidate management.
   - Open candidate list ➔ Download/view Aarav's resume.
   - Change Aarav's status to **Shortlisted** or **Selected** with interview remarks.
5. **Placement Admin Workflow (`admin@placement.edu`):**
   - Demonstrate the **Analytics & Pipeline Distribution** charts.
   - Show the **Branch-Wise Placements** table.
   - Broadcast a new campus announcement notice.
   - Click **Print Placement Report** to generate a clean, formatted report ready for submission.

---

Developed with ❤️ by **Team 4 (Students S.No. 23 to 29)** for the College Placement Portal Project Assignment.
