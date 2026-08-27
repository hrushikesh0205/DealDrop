# DealDrop — Real-Time Online Auction Platform

DealDrop is a **full-stack real-time online auction platform** that enables users to create auctions, participate in live bidding, track bids, and complete auction-related payments.

The platform combines a **MERN-based application architecture** with **Socket.IO for real-time bidding, JWT-based authentication, AI/ML-powered features, Razorpay payment integration, Cloudinary media storage, and Docker-based deployment**.

---

## 🚀 Key Features

### 👤 User Authentication & Authorization

* User registration and login
* JWT-based authentication
* Protected routes and APIs
* Role-based authorization
* User profile management
* Separate user and administrator access

### 🏷️ Online Auction System

* Create and manage auctions
* Browse available auctions
* View detailed auction information
* Track personal auctions
* Automatic auction status management
* Auction lifecycle handling based on start and end times

### ⚡ Real-Time Bidding

* Live bidding using **Socket.IO**
* Real-time bid updates without page refresh
* Bid validation and persistence
* Bid history tracking
* Support for multiple users participating in an auction simultaneously

### 💳 Payment Integration

* **Razorpay** payment gateway integration
* Payment processing for auction-related transactions
* Backend-controlled payment flow

### 🤖 AI & Machine Learning

* AI-powered auction/product description functionality
* Recommendation functionality
* Dedicated Python-based ML service
* Separation of ML workloads from the main Node.js backend

### 🖼️ Image Management

* Auction/product image uploads
* **Cloudinary** integration for media storage
* Upload middleware on the backend
* Persistent image URLs associated with auction data

### 👨‍💼 Admin Features

* Dedicated administrator dashboard
* Role-based access control
* Auction management capabilities
* Administrative views and controls

### 🐳 Containerization & Deployment

* Dockerized frontend
* Dockerized backend
* Dockerized ML service
* Docker Compose orchestration
* Frontend deployment configuration
* Environment-based configuration

### 📊 Analytics

* Google Analytics 4 (GA4)
* Google Tag Manager (GTM)

---

# 🏗️ System Architecture

```text
                         ┌─────────────────────┐
                         │       DealDrop       │
                         │   Online Auction     │
                         │       Platform       │
                         └──────────┬──────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
              ▼                     ▼                     ▼
      ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
      │ React Client │      │ Node/Express │      │ Python ML    │
      │    Vite      │◄────►│   Backend    │◄────►│   Service    │
      └──────┬───────┘      └──────┬───────┘      └──────────────┘
             │                     │
             │                     │
             │              ┌──────┴───────┐
             │              │              │
             │              ▼              ▼
             │        ┌───────────┐  ┌────────────┐
             │        │ MongoDB   │  │ Socket.IO  │
             │        └───────────┘  └────────────┘
             │
             │
             └───────────────────────────────────┐
                                                 │
                           ┌─────────────────────┴───────┐
                           │                             │
                           ▼                             ▼
                    ┌────────────┐                ┌────────────┐
                    │ Cloudinary │                │  Razorpay  │
                    │   Images   │                │  Payments  │
                    └────────────┘                └────────────┘
```

---

# 🧩 Technology Stack

| Category                | Technology                             |
| ----------------------- | -------------------------------------- |
| Frontend                | React.js, Vite                         |
| Styling/UI              | CSS, reusable UI components            |
| Backend                 | Node.js, Express.js                    |
| Database                | MongoDB                                |
| Authentication          | JWT                                    |
| Real-Time Communication | Socket.IO                              |
| AI/ML                   | Python, ML Service                     |
| Payments                | Razorpay                               |
| Image Storage           | Cloudinary                             |
| API Communication       | REST APIs, Axios                       |
| Containerization        | Docker, Docker Compose                 |
| Analytics               | Google Analytics 4, Google Tag Manager |
| Version Control         | Git, GitHub                            |

---

# 📁 Project Structure

