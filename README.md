# 🎓 KMS EduCare — Client

Frontend web application for **KMS EduCare**, a full-stack tuition management and tutor-hiring platform built with React, Vite, Tailwind CSS, DaisyUI, Firebase Authentication, Axios, and Stripe.

- **Live Client URL:** `[LIVE_CLIENT_URL]`
- **Live API Base URL:** `[LIVE_API_BASE_URL]`

---

## 📌 Overview

The client application provides role-based workflows for:

- **Students:** Register/log in, post and edit tuition requirements, track tuition approval status (`Pending` / `Approved` / `Rejected`), review tutor applications, complete Stripe checkout to hire a tutor, and view payment history.
- **Tutors:** Register/log in, browse approved tuitions, apply for open tuitions, track application statuses (`Pending` / `Approved` / `Rejected`), and view ongoing tuitions and revenue records.
- **Admins & Protected Owner (`salauddinmahi2002@gmail.com`):** Moderate tuition posts, manage users and roles (with owner account protection and owner-restricted admin role assignment), and view platform activity, payments, and analytics.

---

## 🧰 Tech Stack

- **UI & Routing:** React, Vite, React Router, Tailwind CSS, DaisyUI
- **Authentication:** Firebase Authentication (`browserLocalPersistence`, email/password, and Google sign-in with popup + redirect fallback/handling)
- **API & State:** Axios (`useAxiosSecure` with JWT bearer header), Context API (`AuthContext`), custom hooks (`useAuth`, `useUserRole`)
- **Payments:** Stripe (`@stripe/react-stripe-js` / `@stripe/stripe-js`)

---

## 📁 Project Structure

```text
kms-educare-client/
├── public/
├── src/
│   ├── Config/
│   │   ├── firebase.config.js
│   │   └── api.js
│   ├── Context/
│   │   └── AuthContext.jsx
│   ├── Hooks/
│   │   ├── useAuth.js
│   │   ├── useUserRole.js
│   │   └── useAxiosSecure.js
│   ├── Components/
│   ├── Pages/
│   ├── Layouts/
│   │   ├── MainLayout.jsx
│   │   └── DashboardLayout.jsx
│   ├── Routes/
│   │   └── Router.jsx
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md