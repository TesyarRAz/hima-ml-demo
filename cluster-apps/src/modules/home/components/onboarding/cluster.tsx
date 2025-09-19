import ClusterChart from '../cluster.chart'
import { FaChevronLeft } from 'react-icons/fa'
import { useEffect } from 'react'

export interface ClusterPageProps {
    onPrev: () => void
}

const ClusterPage = ({ onPrev }: ClusterPageProps) => {

    useEffect(() => {
        // Simpan viewport lama
        const meta = document.querySelector('meta[name="viewport"]');
        const oldContent = meta?.getAttribute("content");

        // Set ke non-dynamic (disable shrinking/zooming)
        meta?.setAttribute(
            "content",
            ""
        );

        // Balikin lagi pas keluar dari page
        return () => {
            if (oldContent) {
                meta?.setAttribute("content", oldContent);
            }
        };
    }, []);

    return (
        <>
            <div className='min-h-[800px] min-w-[1200px] size-full'>
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