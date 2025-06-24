# Audiobook Web Application

This project includes two main interfaces: **Client Site** for users and **Admin Site** for administrators.

---

## 🧰 Technology Stack

- **Backend:** Spring Boot  
- **Frontend:** ReactJS  
- **Database:** SQL Server  
- **Cloud Storage:** Cloudinary (image, audio uploads)  
- **Authentication:** Firebase (OAuth2 with Google)

---

## 🌐 Client Site Features

### 1. 🔐 Authentication
- **Login**
  - Two methods: Email & Password, or OAuth2 (Google)
- **Register**
  - Only for the Email & Password method
- **Forgot Password**
  - Send OTP code to the registered email to reset password

### 2. ❤️ Like
- Users can like/unlike an audiobook

### 3. ⭐ Rating
- Rate audiobooks with stars
- Retrieve average score and total rating count

### 4. 📚 Library
- Add audiobooks to your personal library

### 5. 🎧 Listen
- Count the number of listens for each audiobook
- **History**: Store the 10 most recently listened audiobooks

### 6. 📊 Ranking
- Rankings based on:
  - Number of listens (all time / year / month / day)
  - Number of likes
  - Average rating

### 7. 🔍 Search & Filter
- **Search**: By title, author, or category name
- **Filter**: By category

### 8. 👤 Account Management
- View and update user information
- Change password

---

## 🛠️ Admin Site Features

### 1. 🔐 Authentication
- **Login**: Only via email & password
- **Forgot Password**: Send OTP to reset password

### 2. 📁 Content Management (CRUD)
- Voice
- Author
- Category
- Audiobook

### 3. 👥 Employee Management
- Create, read, update, delete employees
- Role-based authorization

### 4. 🔒 Authorization
- Role-based access control

### 5. 👤 Admin Account
- View and update profile information
- Change password

---
## 🛡️ Security

- Passwords are securely hashed before storage
- JWT (JSON Web Token) is used for authentication
- Role-based access control (RBAC) to protect sensitive routes
- Refresh token with expiration and blacklist mechanism
- OTP (One-Time Password) for secure password recovery
- CORS properly configured to protect cross-origin access
- Validation and sanitization of user input to prevent injection attacks

---