import { useMutation, useQuery } from '@tanstack/react-query';
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { useCallback, useEffect } from 'react'
import { firebaseAuth, firestoreDB } from '../../../lib/firebase';
import { interestSchema, type Interest } from '../models/interest';
import { useAuthState } from 'react-firebase-hooks/auth';
import { queryClient } from '../../../lib/queryclient';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { GlobalAlert } from '../../../lib/alert';

const SelectInterestForm = () => {
    const [user, userLoading] = useAuthState(firebaseAuth);

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

    const {data: selectedInterests} = useQuery({
        queryKey: ['userInterests', user?.uid],
        initialData: [],
        queryFn: async () => {
            if (!user) return [];
            const docRef = doc(firestoreDB, "userInterests", user.uid);
            const querySnapshot = await getDoc(docRef);
            if (querySnapshot.exists()) {
                const data = querySnapshot.data();
                if (data && data.interests) {
                    return data.interests as Interest[];
                }
            }
            return [];
        },
        enabled: !!user && !userLoading,
    })

    useEffect(() => {
        if (user) {
            queryClient.invalidateQueries({ queryKey: ['interests'] });
            queryClient.invalidateQueries({ queryKey: ['userInterests', user?.uid] });
        }
    }, [user, userLoading])

    
    const form = useForm({
        defaultValues: {
            interests: selectedInterests || [],
        },
        resolver: zodResolver(z.object({
            interests: z.array(interestSchema).min(1, { message: "Select at least one interest" })
        })),
    });
    useEffect(() => {
        if (selectedInterests) {
            form.reset({
                interests: selectedInterests,
            });
        }
    }, [selectedInterests, form])

    const currentInterest = form.watch("interests");

    const updateUserInterests = useMutation({
        mutationFn: async (userId: string) => {
            const docRef = doc(firestoreDB, "userInterests", userId);
            await setDoc(docRef, { interests: currentInterest });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userInterests', user?.uid] });
        },
        onError: (error) => {
            GlobalAlert.fire({
                title: 'Error',
                text: (error as Error).message,
                icon: 'error',
            });
        }
    })

    const onSubmit = useCallback(() => {
        if (user) {
            updateUserInterests.mutate(user.uid);
        } else {
            GlobalAlert.fire({
                title: 'Error',
                text: 'You must be logged in to save interests',
                icon: 'error',
            });
        }
    }, [user, updateUserInterests]);

    return (
        <div className="h-full flex justify-center items-center flex-col">
            <div className="mb-4 size-96">
                <label className="block text-gray-700 text-sm font-bold mb-2">Select Your Interests</label>
                <div className="border rounded p-4 flex flex-wrap gap-2">
                    {interests.length === 0 ? (
                        <p className="text-gray-500">No interests available.</p>
                    ) : (
                        interests.map((interest) => (
                            <button
                                key={interest.id}
                                type="button"
                                className={`px-6 py-3 rounded-full text-sm font-bold ${
                                    currentInterest.some(i => i.id === interest.id)
                                        ? "bg-blue-500 text-white hover:bg-blue-600 hover:text-white transition cursor-pointer"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900 transition cursor-pointer"
                                }`}
                                onClick={() => {
                                    if (currentInterest.some(i => i.id === interest.id)) {
                                        form.setValue(
                                            "interests",
                                            currentInterest.filter(i => i.id !== interest.id)
                                        );
                                    } else {
                                        form.setValue("interests", [...currentInterest, interest]);
                                    }
                                    form.handleSubmit(onSubmit)();
                                }}
                            >
                                {interest.name}
                            </button>
                        ))
                    )}
                </div>
                {form.formState.errors.interests && (
                    <p className="text-red-500 text-xs mt-1">{form.formState.errors.interests.message}</p>
                )}
            </div>
        </div>
    )
}

export default SelectInterestForm