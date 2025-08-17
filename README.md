# Inventory Management System

A full-stack inventory management application built with **Node.js**, **Express**, **MongoDB**, and **React.js**. The application provides CRUD functionalities and a user-friendly interface to manage inventory records efficiently.

---

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Frontend](#frontend)
- [Contributing](#contributing)

---

## Features
- **Backend:**
  - MongoDB database connection setup.
  - API structure following REST principles.
  - CRUD operations for creating, reading, updating, and deleting records.
  - Handles all application data efficiently.

- **Frontend:**
  - User-friendly interface using React.js.
  - Forms for adding, updating, and deleting inventory records.
  - Data visualization using tables, cards, and lists.
  - Clean UI design inspired by the Task Manager app with improved visualization.

---

## Tech Stack
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Frontend:** React.js, Axios (for API calls), CSS/Bootstrap (or Tailwind for styling)
- **Others:** Nodemon (for development), dotenv (for environment variables)

---

## Installation

### Backend
1. Clone the repository:
     git clone <https://github.com/DilukshiThathsarani/Inventory-Reorder-Alert-System>
     cd backend

2. Install dependencies:
    npm install

3. Set up environment variables:
    MONGO_URI=mongodb+srv://User01:Apple123@cluster0.l4qmadd.mongodb.net/IRAS?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=2J8zqkP7VN6bxzg+Wy7DQZsd3Yx8mF3Bl0kch6HYtFs=
PORT=5001

4. Start the server:
    npm run dev


### Frontend

1. Navigate to the frontend folder:
    cd frontend

2. Install dependencies:
    npm install

3. Start the frontend server:
    npm start

### Usage

Open the frontend application in your browser (http://localhost:3000).
Use the forms to add, update, or delete inventory records.
View all inventory records in a table or card layout with visual indicators for stock levels.

### API Endpoint
| Method | Endpoint         | Description                       |
| ------ | ---------------- | --------------------------------- |
| GET    | `/api/items`     | Retrieve all inventory items      |
| GET    | `/api/items/:id` | Retrieve a specific item by ID    |
| POST   | `/api/items`     | Create a new inventory item       |
| PUT    | `/api/items/:id` | Update an existing inventory item |
| DELETE | `/api/items/:id` | Delete an inventory item          |
