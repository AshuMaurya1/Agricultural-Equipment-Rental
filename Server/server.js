import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRouter from "./router/userRoutes.js";
import ownerRouter from "./router/ownerRoutes.js";
import bookingRouter from "./router/bookingRoutes.js";
dotenv.config();


// Initialize Express app
const app = express();
const PORT = process.env.PORT || 4000;
let dbReady = false;

// Middleware
app.use(cors());
app.use(express.json());
app.get("/", (_req, res) => {res.send("Server is running in development mode by Ashu Maurya");});
app.use("/api/user", userRouter);
app.use("/api/owner", ownerRouter);
app.use("/api/booking", bookingRouter);


app.listen(PORT, () => {
  console.log(`Server is running on Ashu Singh http://localhost:${PORT}`);
});


// Do not block the HTTP server while MongoDB connects. Requests that need the
// database will return an error until the database connection is available.
connectDB()
  .then(() => {
    dbReady = true;
  })
  .catch((error) => {
    console.error("Database connection failed:", error.message);
  });

