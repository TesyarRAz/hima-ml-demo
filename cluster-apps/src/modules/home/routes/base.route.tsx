import type { RouteObject } from "react-router";
import HomePage from "../pages/home";
import QuestionPage from "../pages/question";
import OperatorPage from "../pages/operator";
import BaseHomeLayout from "../layouts/base.layout";
import OnboardingPage from "../pages/onboarding";

const BaseHomeRoutes: RouteObject[] = [
    {
        path: "/",
        index: true,
        element: <OnboardingPage />,
        handle: { title: "Home Page" }
    },
    {
        path: "/",
        element: <BaseHomeLayout />,
        children: [
            {
                path: "/home",
                element: <HomePage />,
                handle: { title: "Onboarding Page" }
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
        ],
    },
]

export default BaseHomeRoutes;