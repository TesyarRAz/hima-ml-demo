import { getAuth, signInWithPopup } from 'firebase/auth'
import { FcGoogle } from "react-icons/fc"
import { firebaseApp, googleAuthProvider } from '../../../lib/firebase'
import { GlobalAlert } from '../../../lib/alert'
import { useNavigate } from 'react-router'

const LoginPage = () => {
    const navigate = useNavigate()

    const handleLoginWithGoogle = () => {
        signInWithPopup(getAuth(firebaseApp), googleAuthProvider)
            .then((result) => {
                GlobalAlert.fire({
                    icon: 'success',
                    title: 'Login successful!',
                    text: `Welcome ${result.user.displayName || 'User'}!`,
                })
                
                return navigate('/');
            })
            .catch((error) => {
                GlobalAlert.fire({
                    icon: 'error',
                    title: 'Login failed!',
                    text: error.message,
                })
            })
    }

    return (
        <div className="flex h-full">
            {/* Left Section */}
            <div className='h-full flex flex-col items-center justify-center w-1/2 bg-blue-500 text-white p-12'>
                <h1 className='text-4xl font-bold'>Welcome Back! Please Login.</h1>
                <p className='mt-2 text-lg opacity-90'>
                    Enter your credentials to access your account.
                </p>
            </div>

            {/* Right Section */}
            <div className='h-full flex items-center justify-center w-1/2 bg-gray-50'>
                <form className='w-3/4 max-w-sm bg-white p-8 rounded-2xl shadow-xl'>
                    <h2 className='text-2xl font-bold mb-6 text-center text-gray-700'>Login</h2>

                    {/* Login with Google */}
                    <button
                        onClick={handleLoginWithGoogle}
                        type="button"
                        className='flex items-center justify-center gap-3 w-full border border-gray-300 rounded-lg py-2 hover:bg-gray-100 transition cursor-pointer mb-6'
                    >
                        <FcGoogle size={22} />
                        <span className="text-gray-700 font-medium">Login with Google</span>
                    </button>
                </form>
            </div>
        </div>
    )
}

export default LoginPage