```text
DealDrop/
│
├── client/                         # React frontend
│   ├── public/
│   └── src/
│       ├── api/
│       │   └── axios.js
│       │
│       ├── assets/
│       │
│       ├── components/
│       │   ├── ui/
│       │   ├── DashboardLayout.jsx
│       │   ├── ProtectedRoute.jsx
│       │   ├── PublicRoute.jsx
│       │   ├── RoleProtectedRoute.jsx
│       │   ├── ScrollToTop.jsx
│       │   └── Sidebar.jsx
│       │
│       ├── context/
│       │   └── authContext.jsx
│       │
│       ├── lib/
│       │   └── utils.js
│       │
│       ├── pages/
│       │   ├── AdminPage.jsx
│       │   ├── AuctionDetails.jsx
│       │   ├── CreateAuction.jsx
│       │   ├── DashboardAuctions.jsx
│       │   ├── DashboardHome.jsx
│       │   ├── Home.jsx
│       │   ├── Login.jsx
│       │   ├── MyAuctions.jsx
│       │   ├── MyBids.jsx
│       │   ├── Profile.jsx
│       │   └── Register.jsx
│       │
│       ├── socket/
│       │   └── socket.js
│       │
│       ├── App.jsx
│       ├── App.css
│       ├── index.css
│       └── main.jsx
│
├── server/                         # Node.js / Express backend
│   ├── config/
│   │   ├── cloudinary.js
│   │   ├── createAdmin.js
│   │   ├── db.js
│   │   └── razorpay.js
│   │
│   ├── controllers/
│   │   ├── ai.controller.js
│   │   ├── auction.controller.js
│   │   ├── auth.controller.js
│   │   ├── bid.controller.js
│   │   ├── payment.controller.js
│   │   └── recommendation.controller.js
│   │
│   ├── cron/
│   │   └── auctionStatus.cron.js
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── role.middleware.js
│   │   └── upload.js
│   │
│   ├── models/
│   │   ├── auction.js
│   │   ├── bid.js
│   │   └── user.js
│   │
│   ├── routes/
│   │   ├── ai.route.js
│   │   ├── auction.route.js
│   │   ├── auth.route.js
│   │   ├── bid.route.js
│   │   ├── payment.route.js
│   │   └── recommendation.routes.js
│   │
│   ├── services/
│   │   ├── ai.service.js
│   │   └── recommendation.service.js
│   │
│   ├── socket/
│   │   ├── index.js
│   │   ├── socketAuth.js
│   │   └── index.html
│   │
│   ├── server.js
│   └── package.json
│
├── ml_service/                     # Python ML service
│   ├── app.py
│   ├── requirements.txt
│   └── Dockerfile
│
├── docker-compose.yml
└── README.md
```

---

# 🔄 Application Flow

## 1. Authentication Flow

```text
User
 │
 ▼
Register / Login
 │
 ▼
Node.js / Express API
 │
 ▼
Validate Credentials
 │
 ▼
Generate JWT
 │
 ▼
Authenticated User
 │
 ├── User Routes
 │
 └── Admin Routes
```

The frontend maintains authentication state and uses protected/role-protected routes to control access to application features.

---

## 2. Auction Creation Flow

```text
User
 │
 ▼
Create Auction
 │
 ▼
Upload Product Image
 │
 ▼
Express Upload Middleware
 │
 ▼
Cloudinary
 │
 ▼
Image URL
 │
 ▼
Auction API
 │
 ▼
MongoDB
```

---

## 3. Real-Time Bidding Flow

```text
User A
 │
 │ Place Bid
 ▼
React Client
 │
 ▼
Socket.IO / Backend
 │
 ▼
Bid Validation
 │
 ▼
MongoDB
 │
 ▼
Broadcast Updated Bid
 │
 ├──────────────► User B
 │
 ├──────────────► User C
 │
 └──────────────► Other Participants
```

This allows participants to see auction/bidding changes in real time without manually refreshing the page.

---

## 4. Auction Lifecycle

```text
CREATED
   │
   ▼
UPCOMING
   │
   ▼
ACTIVE
   │
   │ Bidding
   ▼
TIME EXPIRES
   │
   ▼
ENDED
   │
   ▼
Auction Transaction
```

