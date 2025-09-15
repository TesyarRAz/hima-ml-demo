import type { RouteObject } from "react-router";
import HomePage from "../pages/home";
import QuestionPage from "../pages/question";

const BaseHomeRoutes: RouteObject[] = [
    {
        path: "/",
        index: true,
        element: <HomePage />,
        handle: { title: "Home Page" }
    },
    {
        path: "/question",
        element: <QuestionPage />,
        handle: { title: "Question Page" }
    }
]

export default BaseHomeRoutes;