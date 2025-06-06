# ChipslyFans

**ChipslyFans** is a premium content subscription platform inspired by OnlyFans and Patreon. It enables content creators to monetize their work by offering exclusive content to subscribed users. Built using a modern, scalable full-stack architecture with **Vue.js**, **Node.js**, and **MariaDB**.

## 🚀 Project Overview

ChipslyFans empowers creators and influencers to:
- Build a monetizable fanbase
- Offer tier-based subscriptions
- Share exclusive content (images, posts)
- Interact privately with subscribers

The platform is ideal for artists, performers, educators, fitness coaches, and anyone offering value through digital media.

---

## 🛠️ Tech Stack

### Frontend
- **Vue.js 3** (Composition API)
- **Vue Router**
- **Pinia** (State Management)
- **Tailwind CSS** (UI Styling)

### Backend
- **Node.js** with **Express.js**
- **MariaDB** (Relational Database)
- **Sequelize ORM**
- **JWT Authentication**
- **Multer** (for file uploads)
- **Bcrypt** (Password hashing)
- **Cloud Storage Integration with AWS S3**
- **Payments with STRIPE**
- **Adaptive feed for user's interests**

---

## 📦 Features

### 🔒 Authentication
- Secure JWT-based login system
- Role-based access control (Admin / Creator / Subscriber)
- Email verification & password recovery

### 🎥 Content System
- Upload images, videos, and written content
- Schedule posts
- Content tagging and categorization
- Pay-per-view (PPV) content

### 💳 Monetization
- Monthly subscription models
- Revenue dashboard for creators
- Integrated payment gateway with Stripe

### 💬 Messaging & Interaction
- Private messaging between creators and fans
- Commenting and likes on content
- Notification system (real-time via sockets or polling)

### 📊 Analytics & Admin Panel
- Real-time user engagement stats
- Creator earnings reports
- Moderation tools and content flagging
- Admin panel for managing users, content, and transactions

---


## 🌐 Deployment & Infrastructure

- Dockerized services (optional)
- Nginx reverse proxy
- SSL via Let's Encrypt
- Scalable RESTful API

---

## 🔧 Project Setup

### Frontend

```bash
cd chipslyfans
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
npm run dev
```

### .env file

```bash
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=chipslyfans
DB_USER=root
DB_PASS=yourpassword
JWT_SECRET=your_jwt_secret
```
