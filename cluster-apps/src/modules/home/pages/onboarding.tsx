import { useState } from 'react'
import { OnboardingStep1 } from '../components/onboarding/step-1'
import { OnboardingStep2 } from '../components/onboarding/step-2'
import { useSearchParams } from 'react-router'
import { OnboardingStep3 } from '../components/onboarding/step-3'
import { OnboardingComplete } from '../components/onboarding/complete'
import ClusterPage from '../components/onboarding/cluster'

const OnboardingPage = () => {
    const [formData, setFormData] = useState({
        image: null as File | null,
        name: "",
        email: "",
        phone: "",
    })
    const [searchParams, setSearchParams] = useSearchParams();

    const currentStep = parseInt(searchParams.get("page") || "1", 10)

    const nextStep = () => {
        const nextStep = currentStep + 1;
        setSearchParams({ page: nextStep.toString() });
    }

    const prevStep = () => {
        const prevStep = currentStep - 1;
        setSearchParams({ page: prevStep.toString() });
    }

    const updateFormData = (data: Partial<typeof formData>) => {
        setFormData((prev) => ({ ...prev, ...data }))
    }

    return (
        <div className="h-full">
            {currentStep === 1 && <OnboardingStep1 onNext={nextStep} />}
            {currentStep === 2 && (
                <OnboardingStep2 onNext={nextStep} onPrev={prevStep} formData={formData} updateFormData={updateFormData} />
            )}

            {currentStep === 3 && (
                <OnboardingStep3 onNext={nextStep} onPrev={prevStep} formData={formData} updateFormData={updateFormData} />
            )}

            {currentStep === 4 && (
                <OnboardingComplete onPrev={prevStep} onNext={nextStep} />
            )}

            {currentStep === 5 && (
                <ClusterPage onPrev={() => {
                    setSearchParams({ page: "3" });
                }} />
            )}
        </div>
    )
}

export default OnboardingPage