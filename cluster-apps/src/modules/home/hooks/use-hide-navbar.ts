import { create } from "zustand";
import { persist } from "zustand/middleware";

interface HideNavbarState {
    hideNavbar: boolean;
    setHideNavbar: (hide: boolean) => void;
}

const useHideNavbar = create<HideNavbarState>()(
    persist(
        (set) => ({
            hideNavbar: false,
            setHideNavbar: (hide) => set({ hideNavbar: hide }),
        }),
        {
            name: "hide-navbar-storage", // unique name
            partialize: (state) => ({ hideNavbar: state.hideNavbar }), // only persist hideNavbar
        }
    )
);

export default useHideNavbar;
