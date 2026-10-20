import mongoose from "mongoose";

const leaveTypeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    daysPerYear: { type: Number, required: true, min: 1, max: 365 },
    description: { type: String, trim: true, default: "" },
  },
    { timestamps: true }
    );
    // export default mongoose.model("LeaveType", leaveTypeSchema);//
    const LeaveType = mongoose.model("LeaveType", leaveTypeSchema);
     export default LeaveType;
