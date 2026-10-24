import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'

const NavbarOwner = () => {
  const { user } = useAppContext()

  return (
    <header className="sticky top-0 z-40 glass-nav border-b border-stone-200/80 shadow-xs px-4 sm:px-6 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-white shadow-md shadow-emerald-700/20">
            <span className="text-lg">🚜</span>
          </div>
          <div className="flex flex-col">
            <span className="text-base font-extrabold tracking-tight text-slate-900 group-hover:text-emerald-700 transition leading-tight">
              Tractor<span className="text-emerald-600">Hub</span>
            </span>
            <span className="text-[9px] font-bold text-amber-700 tracking-wider uppercase">
              Owner Portal
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="text-xs font-bold text-stone-600 hover:text-emerald-700 transition hidden sm:inline"
          >
            ← View Customer Marketplace
          </Link>

          <div className="flex items-center gap-2 bg-stone-100 px-3 py-1.5 rounded-full border border-stone-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-800 truncate max-w-[120px] sm:max-w-[200px]">
              {user?.name || 'Fleet Owner'}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default NavbarOwner
