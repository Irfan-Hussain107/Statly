# 📊 Statly

**Statly** is a full-stack MERN application built to serve as a centralized dashboard for developers and competitive programmers. It aggregates user statistics from multiple platforms like **Codeforces**, **LeetCode**, **GitHub** and **CodeChef**, providing a unified and streamlined interface to track coding progress and achievements.

---

## 🚀 Features

- 📈 Unified dashboard to track stats from multiple coding platforms
- 🔐 Secure user authentication (Email/Password + Google OAuth 2.0)
- 📬 OTP-based email verification during signup
- 🪪 Access & refresh token-based session management
- ⚙️ Platform verification via profile code + data fetching
- 🔍 Web scraping support for platforms without public APIs
- 📬 Nodemailer integration for email-based OTP
- 🧩 Modular and scalable code architecture (MERN Stack)

---

## 🛠️ Tech Stack

### 🌐 Frontend

- **React** – Component-based UI library  
- **Vite** – Fast development and bundling  
- **React Router** – Client-side routing  
- **Tailwind CSS** – Utility-first styling framework  
- **Axios** – For API calls

### 🌐 Backend

- **Node.js + Express.js** – REST API and business logic  
- **MongoDB + Mongoose** – NoSQL database and data modeling

### 🔒 Authentication & Security

- **JWT (JSON Web Token)** – Access and Refresh token system  
- **Passport.js** – Google OAuth 2.0 integration  
- **bcrypt.js** – Secure password hashing  
- **cookie-parser** – Secure handling of refresh tokens via httpOnly cookies

### 📬 Data Fetching & Emailing

- **Cheerio** – HTML parsing & web scraping for platforms like CodeChef & GeeksforGeeks  
- **Nodemailer** – Sending OTP emails for signup verification

---

## 🧩 Core Functionalities

### 🔐 User Authentication

- **Manual Signup**: A user signs up with an email and password. The password is hashed using bcrypt, and a One-Time Password (OTP) is sent to the user's email using Nodemailer. The user must verify the OTP to activate their account.

- **Google OAuth 2.0**: Users can sign in with Google. Passport.js handles the redirection and authentication, creating or finding the user in the database based on their Google email.

---

### 🧠 Session Management

- On successful login, the server issues:
  - A **refresh token** (stored in a secure, httpOnly cookie)  
  - An **access token** (short-lived, sent in the response body)  
- An Axios interceptor on the frontend automatically requests a new access token using the refresh token when the old one expires, keeping users logged in seamlessly.

---

### 🔌 Platform Integration

Statly integrates with various coding platforms through a **two-step verification process**:

#### Step 1: Start Verification

When a user enters their username for a platform (e.g., Codeforces), the backend generates a **unique verification code** and stores it in MongoDB.

#### Step 2: Complete Verification

The user places the code in a visible section of their public profile. When they click "Verify," the backend fetches their profile:

- If the platform has an **official API** (like Codeforces, GitHub, LeetCode), it uses that.  
- If not (like CodeChef), it uses **Cheerio and Axios** to scrape the public profile page.

If the verification code is found, the platform is marked as verified, and relevant stats are extracted and saved.

---

## 📦 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Irfan-Hussain107/Statly-frontend.git
cd statly
