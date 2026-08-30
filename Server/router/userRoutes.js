import express from "express";
import { loginUser, registerUser, getUserData, getAllTractors } from "../controllers/userController.js";
import { protect} from '../Middlewere/auth.js'

const userRouter = express.Router(); 

userRouter.post('/register',registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/cars', getAllTractors);
userRouter.get('/data', protect, getUserData); 
userRouter.get('/tractors', getAllTractors);


export default userRouter;

