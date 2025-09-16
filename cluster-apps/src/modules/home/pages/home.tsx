import { useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import { firebaseAuth, firestoreDB } from '../../../lib/firebase';
import { useQuery } from '@tanstack/react-query';
import { queryClient } from '../../../lib/queryclient';
import { Link } from 'react-router';
import { doc, getDoc } from 'firebase/firestore';
import ClusterChart from '../components/cluster.chart';

const HomePage = () => {
    const [user] = useAuthState(firebaseAuth);

    const { data: notAnsweredQuestionYet, isLoading: isLoadingNotAnswered } = useQuery({
        queryKey: ['notAnsweredQuestionYet', user?.uid],
        queryFn: async () => {
            if (!user) return true;

            const docRef = doc(firestoreDB, "userInterests", user.uid);
            const querySnapshot = await getDoc(docRef);
            if (querySnapshot.exists()) {
                return false
            }
            return true;
        },
        initialData: true,
        enabled: !!user,
    })

    useEffect(() => {
        if (user) {
            queryClient.invalidateQueries({ queryKey: ['isOperator', user?.uid] });
            queryClient.invalidateQueries({ queryKey: ['notAnsweredQuestionYet', user?.uid] });
        }
    }, [user])

    return (
        <div className='flex px-2 py-4 gap-4  h-full'>
            <div className='flex-1'>
                <h1 className='text-4xl font-bold mb-4'>Welcome to the Home Page</h1>

                {user && notAnsweredQuestionYet && !isLoadingNotAnswered && (
                    <div className='border p-4 rounded shadow-lg flex flex-col items-center justify-center h-48'>
                        {/* belum jawab pertanyaan?, jawab dulu */}
                        <p className='mb-4 text-lg'>You need to answer some questions before proceeding.</p>
                        <Link
                            to="/question"
                            className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition cursor-pointer'
                        >
                            Go to Question Page
                        </Link>
                    </div>
                )}

                {user && !notAnsweredQuestionYet && !isLoadingNotAnswered && (
                    <ClusterChart />
                )}
            </div>
        </div>
    )
}

export default HomePage