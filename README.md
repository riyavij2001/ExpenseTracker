# Expense Tracker

Expense Tracker is a full-stack web application that allows users to track their income and expenses, view data visualizations (bar, pie, line charts), and manage financial records securely. The system includes user authentication and a responsive user interface for a seamless experience.

## Features

- **Add/Edit/Delete Transactions**: Users can manage their income and expense records easily.
- **Authentication**: Secure login/logout system using tokens stored in localStorage.
- **Charts and Analytics**: Visualize your spending using bar, pie, and line charts.
- **Responsive UI**: Built with React and Material UI (MUI) for a polished, mobile-friendly interface.

## Technologies Used

- **Frontend**: React.js (Create React App), Material UI (MUI)
- **Backend**: Go (Golang), MySQL

---

## Prerequisites

Before running the project, make sure you have:

- Go (Golang) installed: [Download Go](https://go.dev/dl/)
- Node.js installed: [Download Node.js](https://nodejs.org/)
- A running MySQL instance (local or cloud-based)

---

## Backend Setup

1. Clone the repository:

```bash
git clone https://github.com/riyavij2001/TrackMyStock.git
cd TrackMyStock/backend-go
```

2. Start the backend server:

```bash
make run
```

3. Configure MySQL:

- Edit the database connection settings in `db/db.go`.
- Ensure your database is created and accessible by the backend.

---

## Frontend Setup

1. Navigate to the frontend directory:

```bash
cd ../frontend
```

2. Install dependencies:

```bash
npm install
```

3. Configure API endpoints:

- Update API URLs inside relevant frontend files to point to your backend server (e.g., `http://localhost:8181/api/...`).

4. Start the frontend server:

```bash
npm start
```

> This will launch the app at: [http://localhost:3000](http://localhost:3000)

---

## Running the Application

Once both backend and frontend are running:

- Visit [http://localhost:3000](http://localhost:3000)
- Sign up or log in to access your dashboard
- Add income and expense transactions
- View financial charts to monitor trends


## Project URL
[Roadmap.sh](https://roadmap.sh/projects/expense-tracker-api)