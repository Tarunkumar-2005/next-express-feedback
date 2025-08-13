# Next.js + Express.js Feedback App

A simple feedback collection application built with **Next.js** for the frontend and **Express.js** for the backend.  
No database is used — feedback is stored in a local JSON file (`backend/data/feedback.json`).

---

## 📌 Features
- **Submit Feedback** — Users can enter their name, email, and a message.
- **Admin Panel** — View and delete all submitted feedback.
- **File-based Storage** — Data saved in JSON file so it persists after restarts.
- **Next.js + Express.js** — Clean separation of frontend and backend.
- **API Proxying** — No CORS issues in development.

---

## 🛠 Tech Stack
- **Frontend:** [Next.js](https://nextjs.org/) (React framework)
- **Backend:** [Express.js](https://expressjs.com/)
- **Styling:** CSS
- **Storage:** JSON file (no database)

---
## Run the Project
cd backend ->
node server.js

cd frontend ->
npm run dev