Auction status management is supported through backend processing and a scheduled cron mechanism.

---

## 5. AI/ML Flow

```text
React Frontend
      │
      ▼
Node.js Backend
      │
      ▼
AI / Recommendation Service
      │
      ▼
Python ML Service
      │
      ▼
Prediction / Recommendation
      │
      ▼
Node.js Backend
      │
      ▼
React Frontend
```

The ML service is maintained separately from the Node.js application, allowing machine-learning workloads to remain independently deployable.

---

# 🔌 Backend Architecture

The backend follows a layered structure:

```text
Client Request
      │
      ▼
     Route
      │
      ▼
  Middleware
      │
      ▼
  Controller
      │
      ▼
Service / Model
      │
      ▼
Database / External Service
      │
      ▼
   Response
```

### Main Backend Modules

**Authentication**

Handles registration, login, JWT authentication, protected endpoints, and role-based authorization.

**Auction**

Handles auction creation, retrieval, auction details, and auction lifecycle management.

**Bidding**

Handles bid operations, bid validation, persistence, and real-time auction updates.

**Payments**

Integrates Razorpay for auction-related payment processing.

**AI & Recommendations**

Provides AI-related functionality and communicates with the dedicated ML service.

**Media Uploads**

Uses Cloudinary to store auction/product images.

---

# ⚡ Real-Time Communication

DealDrop uses **Socket.IO** to support live auction interactions.

When a user submits a bid:

```text
Bid Submitted
     │
     ▼
Backend Receives Request
     │
     ▼
Validate & Persist Bid
     │
     ▼
Emit Socket Event
     │
     ▼
Connected Clients Receive Update
     │
     ▼
UI Updates Immediately
```

This architecture is particularly important in an auction system because multiple users may be bidding on the same item concurrently.

---

# 🔐 Security

The application incorporates several security mechanisms:

* JWT-based authentication
* Protected API routes
* Role-based authorization
* Authentication middleware
* Separate administrative access
* Environment variables for sensitive configuration
* Backend-controlled payment operations
* Authenticated Socket.IO communication

Sensitive credentials and API keys should be stored through environment variables rather than committed to the repository.

---

# 💾 Database

DealDrop uses **MongoDB** as its primary data store.

The backend contains dedicated models for:

```text
User
 │
 ├── Authentication
 ├── Profile
 └── Role

Auction
 │
 ├── Seller
 ├── Product Information
 ├── Auction Timing
 ├── Current Bid
 └── Status

Bid
 │
 ├── Bidder
 ├── Auction
 ├── Bid Amount
 └── Bid Information
```

---

# 🐳 Docker Architecture

DealDrop is structured as a multi-service application.

```text
                  Docker Compose
                       │
          ┌────────────┼────────────┐
          │            │            │
          ▼            ▼            ▼
       Client       Server       ML Service
       React       Node/Express    Python
          │            │            │
          └────────────┼────────────┘
                       │
                    MongoDB
```

Each major application component has its own Docker configuration, while `docker-compose.yml` provides orchestration for the services.

---

# ⚙️ Local Development

## Prerequisites

Make sure the following are installed:

* Node.js
* npm
* MongoDB / MongoDB Atlas
* Python
* Docker and Docker Compose
* Git

External services used by the application may also require accounts/configuration for:

* Cloudinary
* Razorpay
* AI/ML services

---

## 1. Clone the Repository

```bash
git clone <repository-url>
cd DealDrop
```

---

## 2. Install Frontend Dependencies

```bash
cd client
npm install
```

---

## 3. Install Backend Dependencies

```bash
cd ../server
npm install
```

---

## 4. Install ML Dependencies

```bash
cd ../ml_service
pip install -r requirements.txt
```

---

# 🔑 Environment Configuration

Create environment files for the services according to the application's configuration.

Typical configuration includes:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

