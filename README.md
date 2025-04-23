# TradeCircle

TradeCircle is a full-stack web application that reimagines local marketplaces through a barter-based system. Users can create listings, browse trade opportunities, and exchange goods and services directly—no cash required.

---

## Table of Contents
1. [About TradeCircle](#about-tradecircle)  
2. [Features](#features)  
3. [Tech Stack](#tech-stack)  
4. [Prerequisites](#prerequisites)  
5. [Installation & Setup](#installation--setup)  
    - [Backend (Django)](#backend-django)  
    - [Frontend (React + Vite)](#frontend-react--vite)  
6. [Running the Application](#running-the-application)  
7. [Project Structure](#project-structure)  
8. [API Endpoints](#api-endpoints)  
9. [Contributing](#contributing)  
---

## About TradeCircle

TradeCircle was born from a desire to foster sustainable, community-driven exchange. Our platform addresses the waste of unused items—especially among students and young professionals—by offering a simple barter-based system. Instead of price tags, we empower neighbors to trade what they have for what they need.

---

## Features

- **User Authentication**: JWT-based login and registration  
- **Profile Management**: View and edit user profiles and skill sets  
- **Barter Listings**: Create, browse, and manage item-for-item listings  
- **Real-time Chat**: Group messaging for trade negotiations  
- **Responsive Design**: Mobile-friendly UI built with React and modern CSS  

---

## Tech Stack

- **Backend**: Django, Django REST Framework, SQLite (Dev)  
- **Frontend**: React, Vite, React Router DOM, Axios  
- **Authentication**: JWT tokens via `django-rest-framework-simplejwt`  
- **Styling**: Tailwind CSS / Custom CSS  

---

## Prerequisites

- **Python 3.10+**  
- **Node.js 16+** and **npm**  
- **Git**  

---

## Installation & Setup

### Backend (Django)

1. Navigate to the Django project folder (contains `manage.py`):  
   ```bash
   cd TradeCircle/backend/TradeCircle

2. Create and activate a virtual environment
    ```bash
    python3 -m venv ../myenv
    source ../myenv/bin/activate  # macOS/Linux
    # .\..\myenv\Scripts\activate  # Windows PowerShell

3. Install Python Dependencies
    ```bash
    pip install --upgrade pip --break-system-packages
    pip install --break-system-packages -r requirements.txt

4. Apply Database Migrations
    ```bash
    python manage.py migrate

### Frontend (React + Vite)
1.  Navigate to the React app root (contains package.json):
    ```bash
    cd TradeCircle/frontend  # or TradeCircle1/TradeCircle

2.  Install JavaScript dependencies:
    ```bash
    npm install

### Running the Application
1.  Start the Django backend (port 8000):
    ```bash
    source ../backend/myenv/bin/activate
    python manage.py runserver

2.  Start the React frontend (port 5173):
    ```bash
    npm run dev

3.  Visit http://localhost:5173 in your browser to interact with TradeCircle.

### Project Structure

```plaintext
TradeCircle/
  backend/
    myenv/              # Python virtual environment
    TradeCircle/        # Django app & settings (contains manage.py)
    requirements.txt
  frontend/
    node_modules/
    public/
    src/
      App.jsx
      AboutUs.jsx
      …other components
    package.json
  README.md

### API Endpoints
Base URL: http://localhost:8000/ (adjust with /api/ prefix if configured)
    ```bash
    POST   /auth/login/        # Obtain JWT token
    POST   /auth/register/     # Create a new user
    GET    /listings/          # Fetch all barter listings
    POST   /listings/          # Create a new listing
    GET    /profile/           # Retrieve user profile
    PUT    /profile/           # Update user profile

### Contributing 
Contributions are welcome! Please fork the repo, create a feature branch, and open a pull request describing your changes.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
