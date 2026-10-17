import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { assets } from "../assets/assets"
import Loader from "../Components/Loader"
import { useAppContext } from "../context/AppContext"
import { useLanguage } from "../context/LanguageContext"
import PaymentModal from "../Components/PaymentModal"
import toast from "react-hot-toast"
import { motion } from 'motion/react'

const defaultImplementsList = [
  { name: "Rotavator (42-blades)", pricePerDay: 500, pricePerHour: 150, pricePerAcre: 300 },
  { name: "Cultivator / Harrow (9-tyne)", pricePerDay: 300, pricePerHour: 100, pricePerAcre: 200 },
  { name: "MB Reversible Plough", pricePerDay: 400, pricePerHour: 120, pricePerAcre: 250 },
  { name: "Heavy Duty Tipping Trolley", pricePerDay: 600, pricePerHour: 180, pricePerAcre: 350 }
];

const TractorDetails = () => {
  const { id } = useParams()
  const { tractors, currency, axios, pickupDate, setPickupDate, returnDate, setReturnDate, user, setShowLogin } = useAppContext()
  const { t } = useLanguage()

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
      axios.get(`/api/user/reviews/${id}`)
        .then(({ data }) => {
          if (data.success) {
            setReviews(data.reviews || [])
          }
        })
        .catch(() => {})
    }
  }, [id, axios])

  const implementsOptions = tractor?.implementsAvailable && tractor.implementsAvailable.length > 0
    ? tractor.implementsAvailable
    : defaultImplementsList;

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

  // Calculate rental duration
  const calculateDays = () => {
    if (!pickupDate || !returnDate) return 1
    const start = new Date(pickupDate)
    const end = new Date(returnDate)
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
    return diff > 0 ? diff : 1
  }

  const days = calculateDays()
  const activeCount = rentalUnit === 'day' ? Math.max(days, unitCount) : Math.max(1, unitCount)

  // Rate calculations
  const pricing = rentalUnit === 'hour' ? (() => {
    const rate = Number(tractor?.pricePerHour || 600)
    return {
      baseTractorTotal: activeCount * rate,
      implementsTotal: activeCount * selectedImplements.reduce((sum, item) => sum + Number(item.pricePerHour || 150), 0),
      driverTotal: withDriver ? activeCount * Number(tractor?.driverHourlyRate || 100) : 0
    }
  })() : rentalUnit === 'acre' ? (() => {
    const rate = Number(tractor?.pricePerAcre || 1200)
    return {
      baseTractorTotal: activeCount * rate,
      implementsTotal: activeCount * selectedImplements.reduce((sum, item) => sum + Number(item.pricePerAcre || 300), 0),
      driverTotal: withDriver ? activeCount * 250 : 0
    }
  })() : (() => {
    const rate = Number(tractor?.pricePerDay || 1500)
    return {
      baseTractorTotal: activeCount * rate,
      implementsTotal: activeCount * selectedImplements.reduce((sum, item) => sum + Number(item.pricePerDay || 0), 0),
      driverTotal: withDriver ? activeCount * Number(tractor?.driverDailyRate || 500) : 0
    }
  })()
  const { baseTractorTotal, implementsTotal, driverTotal } = pricing

  const transportRate = Number(tractor?.transportRatePerKm || 40)
  const transportPrice = Math.max(0, Number(transportDistanceKm || 0)) * transportRate
  const grandTotal = baseTractorTotal + implementsTotal + driverTotal + transportPrice
  const driverRate = rentalUnit === 'hour'
    ? Number(tractor?.driverHourlyRate || 100)
    : rentalUnit === 'acre'
      ? 250
      : Number(tractor?.driverDailyRate || 500)

  const handleOpenPayment = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to book a tractor');
      setShowLogin(true);
      return;
    }

    if (!pickupDate || !returnDate) {
      toast.error('Please select both pickup and return dates');
      return;
    }
    if (new Date(returnDate) < new Date(pickupDate)) {
      toast.error('Return date cannot be earlier than pickup date');
      return;
    }

    setShowPaymentModal(true);
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
        ...paymentDetails
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

  const ownerPhone = "919876543210"
  const whatsappUrl = `https://wa.me/${ownerPhone}?text=${encodeURIComponent(
    `Hello! I am interested in renting the ${tractor?.brand} ${tractor?.model} (${tractor?.location}) listed on TractorHub.`
  )}`

  return tractor ? (
    <div className="px-6 md:px-24 xl:px-32 mt-12 mb-20 max-w-7xl mx-auto">
      <button className="flex items-center gap-2 mb-6 text-gray-500 hover:text-gray-800 transition cursor-pointer" onClick={() => navigate(-1)}>
        <img src={assets.Arrow_icon} alt="" className="rotate-180 opacity-65 w-4 h-4"/>
        Back to all tractors
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Left : Tractor Image & Details */}
        <motion.div 
          initial={{opacity: 0, scale: 0.98}}
          animate={{opacity: 1, scale: 1}}
          transition={{duration: 0.6}}
          className="lg:col-span-2 space-y-6"
        >
          <div className="relative">
            <motion.img 
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              transition={{duration: 0.6, delay: 0.2}}
              src={tractor.image}
              alt={`${tractor.brand} ${tractor.model}`}
              className="w-full h-80 md:h-105 object-cover rounded-2xl shadow-md bg-gray-100"
              onError={(e) => { e.target.src = assets.Ace || assets.download1 }}
            />
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm text-xs font-semibold text-gray-800">
              <span className="text-orange-500 text-sm">★</span>
              <span>{tractor.rating || 4.8}</span>
              <span className="text-gray-400 font-normal">({reviews.length || tractor.ratingCount || 1} reviews)</span>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{tractor.brand} {tractor.model}</h1>
                <p className="text-gray-500 text-base mt-0.5">{tractor.category} • {tractor.year}</p>
              </div>

              {/* Direct WhatsApp Contact Button */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg shadow-sm transition w-fit"
              >
                <span>💬 Chat on WhatsApp</span>
              </a>
            </div>

            <hr className="border-gray-200"/>

            {/* Spec Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { icon: assets.Gear, label: "Engine Power", text: `⚡ ${tractor.horsePower || 50} HP` },
                { icon: assets.user, label: "Operator Seat", text: `${tractor.seatingCapacity || 1} Seat` },
                { icon: assets.fuelIcon, label: "Fuel Type", text: tractor.fuelType },
                { icon: assets.Gear, label: "Transmission", text: tractor.transmission },
                { icon: assets.Location_icon, label: "Location", text: tractor.location }
              ].map(({ icon, label, text }) => (
                <div key={label} className="flex flex-col bg-gray-50 border border-gray-100 p-3 rounded-xl">
                  <div className="flex items-center gap-1.5 mb-1">
                    <img src={icon} alt="" className="h-3.5 w-3.5 opacity-70"/>
                    <span className="text-[11px] text-gray-400 font-medium">{label}</span>
                  </div>
                  <span className="text-xs font-bold text-gray-800 truncate">{text}</span>
                </div>
              ))}
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Description</h2>
              <p className="text-gray-600 leading-relaxed text-sm">{tractor.description}</p>
            </div>

            {/* Agricultural Implements Available to Add */}
            <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Available Farming Implements</h2>
              <p className="text-xs text-gray-500 mb-4">Select agricultural attachments you need with this tractor</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {implementsOptions.map((item) => {
                  const isChecked = selectedImplements.some((imp) => imp.name === item.name)
                  return (
                    <div
                      key={item.name}
                      onClick={() => handleToggleImplement(item)}
                      className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition select-none ${
                        isChecked
                          ? "bg-white border-primary shadow-xs ring-1 ring-primary/30"
                          : "bg-white/80 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleToggleImplement(item);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="h-4 w-4 text-primary rounded cursor-pointer"
                        />
                        <span className="text-xs font-medium text-gray-800">{item.name}</span>
                      </div>
                      <span className="text-xs font-bold text-primary">+{currency}{item.pricePerDay}/day</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Operator / Driver Option */}
            <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl">
              <div>
                <p className="text-sm font-semibold text-gray-900">Include Experienced Driver / Operator</p>
                <p className="text-xs text-gray-500 mt-0.5">Experienced local operator to manage field operations</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-700">
                  +{currency}{driverRate}/{rentalUnit}
                </span>
                <button
                  type="button"
                  onClick={() => setWithDriver(!withDriver)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                    withDriver ? "bg-primary" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      withDriver ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Agricultural Specifications */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Standard Machine Specs</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  "4WD Heavy-Duty Drive Option",
                  "Dual Clutch & Smooth Power Steering",
                  "High Hydraulic Lift Capacity (up to 2000 kg)",
                  "Multi-Speed PTO (540 / 1000 RPM)",
                  "Implements Compatible (Rotavator, Cultivator, Trolley)",
                  "Oil-Immersed Multi-Disc Brakes"
                ].map((item) => (
                  <li key={item} className="flex items-center text-gray-600 text-xs">
                    <img src={assets.Check} alt="Check" className="h-3.5 mr-2 opacity-80"/>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Reviews Section */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Farmer & Contractor Reviews</h2>
                <div className="flex items-center gap-1 text-sm font-semibold text-gray-800">
                  <span className="text-orange-500">★</span>
                  <span>{tractor.rating || 4.8} / 5.0</span>
                </div>
              </div>

              {reviews.length > 0 ? (
                <div className="space-y-3">
                  {reviews.map((rev) => (
                    <div key={rev._id} className="p-4 rounded-xl border border-gray-100 bg-gray-50/70">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-semibold text-sm text-gray-800">{rev.user?.name || "Verified Farmer"}</span>
                        <div className="flex text-orange-500 text-xs">
                          {Array(rev.rating || 5).fill(0).map((_, i) => (
                            <span key={i}>★</span>
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-gray-600">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-dashed border-gray-200 text-center text-xs text-gray-400">
                  No verified reviews yet. Rent this tractor to be the first to leave feedback!
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Right : Booking Form & Summary */}
        <motion.form 
          initial={{opacity: 0, y: 30}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.6, delay: 0.3}}
          onSubmit={handleOpenPayment}
          className="shadow-xl h-max sticky top-20 rounded-2xl p-6 space-y-4 text-gray-600 border border-gray-100 bg-white"
        >
          <div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl text-gray-900 font-bold">
                {currency}
                {rentalUnit === 'hour'
                  ? (tractor.pricePerHour || 600)
                  : rentalUnit === 'acre'
                  ? (tractor.pricePerAcre || 1200)
                  : tractor.pricePerDay}
              </span>
              <span className="text-xs text-gray-400 font-normal">
                Base / {rentalUnit === 'hour' ? t('perHour') : rentalUnit === 'acre' ? t('perAcre') : t('perDay')}
              </span>
            </div>
            <p className="text-xs text-emerald-600 font-medium mt-1">✓ Instant Confirmation • Online Advance or Pay on Delivery</p>
          </div>

          <hr className="border-gray-200"/>

          {/* Pricing Unit Selector Tabs */}
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1.5">{t('rentalUnit')}</label>
            <div className="grid grid-cols-3 gap-1 bg-gray-100 p-1 rounded-xl text-xs font-medium">
              <button
                type="button"
                onClick={() => setRentalUnit('day')}
                className={`py-1.5 rounded-lg transition cursor-pointer text-center ${
                  rentalUnit === 'day' ? 'bg-white text-primary font-bold shadow-xs' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {t('unitDay')}
              </button>
              <button
                type="button"
                onClick={() => setRentalUnit('hour')}
                className={`py-1.5 rounded-lg transition cursor-pointer text-center ${
                  rentalUnit === 'hour' ? 'bg-white text-primary font-bold shadow-xs' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {t('unitHour')}
              </button>
              <button
                type="button"
                onClick={() => setRentalUnit('acre')}
                className={`py-1.5 rounded-lg transition cursor-pointer text-center ${
                  rentalUnit === 'acre' ? 'bg-white text-primary font-bold shadow-xs' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {t('unitAcre')}
              </button>
            </div>
          </div>

          {/* Units Count (for Hours or Acres) */}
          {rentalUnit !== 'day' && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-700">
                {rentalUnit === 'hour' ? 'Total Hours Required' : 'Field Area (Acres)'}
              </label>
              <input
                type="number"
                min="1"
                max="500"
                value={unitCount}
                onChange={(e) => setUnitCount(Math.max(1, Number(e.target.value)))}
                className="border border-gray-300 px-3 py-2 rounded-lg text-sm outline-none focus:border-primary text-gray-800"
                required
              />
            </div>
          )}

          {/* Dates */}
          <div className="space-y-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="Pickup-date" className="text-xs font-semibold text-gray-700">{t('pickupDate')}</label>
              <input
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                type="date"
                className="border border-gray-300 px-3 py-2 rounded-lg text-sm outline-none focus:border-primary text-gray-800"
                required
                id="Pickup-date"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="return-date" className="text-xs font-semibold text-gray-700">{t('returnDate')}</label>
              <input
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                type="date"
                className="border border-gray-300 px-3 py-2 rounded-lg text-sm outline-none focus:border-primary text-gray-800"
                required
                id="return-date"
                min={pickupDate || new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          {/* Delivery Field Distance in KM */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-xs font-semibold text-gray-700">
              <label>{t('deliveryDistance')}</label>
              <span className="text-gray-400 font-normal">+{currency}{transportRate}/km</span>
            </div>
            <input
              type="number"
              min="0"
              max="200"
              value={transportDistanceKm}
              onChange={(e) => setTransportDistanceKm(Math.max(0, Number(e.target.value)))}
              className="border border-gray-300 px-3 py-2 rounded-lg text-sm outline-none focus:border-primary text-gray-800"
              placeholder="e.g. 5 km"
            />
          </div>

          {/* Price Breakdown */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-2 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>
                Tractor ({activeCount} {rentalUnit}{activeCount > 1 ? 's' : ''}):
              </span>
              <span className="font-medium text-gray-800">{currency}{baseTractorTotal}</span>
            </div>

            {selectedImplements.length > 0 && (
              <div className="flex justify-between text-gray-600">
                <span>Implements ({selectedImplements.length}):</span>
                <span className="font-medium text-gray-800">+{currency}{implementsTotal}</span>
              </div>
            )}

            {withDriver && (
              <div className="flex justify-between text-gray-600">
                <span>Driver Service ({activeCount} {rentalUnit}):</span>
                <span className="font-medium text-gray-800">+{currency}{driverTotal}</span>
              </div>
            )}

            {transportPrice > 0 && (
              <div className="flex justify-between text-gray-600">
                <span>Field Transport ({transportDistanceKm} km):</span>
                <span className="font-medium text-gray-800">+{currency}{transportPrice}</span>
              </div>
            )}

            <hr className="border-gray-200 my-1"/>

            <div className="flex justify-between text-sm font-bold text-gray-900 pt-1">
              <span>{t('estimatedTotal')}:</span>
              <span className="text-primary">{currency}{grandTotal}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-blue-700 transition py-3 font-semibold text-white rounded-xl cursor-pointer shadow-md text-sm disabled:opacity-50"
          >
            {isSubmitting ? "Processing..." : t('reserveNow')}
          </button>

          <p className="text-center text-[11px] text-gray-400">
            Pay 20% online advance or pay full upon delivery on your field
          </p>
        </motion.form>
      </div>

      {/* Interactive Payment Gateway Modal */}
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
          unitsBooked: activeCount
        }}
      />
    </div>
  ) : <Loader/>
}

export default TractorDetails
