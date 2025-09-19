import { useState } from 'react'
import { OnboardingStep1 } from '../components/onboarding/step-1'
import { OnboardingStep2 } from '../components/onboarding/step-2'
import { useSearchParams } from 'react-router'
import { OnboardingStep3 } from '../components/onboarding/step-3'
import { OnboardingComplete } from '../components/onboarding/complete'
import ClusterPage from '../components/onboarding/cluster'
import BaseModal from '../../../components/base-modal'
import useModal from '../../../hooks/use-modal'
import { FaPhoneAlt } from 'react-icons/fa'
import useHideContact from '../hooks/use-hide-contact'
import { cn } from '../../../lib/utils/styles'

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

    const modal = useModal()

    const hideContact = useHideContact(state => state.hideContact)

    return (
        <div className="h-full pt-10">
            <BaseModal
                modalName="contact-info"
                modalState={modal}
                title="Contact Information"
            >
                {/* beri informasi kontak, jika ada project atau ada yang ingin di kerjakan bersama linkbee, terus ntar kasih url https://linkbee.id */}
                {/* kasih nomor whatsapp ku juga, jika ingin bertanya*/}
                <div className="space-y-4">
                    <p className="text-gray-600">
                        Kalau ada project atau ada yang ingin dikerjakan bersama Linkbee, silakan hubungi kami di:
                    </p>
                    <div>
                        Phone/WhatsApp: <a href="https://wa.me/6285126335121" target="_blank" className="text-blue-600 hover:underline">+62 851-2633-5121</a><br />
                        Website: <a href="https://linkbee.id" target="_blank" className="text-blue-600 hover:underline">https://linkbee.id</a>
                        Source code: <a href="https://github.com/TesyarRAz/hima-ml-demo" target="_blank" className="text-blue-600 hover:underline">https://github.com/TesyarRAz/hima-ml-demo</a>
                    </div>
                </div>
            </BaseModal>
            {/* contact info */}
            <div className={cn("absolute top-4 left-4", hideContact ? "hidden" : "block")}>
                <button
                    className="bg-zinc-900 text-white px-4 py-2 rounded hover:bg-zinc-800 transition flex items-center"
                    onClick={() => modal.open("contact-info")}
                >
                    <FaPhoneAlt className="inline mr-2" />
                    Contact
                </button>
            </div>
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
                <ClusterPage
                    onPrev={() => {
                        setSearchParams({ page: "3" });
                    }}
                    isShow={currentStep === 5}
                />
            )}

            <div className="absolute top-4 right-4">
                <span className="text-sm text-gray-500">Step {currentStep} of 5</span>
            </div>
        </div>
    )
}

export default OnboardingPage