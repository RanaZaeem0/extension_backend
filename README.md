# Express MVC Backend (TypeScript)

## Overview
This is a backend application built using **Express.js** following the **Model-View-Controller (MVC)** pattern. It is written in **TypeScript** and supports features like authentication, session handling, database integration, and more.

## Features
- **Express.js** framework
- **TypeScript** for type safety
- **MongoDB** with Mongoose ORM
- **JWT authentication**
- **Google OAuth** via Passport.js
- **Stripe** payment integration
- **Environment variables** managed by `dotenv`
- **Secure coding practices** using `express-mongo-sanitize` and `bcrypt`
- **Email functionality** with Nodemailer

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/express-mvc-backend-ts.git
   cd express-mvc-backend-ts
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Create a `.env` file and configure your environment variables.

4. Start the development server:
   ```sh
   npm run dev
   ```

## Scripts
| Command          | Description |
|-----------------|-------------|
| `npm run build` | Compiles TypeScript to JavaScript |
| `npm run start` | Runs the production build |
| `npm run dev`   | Runs the development server with nodemon |
| `npm run watch` | Compiles TypeScript in watch mode |

## Technologies Used
- **Backend:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT, Passport.js (Google OAuth)
- **Security:** Bcrypt, Express-mongo-sanitize, CORS
- **Payment:** Stripe
- **Emailing:** Nodemailer

## Folder Structure
```
📦 express-mvc-backend-ts
├── 📂 src
│   ├── 📂 controllers    # Handles business logic
│   ├── 📂 models         # Mongoose models
│   ├── 📂 routes         # API routes
│   ├── 📂 middleware     # Middleware functions
│   ├── 📂 config         # Configuration files
│   ├── 📂 utils          # Utility functions
│   ├── index.ts         # Entry point
├── 📂 dist               # Compiled JavaScript files
├── .env                 # Environment variables
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
```

## License
This project is licensed under the **ISC License**.

---
Feel free to modify and expand based on your project's specific needs.

