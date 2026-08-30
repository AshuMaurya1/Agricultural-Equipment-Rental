import User from '../models/User.js'
import Tractor from '../models/tractor.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

// Generate JWT Token
const generateToken = (userId) => {
    const payload = { userId };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
}

 // Register User
export const registerUser = async (req, res) => {
    try{
        const {name, email, password} = req.body;

        if (!name || !email || !password || password.length < 6) {
            return res.json({ success: false, message: 'Please fill all fields and use a password with at least 6 characters.' })
        }
        const userExists = await User.findOne({email});
        if(userExists){
            return res.json({success: false, message: 'User already exists'})
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({name, email, password: hashedPassword});
        const token = generateToken(user._id.toString());
        res.json({success: true, token})
        
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message}) 
    }
}

// Login User
export const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.json({success: false, message: 'user does not exists'})
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.json({success: false, message: 'invalid credentials'})
        }
        const token = generateToken(user._id.toString());
        res.json({success: true, token})
    } catch(error){
        console.log(error.message);
        res.json({success: false, message: error.message}) 
    }
}

// get User Data using Token (JWT)
export const getUserData = async (req, res)=>{
    try{
        const {user} = req;
        res.json({success: true, user})
    } catch(error){
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

export const getAllTractors = async (req, res) => {
    try {
        const tractors = await Tractor.find({ isAvailable: true }).sort({ createdAt: -1 });
        res.json({ success: true, tractors });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Get all Tractors for the Frontend
export const getTractors = async(req, res) => {
     try{
          const tractors = await Tractor.find({ isAvailable: true }).sort({ createdAt: -1 });
          res.json({ success: true, tractors });
     }catch(error){
        console.log(error.message);
        res.json({success: false, message : error.message})
     }
}
