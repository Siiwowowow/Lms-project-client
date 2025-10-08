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


export const router = createBrowserRouter([
  {
    path: "/",
    element:<Roots></Roots>,
    children: [
      {
        index: true,
        path: "/",
        element: <HomePage></HomePage>,
      }
      ,
      {
         path:"/courses",
          element:<Course></Course>

      },
      {
         path:"/courses/:id",
          element:<CourseDetails></CourseDetails>,
          loader: ({params})=>fetch(`http://localhost:3000/courses/${params.id}`)
           
      },
      {
        path:"/payment/:courseId",
        element:<Payment></Payment>
      },
      {
        path: "/player/:id", // Add this new route
        element: <VideoPlayer></VideoPlayer>,
        loader: ({ params }) => fetch(`http://localhost:3000/courses/${params.id}`)
      },
      {
         path:"/teachers",
          element:<Teachers></Teachers>

      },
      {
        path:"/dashboard",
        element:<PrivateRoute><DashBoard></DashBoard></PrivateRoute>
      },
      {
        path:"/contract",
        element:<Contract></Contract>
      },
      {
        path:"/signUp",
        element:<SignUp></SignUp>
      },
      {
        path:"/login",
        element:<Login></Login>
      },
      
    ]
    
  },
  // {
  //   path: "/",
  //   element:<DashBoard></DashBoard>,
  //   children:[
  //     {
  //       path:'/dashBoard/admin',
  //       element:<Home></Home>

  //     },
  //     {
  //       path:'/dashBoard/user',
  //       element:<StudentHome></StudentHome>

  //     }
  //   ]
  // }
]);