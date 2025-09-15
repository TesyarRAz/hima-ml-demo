import { create } from "zustand";

interface LoadingState {
    isLoading: boolean;
    message: string | null;
    startLoading: (message: string) => void;
    stopLoading: () => void;
}

const useLoading = create<LoadingState>((set) => ({
    isLoading: false,
    message: null,
    startLoading: (message) => set({ isLoading: true, message }),
    stopLoading: () => set({ isLoading: false }),
}));

export default useLoading;