💸 SpendSense — Personal Expense Tracker
A full-stack expense tracking web application built with the MERN Stack (MongoDB, Express, React, Node.js). Track your income and expenses, visualize spending patterns, and take control of your finances.
🚀 Live Demo
👉 Click here to try the app (coming soon)
✨ Features

🔐 JWT Authentication — Secure register & login with encrypted passwords
💳 Transaction Management — Add, edit, delete income & expenses
📊 Interactive Dashboard — 6-month trend chart + spending by category donut chart
🔍 Search & Filter — Filter by type, category, date range
📄 Pagination — Handles large transaction history efficiently
👤 Profile Settings — Set currency and monthly budget goal
📱 Responsive Design — Works on all screen sizes
🛠 Tech Stack
LayerTechnologyFrontendReact 18, React Router v6, Chart.jsBackendNode.js, Express.jsDatabaseMongoDB, MongooseAuthJWT + bcryptHTTP ClientAxiosStylingCustom CSS, Google Fonts
📸 Screenshots
Dashboard
Show Image
Transactions
Show Image

⚙️ Run Locally
1. Clone the repo
bashgit clone https://github.com/Bhavani178/spendsense.git
cd spendsense
2. Setup Backend
bashcd backend
npm install
Create a .env file in the backend folder:
envPORT=5000
MONGO_URI=mongodb://localhost:27017/spendsense
JWT_SECRET=yoursecretkey
NODE_ENV=development
bashnpm run dev
3. Setup Frontend
bashcd ../frontend
npm install
npm start
App runs at http://localhost:3000 🎉

📁 Project Structure
spendsense/
├── backend/
│   ├── middleware/      # JWT auth middleware
│   ├── models/          # MongoDB schemas (User, Expense)
│   ├── routes/          # API routes (auth, expenses, dashboard)
│   └── server.js        # Express server entry point
│
└── frontend/
    └── src/
        ├── components/  # Reusable components (Layout, Sidebar)
        ├── context/     # Auth context (global state)
        ├── pages/       # Dashboard, Transactions, Login, Register, Profile
        └── utils/       # Axios API helper

🔌 API Endpoints
MethodEndpointDescriptionPOST/api/auth/registerCreate accountPOST/api/auth/loginLoginGET/api/auth/meGet current userGET/api/expensesGet all transactionsPOST/api/expensesCreate transactionPUT/api/expenses/:idUpdate transactionDELETE/api/expenses/:idDelete transactionGET/api/dashboard/summaryDashboard analytics
