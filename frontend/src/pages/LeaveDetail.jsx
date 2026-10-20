import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLeave, cancelLeave } from "../api/leaveApi";

function LeaveDetail({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [leave, setLeave] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getLeave(id)
      .then((data) => setLeave(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm("Cancel this leave request?")) return;
    try {
      await cancelLeave(id);
      navigate("/my-leaves");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!leave) return <p className="error">{error}</p>;

  return (
    <div>
      <h1>Leave Details</h1>
      {error && <p className="error">{error}</p>}
      <div className="card">
        <p><b>Employee:</b> {leave.employee.name} ({leave.employee.employeeId})</p>
        <p><b>Department:</b> {leave.employee.department}</p>
        <p><b>Leave Type:</b> {leave.leaveType?.name}</p>
        <p><b>From:</b> {leave.fromDate.slice(0, 10)}</p>
        <p><b>To:</b> {leave.toDate.slice(0, 10)}</p>
        <p><b>Days:</b> {leave.days}</p>
        <p><b>Reason:</b> {leave.reason}</p>
        <p><b>Status:</b> <span className={`status ${leave.status}`}>{leave.status}</span></p>
        {leave.remarks && <p><b>Remarks:</b> {leave.remarks}</p>}
        <p><b>Applied on:</b> {leave.createdAt.slice(0, 10)}</p>
      </div>

      {user.role === "employee" && leave.status === "pending" && (
        <button className="danger" onClick={handleCancel}>Cancel Request</button>
      )}
      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  );
}

export default LeaveDetail;
