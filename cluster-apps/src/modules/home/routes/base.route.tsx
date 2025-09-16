import type { RouteObject } from "react-router";
import HomePage from "../pages/home";
import QuestionPage from "../pages/question";
import OperatorPage from "../pages/operator";

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
    },
    {
        path: "/operator",
        element: <OperatorPage />,
        handle: { title: "Operator Page" }
    }
]

export default BaseHomeRoutes;