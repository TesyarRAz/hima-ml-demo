import React, { useEffect } from 'react'
import InterestForm from '../components/interest.form';
import { useShallow } from 'zustand/shallow';
import useAuthStore from '../../auth/hooks/use-auth-store';
import { useAuthState } from 'react-firebase-hooks/auth';
import { firebaseAuth, firestoreDB } from '../../../lib/firebase';
import { useQuery } from '@tanstack/react-query';
import { queryClient } from '../../../lib/queryclient';
import { Link } from 'react-router';
import { doc, getDoc } from 'firebase/firestore';
import ClusterChart from '../components/cluster.chart';

const HomePage = () => {
    const [items] = React.useState<string[]>([]);

    const [user] = useAuthState(firebaseAuth);
    const [
        isOperatorCheck
    ] = useAuthStore(useShallow((state) => [
        state.isOperator,
    ]))

    const { data: isOperator } = useQuery({
        queryKey: ['isOperator', user?.uid],
        queryFn: () => {
            if (user) {
                return isOperatorCheck(user);
            }
            return Promise.resolve(false);
        },
        enabled: !!user,
        initialData: false,
    })

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

                <ClusterChart />
            </div>
            {isOperator && (
                <div className='w-80 border p-4 rounded shadow-lg'>
                    <h2 className='text-2xl font-semibold mb-2'>Your Interests</h2>
                    <InterestForm />

                    <h2 className='text-2xl font-semibold mt-6 mb-2'>Items</h2>
                    {items.length === 0 ? (
                        <p className='text-gray-500'>No items available.</p>
                    ) : (
                        <ul className='list-disc list-inside'>
                            {items.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    )
}

export default HomePage