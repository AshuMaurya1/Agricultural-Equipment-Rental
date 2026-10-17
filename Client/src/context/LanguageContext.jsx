import { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  en: {
    // Navigation
    home: 'Home',
    tractors: 'Tractors',
    myBookings: 'My Bookings',
    dashboard: 'Dashboard',
    listTractor: 'List Tractor',
    login: 'Login',
    logout: 'Logout',
    searchPlaceholder: 'Search tractors, brands, or districts...',
    
    // Hero
    heroTitle: 'TractorHub',
    heroSubtitle: 'Heavy Farming Equipment & Tractor Rental Network',
    pickupLocation: 'Pickup Location',
    pickupLocationPlaceholder: 'Please select Location',
    pickupDate: 'Pick-up Date',
    returnDate: 'Return Date',
    searchButton: 'Search Tractors',

    // Featured & Listing
    featuredTitle: 'Featured Tractors',
    featuredSubtitle: 'Explore our fleet of reliable, heavy-duty tractors available for your field operations.',
    availableTractors: 'Available Tractors',
    allBrands: 'All Brands',
    allHP: 'All HP',
    under40HP: 'Under 40 HP (Light)',
    mid40to55HP: '40 - 55 HP (Standard)',
    above55HP: '55+ HP (Heavy Duty)',
    availableNow: 'Available Now',
    booked: 'Booked',
    perDay: 'day',
    perHour: 'hr',
    perAcre: 'acre',
    exploreAll: 'Explore All Tractors',

    // Details & Booking
    backToAll: 'Back to all tractors',
    standardSpecs: 'Standard Machine Specs',
    horsepower: 'Horsepower',
    operatorSeat: 'Operator Seat',
    fuelType: 'Fuel Type',
    transmission: 'Transmission',
    location: 'Location',
    farmingImplements: 'Available Farming Implements',
    includeDriver: 'Include Experienced Operator / Driver',
    driverSubtitle: 'Local skilled operator to manage field operations safely',
    rentalUnit: 'Select Rental Pricing Unit',
    unitDay: 'Per Day (दिन)',
    unitHour: 'Per Hour (घंटे)',
    unitAcre: 'Per Acre (एकड़)',
    unitsToBook: 'Quantity / Units',
    deliveryDistance: 'Delivery Field Distance (km)',
    transportRate: 'Transport surcharge: ₹40/km',
    estimatedTotal: 'Estimated Total',
    reserveNow: 'Reserve Tractor Now',
    chatWhatsApp: 'Chat on WhatsApp',
    reviewsTitle: 'Farmer & Contractor Reviews',
    noReviews: 'No verified reviews yet. Rent this tractor to leave feedback!',

    // Payments
    paymentTitle: 'Complete Tractor Reservation',
    payAdvance: 'Pay 20% Advance Online',
    payFull: 'Pay Full Online',
    payOnDelivery: 'Pay on Delivery (Cash / UPI upon Arrival)',
    advanceGuarantee: 'Instant confirmed booking with machine reserved for your dates',
    upiPay: 'UPI / QR Code',
    cardPay: 'Credit / Debit Card',
    payNow: 'Confirm & Pay',

    // My Bookings
    bookingID: 'Booking ID',
    rentalPeriod: 'Rental Period',
    grandTotal: 'Grand Total',
    downloadInvoice: 'Download Invoice (PDF)',
    rateTractor: 'Rate Tractor',
    cancelBooking: 'Cancel Booking',
    noBookings: 'You have no tractor bookings yet.',

    // Owner
    manageTractors: 'Manage Fleet Tractors',
    manageBookings: 'Manage Bookings',
    analyticsDashboard: 'Owner Analytics & Dashboard',
    availabilityCalendar: 'Availability & Maintenance Calendar',
    blockDate: 'Block for Maintenance',
    assignOperator: 'Assign Driver / Operator'
  },
  hi: {
    // Navigation
    home: 'होम',
    tractors: 'ट्रैक्टर सूची',
    myBookings: 'मेरी बुकिंग',
    dashboard: 'डैशबोर्ड',
    listTractor: 'ट्रैक्टर जोड़ें',
    login: 'लॉग इन',
    logout: 'लॉग आउट',
    searchPlaceholder: 'ट्रैक्टर, ब्रांड या जिला खोजें...',
    
    // Hero
    heroTitle: 'ट्रैक्टर हब',
    heroSubtitle: 'कृषि उपकरण और भारी ट्रैक्टर किराए पर लेने का भरोसेमंद मंच',
    pickupLocation: 'स्थान चुनें',
    pickupLocationPlaceholder: 'कृपया जिला चुनें',
    pickupDate: 'शुरुआत की तारीख',
    returnDate: 'वापसी की तारीख',
    searchButton: 'ट्रैक्टर खोजें',

    // Featured & Listing
    featuredTitle: 'प्रमुख ट्रैक्टर',
    featuredSubtitle: 'अपनी अगली बुवाई और कटाई के लिए उच्च प्रदर्शन वाले ट्रैक्टर देखें।',
    availableTractors: 'उपलब्ध ट्रैक्टर',
    allBrands: 'सभी ब्रांड',
    allHP: 'सभी हॉर्सपावर (HP)',
    under40HP: '40 HP से कम (हल्के कार्य)',
    mid40to55HP: '40 - 55 HP (मध्यम जुताई)',
    above55HP: '55+ HP (भारी कृषि कार्य)',
    availableNow: 'उपलब्ध है',
    booked: 'बुक है',
    perDay: 'दिन',
    perHour: 'घंटा',
    perAcre: 'एकड़',
    exploreAll: 'सभी ट्रैक्टर देखें',

    // Details & Booking
    backToAll: 'सभी ट्रैक्टरों पर वापस जाएं',
    standardSpecs: 'मशीन की विशेषताएं',
    horsepower: 'हॉर्सपावर (HP)',
    operatorSeat: 'चालक सीट',
    fuelType: 'ईंधन प्रकार',
    transmission: 'ट्रांसमिशन',
    location: 'स्थान',
    farmingImplements: 'उपलब्ध कृषि उपकरण',
    includeDriver: 'कुशल ड्राइवर / ऑपरेटर साथ लें',
    driverSubtitle: 'खेत में जुताई और संचालन के लिए अनुभवी स्थानीय चालक',
    rentalUnit: 'किराया गणना इकाई चुनें',
    unitDay: 'प्रति दिन (दिन)',
    unitHour: 'प्रति घंटा (घंटे)',
    unitAcre: 'प्रति एकड़ (एकड़)',
    unitsToBook: 'इकाइयों की संख्या (दिन / घंटे / एकड़)',
    deliveryDistance: 'खेत की डिलीवरी दूरी (किलोमीटर)',
    transportRate: 'परिवहन शुल्क: ₹40 प्रति किमी',
    estimatedTotal: 'कुल अनुमानित राशि',
    reserveNow: 'ट्रैक्टर अभी आरक्षित करें',
    chatWhatsApp: 'व्हाट्सएप पर बात करें',
    reviewsTitle: 'किसानों और ठेकेदारों की समीक्षाएं',
    noReviews: 'अभी तक कोई समीक्षा नहीं है। अपनी समीक्षा साझा करें!',

    // Payments
    paymentTitle: 'ट्रैक्टर बुकिंग और भुगतान',
    payAdvance: '20% अग्रिम राशि ऑनलाइन दें',
    payFull: 'पूरा भुगतान ऑनलाइन करें',
    payOnDelivery: 'डिलीवरी पर भुगतान (कैश या UPI)',
    advanceGuarantee: 'तुरंत पुष्टि — मशीन आपके लिए सुरक्षित हो जाएगी',
    upiPay: 'UPI / QR कोड',
    cardPay: 'डेबिट / क्रेडिट कार्ड',
    payNow: 'पुष्टि करें और भुगतान करें',

    // My Bookings
    bookingID: 'बुकिंग आईडी',
    rentalPeriod: 'किराया अवधि',
    grandTotal: 'कुल देय राशि',
    downloadInvoice: 'रसीद डाउनलोड करें (PDF)',
    rateTractor: 'ट्रैक्टर को रेटिंग दें',
    cancelBooking: 'बुकिंग रद्द करें',
    noBookings: 'आपकी कोई सक्रिय बुकिंग नहीं है।',

    // Owner
    manageTractors: 'ट्रैक्टर फ्लीट प्रबंधन',
    manageBookings: 'बुकिंग प्रबंधन',
    analyticsDashboard: 'मालिक डैशबोर्ड और आय विश्लेषण',
    availabilityCalendar: 'उपलब्धता और रखरखाव कैलेंडर',
    blockDate: 'रखरखाव हेतु तारीख ब्लॉक करें',
    assignOperator: 'ड्राइवर / ऑपरेटर नियुक्त करें'
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('app_language') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('app_language', lang);
  }, [lang]);

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'en' ? 'hi' : 'en'));
  };

  const t = (key) => {
    return translations[lang]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
