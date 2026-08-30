import Booking from '../models/Booking.js';
import Tractor from '../models/tractor.js';

// Functtion to check Availability of Tractor

const checkAvailability = async(tractorId, startDate, endDate) => {
    const bookings = await Booking.find({
        tractor: tractorId,
        startDate: { $lt: endDate },
        endDate: { $gt: startDate }
    });
    return bookings.length === 0;
}
// API to check Availability of Tractor for the given dates and Location
export const checkTractorAvailability = async (req, res) => {
    try{
        const { location, startDate, endDate } = req.body;

//fetch tractors based on location and availability

        const tractors = await Tractor.find({ location: location, isAvailable: true });

        // check tractor availability for the given dates

        const availableTractorsPromises = tractors.map(async (tractor) => {
            const isAvailable = await checkAvailability(tractor._id, startDate, endDate);
            return { ...tractor._doc, isAvailable };
        });

        let availableTractors = await Promise.all(availableTractorsPromises);
        availableTractors = availableTractors.filter(tractor => tractor.isAvailable === true);
        res.json({ success: true, availableTractors });

    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
}

// API to Create Booking
export const createBooking = async (req, res) => {
    try{
        const {_id} = req.user;
        const { tractorId, startDate, endDate } = req.body;

        const isAvailable = await checkAvailability(tractorId, startDate, endDate);
        if(!isAvailable){
            return res.json({ success: false, message: 'Tractor is not available for the selected dates' });
        }

        const TractorData = await Tractor.findById(tractorId);
        if (!TractorData) {
            return res.status(404).json({ success: false, message: 'Tractor not found' });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffDays = Math.max(1, Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)));
        const totalPrice = diffDays * Number(TractorData.pricePerDay);

        await Booking.create({ tractor: TractorData._id, owner: TractorData.owner, user: _id, startDate, endDate, price: totalPrice });

        res.json({ success: true, message: 'Booking created successfully' });
    }catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
}
// API to List User Bookings
export const getUserBookings = async (req, res) => {
    try{
        const {_id} = req.user;
        const bookings = await Booking.find({ user: _id }).populate('tractor').sort({ createdAt: -1 });
        res.json({ success: true, bookings });

    } catch(error){
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
}

// API To Get Owner Bookings
export const getOwnerBookings = async (req, res) => {
    try{
        if(req.user.role !== 'owner'){
            return res.json({ success: false, message: 'Access denied' });
        }
        const bookings = await Booking.find({ owner: req.user._id })
            .populate('tractor')
            .populate({ path: 'user', select: '-password' })
            .sort({ createdAt: -1 });
        res.json({ success: true, bookings });

    } catch(error){
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
}

// User can Update Booking Status to Cancelled
export const updateBookingStatus = async (req, res) => {
    try{
        const {_id} = req.user;
        const { bookingId, status } = req.body;
        const booking = await Booking.findById(bookingId);
        if(booking.owner.toString() !== _id.toString()){
            return res.json({ success: false, message: 'Unauthorized' });
        }
        booking.status = status;
        await booking.save();
        res.json({ success: true, message: 'Booking status updated successfully' });
    } catch(error){
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
}