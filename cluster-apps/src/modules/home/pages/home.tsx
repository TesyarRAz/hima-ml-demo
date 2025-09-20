import { useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import { firebaseAuth } from '../../../lib/firebase';
import { queryClient } from '../../../lib/queryclient';
import ClusterChart from '../components/cluster.chart';
import { FaExpand, FaQrcode, FaUsers } from 'react-icons/fa';
import useHideNavbar from '../hooks/use-hide-navbar';
import { useShallow } from 'zustand/shallow';
import BaseModal from '../../../components/base-modal';
import useModal from '../../../hooks/use-modal';
import UserList from '../components/user-list';
import QRCode from 'react-qr-code';

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

            <BaseModal
                modalName="qr-code"
                modalState={modal}
                title="Scan QR Code to Open This Page"
            >
                <div className='flex justify-center'>
                    <QRCode
                        size={256}
                        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                        value="https://hima.linkbee.id"
                        viewBox={`0 0 256 256`}
                    />
                </div>
            </BaseModal>

            {/* button full screen absolute di kanan atas */}
            <div className='absolute top-4 right-4 flex space-x-2'>
                <button 
                className='bg-zinc-900 text-white p-2 rounded hover:bg-zinc-800 transition flex items-center justify-center shadow-lg cursor-pointer'
                onClick={() => {
                    modal.open("qr-code")
                }}
                >
                   <FaQrcode className='w-6 h-6' />
                </button>
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