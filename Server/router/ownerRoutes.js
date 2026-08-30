import express from "express";
import { addTractor, changeRoleToOwner, deleteTractor, getDashboardData, getOwnerTractors, toggleTractorAvailability, updateUserImage } from "../controllers/ownerController.js";
import { protect } from "../Middlewere/auth.js";
import upload from "../Middlewere/multer.js";

const ownerRouter = express.Router();

ownerRouter.post("/change-role", protect, changeRoleToOwner);
ownerRouter.post("/add-tractor", protect, upload.single("image"), addTractor);
ownerRouter.get("/tractors", protect, getOwnerTractors);
ownerRouter.put("/tractors/:tractorId/availability", protect, toggleTractorAvailability);
ownerRouter.delete("/tractors/:tractorId", protect, deleteTractor);
ownerRouter.get("/dashboard", protect, getDashboardData);
ownerRouter.post('/update-image', upload.single('image'), protect, updateUserImage)

export default ownerRouter;