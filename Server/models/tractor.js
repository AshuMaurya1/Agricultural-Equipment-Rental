import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const tractorSchema = new mongoose.Schema({
    owner: { type: ObjectId, ref: "User" },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    image: { type: String, required: true },
    year: { type: Number, required: true },
    category: { type: String, required: true },
    seatingCapacity: { type: Number, required: true },
    fuelType: { type: String, required: true },
    transmission: { type: String, required: true },
    pricePerDay: { type: Number, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    isAvailable: { type: Boolean, default: true },
}, { timestamps: true });

const Tractor = mongoose.model('Tractor', tractorSchema);

export default Tractor;
