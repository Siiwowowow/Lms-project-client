import { createBrowserRouter } from "react-router";
import Roots from "../Roots/Roots";
import HomePage from "../Component/HomePage/HomePage";
import Course from "../Component/Course/Course";
import Teachers from "../Component/Teachers/Teachers";
import DashBoard from "../Component/DashBoard/DashBoard";
import Contract from "../Component/Contract/Contract";
import CourseDetails from "../Component/Course/CourseDetails";
import VideoPlayer from "../Component/Course/VideoPlayer";
import SignUp from "../Component/SignUp/SignUp";
import Login from "../Component/Login/Login";
import PrivateRoute from "../PrivateRoute/PrivateRoute";
import Payment from "../Component/Payment/Payment";
import MyCourses from "../Component/DashBoard/User/MyCourses";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Roots />, // main layout with navbar/footer
    children: [
      { index: true, element: <HomePage /> },
      { path: "courses", element: <Course /> },
      { path: "courses/:id", element: <CourseDetails />, loader: ({ params }) => fetch(`http://localhost:3000/courses/${params.id}`) },
      { path: "payment/:courseId", element: <Payment /> },
      { path: "player/:id", element: <VideoPlayer />, loader: ({ params }) => fetch(`http://localhost:3000/courses/${params.id}`) },
      { path: "teachers", element: <Teachers /> },
      { path: "contract", element: <Contract /> },
      { path: "signUp", element: <SignUp /> },
      { path: "login", element: <Login /> },
    ]
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashBoard /> {/* dashboard with drawer, no navbar/footer */}
      </PrivateRoute>
    ),
    children: [
      { path: "my-courses", element: <MyCourses /> },
      // add more user/admin dashboard routes here
    ]
  }
]);
