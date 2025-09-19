import { FaChevronLeft, FaChevronRight, FaUser } from "react-icons/fa";
import SelectInterestForm from "../select-interest.form";

interface OnboardingStep3Props {
    onNext: () => void
    onPrev: () => void
    formData: { name: string; email: string; phone: string }
    updateFormData: (data: Partial<{ name: string; email: string; phone: string }>) => void
}

export function OnboardingStep3({ onNext, onPrev }: OnboardingStep3Props) {
    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-2xl">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-6">
                        <FaUser className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <h2 className="text-3xl font-bold text-foreground mb-4 text-balance">Lengkapi Profil Anda</h2>
                    <p className="text-lg text-muted-foreground text-pretty">
                        Isi informasi dasar untuk menyelesaikan pendaftaran
                    </p>
                </div>

                <SelectInterestForm />


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
                    <div className="w-2 h-2 rounded-full bg-muted" />
                    <div className="w-8 h-2 rounded-full bg-accent" />
                </div>
            </div>
        </div>
    )
}