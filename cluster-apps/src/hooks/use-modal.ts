import { useState } from "react";

export interface ModalState {
    openModal: { [key: string]: boolean };
    disabled: { [key: string]: boolean };
    isLoading: { [key: string]: boolean };
    open: (name: string) => void;
    close: (name: string) => void;
    setDisable: (name: string, value?: boolean) => void;
    setLoading: (name: string, value?: boolean) => void;
    reset: () => void;
}

const useModal = (): ModalState => {
    const [openModal, setOpenModal] = useState<{ [key: string]: boolean }>({});
    const [disabled, setDisabled] = useState<{ [key: string]: boolean }>({});
    const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({});

    const open = (name: string) => {
        if (name && !openModal[name]) {
            setOpenModal({ ...openModal, [name]: true });
        }
    };

    const close = (name: string) => {
        if (name && openModal[name]) {
            setOpenModal({ ...openModal, [name]: false });
            setDisabled({ ...disabled, [name]: false });
            setIsLoading({ ...isLoading, [name]: false });
        }
    };

    const setDisable = (name: string, value = false) => {
        if (name && openModal[name] && disabled[name]) {
            setDisabled({ ...disabled, [name]: value });
        }
    };

    const setLoading = (name: string, value = false) => {
        if (name && openModal[name]) {
            setIsLoading({ ...isLoading, [name]: value });
        }
    }
    
    const reset = () => {
        setOpenModal({});
        setDisabled({});
        setIsLoading({});
    }

    return {
        openModal,
        disabled,
        isLoading,
        open,
        close,
        setDisable,
        setLoading,
        reset
    }
}

export default useModal;