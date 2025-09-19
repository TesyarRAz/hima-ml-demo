import { forwardRef } from "react"
import type { ModalState } from "../hooks/use-modal";
import { cn } from "../lib/utils/styles";

export interface BaseModalProps extends React.HTMLAttributes<HTMLDivElement> {
    modalState: ModalState
    modalName: string;
    title?: string;
}

const BaseModal = forwardRef<HTMLDivElement, BaseModalProps>(
    ({ modalState, modalName, className, title, children, ...props }, ref) => {
        return (
            <>
                {modalState.openModal[modalName] && (
                    <div className={cn("fixed inset-0 flex items-center justify-center z-50 px-6 backdrop-blur", className)} ref={ref} {...props}>
                        <div className="bg-white px-10 py-10 rounded-lg shadow-2xl relative">
                            <button
                                type="button"
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                                onClick={() => modalState.close(modalName)}
                                aria-label="Close"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <h1 className="text-2xl font-semibold text-center mb-10">{title}</h1>
                        {children}
                        </div>
                    </div>
                )}
            </>
        )
    }
)

export default BaseModal