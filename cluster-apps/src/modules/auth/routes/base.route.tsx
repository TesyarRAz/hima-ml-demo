import type { RouteObject } from "react-router";
import BaseHomeLayout from "../../home/layouts/base.layout";

const BaseAuthRoutes: RouteObject[] = [
    {
        path: "/auth/login",
        lazy: async () => {
            const LoginPage = await import("../pages/login");

            return { Component: LoginPage.default }
        },
        handle: { title: "Login Page" }
    },
    {
        path: "/auth",
        element: <BaseHomeLayout />,
        children: [
            {
                path: "/auth/profile",
                lazy: async () => {
                    const ProfilePage = await import("../pages/profile");

                    return { Component: ProfilePage.default }
                },
                handle: { title: "Profile Page" }
            }
        ]
    }
]

export default BaseAuthRoutes;