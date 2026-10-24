import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const upiApps = [
  { id: 'phonepe', name: 'PhonePe', icon: '🟣', handle: '@ybl' },
  { id: 'gpay', name: 'Google Pay', icon: '🔵', handle: '@okhdfcbank' },
  { id: 'paytm', name: 'Paytm', icon: '💠', handle: '@paytm' },
  { id: 'bhim', name: 'BHIM UPI', icon: '🇮🇳', handle: '@upi' },
];

const PaymentModal = ({
  isOpen,
  onClose,
  onConfirmPayment,
  bookingDetails,
  currency = '₹',
  isSubmitting = false,
}) => {
  const { lang } = useLanguage();
  const [paymentChoice, setPaymentChoice] = useState('online_advance'); // 'online_advance' | 'full_online' | 'pay_on_delivery'
  const [paymentTab, setPaymentTab] = useState('upi'); // 'upi' | 'card'
  const [selectedUpiApp, setSelectedUpiApp] = useState('phonepe');
  const [sendWhatsAppUpdates, setSendWhatsAppUpdates] = useState(true);

  // Form states
  const [upiId, setUpiId] = useState('kisan.farmer@ybl');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('889');

  if (!isOpen || !bookingDetails) return null;

  const {
    totalPrice = 0,
    baseTractorTotal = 0,
    implementsTotal = 0,
    driverTotal = 0,
    transportPrice = 0,
    transportDistanceKm = 0,
    rentalUnit = 'day',
    unitsBooked = 1,
  } = bookingDetails;

  const advanceAmount = Math.round(totalPrice * 0.2);
  const remainingDue = totalPrice - advanceAmount;

  const amountToPayNow =
    paymentChoice === 'online_advance'
      ? advanceAmount
      : paymentChoice === 'full_online'
      ? totalPrice
      : 0;

  const handleSelectApp = (app) => {
    setSelectedUpiApp(app.id);
    setUpiId(`9876543210${app.handle}`);
  };

  const handlePay = () => {
    const txnId = `TXN${Date.now()}`;
    onConfirmPayment({
      paymentMethod: paymentChoice,
      paymentStatus:
        paymentChoice === 'online_advance'
          ? 'advance_paid'
          : paymentChoice === 'full_online'
          ? 'fully_paid'
          : 'pending',
      advanceAmount: amountToPayNow,
      transactionId: paymentChoice !== 'pay_on_delivery' ? txnId : '',
      sendWhatsAppUpdates,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 text-slate-800 relative animate-fadeIn border border-stone-200 my-8">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b border-stone-100 pb-4 mb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              🔒 100% Guaranteed Reservation
            </span>
            <h3 className="text-lg font-extrabold text-slate-900 mt-1">
              {lang === 'hi' ? 'ट्रैक्टर बुकिंग व सुरक्षित भुगतान' : 'Confirm Agricultural Booking'}
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              {lang === 'hi'
                ? '20% अग्रिम देकर बुकिंग सुरक्षित करें, शेष राशि डिलीवरी पर दें'
                : 'Lock in your machine dates with 20% advance; pay balance upon field delivery'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 text-2xl font-bold cursor-pointer p-1"
          >
            &times;
          </button>
        </div>

        {/* Cost Summary Box */}
        <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs space-y-1.5 mb-5">
          <div className="flex justify-between text-stone-600">
            <span>
              Tractor Rent ({unitsBooked} {rentalUnit}{unitsBooked > 1 ? 's' : ''}):
            </span>
            <span className="font-bold text-slate-900">{currency}{baseTractorTotal}</span>
          </div>
          {implementsTotal > 0 && (
            <div className="flex justify-between text-stone-600">
              <span>Attached Implements:</span>
              <span className="font-bold text-emerald-800">+{currency}{implementsTotal}</span>
            </div>
          )}
          {driverTotal > 0 && (
            <div className="flex justify-between text-stone-600">
              <span>Operator Service:</span>
              <span className="font-bold text-slate-900">+{currency}{driverTotal}</span>
            </div>
          )}
          {transportPrice > 0 && (
            <div className="flex justify-between text-stone-600">
              <span>Field Transport ({transportDistanceKm} km):</span>
              <span className="font-bold text-slate-900">+{currency}{transportPrice}</span>
            </div>
          )}
          <hr className="border-stone-200/80 my-1.5" />
          <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-0.5">
            <span>{lang === 'hi' ? 'कुल राशि:' : 'Grand Total:'}</span>
            <span className="text-emerald-800 text-base">{currency}{totalPrice}</span>
          </div>
        </div>

        {/* Payment Choice Selection */}
        <div className="space-y-2 mb-5">
          <label className="text-xs font-bold text-stone-700 block">
            {lang === 'hi' ? 'भुगतान विकल्प चुनें:' : 'Select Payment Option:'}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            {/* Option 1: 20% Advance (Recommended) */}
            <button
              type="button"
              onClick={() => setPaymentChoice('online_advance')}
              className={`p-3 rounded-2xl border-2 text-left transition cursor-pointer flex flex-col justify-between ${
                paymentChoice === 'online_advance'
                  ? 'border-emerald-700 bg-emerald-50/70 shadow-xs'
                  : 'border-stone-200 hover:border-stone-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="font-extrabold text-slate-900">20% Advance</span>
                <span className="text-[9px] font-black bg-emerald-700 text-white px-1.5 py-0.5 rounded">POPULAR</span>
              </div>
              <span className="text-emerald-800 font-extrabold text-base">{currency}{advanceAmount}</span>
              <span className="text-[10px] text-stone-500 mt-1">
                Due on field: {currency}{remainingDue}
              </span>
            </button>

            {/* Option 2: Full Online */}
            <button
              type="button"
              onClick={() => setPaymentChoice('full_online')}
              className={`p-3 rounded-2xl border-2 text-left transition cursor-pointer flex flex-col justify-between ${
                paymentChoice === 'full_online'
                  ? 'border-emerald-700 bg-emerald-50/70 shadow-xs'
                  : 'border-stone-200 hover:border-stone-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="font-bold text-slate-900">Full 100%</span>
                <span className="text-[9px] bg-stone-100 text-stone-600 px-1 rounded">Paid</span>
              </div>
              <span className="text-slate-900 font-extrabold text-base">{currency}{totalPrice}</span>
              <span className="text-[10px] text-stone-500 mt-1">Zero balance on field</span>
            </button>

            {/* Option 3: Pay on Delivery */}
            <button
              type="button"
              onClick={() => setPaymentChoice('pay_on_delivery')}
              className={`p-3 rounded-2xl border-2 text-left transition cursor-pointer flex flex-col justify-between ${
                paymentChoice === 'pay_on_delivery'
                  ? 'border-emerald-700 bg-emerald-50/70 shadow-xs'
                  : 'border-stone-200 hover:border-stone-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="font-bold text-slate-900">Pay on Field</span>
                <span className="text-[9px] text-amber-700 font-bold bg-amber-50 px-1 rounded">COD</span>
              </div>
              <span className="text-slate-900 font-extrabold text-base">{currency}0 Now</span>
              <span className="text-[10px] text-stone-500 mt-1">Pay driver at gate</span>
            </button>
          </div>
        </div>

        {/* Online Payment Method Tabs & Apps (UPI / Cards) */}
        {paymentChoice !== 'pay_on_delivery' && (
          <div className="border border-stone-200 rounded-2xl p-4 bg-stone-50/60 mb-5 space-y-3.5">
            <div className="flex border-b border-stone-200 pb-2 gap-4 text-xs font-bold">
              <button
                type="button"
                onClick={() => setPaymentTab('upi')}
                className={`pb-1 cursor-pointer transition flex items-center gap-1.5 ${
                  paymentTab === 'upi'
                    ? 'text-emerald-800 border-b-2 border-emerald-700 font-extrabold'
                    : 'text-stone-400 hover:text-stone-600'
                }`}
              >
                <span>📱</span>
                <span>UPI / QR Apps (GPay, PhonePe, Paytm)</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentTab('card')}
                className={`pb-1 cursor-pointer transition flex items-center gap-1.5 ${
                  paymentTab === 'card'
                    ? 'text-emerald-800 border-b-2 border-emerald-700 font-extrabold'
                    : 'text-stone-400 hover:text-stone-600'
                }`}
              >
                <span>💳</span>
                <span>RuPay / Debit Card</span>
              </button>
            </div>

            {paymentTab === 'upi' ? (
              <div className="space-y-3 pt-1">
                {/* One-Click UPI App Shortcuts */}
                <div className="grid grid-cols-4 gap-2">
                  {upiApps.map((app) => (
                    <button
                      key={app.id}
                      type="button"
                      onClick={() => handleSelectApp(app)}
                      className={`p-2 rounded-xl border text-center transition cursor-pointer flex flex-col items-center gap-1 ${
                        selectedUpiApp === app.id
                          ? 'bg-emerald-50 border-emerald-700 shadow-2xs font-extrabold text-emerald-900'
                          : 'bg-white border-stone-200 hover:border-stone-300 text-stone-700 text-xs'
                      }`}
                    >
                      <span className="text-base">{app.icon}</span>
                      <span className="text-[11px] font-bold">{app.name}</span>
                    </button>
                  ))}
                </div>

                {/* Simulated QR Code Scan */}
                <div className="flex items-center gap-3.5 bg-white p-3 rounded-2xl border border-stone-200">
                  <div className="bg-stone-900 p-2 rounded-xl text-white flex flex-col items-center justify-center shrink-0 w-18 h-18">
                    <div className="grid grid-cols-4 gap-0.5 w-12 h-12 bg-white p-1 rounded">
                      <div className="bg-stone-900 rounded-xs"></div>
                      <div className="bg-stone-200 rounded-xs"></div>
                      <div className="bg-stone-900 rounded-xs"></div>
                      <div className="bg-stone-900 rounded-xs"></div>
                      <div className="bg-stone-200 rounded-xs"></div>
                      <div className="bg-stone-900 rounded-xs"></div>
                      <div className="bg-stone-200 rounded-xs"></div>
                      <div className="bg-stone-900 rounded-xs"></div>
                      <div className="bg-stone-900 rounded-xs"></div>
                      <div className="bg-stone-900 rounded-xs"></div>
                      <div className="bg-stone-200 rounded-xs"></div>
                      <div className="bg-stone-900 rounded-xs"></div>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-slate-900">Scan to Pay via Any UPI App</p>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Fast, instant deposit confirmation with auto-receipt
                    </p>
                    <span className="inline-block mt-1 text-[10px] font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                      ✓ Zero Transaction Fees
                    </span>
                  </div>
                </div>

                {/* VPA ID Input */}
                <div>
                  <label className="text-[11px] font-bold text-stone-600 block mb-1">
                    Virtual Payment Address (UPI ID)
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="e.g. 9876543210@upi"
                    className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-emerald-600"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2.5 pt-1 text-xs">
                <div>
                  <label className="text-[11px] font-bold text-stone-600 block mb-1">Card Number (RuPay / Visa / Master)</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4532 0000 0000 0000"
                    className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-emerald-600"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-stone-600 block mb-1">Expiry</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-stone-600 block mb-1">CVV</label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="•••"
                      maxLength={4}
                      className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* WhatsApp Confirmation Checkbox */}
        <div className="mb-5 p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-start gap-2.5">
          <input
            type="checkbox"
            id="whatsapp-confirm"
            checked={sendWhatsAppUpdates}
            onChange={(e) => setSendWhatsAppUpdates(e.target.checked)}
            className="mt-0.5 rounded text-emerald-700 accent-emerald-700 cursor-pointer h-4 w-4"
          />
          <label htmlFor="whatsapp-confirm" className="text-xs text-emerald-950 font-medium cursor-pointer">
            <span className="font-bold">💬 WhatsApp Updates:</span> {lang === 'hi' ? 'बुकिंग रसीद, ऑपरेटर संपर्क और लाइव स्टेटस मेरे व्हाट्सएप पर भेजें।' : 'Send booking receipt, operator contact & live updates to my WhatsApp.'}
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 border border-stone-200 rounded-xl text-xs text-stone-600 hover:bg-stone-50 cursor-pointer font-bold"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handlePay}
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-extrabold transition shadow-md shadow-emerald-700/20 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting
              ? 'Processing...'
              : paymentChoice === 'pay_on_delivery'
              ? 'Confirm Booking (Pay on Delivery)'
              : `Pay ${currency}${amountToPayNow} & Guarantee Booking`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
