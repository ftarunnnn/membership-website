# Limitless Club - Full-Stack Membership Website

Limitless Club is a premium, visually stunning full-stack **Membership Website** engineered to show how secure user registration, tiered subscriptions, credit card checkout simulations, protected courses, and admin analytics dashboards are constructed.

---

## Key Features

1. **User Authentication Session**:
   - Secure account registration, sign in, and sign out options.
   - Credentials protection via password hashing (`bcryptjs`) on the server.
   - Authorized routes guarding using JSON Web Tokens (JWT) attached to header interceptors.

2. **Simulated Payment Gateway (Stripe/Razorpay)**:
   - Dynamic sandbox checkout panel mapping name, card number, expiration, and CVV checks.
   - Automated payment verification on backend that upgrades the user's active tier instantly and logs the transaction.

3. **Protected Course Library**:
   - Access control gates filtering video lessons, articles, and zip files.
   - Shows locked course indicators prompting user to upgrade if they are on a lower tier.
   - Interactive in-app video player modals.

4. **Admin Dashboard Control**:
   - Live metrics monitor: Total users count, active paid subscribers count, gross revenues in INR, and payment count.
   - Admin users manager: lists all members with active tiers and includes block/unblock controls.
   - Transactions auditor: detailed logs of transaction IDs, gateways, amount, and timestamp.
   - Content publisher form: release new video guides, code templates, or articles to specific tiers.

5. **Premium Responsive Design**:
   - Fully optimized UI layout (Mobile, Tablet, Desktop).
   - Styled using custom CSS utilities (glassmorphism cards, glowing radial backdrops, and interactive list hover scales).

---

## Technology Stack

* **Frontend**: React (v19) + Vite (v8) + Tailwind CSS (v3) + React Router (v7) + Lucide Icons + Axios
* **Backend**: Node.js + Express.js + SQLite Database (`sqlite3` module) + JWT (`jsonwebtoken`) + Hashing (`bcryptjs`)

---

## Project Structure

```
membership-website/
├── backend/                  # Express REST API Server
│   ├── src/
│   │   ├── config/           # SQLite database initialize & payment configs
│   │   ├── controllers/      # Route controllers (Auth, Payments, Admin, User)
│   │   ├── middleware/       # JWT protects, role checks, and error handlers
│   │   ├── routes/           # API routes definitions
│   │   ├── app.js            # Express application configurations
│   │   └── server.js         # DB seeds launcher & port listener boot
│   └── .env                  # Port, JWT secret & database path variables
│
├── frontend/                 # Vite React Client App
│   ├── src/
│   │   ├── components/       # Common UI elements (Navbar, Footer, PricingCard)
│   │   ├── context/          # AuthState context provider (login, logout, checks)
│   │   ├── pages/            # View pages (Home, About, Pricing, Dashboard, Admin)
│   │   ├── services/         # Axios API client setup with request interceptors
│   │   ├── index.css         # Global Tailwind CSS and glassmorphism styling
│   │   └── App.jsx           # App routes mapper
│   └── tailwind.config.js    # Tailwind content directories configurations
│
└── .gitignore                # Root gitignore rules (hides databases & env files)
```

---

## Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

### Setup and Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ftarunnnn/membership-website.git
   cd membership-website
   ```

2. **Setup the Backend Server**:
   ```bash
   cd backend
   npm install
   ```
   *Note: On initial boot, the SQLite client will automatically compile and run the schema setup (`backend/database.sqlite`), seeding default plans, contents, and the admin profile.*

3. **Setup the Frontend Client**:
   ```bash
   cd ../frontend
   npm install
   ```

### Running Locally

To run the full stack, you will need to open two terminal windows:

* **Terminal 1: Start Backend API** (running on `http://localhost:5000`)
  ```bash
  cd backend
  npm run dev
  ```

* **Terminal 2: Start Frontend App** (running on `http://localhost:5173`)
  ```bash
  cd frontend
  npm run dev
  ```

---

## Test Credentials

### 1. General Member Flow
You can sign up for a new account using the registration screen on the website. New members are automatically subscribed to the **Free** tier.

### 2. Administrator Access
You can log in as the default admin to access user metrics and upload courses:
* **Email**: `admin@membership.com`
* **Password**: `admin123`

---

## Payment Simulation
Any billing upgrade uses simulated gateways. You can safely enter mock credit card details (e.g., card `4242 4242 4242 4242`, CVV `123`) to test the payment flow. **No real money is charged.**
