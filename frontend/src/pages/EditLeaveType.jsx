import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LeaveTypeForm from "../components/LeaveTypeForm";
import { getLeaveType, updateLeaveType } from "../api/leaveTypeApi";

function EditLeaveType() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [leaveType, setLeaveType] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getLeaveType(id)
      .then((data) => setLeaveType(data))
      .catch((err) => setError(err.message));
  }, [id]);

  const handleSubmit = async (formData) => {
    await updateLeaveType(id, formData);
    navigate("/admin/leave-types");
  };

  if (error) return <p className="error">{error}</p>;
  if (!leaveType) return <p>Loading...</p>;

  return (
    <div>
      <h1>Edit Leave Type</h1>
      <LeaveTypeForm initialData={leaveType} onSubmit={handleSubmit} buttonText="Update" />
    </div>
  );
}

export default EditLeaveType;
