import { useState } from 'react'
import { assets } from '../assets/assets'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { useLanguage } from '../context/LanguageContext'
import { toast } from 'react-hot-toast'
import { motion } from 'motion/react'

const Navbar = () => {
  const { setShowLogin, user, logout, isOwner, axios, setIsOwner } = useAppContext();
  const { lang, toggleLanguage, t } = useLanguage();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [navSearch, setNavSearch] = useState('');

  const menuLinks = [
    { name: t('home'), path: '/' },
    { name: t('tractors'), path: '/tractor' },
    { name: t('myBookings'), path: '/mybooking' }
  ];

  const handleNavSearch = (e) => {
    if (e.key === 'Enter') {
      if (navSearch.trim()) {
        navigate(`/tractor?query=${encodeURIComponent(navSearch.trim())}`);
      } else {
        navigate('/tractor');
      }
    }
  };

  const handleSearchClick = () => {
    if (navSearch.trim()) {
      navigate(`/tractor?query=${encodeURIComponent(navSearch.trim())}`);
    } else {
      navigate('/tractor');
    }
  };

  const changeRole = async () => {
    if (!user) {
      setShowLogin(true);
      return;
    }

    try {
      const { data } = await axios.post('/api/owner/change-role');
      if (data.success) {
        setIsOwner(true)
        toast.success(data.message);
      } else {
        toast.error(data.message || 'Unable to change role');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={` flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-10 py-4 text-gray-600 border-b border-borderColor relative transition-all ${location.pathname === "/" && "bg-light"}`}>
      <Link to='/'>
        <motion.img whileHover={{ scale: 1.05 }} src={assets.Rental_Logo3} alt="TractorHub" className='h-10 rounded-2xl w-35 border-2 object-contain' />
      </Link>
      <div className={`max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-16 max-sm:border-t border-borderColor right-0 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-3 max-sm:p-4 transition-all duration-300 z-50 ${location.pathname === "/" ? "bg-light" : "bg-white"} ${open ? "max-sm:translate-x-0" : "max-sm:translate-x-full"}`}>
        {menuLinks.map((link, index) => (
          <Link key={index} to={link.path} onClick={() => setOpen(false)} className="hover:text-primary transition font-medium">
            {link.name}
          </Link>
        ))}
        {user && <Link to='/security-sessions' onClick={() => setOpen(false)} className="hover:text-primary transition font-medium">Security</Link>}

        {/* Language Switcher Pill */}
        <button
          onClick={toggleLanguage}
          className="px-2.5 py-1 text-xs font-semibold rounded-full border border-gray-300 bg-gray-50 hover:bg-gray-100 transition cursor-pointer flex items-center gap-1 text-gray-700 shadow-2xs"
          title="Change Language"
        >
          <span>🇮🇳</span>
          <span>{lang === 'en' ? 'हिन्दी' : 'English'}</span>
        </button>

        <div className='hidden lg:flex items-center text-sm gap-1 border border-borderColor px-3 rounded-full max-w-56 bg-white'>
          <input
            type="text"
            value={navSearch}
            onChange={(e) => setNavSearch(e.target.value)}
            onKeyDown={handleNavSearch}
            className='py-1.5 w-full bg-transparent outline-none placeholder-gray-400 text-xs'
            placeholder={t('searchPlaceholder')}
          />
          <img src={assets.search} alt="search" className='cursor-pointer w-4 h-4' onClick={() => { setOpen(false); handleSearchClick(); }} />
        </div>

        <div className='flex max-sm:flex-col items-start sm:items-center gap-3'>

          <button onClick={() => { setOpen(false); if (isOwner) navigate('/owner'); else changeRole(); }} className='cursor-pointer text-xs font-semibold hover:text-primary transition'>
            {isOwner ? t('dashboard') : t('listTractor')}
          </button>

          <button onClick={() => { setOpen(false); if (user) logout(); else setShowLogin(true); }} className="cursor-pointer px-6 py-2 bg-[#1d4ed8] hover:bg-blue-800 transition-all text-white rounded-lg text-xs font-semibold">
            {user ? t('logout') : t('login')}
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

