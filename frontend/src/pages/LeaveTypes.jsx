import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getLeaveTypes, deleteLeaveType } from "../api/leaveTypeApi";

function LeaveTypes() {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadLeaveTypes = () => {
    getLeaveTypes()
      .then((data) => setLeaveTypes(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadLeaveTypes();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this leave type?")) return;
    setError("");
    try {
      await deleteLeaveType(id);
      loadLeaveTypes();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Leave Types</h1>
      <Link className="btn" to="/admin/leave-types/new">+ Add Leave Type</Link>
      {error && <p className="error">{error}</p>}

      {leaveTypes.length === 0 ? (
        <p>No leave types yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Days per year</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaveTypes.map((type) => (
              <tr key={type._id}>
                <td>{type.name}</td>
                <td>{type.daysPerYear}</td>
                <td>{type.description}</td>
                <td>
                  <Link to={`/admin/leave-types/${type._id}/edit`}>Edit</Link>{" "}
                  <button className="danger" onClick={() => handleDelete(type._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default LeaveTypes;
