import { useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import { firebaseAuth, firestoreDB } from '../../../lib/firebase';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs } from 'firebase/firestore';

interface UserInfo {
    id: string;
    interest?: string;
    cluster?: number;
    profile?: {
        name: string;
        photoBase64?: string;
    }
}

const UserList = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLUListElement>) => {
    const [user] = useAuthState(firebaseAuth);

    const { data: users, refetch: refetchUsers } = useQuery({
        queryKey: ['userInterestsClustered'],
        queryFn: async () => {
            const data = await getDocs(collection(firestoreDB, 'userInterestsClustered'));
            return data.docs.map(doc => ({
                id: doc.id,
                ...doc.data() as Omit<UserInfo, 'id'>
            })).sort((a, b) => (a.cluster || '').toString().localeCompare((b.cluster || '').toString()));
        },
        initialData: [],
    });

    useEffect(() => {
        if (user) {
            refetchUsers();
        }
    }, [refetchUsers, user])

    return (
        <ul className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] min-w-[300px] overflow-y-auto ${className}`} {...props}>
            {users?.map((u: UserInfo) => (
                <li key={u.id} className="p-6 border rounded-lg shadow-md hover:shadow-lg transition-all duration-300 bg-white flex items-center space-x-4">
                    {u.profile?.photoBase64 ? (
                        <img
                            src={u.profile.photoBase64}
                            alt={u.profile.name || 'User'}
                            className="w-16 h-16 rounded-full object-cover border-2 border-indigo-100 shadow"
                        />
                    ) : (
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                            {(u.profile?.name || 'U').charAt(0)}
                        </div>
                    )}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">{u.profile?.name || 'Unnamed User'}</h3>
                        <p className="text-sm text-gray-500">User ID: {u.id}</p>
                        {/* interest, dan cluster */}
                        <p className="text-sm text-gray-500">Interest: {u.interest || 'N/A'}</p>
                        <p className="text-sm text-gray-500">Cluster: {u.cluster !== undefined ? u.cluster : 'N/A'}</p>
                    </div>
                </li>
            ))}
        </ul>
    )
}

export default UserList