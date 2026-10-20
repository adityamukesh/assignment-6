import LeaveRequest from "../models/LeaveRequest.js";

export const getDashboard = async (req, res, next) => {
  try {
    const pendingRequests = await LeaveRequest.find({ status: "pending" })
      .populate("employee", "name department")
      .populate("leaveType", "name")
      .sort({ createdAt: -1 });

    const today = new Date(new Date().toLocaleDateString("en-CA"));
    const onLeaveToday = await LeaveRequest.find({
      status: "approved",
      fromDate: { $lte: today },
      toDate: { $gte: today },
    })
      .populate("employee", "name department")
      .populate("leaveType", "name");

    const approved = await LeaveRequest.find({ status: "approved" }).populate("employee", "department");
    const departmentCounts = {};
    approved.forEach((leave) => {
      if (!leave.employee) return;
      const dept = leave.employee.department;
      if (!departmentCounts[dept]) {
        departmentCounts[dept] = { department: dept, leaves: 0, days: 0 };
      }
      departmentCounts[dept].leaves += 1;
      departmentCounts[dept].days += leave.days;
    });

    res.status(200).json({
      pendingCount: pendingRequests.length,
      pendingRequests,
      onLeaveToday,
      departmentCounts: Object.values(departmentCounts),
    });
  } catch (error) {
    next(error);
  }
};
