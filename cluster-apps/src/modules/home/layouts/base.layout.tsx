import Navbar from '../components/navbar'
import { Outlet } from 'react-router'
import useHideNavbar from '../hooks/use-hide-navbar'
import { cn } from '../../../lib/utils/styles'

const BaseHomeLayout = () => {
    const hideNavbar = useHideNavbar(state => state.hideNavbar);
    return (
        <>
            {!hideNavbar && <Navbar />}
            <main className={cn("relative", hideNavbar ? "h-full" : "h-[calc(100vh-4rem)]")}>
                <Outlet />
            </main>
        </>
    )
}

export default BaseHomeLayout