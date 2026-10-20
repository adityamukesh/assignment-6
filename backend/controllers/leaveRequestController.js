import LeaveRequest from "../models/LeaveRequest.js";
import LeaveType from "../models/LeaveType.js";

const getUsedDays = async (employeeId, leaveTypeId, year) => {
  const approved = await LeaveRequest.find({
    employee: employeeId,
    leaveType: leaveTypeId,
    status: "approved",
    fromDate: { $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`) },
  });
  let used = 0;
  approved.forEach((leave) => {
    used = used + leave.days;
  });
  return used;
};

export const applyLeave = async (req, res, next) => {
  try {
    const { leaveType, fromDate, toDate, reason } = req.body;
    if (!leaveType || !fromDate || !toDate || !reason) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    const type = await LeaveType.findById(leaveType);
    if (!type) {
      return res.status(404).json({ message: "Leave type not found" });
    }

    const from = new Date(fromDate);
    const to = new Date(toDate);
    if (isNaN(from) || isNaN(to)) {
      return res.status(400).json({ message: "Invalid date" });
    }
    if (to < from) {
      return res.status(400).json({ message: "To date cannot be before from date" });
    }

    const days = Math.round((to - from) / (1000 * 60 * 60 * 24)) + 1;

    const overlap = await LeaveRequest.findOne({
      employee: req.user._id,
      status: { $in: ["pending", "approved"] },
      fromDate: { $lte: to },
      toDate: { $gte: from },
    });
    if (overlap) {
      return res.status(409).json({ message: "You already have a leave in these dates" });
    }

    const used = await getUsedDays(req.user._id, type._id, from.getFullYear());
    const remaining = type.daysPerYear - used;
    if (days > remaining) {
      return res.status(400).json({ message: `Not enough balance. You have ${remaining} ${type.name} days left` });
    }

    const leave = await LeaveRequest.create({
      employee: req.user._id,
      leaveType: type._id,
      fromDate: from,
      toDate: to,
      days,
      reason,
    });
    res.status(201).json(leave);
  } catch (error) {
    next(error);
  }
};

export const getMyLeaves = async (req, res, next) => {
  try {
    const leaves = await LeaveRequest.find({ employee: req.user._id })
      .populate("leaveType", "name")
      .sort({ createdAt: -1 });
    res.status(200).json(leaves);
  } catch (error) {
    next(error);
  }
};

export const getMyBalance = async (req, res, next) => {
  try {
    const year = new Date().getFullYear();
    const leaveTypes = await LeaveType.find().sort({ name: 1 });
    const balance = [];
    for (const type of leaveTypes) {
      const used = await getUsedDays(req.user._id, type._id, year);
      balance.push({
        _id: type._id,
        name: type.name,
        total: type.daysPerYear,
        used,
        remaining: type.daysPerYear - used,
      });
    }
    res.status(200).json(balance);
  } catch (error) {
    next(error);
  }
};

export const getLeaveById = async (req, res, next) => {
  try {
    const leave = await LeaveRequest.findById(req.params.id)
      .populate("leaveType", "name daysPerYear")
      .populate("employee", "name email employeeId department designation");
    if (!leave) {
      return res.status(404).json({ message: "Leave request not found" });
    }
    if (req.user.role !== "admin" && leave.employee._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only see your own leave requests" });
    }
    res.status(200).json(leave);
  } catch (error) {
    next(error);
  }
};

export const cancelLeave = async (req, res, next) => {
  try {
    const leave = await LeaveRequest.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ message: "Leave request not found" });
    }
    if (leave.employee.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only cancel your own leave requests" });
    }
    if (leave.status !== "pending") {
      return res.status(400).json({ message: "Only pending requests can be cancelled" });
    }
    leave.status = "cancelled";
    await leave.save();
    res.status(200).json(leave);
  } catch (error) {
    next(error);
  }
};

export const getAllLeaves = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }
    const leaves = await LeaveRequest.find(filter)
      .populate("leaveType", "name")
      .populate("employee", "name employeeId department")
      .sort({ createdAt: -1 });
    res.status(200).json(leaves);
  } catch (error) {
    next(error);
  }
};

export const updateLeaveStatus = async (req, res, next) => {
  try {
    const { status, remarks } = req.body;
    if (status !== "approved" && status !== "rejected") {
      return res.status(400).json({ message: "Status must be approved or rejected" });
    }

    const leave = await LeaveRequest.findById(req.params.id).populate("leaveType");
    if (!leave) {
      return res.status(404).json({ message: "Leave request not found" });
    }
    if (leave.status !== "pending") {
      return res.status(400).json({ message: `This request is already ${leave.status}` });
    }

    if (status === "approved") {
      const used = await getUsedDays(leave.employee, leave.leaveType._id, leave.fromDate.getFullYear());
      if (leave.days > leave.leaveType.daysPerYear - used) {
        return res.status(400).json({ message: "Employee does not have enough balance for this leave" });
      }
    }

    leave.status = status;
    leave.remarks = remarks || "";
    await leave.save();
    res.status(200).json(leave);
  } catch (error) {
    next(error);
  }
};
