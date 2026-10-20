import LeaveType from "../models/LeaveType.js";
import LeaveRequest from "../models/LeaveRequest.js";

export const getLeaveTypes = async (req, res, next) => {
  try {
    const leaveTypes = await LeaveType.find().sort({ name: 1 });
    res.status(200).json(leaveTypes);
  } catch (error) {
    next(error);
  }
};

export const getLeaveTypeById = async (req, res, next) => {
  try {
    const leaveType = await LeaveType.findById(req.params.id);
    if (!leaveType) {
      return res.status(404).json({ message: "Leave type not found" });
    }
    res.status(200).json(leaveType);
  } catch (error) {
    next(error);
  }
};

export const createLeaveType = async (req, res, next) => {
  try {
    const { name, daysPerYear, description } = req.body;
    const leaveType = await LeaveType.create({ name, daysPerYear, description });
    res.status(201).json(leaveType);
  } catch (error) {
    next(error);
  }
};

export const updateLeaveType = async (req, res, next) => {
  try {
    const { name, daysPerYear, description } = req.body;
    const leaveType = await LeaveType.findByIdAndUpdate(
      req.params.id,
      { name, daysPerYear, description },
      { new: true, runValidators: true }
    );
    if (!leaveType) {
      return res.status(404).json({ message: "Leave type not found" });
    }
    res.status(200).json(leaveType);
  } catch (error) {
    next(error);
  }
};

export const deleteLeaveType = async (req, res, next) => {
  try {
    const leaveType = await LeaveType.findById(req.params.id);
    if (!leaveType) {
      return res.status(404).json({ message: "Leave type not found" });
    }
    const used = await LeaveRequest.findOne({ leaveType: leaveType._id });
    if (used) {
      return res.status(409).json({ message: "This leave type is used in leave requests, it cannot be deleted" });
    }
    await leaveType.deleteOne();
    res.status(200).json({ message: "Leave type deleted" });
  } catch (error) {
    next(error);
  }
};
