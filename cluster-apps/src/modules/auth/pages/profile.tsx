import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { firebaseAuth, firestoreDB } from '../../../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { queryClient } from '../../../lib/queryclient';
import useProfileData from '../hooks/use-profile-data';
import type { UserProfile } from 'firebase/auth';

const ProfilePage = () => {
    const [user] = useAuthState(firebaseAuth);
    const { profile } = useProfileData();

    const inputFileRef = React.useRef<HTMLInputElement>(null);

    
    const handleChangePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                const docRef = doc(firestoreDB, "users", user!.uid);
                // simpan ke firestore
                const data: UserProfile = {
                    photoBase64: base64String,
                };
                setDoc(docRef, data, { merge: true }).then(() => {
                    queryClient.invalidateQueries({ queryKey: ['profile'] });
                });
            };
            reader.readAsDataURL(file);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <input type="file" accept="image/*" ref={inputFileRef} onChange={handleChangePhoto} hidden/>
            <img
                src={profile?.photoBase64 || user?.photoURL || 'https://via.placeholder.com/150'}
                alt="Profile"
                className="w-32 h-32 rounded-full mb-4 cursor-pointer object-cover"
                onClick={() => inputFileRef.current?.click()}
            />
            <h2 className="text-2xl font-bold mb-2">{user?.displayName || 'User'}</h2>
            <p className="text-gray-600 mb-4">{user?.email || 'user@example.com'}</p>
        </div>
    )
}

export default ProfilePage