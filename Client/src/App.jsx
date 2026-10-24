import { useEffect } from 'react'
import Navbar from './Components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './Pages/Home'
import MyBooking from './Pages/MyBooking'
import TractorDetails from './Pages/tractorDetails'
import Tractors from './Pages/tractors'
import Footer from './Components/Footer'
import Layout from './Pages/Owner/Layout'
import AddTractor from './Pages/Owner/AddTractor'
import ManageTractors from './Pages/Owner/ManageTractors'
import ManageBooking from './Pages/Owner/ManageBooking'
import Dashboard from './Pages/Owner/Dashboard'
import Login from './Components/Login'
import { Toaster } from 'react-hot-toast'
import { useAppContext } from './context/AppContext'
import SecuritySessions from './Pages/SecuritySessions'
import ResetPassword from './Pages/ResetPassword'
import VerifyEmail from './Pages/VerifyEmail'
import FloatingHelpline from './Components/FloatingHelpline'

const App = () => {
  const { showLogin } = useAppContext()
  const location = useLocation()
  const isOwnerPath = location.pathname.startsWith('/owner')

  // Smoothly scroll to top whenever the route or page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  return (
    <div className="min-h-screen flex flex-col justify-between overflow-x-hidden w-full max-w-full relative">
      <Toaster position="top-right" />
      {showLogin && <Login />}

      {!isOwnerPath && <Navbar />}

      <main className={`flex-1 w-full max-w-full ${!isOwnerPath ? 'pt-16' : ''}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tractor-details/:id" element={<TractorDetails />} />
          <Route path="/tractor" element={<Tractors />} />
          <Route path="/mybooking" element={<MyBooking />} />
          <Route path="/security-sessions" element={<SecuritySessions />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/owner" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="add-tractor" element={<AddTractor />} />
            <Route path="manage-tractor" element={<ManageTractors />} />
            <Route path="manage-booking" element={<ManageBooking />} />
          </Route>
        </Routes>
      </main>

      {!isOwnerPath && <Footer />}
      {!isOwnerPath && <FloatingHelpline />}
    </div>
  )
}

export default App
