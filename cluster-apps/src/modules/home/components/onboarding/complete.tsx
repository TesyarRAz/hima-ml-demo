import { FaCheckCircle, FaChevronLeft, FaChevronRight } from "react-icons/fa"

interface OnboardingCompleteProps {
    onPrev?: () => void
    onNext?: () => void
}

export function OnboardingComplete({ onPrev, onNext }: OnboardingCompleteProps) {
    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-2xl text-center">
                <div className="mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-accent rounded-full mb-6 animate-bounce">
                        <FaCheckCircle className="w-10 h-10 text-accent-foreground" />
                    </div>
                    <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">Selamat! 🎉</h1>
                    <p className="text-xl text-muted-foreground text-pretty">Akun kamu sudah selesai di atur</p>
                    <p className="text-xl text-muted-foreground text-pretty">Kamu bisa kembali mengatur profile kamu setiap saat</p>
                    <p className="text-xl text-muted-foreground text-pretty">Setiap pembaruan akan merubah data analisis secara realtime 🎉</p>
                </div>

                <div className="flex justify-between">
                    <button onClick={onPrev} className="px-8 py-2 rounded-xl font-medium text-lg flex items-center shadow-md hover:bg-zinc-900 active:bg-zinc-500 hover:text-white transition border border-zinc-900 duration-200">
                        <FaChevronLeft className="w-4 h-4 mr-2" />
                        <span>Kembali</span>
                    </button>
                    <button onClick={onNext} className="px-8 py-2 rounded-xl bg-zinc-800 text-white font-medium text-lg flex items-center shadow-md hover:bg-white hover:text-zinc-900 border border-zinc-900 transition duration-200">
                        <span>Analytics</span>
                        <FaChevronRight className="w-4 h-4 ml-2" />
                    </button>
                </div>

            </div>
        </div>
    )
}
