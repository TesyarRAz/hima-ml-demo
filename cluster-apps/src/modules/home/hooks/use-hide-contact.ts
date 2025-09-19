import { create } from "zustand";
import { persist } from "zustand/middleware";

interface HideContactState {
    hideContact: boolean;
    setHideContact: (hide: boolean) => void;
}

const useHideContact = create<HideContactState>()(
    persist(
        (set) => ({
            hideContact: false,
            setHideContact: (hide) => set({ hideContact: hide }),
        }),
        {
            name: "hide-contact-storage", // unique name
            partialize: (state) => ({ hideContact: state.hideContact }), // only persist hideContact
        }
    )
);

export default useHideContact;