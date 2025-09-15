import type { RouteObject } from "react-router";
import BaseLayout from "../layout/base.layout";
import BaseAuthRoutes from "../../modules/auth/routes/base.route";
import BaseHomeRoutes from "../../modules/home/routes/base.route";
import BaseHomeLayout from "../../modules/home/layouts/base.layout";

const BaseRouter: RouteObject[] = [
    {
        path: "/",
        element: <BaseHomeLayout />,
        children: [
            ...BaseHomeRoutes
        ]
    },
    {
        path: "/auth",
        element: <BaseLayout />,
        children: [
            ...BaseAuthRoutes
        ]
    }
]

export default BaseRouter;