import { useNavigate } from "react-router-dom";
import LeaveTypeForm from "../components/LeaveTypeForm";
import { createLeaveType } from "../api/leaveTypeApi";

function AddLeaveType() {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    await createLeaveType(formData);
    navigate("/admin/leave-types");
  };

  return (
    <div>
      <h1>Add Leave Type</h1>
      <LeaveTypeForm onSubmit={handleSubmit} buttonText="Add" />
    </div>
  );
}

export default AddLeaveType;
