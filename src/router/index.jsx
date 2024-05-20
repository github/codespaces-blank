import { createBrowserRouter } from "react-router-dom";
import SignUp from "../pages/SignUp/SignUp";
import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import Password from "../pages/Password/Password";
import Email from "../pages/Email/Email";

const route = createBrowserRouter([
  {
    path: "/",
    element: <SignUp/>,
  },
  {
    path: "/login",
    element: <Login/>,
  },
  {
    path: "/dashboard",
    element: <Dashboard/>,
  },
  {
    path: "/forgot-password",
    element: <Password/>,
  },
  {
    path: "/forgot-email",
    element: <Email/>,
  },
]);

export default route;
