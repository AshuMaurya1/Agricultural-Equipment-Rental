import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { assets } from "../assets/assets"
import Loader from "../Components/Loader"
import { useAppContext } from "../context/AppContext"
import { useLanguage } from "../context/LanguageContext"
import PaymentModal from "../Components/PaymentModal"
import toast from "react-hot-toast"
import { motion } from 'motion/react'
import { getShortLocation } from "../data/indiaLocations"

const defaultImplementsList = [
  {
    name: "Rotavator (42-blades)",
    icon: "🚜",
    spec: "42 Boron Steel Blades · Heavy Duty Gear Drive",
    pricePerDay: 500,
    pricePerHour: 150,
    pricePerAcre: 300,
  },
  {
    name: "Cultivator / Harrow (9-tyne)",
    icon: "⚙️",
    spec: "9 Heavy Duty Spring Tynes · 54-inch Width",
    pricePerDay: 300,
    pricePerHour: 100,
    pricePerAcre: 200,
  },
  {
    name: "MB Reversible Plough",
    icon: "🌾",
    spec: "2-Bottom Reversible Moldboard · Deep Tillage",
    pricePerDay: 400,
    pricePerHour: 120,
    pricePerAcre: 250,
  },
  {
    name: "Heavy Duty Tipping Trolley",
    icon: "🚛",
    spec: "5-Tonne Hydraulic Tipping · Reinforced Steel Bed",
    pricePerDay: 600,
    pricePerHour: 180,
    pricePerAcre: 350,
  },
]

