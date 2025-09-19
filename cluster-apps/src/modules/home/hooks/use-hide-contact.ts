import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface HideContactState {
    hideContact: boolean;
    setHideContact: (hide: boolean) => void;
}

const useHideContact = create<HideContactState>()(
    devtools(
        (set) => ({
            hideContact: false,
            setHideContact: (hide) => set({ hideContact: hide }),
        }),
    )
);

export default useHideContact;