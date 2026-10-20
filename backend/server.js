import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import leaveTypeRoutes from "./routes/leaveTypeRoutes.js";
import leaveRequestRoutes from "./routes/leaveRequestRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import errorHandler from "./middleware/errorHandler.js";


connectDB();    

const app=express();
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health",(req,res)=>{
    res.json({message:"server is running"});
});
app.use("/api/auth", authRoutes);
app.use("/api/leave-types", leaveTypeRoutes);
app.use("/api/leaves", leaveRequestRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use((req,res)=>{
    res.status(404).json({ message: "Route not found" });
});
app.use(errorHandler);

const PORT=process.env.PORT || 5001;
app.listen(PORT,()=>{
    console.log(`Server is running at port ${PORT}`);
});
