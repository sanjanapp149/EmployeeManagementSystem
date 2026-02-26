# Employee Management System

Full-stack web application for managing employees using **dynamic forms**, **JWT authentication**, and **REST APIs**.
## Features

- **Authentication**
  - User registration and login (JWT access + refresh tokens)
  - Profile view (username & email)
  - Change password
- **Form Management**
  - Create new dynamic forms with customizable fields
  - Edit existing forms
  - Drag-and-drop reordering of fields
  - Field types: Text, Number, Date, Email, Password
- **Employee Management**
  - Create employee using any saved form (dynamic fields)
  - List all employees with search
  - Edit and delete employees
  - Pagination support
  - 
## Tech Stack

**Backend**
- Python 3
- Django
- Django REST Framework
- djangorestframework-simplejwt (JWT)

**Frontend**
- React.js
- React Router v6
- Axios
- @dnd-kit (drag & drop)

**Database**: SQLite (development)

## Project Structure
employee-management-system/
├── backend/                # Django API project
│   ├── manage.py
│   ├── requirements.txt
│   └── ...
├── frontend/               # React application
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
└── README.md

## Setup Instructions

### 1. Backend (Django)

- cd backend
- python -m venv venv
- source venv/bin/activate          
- pip install -r requirements.txt
- python manage.py migrate
- python manage.py createsuperuser  # create admin user
- python manage.py runserver
- API will be available at: http://127.0.0.1:8000/api/
2. Frontend (React)
- cd frontend
- npm install
- npm start
- Frontend will open at: http://localhost:3000# EmployeeManagementSystem
### How to Test After Login

1. Register or Login
- Go to /register → create account
- Then /login → use those credentials

2. Dashboard
- After login → redirected to /dashboard
- See cards: Create/Edit Form, Add Employee, Employee List

3. Form Management
- Click Create Dynamic Form
- Add fields → drag to reorder → Save
- Go back → see list of saved forms
- Click Edit on any form → reorder fields → Update

3. Employee Creation
- Click Add New Employee
- Select a saved form
- Fill dynamic fields → Submit

- Employee List
- Click View All Employees
- See records, use global search
- Edit or Delete any employee

4. Profile & Password
- Click My Profile → see username & email
- Click Change Password → update password
### Notes

- Frontend uses localStorage for JWT tokens
- CORS configured for http://localhost:3000
- Drag & drop uses @dnd-kit library
