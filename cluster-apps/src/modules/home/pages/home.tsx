import { useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import { firebaseAuth } from '../../../lib/firebase';
import { queryClient } from '../../../lib/queryclient';
import ClusterChart from '../components/cluster.chart';
import { FaExpand, FaUsers } from 'react-icons/fa';
import useHideNavbar from '../hooks/use-hide-navbar';
import { useShallow } from 'zustand/shallow';
import BaseModal from '../../../components/base-modal';
import useModal from '../../../hooks/use-modal';
import UserList from '../components/user-list';

const HomePage = () => {
    const [user] = useAuthState(firebaseAuth);

    useEffect(() => {
        if (user) {
            queryClient.invalidateQueries({ queryKey: ['isOperator', user?.uid] });
            queryClient.invalidateQueries({ queryKey: ['notAnsweredQuestionYet', user?.uid] });
        }
    }, [user])

    const [hideNavbar, setHideNavbar] = useHideNavbar(useShallow(state => [state.hideNavbar, state.setHideNavbar]));

    const modal = useModal()

    return (
        <>
            <BaseModal
                modalName="user-list"
                modalState={modal}
                title="User List"
            >
                <UserList />
            </BaseModal>

            <div className='min-h-[800px] min-w-[1200px] size-full'>
                <ClusterChart />
            </div>

            {/* button full screen absolute di kanan atas */}
            <div className='absolute top-4 right-4 flex space-x-2'>
                <button
                    className='bg-green-500 text-white p-2 rounded hover:bg-green-600 transition flex items-center justify-center shadow-lg cursor-pointer mr-2'
                    onClick={() => {
                        modal.open("user-list")
                    }}
                >
                    <FaUsers className='w-6 h-6' />
                </button>
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