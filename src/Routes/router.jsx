import { createBrowserRouter } from "react-router";
import App from "../App";

// Layouts
import MainLayout from "../Layouts/MainLayout";
import DashboardLayout from "../Layouts/DashboardLayout";

// Guards
import PrivateRoute from "./PrivateRoute";
import RoleRoute from "./RoleRoute";

// Public pages
import ErrorPage from "../Pages/ErrorPage/ErrorPage";
import HomePage from "../Pages/PublicPage/HomePage";
import TuitionsPage from "../Pages/PublicPage/TuitionsPage";
import TuitionDetailsPage from "../Pages/PublicPage/TuitionDetailsPage";
import TutorsPage from "../Pages/PublicPage/TutorsPage";
import TutorProfilePage from "../Pages/PublicPage/TutorProfilePage";
import AboutPage from "../Pages/PublicPage/AboutPage";
import ContactPage from "../Pages/PublicPage/ContactPage";
import LoginPage from "../Pages/PublicPage/LoginPage";
import RegisterPage from "../Pages/PublicPage/RegisterPage";

// Dashboard pages
import DashboardHome from "../pages/dashboard/DashboardHome";
import ProfileSettings from "../pages/dashboard/shared/ProfileSettings";
import PaymentCheckout from "../pages/dashboard/shared/PaymentCheckout";

import MyTuitions from "../pages/dashboard/student/MyTuitions";
import PostTuition from "../pages/dashboard/student/PostTuition";
import AppliedTutors from "../pages/dashboard/student/AppliedTutors";
import StudentPayments from "../pages/dashboard/student/StudentPayments";

import MyApplications from "../pages/dashboard/tutor/MyApplications";
import OngoingTuitions from "../pages/dashboard/tutor/OngoingTuitions";
import RevenueHistory from "../pages/dashboard/tutor/RevenueHistory";

import ManageUsers from "../pages/dashboard/admin/ManageUsers";
import ManageTuitions from "../pages/dashboard/admin/ManageTuitions";
import ReportsAnalytics from "../pages/dashboard/admin/ReportsAnalytics";

// Small helper keeps the route table readable
const only = (roles, element) => (
  <RoleRoute allowedRoles={roles}>{element}</RoleRoute>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      /* ----------------------- Public pages (MainLayout) ----------------------- */
      {
        element: <MainLayout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: "tuitions", element: <TuitionsPage /> },
          { path: "tuitions/:id", element: <TuitionDetailsPage /> },
          { path: "tutors", element: <TutorsPage /> },
          { path: "tutors/:id", element: <TutorProfilePage /> },
          { path: "about", element: <AboutPage /> },
          { path: "contact", element: <ContactPage /> },
          { path: "login", element: <LoginPage /> },
          { path: "register", element: <RegisterPage /> },
        ],
      },

      /* ---------------- Dashboard (separate shell, login required) ------------- */
      {
        path: "dashboard",
        element: (
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        ),
        children: [
          // Shared by every role
          { index: true, element: <DashboardHome /> },
          { path: "profile", element: <ProfileSettings /> },

          // Student
          { path: "my-tuitions", element: only(["student"], <MyTuitions />) },
          { path: "post-tuition", element: only(["student"], <PostTuition />) },
          { path: "applied-tutors", element: only(["student"], <AppliedTutors />) },
          { path: "payments", element: only(["student"], <StudentPayments />) },
          {
            path: "checkout/:applicationId",
            element: only(["student"], <PaymentCheckout />),
          },

          // Tutor
          { path: "my-applications", element: only(["tutor"], <MyApplications />) },
          { path: "ongoing-tuitions", element: only(["tutor"], <OngoingTuitions />) },
          { path: "revenue", element: only(["tutor"], <RevenueHistory />) },

          // Admin
          { path: "manage-users", element: only(["admin"], <ManageUsers />) },
          { path: "manage-tuitions", element: only(["admin"], <ManageTuitions />) },
          { path: "reports", element: only(["admin"], <ReportsAnalytics />) },
        ],
      },
    ],
  },
]);

export default router;