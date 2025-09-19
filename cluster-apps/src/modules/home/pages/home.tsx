import { useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import { firebaseAuth } from '../../../lib/firebase';
import { queryClient } from '../../../lib/queryclient';
import ClusterChart from '../components/cluster.chart';
import { FaExpand } from 'react-icons/fa';
import useHideNavbar from '../hooks/use-hide-navbar';
import { useShallow } from 'zustand/shallow';

const HomePage = () => {
    const [user] = useAuthState(firebaseAuth);

    useEffect(() => {
        if (user) {
            queryClient.invalidateQueries({ queryKey: ['isOperator', user?.uid] });
            queryClient.invalidateQueries({ queryKey: ['notAnsweredQuestionYet', user?.uid] });
        }
    }, [user])

    const [hideNavbar, setHideNavbar] = useHideNavbar(useShallow(state => [state.hideNavbar, state.setHideNavbar]));

    return (
        <>
            <div className='min-h-[800px] min-w-[1200px] size-full'>
                <ClusterChart />
            </div>

            {/* button full screen absolute di kanan atas */}
            <div className='absolute top-4 right-4'>
                <button
                    className='bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition flex items-center justify-center shadow-lg cursor-pointer'
                    onClick={() => {
                        setHideNavbar(!hideNavbar);
                    }}
                >
                    {/* pake icon dari react icons */}
                    <FaExpand className='w-6 h-6' />
                </button>
            </div>
        </>
    )
}

export default HomePage