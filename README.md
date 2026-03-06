# 📸 VibeShare API - Multimedia Backend

A robust **Node.js** and **Express** backend for a social media or portfolio platform. This project implements secure user authentication, image management using **Cloudinary**, and complex data processing using **MongoDB Aggregation Pipelines**.

[Image of MERN stack architecture diagram]

---

## 🌟 Features

- **User Authentication**: Secure registration and login using **JWT** (JSON Web Tokens) and **Bcrypt** for password hashing.
- **Media Management**:
  - Image uploads handled by **Multer**.
  - Cloud storage integration with **Cloudinary API**.
  - Automatic cleanup (deleting from Cloudinary when a post is deleted).
- **Data Integrity**: Mongoose schemas with validation and auto-capitalization logic for categories.
- **Advanced Aggregation**:
  - Custom feed generation using `$match`, `$lookup`, and `$unwind`.
  - Statistics and grouping by category to analyze post data.
- **RESTful CRUD**: Complete Create, Read, Update, and Delete operations for user posts.

---

## 🛠️ Tech Stack

- **Server**: Node.js & Express.js
- **Database**: MongoDB & Mongoose ODM
- **Storage**: Cloudinary (Image Hosting)
- **Middleware**: Multer (File Handling)
- **Security**: JWT, BcryptJS, Dotenv
- **Testing**: Postman

---

## 📂 Folder Structure

```text
├── config/             # Database & Cloudinary configurations
├── controllers/        # Logic for Auth and Posts
├── middleware/         # Auth guard & Multer setup
├── models/             # Mongoose Schemas (User, Post)
├── routes/             # API Route definitions
├── helpers/              # Helper functions & Cloudinary upload utility
├── .env                # Environment variables (private)
└── server.js           # Entry point
```

**Clone the repository:**

```bash
git clone https://github.com/roni-biswas/Vibe-Share.git
cd Vibe-Share

```
