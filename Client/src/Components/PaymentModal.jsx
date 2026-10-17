import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const PaymentModal = ({
  isOpen,
  onClose,
  onConfirmPayment,
  bookingDetails,
  currency = '₹',
  isSubmitting = false
}) => {
  const { t } = useLanguage();
  const [paymentChoice, setPaymentChoice] = useState('online_advance'); // 'online_advance' | 'full_online' | 'pay_on_delivery'
  const [paymentTab, setPaymentTab] = useState('upi'); // 'upi' | 'card'
  
  // Form states
  const [upiId, setUpiId] = useState('farmer@upi');
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
    unitsBooked = 1
  } = bookingDetails;

  const advanceAmount = Math.round(totalPrice * 0.2);
  const remainingDue = totalPrice - advanceAmount;

  const amountToPayNow =
    paymentChoice === 'online_advance'
      ? advanceAmount
      : paymentChoice === 'full_online'
      ? totalPrice
      : 0;

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
      transactionId: paymentChoice !== 'pay_on_delivery' ? txnId : ''
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 text-gray-800 relative animate-fadeIn border border-gray-100 my-8">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">{t('paymentTitle')}</h3>
            <p className="text-xs text-gray-500 mt-0.5">Secure Agricultural Equipment Reservation</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-2xl font-bold cursor-pointer"
          >
            &times;
          </button>
        </div>

        {/* Cost Summary Box */}
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs space-y-1.5 mb-5">
          <div className="flex justify-between text-gray-600">
            <span>
              Tractor Rent ({unitsBooked} {rentalUnit}{unitsBooked > 1 ? 's' : ''}):
            </span>
            <span className="font-semibold text-gray-900">{currency}{baseTractorTotal}</span>
          </div>
          {implementsTotal > 0 && (
            <div className="flex justify-between text-gray-600">
              <span>Farming Implements Attached:</span>
              <span className="font-semibold text-gray-900">+{currency}{implementsTotal}</span>
            </div>
          )}
          {driverTotal > 0 && (
            <div className="flex justify-between text-gray-600">
              <span>Driver / Operator Service:</span>
              <span className="font-semibold text-gray-900">+{currency}{driverTotal}</span>
            </div>
          )}
          {transportPrice > 0 && (
            <div className="flex justify-between text-gray-600">
              <span>Field Transport ({transportDistanceKm} km):</span>
              <span className="font-semibold text-gray-900">+{currency}{transportPrice}</span>
            </div>
          )}
          <hr className="border-gray-200 my-1" />
          <div className="flex justify-between text-sm font-extrabold text-gray-900 pt-1">
            <span>Grand Total:</span>
            <span className="text-primary">{currency}{totalPrice}</span>
          </div>
        </div>

        {/* Payment Type Selection */}
        <div className="space-y-2.5 mb-5">
          <label className="text-xs font-bold text-gray-700 block">Choose Payment Mode</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            {/* Option 1: 20% Advance */}
            <button
              type="button"
              onClick={() => setPaymentChoice('online_advance')}
              className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                paymentChoice === 'online_advance'
                  ? 'border-primary bg-blue-50/50 ring-2 ring-primary/20'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="font-bold text-gray-900">20% Advance</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              </div>
              <span className="text-primary font-bold text-sm">{currency}{advanceAmount}</span>
              <span className="text-[10px] text-gray-500 mt-1">Due later: {currency}{remainingDue}</span>
            </button>

            {/* Option 2: Full Online */}
            <button
              type="button"
              onClick={() => setPaymentChoice('full_online')}
              className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                paymentChoice === 'full_online'
                  ? 'border-primary bg-blue-50/50 ring-2 ring-primary/20'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="font-bold text-gray-900">Full Payment</span>
                <span className="text-[10px] bg-blue-100 text-blue-700 px-1 rounded">100%</span>
              </div>
              <span className="text-primary font-bold text-sm">{currency}{totalPrice}</span>
              <span className="text-[10px] text-gray-500 mt-1">Zero balance on field</span>
            </button>

            {/* Option 3: Pay on Delivery */}
            <button
              type="button"
              onClick={() => setPaymentChoice('pay_on_delivery')}
              className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                paymentChoice === 'pay_on_delivery'
                  ? 'border-primary bg-blue-50/50 ring-2 ring-primary/20'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="font-bold text-gray-900">Pay on Field</span>
                <span className="text-[10px] text-amber-600 font-semibold">COD</span>
              </div>
              <span className="text-gray-900 font-bold text-sm">{currency}0 Now</span>
              <span className="text-[10px] text-gray-500 mt-1">Pay full upon arrival</span>
            </button>
          </div>
        </div>

        {/* Online Payment Method Tabs (shown if paying advance or full) */}
        {paymentChoice !== 'pay_on_delivery' && (
          <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/60 mb-5 space-y-3">
            <div className="flex border-b border-gray-200 pb-2 gap-4 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setPaymentTab('upi')}
                className={`pb-1 cursor-pointer transition ${
                  paymentTab === 'upi' ? 'text-primary border-b-2 border-primary font-bold' : 'text-gray-400'
                }`}
              >
                📱 UPI / QR Code (GPay, PhonePe, Paytm)
              </button>
              <button
                type="button"
                onClick={() => setPaymentTab('card')}
                className={`pb-1 cursor-pointer transition ${
                  paymentTab === 'card' ? 'text-primary border-b-2 border-primary font-bold' : 'text-gray-400'
                }`}
              >
                💳 Debit / Credit / RuPay Card
              </button>
            </div>

            {paymentTab === 'upi' ? (
              <div className="space-y-3 pt-1">
                <div className="flex items-center gap-3">
                  {/* Mock QR Code */}
                  <div className="bg-white p-2 rounded-lg border border-gray-300 w-20 h-20 flex flex-col items-center justify-center shrink-0 shadow-xs">
                    <div className="grid grid-cols-4 gap-1 w-14 h-14 bg-gray-900 p-1 rounded">
                      <div className="bg-white"></div>
                      <div className="bg-gray-900"></div>
                      <div className="bg-white"></div>
                      <div className="bg-white"></div>
                      <div className="bg-gray-900"></div>
                      <div className="bg-white"></div>
                      <div className="bg-gray-900"></div>
                      <div className="bg-white"></div>
                      <div className="bg-white"></div>
                      <div className="bg-gray-900"></div>
                      <div className="bg-white"></div>
                      <div className="bg-gray-900"></div>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-800">Scan QR Code with any UPI App</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">Supports Google Pay, PhonePe, Paytm, BHIM</p>
                    <span className="inline-block mt-1 bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded font-semibold">
                      Instant Payment Verification
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-gray-600 block mb-1">
                    Or Enter Virtual Payment Address (VPA / UPI ID)
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="e.g. 9876543210@upi"
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-primary"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2.5 pt-1 text-xs">
                <div>
                  <label className="text-[11px] font-semibold text-gray-600 block mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4532 0000 0000 0000"
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-primary"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-gray-600 block mb-1">Expiry</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className="w-full bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-gray-600 block mb-1">CVV</label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="123"
                      maxLength={4}
                      className="w-full bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded-xl text-xs text-gray-600 hover:bg-gray-50 cursor-pointer font-medium"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handlePay}
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-primary hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer disabled:opacity-50"
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