ML_SERVICE_URL=your_ml_service_url
```

> **Never commit actual credentials, API keys, database passwords, or secrets to GitHub.**

---

# ▶️ Running the Application

### Start Frontend

```bash
cd client
npm run dev
```

### Start Backend

```bash
cd server
npm run dev
```

### Start ML Service

```bash
cd ml_service
python app.py
```

The exact commands may depend on the scripts/configuration currently defined in each service's package/configuration files.

---

# 🐳 Running with Docker

From the project root:

```bash
docker compose up --build
```

To run the containers in detached mode:

```bash
docker compose up -d --build
```

To stop the services:

```bash
docker compose down
```

---

# 📡 API Architecture

The backend exposes REST APIs organized by feature:

```text
/api/auth
/api/auction
/api/bid
/api/payment
/api/ai
/api/recommendation
```

The frontend communicates with these APIs through a centralized Axios configuration.

Real-time auction updates are handled separately through Socket.IO.

---

# 📈 Scalability Considerations

DealDrop was designed with a service-oriented structure that separates major responsibilities:

* React frontend for presentation
* Node.js backend for business logic
* MongoDB for persistent data
* Socket.IO for real-time communication
* Python service for ML workloads
* Cloudinary for media storage
* Razorpay for payments
* Docker for containerization

This separation makes individual services easier to maintain, deploy, and scale independently.

---

# 🧠 Engineering Highlights

The project focuses on several real-world engineering challenges:

### Concurrent Bidding

Multiple users can interact with the same auction simultaneously, making bid validation and consistent persistence important.

### Real-Time State Synchronization

Socket.IO keeps connected clients synchronized with changes occurring during an active auction.

### Authentication & Authorization

JWT authentication combined with role-based middleware protects application resources and administrative functionality.

### Service Separation

ML functionality is separated into a Python service instead of coupling it directly to the Node.js backend.

### External Service Integration

The application integrates external services for:

* Payments — Razorpay
* Media storage — Cloudinary
* Analytics — GA4/GTM

### Containerized Deployment

Docker and Docker Compose provide a consistent environment for running the application's different services.

---

# 📊 Analytics

DealDrop includes analytics tooling through:

* **Google Analytics 4 (GA4)**
* **Google Tag Manager (GTM)**

These can be used to track application usage and user interactions.

---

# 🛠️ Future Improvements

Potential areas for further enhancement include:

* Advanced auction concurrency controls
* Distributed Socket.IO scaling
* Redis-based caching and Socket.IO adapter
* Improved recommendation models
* Automated testing and CI/CD pipelines
* Enhanced payment verification and webhook handling
* Advanced search and filtering
* Notification system
* Monitoring and observability
* Rate limiting and additional API security
* Performance optimization

---

# 👨‍💻 Project Structure Philosophy

DealDrop follows a modular architecture where different responsibilities are separated into dedicated layers and services.

```text
Frontend
   │
   ├── Pages
   ├── Components
   ├── Context
   ├── API Layer
   └── Socket Layer
             │
             ▼
Backend
   │
   ├── Routes
   ├── Middleware
   ├── Controllers
   ├── Services
   ├── Models
   ├── Socket Layer
   └── Cron Jobs
             │
       ┌─────┴─────┐
       ▼           ▼
   MongoDB     External Services
                   │
          ┌────────┼────────┐
          ▼        ▼        ▼
      Cloudinary Razorpay  ML Service
```

---

# 📌 Project Summary

**DealDrop** is a full-stack real-time auction platform designed around practical distributed-system and web-application concepts.

It combines:

* **MERN Stack**
* **REST APIs**
* **JWT Authentication**
* **Role-Based Authorization**
* **Real-Time Socket.IO Communication**
* **Auction & Bidding System**
* **AI/ML Integration**
* **Python ML Microservice**
* **Razorpay Payment Gateway**
* **Cloudinary Image Storage**
* **Docker & Docker Compose**
* **GA4 & GTM Analytics**

The project demonstrates the integration of real-time communication, transactional workflows, external services, machine-learning capabilities, and containerized application architecture in a single full-stack system.

---

👨‍💻 Developer
Hrushikesh Bhoir

🎓 Computer Engineering Student
💻 Full Stack Developer (Java + MERN)
🚀 Passionate about Software Development
⭐ If you found this project interesting, consider giving it a star.
