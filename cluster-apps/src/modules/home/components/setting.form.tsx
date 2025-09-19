import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { FaMinus, FaPlus } from 'react-icons/fa'
import z from 'zod'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { firebaseAuth, firestoreDB } from '../../../lib/firebase'
import { useCallback, useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'

const settingSchema = z.object({
    clusterNum: z.number().min(1).max(20),
})

type Setting = z.infer<typeof settingSchema>

const SettingForm = () => {
    const form = useForm({
        resolver: zodResolver(settingSchema),
        defaultValues: { clusterNum: 0 },
    })

    const [user] = useAuthState(firebaseAuth);

    const actionUpdateSetting = useMutation({
        mutationFn: async (data: Setting) => {
            const docRef = doc(firestoreDB, "settings", "appSettings");
            await setDoc(docRef, data);
        },
    })

    const { data: appSettings, refetch: refetchAppSettings } = useQuery({
        queryKey: ['appSettings'],
        queryFn: async () => {
            const docRef = doc(firestoreDB, "settings", "appSettings");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return docSnap.data()
            }
            return null;
        },
        initialData: null,
    })

    useEffect(() => {
        if (appSettings) {
            form.reset(appSettings);
        }
    }, [appSettings, form])

    useEffect(() => {
        if (user) {
            refetchAppSettings();
        }
    }, [user, refetchAppSettings])

    const onSubmit = useCallback((data: Setting) => {
        actionUpdateSetting.mutate(data);
    }, [actionUpdateSetting])

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col">
                <label className="label">
                    <span className="label-text">Number of Clusters</span>
                </label>
                <div className='flex items-center gap-2'>
                    <button
                        type="button"
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition cursor-pointer"
                        onClick={() => {
                            const current = form.getValues("clusterNum");
                            if (current > 1) {
                                form.setValue("clusterNum", current - 1);
                                form.handleSubmit(onSubmit)();
                            }
                        }}
                    >
                        <FaMinus />
                    </button>
                    <input
                        type="number"
                        value={form.watch("clusterNum")}
                        onChange={(e) => {
                            const value = parseInt(e.target.value);
                            form.setValue("clusterNum", isNaN(value) ? 0 : value);
                            form.handleSubmit(onSubmit)();
                        }}
                        className="w-10 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="button"
                        className="bg-green-500 text-white px-2 py-1 rounded-r hover:bg-gray-400 transition cursor-pointer"
                        onClick={() => {
                            const current = form.getValues("clusterNum");
                            if (current < 20) {
                                form.setValue("clusterNum", current + 1);
                                form.handleSubmit(onSubmit)();
                            }
                        }}
                    >
                        <FaPlus />
                    </button>
                </div>
                {form.formState.errors.clusterNum && (
                    <span className="text-red-500 text-sm">
                        {form.formState.errors.clusterNum.message}
                    </span>
                )}
            </div>
        </div>
    )
}

export default SettingForm