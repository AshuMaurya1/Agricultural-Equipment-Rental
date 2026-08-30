import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const bookingSchema = new mongoose.Schema({
    tractor: {type: ObjectId, ref: "Tractor", required: true},
    user:{type: ObjectId, ref: "User", required: true},
    owner:{type: ObjectId, ref: "User", required: true},
    startDate: {type: Date, required: true},
    endDate: {type: Date, required: true},
    status: {type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending'},
    price: {type: Number, required: true}
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;