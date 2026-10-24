import { useEffect } from 'react'
import NavbarOwner from '../../Components/owner/NavbarOwner'
import SideBar from '../../Components/owner/SideBar'
import { Outlet } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'

const Layout = () => {
  const { isOwner, navigate } = useAppContext()

  useEffect(() => {
    if (!isOwner) {
      navigate('/')
    }
  }, [isOwner, navigate])

  return (
    <div className="flex flex-col min-h-screen bg-stone-50 pt-[69px]">
      <NavbarOwner />
      <div className="flex flex-1 min-h-[calc(100vh-65px)]">
        <SideBar />
        <main className="flex-1 min-w-0 overflow-x-hidden ml-14 sm:ml-16 md:ml-60">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
