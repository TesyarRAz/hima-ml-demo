import { useAuthState } from "react-firebase-hooks/auth";
import { firebaseAuth, firestoreDB } from "../../../lib/firebase";
import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";
import { useEffect } from "react";
import { queryClient } from "../../../lib/queryclient";

export interface UserProfile {
    photoBase64?: string;
}

const useProfileData = () => {
    const [user] = useAuthState(firebaseAuth);

    const { data: profile, isLoading } = useQuery({
        queryKey: ['profile'],
        queryFn: async () => {
            if (!user) return null;

            const docRef = doc(firestoreDB, "users", user.uid);
            const querySnapshot = await getDoc(docRef);
            if (querySnapshot.exists()) {
                return querySnapshot.data() as UserProfile;
            }
            return null;
        },
        enabled: !!user,
        initialData: null,
        staleTime: Infinity,
    })

    useEffect(() => {
        if (user) {
            queryClient.invalidateQueries({ queryKey: ['profile'] });
        }
    }, [user]);


    return { profile, isLoading };
}

export default useProfileData;