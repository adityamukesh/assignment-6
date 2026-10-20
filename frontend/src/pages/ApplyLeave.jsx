import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLeaveTypes } from "../api/leaveTypeApi";
import { applyLeave } from "../api/leaveApi";

function ApplyLeave() {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ leaveType: "", fromDate: "", toDate: "", reason: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getLeaveTypes()
      .then((data) => setLeaveTypes(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  let days = 0;
  if (formData.fromDate && formData.toDate) {
    days = (new Date(formData.toDate) - new Date(formData.fromDate)) / (1000 * 60 * 60 * 24) + 1;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await applyLeave(formData);
      navigate("/my-leaves");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Apply Leave</h1>
      {leaveTypes.length === 0 && !error ? (
        <p>No leave types added yet. Ask the admin to add some.</p>
      ) : (
        <form className="form" onSubmit={handleSubmit}>
          {error && <p className="error">{error}</p>}

          <label>Leave Type</label>
          <select name="leaveType" value={formData.leaveType} onChange={handleChange} required>
            <option value="">-- Select --</option>
            {leaveTypes.map((type) => (
              <option key={type._id} value={type._id}>
                {type.name} ({type.daysPerYear} days/year)
              </option>
            ))}
          </select>

          <label>From Date</label>
          <input type="date" name="fromDate" value={formData.fromDate} onChange={handleChange} required />

          <label>To Date</label>
          <input type="date" name="toDate" value={formData.toDate} onChange={handleChange} required />

          {days > 0 && <p>Total days: {days}</p>}

          <label>Reason</label>
          <textarea name="reason" value={formData.reason} onChange={handleChange} required />

          <button type="submit">Apply</button>
        </form>
      )}
    </div>
  );
}

export default ApplyLeave;
