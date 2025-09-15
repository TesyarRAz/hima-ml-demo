import { useAuthState } from 'react-firebase-hooks/auth'
import { cn } from '../../../lib/utils/styles'
import { firebaseAuth } from '../../../lib/firebase';
import { GlobalAlert } from '../../../lib/alert';
import { Link } from 'react-router';
import useProfileData from '../../auth/hooks/use-profile-data';

const Navbar = ({
    className
}: {
    className?: string
}) => {
    const [user] = useAuthState(firebaseAuth);
    const { profile } = useProfileData();

    const handleLogout = () => {
        firebaseAuth.signOut()
            .then(() => {
                GlobalAlert.fire({
                    icon: 'success',
                    title: 'Logged out successfully',
                    timer: 2000,
                    showConfirmButton: false,
                });
            })
            .catch((error) => {
                GlobalAlert.fire({
                    icon: 'error',
                    title: 'Logout failed',
                    text: error.message,
                });
            });
    }

    return (
        <nav className={cn("bg-blue-600 p-4 text-white flex items-center", className)}>
            <h1 className="text-2xl font-bold">
                <Link to="/">My App</Link>
            </h1>

            <div className="flex items-center ml-auto space-x-4">
                {/* Logout */}
                {user && (
                    <>
                        <Link to="/auth/profile">
                                <img
                                    src={profile?.photoBase64 || 'https://via.placeholder.com/150'}
                                    alt="Profile"
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                            </Link>
                        <span className="self-center">Hello, {user.displayName || 'User'}</span>
                        <Link to="/question" className="cursor-pointer hover:scale-105 transition">
                            Questions
                        </Link>
                        <button
                            className="cursor-pointer hover:scale-105 transition"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </>
                )}
                {!user && (
                    <Link
                        to="/auth/login"
                        className="cursor-pointer hover:scale-105 transition"
                    >
                        Login
                    </Link>
                )}
            </div>
        </nav>
    )
}

export default Navbar