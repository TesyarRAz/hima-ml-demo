"use client"

import { useState, useEffect } from "react"
import { FaBrain, FaChevronRight } from "react-icons/fa"
import { MdScatterPlot, MdSync } from "react-icons/md"
import { FcSmartphoneTablet } from "react-icons/fc"
import { cn } from "../../../../lib/utils/styles"

interface OnboardingStep1Props {
    onNext: () => void
}

const features = [
    {
        icon: FaBrain,
        title: "Machine Learning",
        description: "Kecerdasan buatan untuk rekomendasi terbaik",
    },
    {
        icon: MdScatterPlot,
        title: "Unsupervised Learning",
        description: "Analisis data tanpa label untuk wawasan mendalam",
    },
    {
        icon: MdSync,
        title: "Real-time Sync",
        description: "Sinkronisasi data secara langsung dan otomatis",
    },
]

export function OnboardingStep1({ onNext }: OnboardingStep1Props) {
    const [currentFeature, setCurrentFeature] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentFeature((prev) => (prev + 1) % features.length)
        }, 2000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="flex items-center justify-center h-full p-4">
            <div className="w-full max-w-2xl">
                <div className="text-center mt-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-full mb-6 animate-pulse">
                        <FcSmartphoneTablet className="w-10 h-10 text-primary-foreground" />
                    </div>
                    <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">Halo Semua!</h1>
                    <p className="text-xl text-muted-foreground text-pretty">Mari mulai perjalanan informatika Anda bersama kami</p>
                </div>

                <div className="space-y-2 mb-12">
                    {features.map((feature, index) => {
                        const Icon = feature.icon
                        return (
                            <div
                                key={index}
                                className={cn(
                                    'p-6 transition-all duration-500 transform rounded-lg shadow-lg',
                                    currentFeature === index ? "scale-105 bg-card border-accent shadow-xl" : "scale-100 bg-muted/50"
                                )}
                            >
                                <div className="flex items-start gap-4">
                                    <div
                                        className={`p-3 rounded-lg transition-colors duration-300 ${currentFeature === index ? "bg-accent" : "bg-muted"
                                            }`}
                                    >
                                        <Icon
                                            className={`w-6 h-6 transition-colors duration-300 ${currentFeature === index ? "text-accent-foreground" : "text-muted-foreground"
                                                }`}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-card-foreground mb-2">{feature.title}</h3>
                                        <p className="text-muted-foreground text-pretty">{feature.description}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className="flex justify-center">
                    <button onClick={onNext} className="px-8 py-2 rounded-xl bg-zinc-800 text-white font-medium text-lg flex items-center shadow-md hover:bg-zinc-500 active:bg-zinc-900 transition duration-200">
                        Mulai Sekarang
                        <FaChevronRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                    </button>
                </div>

                <div className="flex justify-center mt-8 gap-2">
                    {features.map((_, index) => (
                        <div
                            key={index}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${currentFeature === index ? "bg-accent w-8" : "bg-muted"
                                }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
