import { getAuth, signInWithPopup, type UserProfile } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { useCallback, useEffect, useRef, useState } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { FaChevronLeft, FaChevronRight, FaImage, FaSignOutAlt, FaUpload } from "react-icons/fa"
import { firebaseApp, firebaseAuth, firestoreDB, googleAuthProvider } from "../../../../lib/firebase"
import { queryClient } from "../../../../lib/queryclient"
import useProfileData from "../../../auth/hooks/use-profile-data"
import { FcGoogle } from "react-icons/fc"
import { GlobalAlert } from "../../../../lib/alert"

interface OnboardingStep2Props {
    onNext: () => void
    onPrev: () => void
    formData: { image: File | null }
    updateFormData: (data: { image: File | null }) => void
}

export function OnboardingStep2({ onNext, onPrev, updateFormData }: OnboardingStep2Props) {
    const [dragActive, setDragActive] = useState(false)
    const [preview, setPreview] = useState<string | null>(null)

    const [user] = useAuthState(firebaseAuth);
    const { profile, isLoading: isProfileLoading } = useProfileData();

    useEffect(() => {
        if (profile?.photoBase64) {
            setPreview(profile.photoBase64)
        }
    }, [profile])

    const inputFileRef = useRef<HTMLInputElement>(null);

    const handleFile = useCallback((file: File) => {
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
    }, [user]);

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            updateFormData({ image: file })
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
            handleFile(file)
        }
    }

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }, [])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0])
        }
    }, [handleFile])


    const handleLoginWithGoogle = () => {
        signInWithPopup(getAuth(firebaseApp), googleAuthProvider)
            .then((result) => {
                GlobalAlert.fire({
                    icon: 'success',
                    title: 'Login successful!',
                    text: `Welcome ${result.user.displayName || 'User'}!`,
                })
            })
            .catch((error) => {
                GlobalAlert.fire({
                    icon: 'error',
                    title: 'Login failed!',
                    text: error.message,
                })
            })
    }

    const handleLogout = () => {
        firebaseAuth.signOut().then(() => {
            GlobalAlert.fire({
                icon: 'success',
                title: 'Logout successful!',
            })
        }).catch((error) => {
            GlobalAlert.fire({
                icon: 'error',
                title: 'Logout failed!',
                text: error.message,
            })
        })
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen p-4">
                <div className="w-full max-w-2xl">

                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary rounded-full mb-6">
                            <FaImage className="w-8 h-8 text-secondary-foreground" />
                        </div>
                        <h2 className="text-3xl font-bold text-foreground mb-4 text-balance">Login</h2>
                        <p className="text-lg text-muted-foreground text-pretty">Silahkan login untuk melanjutkan</p>
                    </div>


                    {/* Login with Google */}
                    <div className="flex justify-center w-full">
                        <button
                            onClick={handleLoginWithGoogle}
                            type="button"
                            className='w-80 flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-2 hover:bg-gray-100 transition cursor-pointer mb-6'
                        >
                            <FcGoogle size={22} />
                            <span className="text-gray-700 font-medium">Login with Google</span>
                        </button>
                    </div>


                    <div className="flex justify-center mt-20">
                        <button onClick={onPrev} className="px-8 py-2 rounded-xl font-medium text-lg flex items-center shadow-md hover:bg-zinc-900 active:bg-zinc-500 hover:text-white transition border border-zinc-900 duration-200">
                            <FaChevronLeft className="w-4 h-4 mr-2" />
                            <span>Kembali</span>
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-2xl">

                {/* button logout */}
                <button onClick={handleLogout} className="px-8 py-2 rounded-xl bg-red-600 text-white font-medium text-lg flex items-center shadow-md hover:bg-red-500 transition duration-200 ml-auto">
                    <span>Logout</span>
                    <FaSignOutAlt className="w-4 h-4 ml-2" />
                </button>

                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary rounded-full mb-6">
                        <FaImage className="w-8 h-8 text-secondary-foreground" />
                    </div>
                    <h2 className="text-3xl font-bold text-foreground mb-4 text-balance">Upload Foto Profil</h2>
                    <p className="text-lg text-muted-foreground text-pretty">Pilih foto terbaik Anda untuk profil</p>
                </div>

                <div className="p-8 mb-8">
                    <input type="file" accept="image/*" onChange={handleFileInput} className="hidden" ref={inputFileRef} />
                    {isProfileLoading ? (
                        <div className="text-center text-muted-foreground">Memuat...</div>
                    ) : (
                        !preview ? (
                            <div
                                className={`border-2 border-dashed rounded-lg p-12 text-center transition-all duration-300 ${dragActive
                                    ? "border-accent bg-accent/10 scale-105"
                                    : "border-border hover:border-accent/50 hover:bg-accent/5"
                                    }`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                <FaUpload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-card-foreground mb-2">Drag & drop foto Anda di sini</h3>
                                <p className="text-muted-foreground mb-6">atau klik tombol di bawah untuk memilih file</p>
                                <label htmlFor="file-upload">
                                    <button className="cursor-pointer" onClick={() => inputFileRef.current?.click()}>
                                        Pilih File
                                    </button>
                                </label>
                                <p className="text-sm text-muted-foreground mt-4">Format yang didukung: JPG, PNG, GIF (Maks. 5MB)</p>
                            </div>
                        ) : (
                            <div className="text-center"
                                onClick={() => inputFileRef.current?.click()}>
                                <div className="relative inline-block mb-4">
                                    <img
                                        src={preview || "/placeholder.svg"}
                                        alt="Preview"
                                        className="w-32 h-32 rounded-full object-cover border-4 border-accent"
                                    />
                                </div>
                                <p className="text-muted-foreground text-sm">Klik gambar untuk mengganti foto</p>
                            </div>
                        )
                    )}
                </div>

                <div className="flex justify-between">
                    <button onClick={onPrev} className="px-8 py-2 rounded-xl font-medium text-lg flex items-center shadow-md hover:bg-zinc-900 active:bg-zinc-500 hover:text-white transition border border-zinc-900 duration-200">
                        <FaChevronLeft className="w-4 h-4 mr-2" />
                        <span>Kembali</span>
                    </button>
                    <button onClick={onNext} className="px-8 py-2 rounded-xl bg-zinc-800 text-white font-medium text-lg flex items-center shadow-md hover:bg-white hover:text-zinc-900 border border-zinc-900 transition duration-200">
                        <span>Lanjutkan</span>
                        <FaChevronRight className="w-4 h-4 ml-2" />
                    </button>
                </div>

                <div className="flex justify-center mt-8 gap-2">
                    <div className="w-2 h-2 rounded-full bg-muted" />
                    <div className="w-8 h-2 rounded-full bg-accent" />
                    <div className="w-2 h-2 rounded-full bg-muted" />
                </div>
            </div>
        </div>
    )
}