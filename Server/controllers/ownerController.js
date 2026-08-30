import imagekit from "../config/imageKit.js";
import Booking from "../models/Booking.js";
import User from "../models/User.js";
import Tractor from "../models/tractor.js";
import fs from 'fs';


export const changeRoleToOwner = async (req, res) => {
    try {
        const { _id } = req.user;
        await User.findByIdAndUpdate(_id, { role: 'owner' }, { new: true });
        return res.json({ success: true, message: 'Now you can list cars' });
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
};

// API to List Tractor

export const addTractor = async (req, res) => {
    try {
        const { _id } = req.user;
        const submittedData = JSON.parse(req.body.tractorData || '{}');
        // Accept the current camelCase client fields as well as older saved form payloads.
        const tractorData = {
            ...submittedData,
            seatingCapacity: submittedData.seatingCapacity ?? submittedData.seating_capacity,
            fuelType: submittedData.fuelType ?? submittedData.fuel_type,
            transmission: submittedData.transmission ?? submittedData.transmissionType,
        };
        const imageFile = req.file;

        if (!imageFile) {
            return res.status(400).json({ success: false, message: 'Image upload is required' });
        }

        const fileBuffer = fs.readFileSync(imageFile.path);
        const base64File = fileBuffer.toString('base64');
        const response = await imagekit.upload({
            file: base64File,
            fileName: imageFile.originalname,
            folder: '/tractors'
        });

        const optimizedImageUrl = imagekit.url({
            path: response.filePath,
            transformation: [
                { width: '1280' },
                { quality: 'auto' },
                { format: 'webp' }
            ]
        });

        const image = optimizedImageUrl;

        const tractor = await Tractor.create({
            ...tractorData,
            owner: _id,
            image
        });

        // remove the temp file
        try { fs.unlinkSync(imageFile.path) } catch(e){}

        return res.json({ success: true, message: 'Tractor upload flow ready', tractor });
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
}

// API to List Owner's Tractors
export const getOwnerTractors = async (req, res) => {
    try {
        const { _id } = req.user;
        const tractors = await Tractor.find({ owner: _id });
        return res.json({ success: true, tractors });
    }catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
}

// API to Toggle Tractor Availability
export const toggleTractorAvailability = async (req, res) => {
    try {
        const { tractorId } = req.params;
        const { _id } = req.user;
        const tractorDoc = await Tractor.findOne({ owner: _id, _id: tractorId });

        if (!tractorDoc) {
            return res.status(404).json({ success: false, message: 'Tractor not found' });
        }

        tractorDoc.isAvailable = !tractorDoc.isAvailable;
        await tractorDoc.save();

        return res.json({ success: true, message: 'Availability toggled successfully', tractor: tractorDoc });
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
};

// API to Delete Tractor
export const deleteTractor = async (req, res) => {
    try {
        const { tractorId } = req.params;
        const { _id } = req.user;
        const tractorDoc = await Tractor.findOne({ owner: _id, _id: tractorId });

        if (!tractorDoc) {
            return res.status(404).json({ success: false, message: 'Tractor not found' });
        }

        await tractorDoc.deleteOne();

        return res.json({ success: true, message: 'Tractor deleted successfully' });
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
};

// API To get Dashboard Data
export const getDashboardData = async (req, res) => {
    try {
        const { _id, role } = req.user;

        if (role !== 'owner') {
            return res.json({ success: false, message: 'Unauthorized access' });
        }

        const tractors = await Tractor.find({ owner: _id });
        // return res.json({ success: true, tractors });
        const bookings = await Booking.find({ owner: _id }).populate('tractor').sort({ createdAt: -1 });

        const pendingBooking = await Booking.find({ owner: _id, status: 'pending' });
        const completedBooking = await Booking.find({ owner: _id, status: 'confirmed' });

        const monthlyRevenue = bookings
            .filter((booking) => booking.status === 'confirmed')
            .reduce((acc, booking) => acc + booking.price, 0);

        const dashboardData = {
            totalTractor: tractors.length,
            totalBooking: bookings.length,
            pendingBooking: pendingBooking.length,
            completedBooking: completedBooking.length,
            recentBooking: bookings.slice(0, 3),
            monthlyRevenue,
        };

        res.json({ success: true, dashboardData });

    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
};

// API to Update user image
export const updateUserImage = async (req, res) => {
    try {
        const { _id } = req.user;
        const imageFile = req.file;

        if (!imageFile) {
            return res.status(400).json({ success: false, message: 'Image upload is required' });
        }

        const fileBuffer = fs.readFileSync(imageFile.path);
        const base64File = fileBuffer.toString('base64');
        const response = await imagekit.upload({
            file: base64File,
            fileName: imageFile.originalname,
            folder: '/users'
        });

        const optimizedImageUrl = imagekit.url({
            path: response.filePath,
            transformation: [
                { width: '400' },
                { quality: 'auto' },
                { format: 'webp' }
            ]
        });

        const image = optimizedImageUrl;
        await User.findByIdAndUpdate(_id, { image });
        // remove the temp file
        try { fs.unlinkSync(imageFile.path) } catch(e){}
        res.json({ success: true, message: 'User image updated successfully', image, user: await User.findById(_id) });
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
};
