import { useState } from 'react'
import { assets } from '../assets/assets'
import {Link, useLocation, useNavigate} from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { toast } from 'react-hot-toast'
import {motion} from 'motion/react'

const menuLinks = [
  { name: 'Home', path: '/' },
//   { name: 'About', path: '/about' },
  { name: 'Tractor', path: '/tractor' },
  { name: 'My Booking', path: '/mybooking' }
]
const Navbar = () => {
    const { setShowLogin, user, logout, isOwner, axios, setIsOwner } = useAppContext();

    const location = useLocation();
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const changeRole = async () => {
      if (!user) {
        setShowLogin(true);
        return;
      }

      try {
        const { data } = await axios.post('/api/owner/change-role');
        if(data.success) {
          setIsOwner(true)
          toast.success(data.message);
        } else{
          toast.error(data.message || 'Unable to change role');
        }
      } catch (error) {
        toast.error(error.response?.data?.message || error.message);
      }};

  return (
    <motion.div
    initial = {{y: -20, opacity: 0}}
    animate = {{y: 0, opacity : 1}}
    transition={{duration: 0.5}}
     className={` flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-10 py-4 text-gray-600 border-b border-borderColor relative transition-all ${location.pathname === "/" && "bg-light"}`}>
        <Link to='/'>
        <motion.img whileHover={{scale: 1.05}} src={assets.Tractor_Logo} alt="" className='h-10 rounded-2xl w-35' />
        </Link>
        <div className={`max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-16 max-sm:border-t border-borderColor right-0 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-3 max-sm:p-2 transition-all duration-300 z-50 ${location.pathname === "/" ? "bg-light" : "bg-white"} ${open ? "max-sm:translate-x-0" : "max-sm:translate-x-full"}`}>
            {menuLinks.map((link, index) => (
                <Link key={index} to={link.path}>
                    {link.name}
                </Link>
            ))}
            <div className='hidden lg:flex items-center text-sm gap-1 border border-borderColor px-3 rounded-full max-w-56'>
                <input type="text" className='py-1.5 w-full bg-transparent outline-none placeholder-gray-500' placeholder='Search Products'/>
                <img src={assets.search} alt="search" />
            </div>
             
            <div className='flex max-sm:flex-col items-start sm:items-center gap-3'>

                <button onClick={isOwner ? () => navigate('/owner') : changeRole} className='cursor-pointer'>{isOwner ? 'Dashboard' : 'List Tractor'}</button>
                 
               <button onClick={() => {user ? logout() : setShowLogin(true)}} className="cursor-pointer px-8 py-2 bg-[#1d4ed8] hover:bg-blue-800 transition-all text-white rounded-lg">{user ? 'Logout' : 'Login'}
               </button>
            </div>
        </div>
        <button className='sm:hidden cursor-pointer' aria-label='Menu' onClick={() => setOpen(!open)}>
            <img src={open ? assets.menuCloser : assets.menu} alt="menu" className='h-6 w-6' />
        </button>

    </motion.div>
  )
}
export default Navbar;

