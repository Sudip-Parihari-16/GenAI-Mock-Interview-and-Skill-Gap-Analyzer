import { createBrowserRouter } from "react-router";
import Register from "./features/auth/pages/Register";
import Login from "./features/auth/pages/Login";
import Home from "./features/interview/pages/Home";
import Protected from "./features/auth/components/Protected";
import Interview from"./features/interview/pages/interview";

export const router = createBrowserRouter([

    {
        path: "/Register",
        element: <Register />
    },
    {
        path: "/Login",
        element: <Login />
    },
    {
        path: "/",
        element: (<Protected><Home /></Protected>)
    },
    {
        path: "/interview/:interviewId",
        element: <Protected><Interview /></Protected>
    },
])