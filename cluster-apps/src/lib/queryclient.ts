import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retryOnMount: false,
            staleTime: Infinity,
            refetchOnReconnect: false,
        },
    },
});