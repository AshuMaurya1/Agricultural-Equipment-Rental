import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import Title from "../Components/Title";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import { useLanguage } from "../context/LanguageContext";
import { motion } from 'motion/react';
import { generateBookingInvoice } from "../utils/invoiceGenerator";

const formatDate = (date) => date ? new Date(date).toLocaleDateString() : "-";

const MyBooking = () => {
  const { axios, currency, user } = useAppContext();
  const { lang, t } = useLanguage();

  const [bookings, setBookings] = useState([]);
  const [reviewModalBooking, setReviewModalBooking] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const fetchMyBooking = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/booking/user');
      if (data.success) {
        setBookings(data.bookings);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  }, [axios]);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      const { data } = await axios.post('/api/booking/change-status', {
        bookingId,
        status: 'cancelled',
      });
      if (data.success) {
        toast.success("Booking cancelled successfully");
        fetchMyBooking();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewModalBooking) return;

    try {
      setIsSubmittingReview(true);
      const { data } = await axios.post('/api/user/review', {
        tractorId: reviewModalBooking.tractor?._id,
        bookingId: reviewModalBooking._id,
        rating,
        comment,
      });

      if (data.success) {
        toast.success("Thank you for your rating & review!");
        setReviewModalBooking(null);
        setComment("");
        setRating(5);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  useEffect(() => {
    if (user) fetchMyBooking();
    else setBookings([]);
  }, [user, fetchMyBooking]);

  const getUnitLabel = (unit, count) => {
    if (unit === 'hour') return `${count || 1} ${lang === 'hi' ? 'घंटे' : 'Hour(s)'}`;
    if (unit === 'acre') return `${count || 1} ${lang === 'hi' ? 'एकड़' : 'Acre(s)'}`;
    return `${count || 1} ${lang === 'hi' ? 'दिन' : 'Day(s)'}`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="px-3 sm:px-6 md:px-12 lg:px-20 mt-6 sm:mt-12 mb-20 text-sm max-w-7xl mx-auto"
    >
      <Title 
        title={t('myBookings')} 
        subtitle={lang === 'hi' ? "अपनी सभी ट्रैक्टर बुकिंग देखें, ऑपरेटर विवरण जांचें, और रसीद डाउनलोड करें" : "View and manage all your tractor bookings, check assigned operators, and download official receipts"} 
        align="left" 
      />

      <div className="space-y-6 mt-8">
        {bookings.map((booking, index) => {
          const isAdvance = booking.paymentStatus === 'advance_paid';
          const isFullyPaid = booking.paymentStatus === 'fully_paid';
          const advanceAmt = booking.advanceAmount || Math.round(booking.price * 0.2);
          const remainingDue = Math.max(0, booking.price - advanceAmt);

          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.4 }}
              key={booking._id}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6 p-4 sm:p-6 border border-stone-200 rounded-3xl bg-white shadow-xs hover:shadow-md transition-shadow"
            >
              {/* Image & Machine Quick Specs */}
              <div className="flex flex-col space-y-2">
                <div className="rounded-xl overflow-hidden bg-gray-100 h-40 border border-gray-100">
                  <img
                    src={booking.tractor?.image || assets.download1}
                    alt={`${booking.tractor?.brand || "Tractor"} ${booking.tractor?.model || ""}`}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = assets.Ace || assets.download1; }}
                  />
                </div>
                {booking.tractor?.horsePower && (
                  <span className="text-center font-bold text-xs bg-primary/10 text-primary py-1 rounded-lg">
                    ⚡ {booking.tractor.horsePower} HP Power
                  </span>
                )}
              </div>

              {/* Booking & Operator Info */}
              <div className="md:col-span-2 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-bold text-gray-900">
                      {booking.tractor?.brand} {booking.tractor?.model}
                    </h3>
                    <span className="bg-blue-100 text-blue-800 text-[11px] font-semibold px-2 py-0.5 rounded-full border border-blue-200">
                      {getUnitLabel(booking.rentalUnit, booking.unitsBooked)}
                    </span>
                    {booking.withDriver && (
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                        {lang === 'hi' ? 'ड्राइवर सहित' : 'With Driver'}
                      </span>
                    )}
                  </div>

                  <p className="text-gray-400 text-xs mt-0.5">
                    {t('bookingID')}: <span className="font-mono text-gray-600 font-semibold">{booking._id}</span>
                  </p>
                  
                  <p className="text-gray-700 font-medium text-xs mt-1.5">
                    📅 {t('rentalPeriod')}: <span className="font-semibold">{formatDate(booking.startDate)}</span> to <span className="font-semibold">{formatDate(booking.endDate)}</span>
                  </p>

                  {booking.tractor?.location && (
                    <p className="text-gray-500 text-xs mt-0.5">📍 {t('location')}: {booking.tractor.location}</p>
                  )}

                  {/* Delivery Distance */}
                  {booking.transportDistanceKm > 0 && (
                    <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-2 py-1 mt-1.5 inline-block">
                      🚚 Field Delivery: {booking.transportDistanceKm} km (+{currency}{booking.transportPrice})
                    </p>
                  )}

                  {/* Selected Implements */}
                  {booking.selectedImplements && booking.selectedImplements.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {booking.selectedImplements.map((imp, idx) => (
                        <span key={idx} className="bg-gray-100 text-gray-700 text-[11px] px-2 py-0.5 rounded-md border border-gray-200">
                          + {imp.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Operator / Driver Status Card */}
                  {booking.operatorAssigned?.name ? (
                    <div className="mt-3 bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <p className="text-xs font-bold text-emerald-900">
                          👨‍🌾 Assigned Driver: {booking.operatorAssigned.name}
                        </p>
                        <p className="text-xs text-emerald-700">
                          📞 Phone: {booking.operatorAssigned.phone || "On file"}
                        </p>
                      </div>
                      {booking.operatorAssigned.phone && (
                        <div className="flex gap-2">
                          <a
                            href={`tel:${booking.operatorAssigned.phone}`}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-2.5 py-1 rounded-lg font-medium transition cursor-pointer"
                          >
                            Call
                          </a>
                          <a
                            href={`https://wa.me/91${booking.operatorAssigned.phone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(booking.operatorAssigned.name)},%20I%20am%20calling%20regarding%20Tractor%20Booking%20${booking._id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-green-500 hover:bg-green-600 text-white text-xs px-2.5 py-1 rounded-lg font-medium transition cursor-pointer"
                          >
                            WhatsApp
                          </a>
                        </div>
                      )}
                    </div>
                  ) : booking.withDriver ? (
                    <div className="mt-2.5 bg-amber-50 border border-amber-200 rounded-lg p-2 text-xs text-amber-800">
                      🚜 Operator requested. Equipment owner will assign certified driver prior to delivery.
                    </div>
                  ) : null}
                </div>

                {/* Action Buttons: Invoice & Review */}
                <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => generateBookingInvoice(booking, currency)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold transition cursor-pointer"
                    title="Download Official Tax Invoice PDF"
                  >
                    <span>📄 {t('downloadInvoice')}</span>
                  </button>

                  {booking.status === "confirmed" && (
                    <button
                      onClick={() => setReviewModalBooking(booking)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg text-xs font-semibold transition cursor-pointer border border-amber-200"
                    >
                      <span>⭐ {t('rateTractor')}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Financials & Status */}
              <div className="md:text-right flex flex-col justify-between items-start md:items-end">
                <div>
                  <p className="text-xs text-gray-400 font-medium">{t('grandTotal')}</p>
                  <p className="font-extrabold text-2xl text-gray-900">{currency}{booking.price}</p>
                  
                  {/* Payment Token & Settlement status */}
                  <div className="mt-2 text-xs md:text-right">
                    {isAdvance ? (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 text-left md:text-right">
                        <p className="font-bold text-amber-800">
                          ✓ Advance Paid: {currency}{advanceAmt}
                        </p>
                        <p className="text-gray-600 font-medium text-[11px] mt-0.5">
                          Remaining Due on Field: <span className="font-bold text-red-600">{currency}{remainingDue}</span>
                        </p>
                      </div>
                    ) : isFullyPaid ? (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2 text-left md:text-right">
                        <p className="font-bold text-emerald-800">✓ Fully Paid Online</p>
                        {booking.transactionId && (
                          <p className="text-[10px] text-gray-400 font-mono">Txn: {booking.transactionId}</p>
                        )}
                      </div>
                    ) : (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-left md:text-right">
                        <p className="font-medium text-gray-700">💵 Pay on Field Delivery</p>
                        <p className="text-[10px] text-gray-400">Total {currency}{booking.price} upon arrival</p>
                      </div>
                    )}
                  </div>

                  <span className={`mt-3 inline-block px-3 py-1 rounded-full text-xs font-bold capitalize ${
                    booking.status === "confirmed"
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      : booking.status === "cancelled"
                      ? "bg-red-100 text-red-700 border border-red-200"
                      : "bg-blue-100 text-blue-700 border border-blue-200"
                  }`}>
                    {booking.status}
                  </span>
                </div>

                {booking.status === "pending" && (
                  <button
                    onClick={() => handleCancelBooking(booking._id)}
                    className="mt-4 text-xs text-red-600 hover:text-red-700 border border-red-200 hover:bg-red-50 px-3 py-1.5 rounded-lg transition cursor-pointer font-medium"
                  >
                    {t('cancelBooking')}
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {bookings.length === 0 && (
        <div className="mt-16 text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <p className="text-gray-500 font-medium text-base">{t('noBookings')}</p>
          <Link to="/tractor" className="inline-block mt-4 px-6 py-2.5 bg-primary text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition shadow-xs">
            {t('exploreAll')}
          </Link>
        </div>
      )}

      {/* Star Rating & Review Modal */}
      {reviewModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 text-gray-700 relative animate-fadeIn">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="text-base font-bold text-gray-900">
                Rate {reviewModalBooking.tractor?.brand} {reviewModalBooking.tractor?.model}
              </h3>
              <button
                onClick={() => setReviewModalBooking(null)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Overall Star Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="text-2xl cursor-pointer transition-transform hover:scale-125 focus:outline-none"
                    >
                      <span className={rating >= star ? "text-amber-400" : "text-gray-200"}>★</span>
                    </button>
                  ))}
                  <span className="text-xs font-bold text-gray-600 ml-2">{rating} / 5 Stars</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Your Experience / Feedback</label>
                <textarea
                  rows="4"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share details about tractor performance, fuel efficiency, implement compatibility, and owner delivery..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs outline-none focus:border-primary"
                  required
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setReviewModalBooking(null)}
                  className="px-4 py-2 border rounded-lg text-xs text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="px-5 py-2 bg-primary hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingReview ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default MyBooking;