const TractorDetails = () => {
  const { id } = useParams()
  const {
    tractors,
    currency,
    axios,
    pickupDate,
    setPickupDate,
    returnDate,
    setReturnDate,
    user,
    setShowLogin,
  } = useAppContext()
  const { t, lang } = useLanguage()

  const navigate = useNavigate()
  const tractor = tractors.find((item) => (item._id || item.id) === id)

  // Pricing mode state
  const [rentalUnit, setRentalUnit] = useState('day') // 'day' | 'hour' | 'acre'
  const [unitCount, setUnitCount] = useState(1)
  const [transportDistanceKm, setTransportDistanceKm] = useState(0)

  // Implements & Driver selection state
  const [selectedImplements, setSelectedImplements] = useState([])
  const [withDriver, setWithDriver] = useState(false)
  const [reviews, setReviews] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  // Fetch reviews for this tractor
  useEffect(() => {
    if (id) {
      axios
        .get(`/api/user/reviews/${id}`)
        .then(({ data }) => {
          if (data.success) {
            setReviews(data.reviews || [])
          }
        })
        .catch(() => {})
    }
  }, [id, axios])

  const implementsOptions =
    tractor?.implementsAvailable && tractor.implementsAvailable.length > 0
      ? tractor.implementsAvailable.map((item, idx) => ({
          ...defaultImplementsList[idx % defaultImplementsList.length],
          ...item,
        }))
      : defaultImplementsList

  // Toggle implement selection
  const handleToggleImplement = (item) => {
    setSelectedImplements((prev) => {
      const exists = prev.some((imp) => imp.name === item.name)
      if (exists) {
        return prev.filter((imp) => imp.name !== item.name)
      } else {
        return [...prev, item]
      }
    })
  }

  // Calculate rental duration in days
  const calculateDays = () => {
    if (!pickupDate || !returnDate) return 1
    const start = new Date(pickupDate)
    const end = new Date(returnDate)
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
    return diff > 0 ? diff : 1
  }

  const days = calculateDays()
  const activeCount = rentalUnit === 'day' ? Math.max(days, unitCount) : Math.max(1, unitCount)

  // Dynamic rates per active unit
  const pricing =
    rentalUnit === 'hour'
      ? (() => {
          const rate = Number(tractor?.pricePerHour || 600)
          return {
            baseTractorTotal: activeCount * rate,
            implementsTotal:
              activeCount *
              selectedImplements.reduce((sum, item) => sum + Number(item.pricePerHour || 150), 0),
            driverTotal: withDriver
              ? activeCount * Number(tractor?.driverHourlyRate || 100)
              : 0,
          }
        })()
      : rentalUnit === 'acre'
      ? (() => {
          const rate = Number(tractor?.pricePerAcre || 1200)
          return {
            baseTractorTotal: activeCount * rate,
            implementsTotal:
              activeCount *
              selectedImplements.reduce((sum, item) => sum + Number(item.pricePerAcre || 300), 0),
            driverTotal: withDriver ? activeCount * 250 : 0,
          }
        })()
      : (() => {
          const rate = Number(tractor?.pricePerDay || 1500)
          return {
            baseTractorTotal: activeCount * rate,
            implementsTotal:
              activeCount *
              selectedImplements.reduce((sum, item) => sum + Number(item.pricePerDay || 400), 0),
            driverTotal: withDriver
              ? activeCount * Number(tractor?.driverDailyRate || 500)
              : 0,
          }
        })()

  const { baseTractorTotal, implementsTotal, driverTotal } = pricing

  const transportRate = Number(tractor?.transportRatePerKm || 40)
  const transportPrice = Math.max(0, Number(transportDistanceKm || 0)) * transportRate
  const grandTotal = baseTractorTotal + implementsTotal + driverTotal + transportPrice
  const advanceAmount = Math.round(grandTotal * 0.2)

  const driverRate =
    rentalUnit === 'hour'
      ? Number(tractor?.driverHourlyRate || 100)
      : rentalUnit === 'acre'
      ? 250
      : Number(tractor?.driverDailyRate || 500)

  const handleOpenPayment = (e) => {
    e.preventDefault()
    if (!user) {
      toast.error('Please login to reserve equipment')
      setShowLogin(true)
      return
    }

    if (!pickupDate || !returnDate) {
      toast.error('Please select both pickup and return dates')
      return
    }
    if (new Date(returnDate) < new Date(pickupDate)) {
      toast.error('Return date cannot be earlier than pickup date')
      return
    }

    setShowPaymentModal(true)
  }

  const handleConfirmReservation = async (paymentDetails) => {
    try {
      setIsSubmitting(true)
      const { data } = await axios.post('/api/booking/create', {
        tractorId: id,
        startDate: pickupDate,
        endDate: returnDate,
        rentalUnit,
        unitsBooked: activeCount,
        selectedImplements,
        withDriver,
        transportDistanceKm,
        ...paymentDetails,
      })
      if (data.success) {
        setShowPaymentModal(false)
        toast.success(data.message)
        navigate('/mybooking')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const ownerPhone = '919876543210'
  const whatsappUrl = `https://wa.me/${ownerPhone}?text=${encodeURIComponent(
    `Namaste! I am interested in renting the ${tractor?.brand} ${tractor?.model} (${tractor?.location}) from TractorHub.`
  )}`

  return tractor ? (
    <div className="px-4 sm:px-6 lg:px-8 mt-8 mb-24 max-w-7xl mx-auto">
      {/* Breadcrumb / Back button */}
      <button
        className="flex items-center gap-2 mb-6 text-stone-500 hover:text-emerald-700 transition cursor-pointer text-xs font-bold"
        onClick={() => navigate(-1)}
      >
        <span className="text-base">←</span>
        <span>{t('backToAll')}</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        {/* Left Column: Image, Specifications, Implements, Health Grid & Reviews */}
        <motion.div
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-7 xl:col-span-8 space-y-8"
        >
          {/* Main Visual Showcase */}
          <div className="relative rounded-3xl overflow-hidden bg-stone-100 shadow-md border border-stone-200">
            <img
              src={tractor.image}
              alt={`${tractor.brand} ${tractor.model}`}
              className="w-full h-60 sm:h-80 md:h-[420px] object-cover"
              onError={(e) => {
                e.target.src = assets.Ace || assets.download1
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20 pointer-events-none" />

            {/* Top Left: Badges */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="bg-emerald-600 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-md flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                {tractor.isAvailable ? t('availableNow') : t('booked')}
              </span>
              <span className="bg-slate-900/90 text-amber-300 border border-amber-500/30 text-xs font-extrabold px-3 py-1 rounded-full shadow-md">
                ⚡ {tractor.horsePower || 50} HP
              </span>
            </div>

            {/* Top Right: Rating Pill */}
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md text-xs font-bold text-slate-800">
              <span className="text-amber-500 text-sm">★</span>
              <span>{tractor.rating || 4.8}</span>
              <span className="text-stone-400 font-normal">
                ({reviews.length || tractor.ratingCount || 1} {lang === 'hi' ? 'समीक्षाएं' : 'reviews'})
              </span>
            </div>

            {/* Bottom Overlay Title Info */}
            <div className="absolute bottom-4 left-4 right-4 text-white flex items-end justify-between">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-amber-400">
                  {tractor.category} · {tractor.year || 2023}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {tractor.brand} {tractor.model}
                </h1>
              </div>
              <div className="text-right">
                <div className="text-xl sm:text-2xl font-black text-amber-400">
                  {currency}
                  {rentalUnit === 'hour'
                    ? tractor.pricePerHour || 600
                    : rentalUnit === 'acre'
                    ? tractor.pricePerAcre || 1200
                    : tractor.pricePerDay || 1500}
                  <span className="text-xs text-stone-200 font-normal">
                    {' '}
                    /{rentalUnit === 'hour' ? t('perHour') : rentalUnit === 'acre' ? t('perAcre') : t('perDay')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Header Actions: WhatsApp & Location */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-stone-700">
              <span className="text-base">📍</span>
              <span>{lang === 'hi' ? 'उपकरण आधार स्थान:' : 'Machinery Base:'}</span>
              <span className="text-emerald-800 font-extrabold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                {tractor.location || 'Uttar Pradesh'}
              </span>
              {tractor.block && (
                <span className="text-[10px] font-bold text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md border border-stone-200">
                  Tehsil / Block: {tractor.block}
                </span>
              )}
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition"
            >
              <span>💬</span>
              <span>{t('chatWhatsApp')}</span>
            </a>
          </div>

          {/* Equipment Health & Field Inspection Specs Grid */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <span>🛡️</span>
                  <span>{lang === 'hi' ? 'मशीनरी स्वास्थ्य व निरीक्षण रिपोर्ट' : 'Machinery Health & Inspection Specs'}</span>
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  {lang === 'hi' ? 'सत्यापित तकनीकी रिपोर्ट ताकि खेत में कोई रुकावट न आए' : 'Certified diagnostics verified prior to dispatch'}
                </p>
              </div>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                ✓ Passed 25-Point Check
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80">
                <span className="text-stone-400 font-semibold block text-[10px] uppercase">PTO Power</span>
                <span className="font-extrabold text-slate-900 text-sm mt-0.5 block">
                  ⚡ {Math.max(30, Number(tractor.horsePower || 50) - 6)} PTO HP
                </span>
                <span className="text-[10px] text-stone-500">540 / 1000 RPM</span>
              </div>

              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80">
                <span className="text-stone-400 font-semibold block text-[10px] uppercase">Hydraulic Lift</span>
                <span className="font-extrabold text-slate-900 text-sm mt-0.5 block">
                  🏋️ 1,850 kg
                </span>
                <span className="text-[10px] text-stone-500">Cat-II 3-Point Hitch</span>
              </div>

              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80">
                <span className="text-stone-400 font-semibold block text-[10px] uppercase">Tyre Tread</span>
                <span className="font-extrabold text-slate-900 text-sm mt-0.5 block">
                  🚜 90% Deep Lug
                </span>
                <span className="text-[10px] text-emerald-700 font-medium">Optimal Grip in Wet Mud</span>
              </div>

              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80">
                <span className="text-stone-400 font-semibold block text-[10px] uppercase">Brakes & Fuel</span>
                <span className="font-extrabold text-slate-900 text-sm mt-0.5 block">
                  ⛽ 100% Diesel Tank
                </span>
                <span className="text-[10px] text-stone-500">Oil-Immersed Brakes</span>
              </div>
            </div>
          </div>

          {/* Interactive Implement Picker Cards */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <span>🌾</span>
                  <span>{t('farmingImplements')}</span>
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  {lang === 'hi'
                    ? 'ट्रैक्टर के साथ जोड़े जाने वाले कृषि उपकरण चुनें (दरें चुनी गई इकाई अनुसार अपडेट होंगी)'
                    : 'Select agricultural attachments to attach. Pricing dynamically scales with your rental unit.'}
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                {selectedImplements.length} {lang === 'hi' ? 'चुने गए' : 'Selected'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {implementsOptions.map((item) => {
                const isChecked = selectedImplements.some((imp) => imp.name === item.name)
                const currentItemPrice =
                  rentalUnit === 'hour'
                    ? item.pricePerHour || 150
                    : rentalUnit === 'acre'
                    ? item.pricePerAcre || 300
                    : item.pricePerDay || 400

                return (
                  <div
                    key={item.name}
                    onClick={() => handleToggleImplement(item)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between select-none ${
                      isChecked
                        ? 'bg-emerald-50/60 border-emerald-700 shadow-xs'
                        : 'bg-stone-50/50 border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{item.icon || '🌾'}</span>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{item.name}</h4>
                          <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">{item.spec}</p>
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold transition ${
                          isChecked
                            ? 'bg-emerald-700 text-white'
                            : 'border border-stone-300 bg-white text-transparent'
                        }`}
                      >
                        ✓
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-stone-200/60 flex items-center justify-between text-xs">
                      <span className="text-stone-400 font-medium">Additional Rate:</span>
                      <span className="font-extrabold text-emerald-800">
                        +{currency}
                        {currentItemPrice}/{rentalUnit === 'hour' ? t('perHour') : rentalUnit === 'acre' ? t('perAcre') : t('perDay')}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Operator / Driver Toggle */}
          <div className="p-5 bg-stone-50 rounded-3xl border border-stone-200 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-amber-100/80 text-amber-800 flex items-center justify-center text-xl">
                👨‍🌾
              </div>
              <div>
                <p className="text-sm font-extrabold text-slate-900">{t('includeDriver')}</p>
                <p className="text-xs text-stone-500 mt-0.5">{t('driverSubtitle')}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-extrabold text-emerald-800">
                +{currency}{driverRate}/{rentalUnit === 'hour' ? t('perHour') : rentalUnit === 'acre' ? t('perAcre') : t('perDay')}
              </span>
              <button
                type="button"
                onClick={() => setWithDriver(!withDriver)}
                className={`w-13 h-7 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                  withDriver ? 'bg-emerald-700' : 'bg-stone-300'
                }`}
              >
                <div
                  className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform ${
                    withDriver ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Machine Description */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs">
            <h3 className="text-base font-extrabold text-slate-900 mb-2">{lang === 'hi' ? 'विवरण' : 'Machine Overview'}</h3>
            <p className="text-stone-600 text-sm leading-relaxed">{tractor.description}</p>
          </div>

          {/* Farmer Reviews Section */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">{t('reviewsTitle')}</h3>
                <p className="text-xs text-stone-500 mt-0.5">Verified feedback from local farmers & agricultural contractors</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-800 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200">
                <span className="text-amber-500 text-sm">★</span>
                <span>{tractor.rating || 4.8} / 5.0</span>
              </div>
            </div>

            {reviews.length > 0 ? (
              <div className="space-y-3">
                {reviews.map((rev) => (
                  <div key={rev._id} className="p-4 rounded-2xl border border-stone-200/80 bg-stone-50/60">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-xs text-slate-900">{rev.user?.name || 'Verified Farmer'}</span>
                      <div className="flex text-amber-500 text-xs">
                        {Array(rev.rating || 5)
                          .fill(0)
                          .map((_, i) => (
                            <span key={i}>★</span>
                          ))}
                      </div>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-2xl border border-dashed border-stone-200 text-center text-xs text-stone-400">
                {t('noReviews')}
              </div>
            )}
          </div>
        </motion.div>

        {/* Right Column: Sticky Real-Time Cost Calculator & Reservation Card */}
        <div className="lg:col-span-5 xl:col-span-4">
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            onSubmit={handleOpenPayment}
            className="lg:sticky lg:top-24 rounded-3xl p-4 sm:p-6 space-y-4 bg-white border border-stone-200 shadow-xl"
          >
            {/* Top Pricing Display */}
            <div>
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-3xl font-extrabold text-slate-900">
                    {currency}
                    {rentalUnit === 'hour'
                      ? tractor.pricePerHour || 600
                      : rentalUnit === 'acre'
                      ? tractor.pricePerAcre || 1200
                      : tractor.pricePerDay || 1500}
                  </span>
                  <span className="text-xs text-stone-500 font-medium ml-1">
                    /{rentalUnit === 'hour' ? t('perHour') : rentalUnit === 'acre' ? t('perAcre') : t('perDay')}
                  </span>
                </div>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Instant Reserve
                </span>
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                Flexible billing by Day, Hour, or Acre with live calculation
              </p>
            </div>

            <hr className="border-stone-100" />

            {/* Pricing Mode Segmented Selector */}
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1.5">{t('rentalUnit')}</label>
              <div className="grid grid-cols-3 gap-1 bg-stone-100 p-1 rounded-2xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setRentalUnit('day')}
                  className={`py-2 rounded-xl transition cursor-pointer text-center ${
                    rentalUnit === 'day'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {t('unitDay')}
                </button>
                <button
                  type="button"
                  onClick={() => setRentalUnit('hour')}
                  className={`py-2 rounded-xl transition cursor-pointer text-center ${
                    rentalUnit === 'hour'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {t('unitHour')}
                </button>
                <button
                  type="button"
                  onClick={() => setRentalUnit('acre')}
                  className={`py-2 rounded-xl transition cursor-pointer text-center ${
                    rentalUnit === 'acre'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {t('unitAcre')}
                </button>
              </div>
            </div>

            {/* Field for Hours or Acres */}
            {rentalUnit !== 'day' && (
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-stone-700">
                  {rentalUnit === 'hour'
                    ? lang === 'hi'
                      ? 'आवश्यक कुल घंटे'
                      : 'Total Hours Required'
                    : lang === 'hi'
                    ? 'खेत का क्षेत्रफल (एकड़)'
                    : 'Field Area (Acres)'}
                </label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={unitCount}
                  onChange={(e) => setUnitCount(Math.max(1, Number(e.target.value)))}
                  className="border border-stone-200 px-3 py-2 rounded-xl text-sm font-semibold outline-none focus:border-emerald-600 text-slate-800 bg-stone-50"
                  required
                />
              </div>
            )}

            {/* Date Range Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="flex flex-col gap-1">
                <label htmlFor="Pickup-date" className="text-[11px] font-bold text-stone-600">
                  {t('pickupDate')}
                </label>
                <input
                  id="Pickup-date"
                  type="date"
                  value={pickupDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="border border-stone-200 px-3 py-2 rounded-xl text-xs font-semibold outline-none focus:border-emerald-600 text-slate-800 bg-stone-50"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="return-date" className="text-[11px] font-bold text-stone-600">
                  {t('returnDate')}
                </label>
                <input
                  id="return-date"
                  type="date"
                  value={returnDate}
                  min={pickupDate || new Date().toISOString().split('T')[0]}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="border border-stone-200 px-3 py-2 rounded-xl text-xs font-semibold outline-none focus:border-emerald-600 text-slate-800 bg-stone-50"
                  required
                />
              </div>
            </div>

            {/* Field Delivery Distance (km) */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-xs font-bold text-stone-700">
                <label>{t('deliveryDistance')}</label>
                <span className="text-stone-400 font-normal">+{currency}{transportRate}/km</span>
              </div>
              <input
                type="number"
                min="0"
                max="250"
                value={transportDistanceKm}
                onChange={(e) => setTransportDistanceKm(Math.max(0, Number(e.target.value)))}
                className="border border-stone-200 px-3 py-2 rounded-xl text-xs font-semibold outline-none focus:border-emerald-600 text-slate-800 bg-stone-50"
                placeholder="0 km (Self pickup / Near base)"
              />
              <p className="text-[10px] text-stone-400">
                Estimated distance from base ({getShortLocation(tractor)}) to your farmland
              </p>
            </div>

            {/* Transparent Live Cost Breakdown */}
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>
                  Base Machine ({activeCount} {rentalUnit}):
                </span>
                <span className="font-bold text-slate-900">{currency}{baseTractorTotal}</span>
              </div>

              {selectedImplements.length > 0 && (
                <div className="flex justify-between text-stone-600">
                  <span>Implements ({selectedImplements.length}):</span>
                  <span className="font-bold text-emerald-800">+{currency}{implementsTotal}</span>
                </div>
              )}

              {withDriver && (
                <div className="flex justify-between text-stone-600">
                  <span>Operator Service:</span>
                  <span className="font-bold text-slate-900">+{currency}{driverTotal}</span>
                </div>
              )}

              {transportPrice > 0 && (
                <div className="flex justify-between text-stone-600">
                  <span>Field Delivery ({transportDistanceKm} km):</span>
                  <span className="font-bold text-slate-900">+{currency}{transportPrice}</span>
                </div>
              )}

              <hr className="border-stone-200/80 my-1" />

              <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-1">
                <span>{t('estimatedTotal')}:</span>
                <span className="text-emerald-800 text-base">{currency}{grandTotal}</span>
              </div>

              {/* 20% Advance Online Highlight */}
              <div className="mt-2 p-2.5 rounded-xl bg-emerald-100/70 border border-emerald-300 text-emerald-950 flex items-center justify-between text-xs font-bold">
                <span>Pay 20% Advance Now:</span>
                <span className="text-sm font-black">{currency}{advanceAmount}</span>
              </div>
            </div>

            {/* Main Submit CTA */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-700 hover:bg-emerald-800 transition py-3.5 font-extrabold text-white rounded-2xl cursor-pointer shadow-md shadow-emerald-700/20 text-sm disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span>{isSubmitting ? 'Processing...' : t('reserveNow')}</span>
              <span>→</span>
            </motion.button>

            <p className="text-center text-[11px] text-stone-400">
              🔒 100% Secure reservation · Balance paid on field delivery
            </p>
          </motion.form>
        </div>
      </div>

      {/* Payment Gateway Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onConfirmPayment={handleConfirmReservation}
        currency={currency}
        isSubmitting={isSubmitting}
        bookingDetails={{
          totalPrice: grandTotal,
          baseTractorTotal,
          implementsTotal,
          driverTotal,
          transportPrice,
          transportDistanceKm,
          rentalUnit,
          unitsBooked: activeCount,
        }}
      />
    </div>
  ) : (
    <Loader />
  )
}

export default TractorDetails
