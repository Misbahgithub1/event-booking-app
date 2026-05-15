# 🎟️ Event Booking App (MERN Stack)

A full-stack Event Booking platform built using the MERN stack with secure authentication, OTP verification, role-based access control, file upload support, refresh token authentication, and an admin dashboard.

---

# 🚀 Tech Stack

## 🔹 Frontend
- React (Vite)
- TypeScript
- Tailwind CSS
- React Router
- React Query
- Axios

## 🔹 Backend
- Node.js
- Express.js
- TypeScript
- MongoDB (Atlas)
- Mongoose
- JWT (Access + Refresh Tokens)
- Multer (Image Upload)
- Cookie Parser

---

# ✅ Features

## 🔐 Authentication
- Register with Full Name, Email, Password
- OTP email verification
- Resend OTP
- Secure Login
- Access Token (Memory-based)
- Refresh Token (HTTP-only Cookie)
- Auto login after refresh
- `/auth/me` endpoint
- Role-based route protection

---

## 🎫 Event Management
- Public event listing
- Search events
- View single event
- Admin create/update/delete events
- Image upload using Multer
- Image preview in admin panel
- Local `/uploads` static serving

---

## 📦 Booking System
- Users can book events
- OTP confirmation for booking
- Booking status:
  - pending
  - confirmed
  - cancelled
- Payment status:
  - pending
  - paid
  - failed
- Admin can confirm/cancel bookings

---

## 🛠 Admin Dashboard
- View all events
- Create / Update / Delete events
- View all bookings
- Confirm / Cancel bookings
- Stats overview
- Clean Tailwind UI
- Fully React Query powered

---

# 📂 Project Structure