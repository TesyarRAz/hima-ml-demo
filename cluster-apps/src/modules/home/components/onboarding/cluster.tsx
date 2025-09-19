import ClusterChart from '../cluster.chart'
import { FaChevronLeft } from 'react-icons/fa'
import { useEffect } from 'react'
import useHideContact from '../../hooks/use-hide-contact'
import { useShallow } from 'zustand/shallow'

export interface ClusterPageProps {
    onPrev: () => void
    isShow: boolean
}

const ClusterPage = ({ onPrev, isShow }: ClusterPageProps) => {
    const [, setHideContact] = useHideContact(useShallow(state => [
        state.hideContact, state.setHideContact
    ]));

    useEffect(() => {
        setHideContact(isShow);
        return () => {
            setHideContact(false);
        }
    }, [setHideContact, isShow])

    return (
        <>
            <div className='size-full'>
                <ClusterChart />
            </div>

            <div className='absolute inset-0 p-4 flex items-start'>

                <div className="flex justify-between">
                    <button onClick={onPrev} className="px-8 py-2 rounded-xl font-medium text-lg flex items-center shadow-md hover:bg-zinc-900 active:bg-zinc-500 hover:text-white transition border border-zinc-900 duration-200">
                        <FaChevronLeft className="w-4 h-4 mr-2" />
                    </button>
                </div>
            </div>
        </>
    )
}

export default ClusterPage