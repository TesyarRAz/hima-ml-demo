import { create } from "zustand";
import { firebaseAuth, firestoreDB } from "../../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import type { User } from "firebase/auth";

export interface AuthState {
    isAuthenticated: () => boolean;
    isOperator: (user: User) => Promise<boolean>;
}

const useAuthStore = create<AuthState>()(() => ({
    isAuthenticated: () => {
        return firebaseAuth.currentUser !== null;
    },
    isOperator: async (user: User) => {
        const userInfo = await getDoc(doc(firestoreDB, "users", user.uid))

        if (userInfo.exists()) {
            const data = userInfo.data();
            return data.role === 'operator';
        }

        return false;
    },
}));

export default useAuthStore;