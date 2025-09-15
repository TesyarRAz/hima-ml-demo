import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import useAuthStore from '../../auth/hooks/use-auth-store'
import { useShallow } from 'zustand/shallow'
import { useMutation, useQuery } from '@tanstack/react-query'
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore'
import { firebaseAuth, firestoreDB } from '../../../lib/firebase'
import { queryClient } from '../../../lib/queryclient'
import { GlobalAlert } from '../../../lib/alert'
import { useAuthState } from 'react-firebase-hooks/auth'
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { interestSchema, type Interest } from '../models/interest'

const InterestForm = () => {
    const [user, userLoading] = useAuthState(firebaseAuth);
    const navigate = useNavigate()

    const form = useForm({
        resolver: zodResolver(interestSchema),
    })

    const [
        isAuthenticated,
    ] = useAuthStore(useShallow((state) => [
        state.isAuthenticated,
    ]))

    const { data: interests } = useQuery({
        queryKey: ['interests'],
        initialData: [],
        queryFn: async () => {
            const querySnapshot = await getDocs(collection(firestoreDB, "interests"));
            const interestsData: Interest[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (data && data.name) {
                    interestsData.push({ id: doc.id, name: data.name });
                }
            });
            return interestsData;
        },
        enabled: !userLoading,
    })

    useEffect(() => {
        if (user) {
            queryClient.invalidateQueries({ queryKey: ['interests'] });
        }
    }, [user, userLoading])

    const addInterest = useMutation({
        mutationFn: async (interest: Interest) => {
            const docRef = await addDoc(collection(firestoreDB, "interests"), interest);
            return docRef.id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['interests'] });
        }
    })

    const deleteInterest = useMutation({
        mutationFn: async (interestId: string) => {
            const docRef = doc(firestoreDB, "interests", interestId);
            await deleteDoc(docRef);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['interests'] });
        }
    })

    const updateInterest = useMutation({
        mutationFn: async (interest: Interest) => {
            const docRef = doc(firestoreDB, "interests", interest.id!);
            await updateDoc(docRef, { name: interest.name });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['interests'] });
        }
    })

    const onSubmit = (data: Interest) => {
        if (!isAuthenticated()) {
            GlobalAlert.fire({
                icon: 'warning',
                title: 'You must be logged in to add interests.',
            }).then(() => {
                navigate('/auth/login')
            });
            return
        }

        if (data.id) {
            // update existing interest
            updateInterest.mutate(data, {
                onSuccess: () => {
                    form.reset();
                }
            });
        } else {
            // add new interest
            addInterest.mutate({ name: data.name }, {
                onSuccess: () => {
                    form.reset();
                }
            });
        }
    }

    return (
        <>
            {/* create new interest item */}
            <form className='mb-4' onSubmit={form.handleSubmit(onSubmit)}>
                <div>
                    <input
                        type="text"
                        {...form.register('name')}
                        className='flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                    {form.formState.errors.name && (
                        <p className='text-red-500 text-sm mt-1'>{form.formState.errors.name.message}</p>
                    )}
                    <div className='mt-2 flex gap-2'>
                        {form.watch('id') && (
                            <button
                                type='button'
                                onClick={() => form.reset()}
                                className='bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition cursor-pointer'
                            >
                                Cancel
                            </button>
                        )}
                        <button
                            type='submit'
                            className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition cursor-pointer'
                        >
                            Save
                        </button>
                    </div>
                </div>
            </form>
            {interests.length === 0 ? (
                <p className='text-gray-500'>No interests selected.</p>
            ) : (
                <div>
                    {interests.map((interest, index) => (
                        <div key={index} className='bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm mr-2 mb-2 inline-flex items-center'>
                            {interest.name}

                            {/* trash */}
                            <button
                                onClick={() => {
                                    if (!isAuthenticated()) {
                                        GlobalAlert.fire({
                                            icon: 'warning',
                                            title: 'You must be logged in to delete interests.',
                                        }).then(() => {
                                            navigate('/auth/login')
                                        });
                                        return
                                    }
                                    deleteInterest.mutate(interest.id!);
                                }}
                                className='ml-2 text-red-500 hover:text-red-700 transition cursor-pointer hover:scale-110 text-lg font-bold'
                            >
                                <FaTrashAlt />
                            </button>
                            {/* edit */}
                            <button
                                onClick={() => {
                                    if (!isAuthenticated()) {
                                        GlobalAlert.fire({
                                            icon: 'warning',
                                            title: 'You must be logged in to edit interests.',
                                        }).then(() => {
                                            navigate('/auth/login')
                                        });
                                        return
                                    }
                                    form.setValue('id', interest.id!)
                                    form.setValue('name', interest.name)
                                }}
                                className='ml-2 text-green-500 hover:text-green-700 transition cursor-pointer hover:scale-110 text-lg font-bold'
                            >
                                <FaPencilAlt />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </>
    )
}

export default InterestForm