import Navbar from '../components/navbar'
import { Outlet } from 'react-router'
import Footer from '../components/footer'

const BaseHomeLayout = () => {
    return (
        <>
            <Navbar />
            <main className="h-[calc(100vh-4rem-4rem)]">
                <Outlet />
            </main>
            <Footer className="h-16" />
        </>
    )
}

export default BaseHomeLayout