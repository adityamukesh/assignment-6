import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllLeaves, updateLeaveStatus } from "../api/leaveApi";

function AdminRequests() {
  const [leaves, setLeaves] = useState([]);
  const [remarks, setRemarks] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadLeaves = () => {
    getAllLeaves()
      .then((data) => setLeaves(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadLeaves();
  }, []);

  const handleAction = async (id, status) => {
    setError("");
    try {
      await updateLeaveStatus(id, status, remarks[id]);
      loadLeaves();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Leave Requests</h1>
      {error && <p className="error">{error}</p>}

      {leaves.length === 0 ? (
        <p>No leave requests yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Department</th>
              <th>Type</th>
              <th>From</th>
              <th>To</th>
              <th>Days</th>
              <th>Status</th>
              <th>Remarks / Action</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((leave) => (
              <tr key={leave._id}>
                <td>
                  <Link to={`/my-leaves/${leave._id}`}>{leave.employee?.name}</Link>
                </td>
                <td>{leave.employee?.department}</td>
                <td>{leave.leaveType?.name}</td>
                <td>{leave.fromDate.slice(0, 10)}</td>
                <td>{leave.toDate.slice(0, 10)}</td>
                <td>{leave.days}</td>
                <td className={`status ${leave.status}`}>{leave.status}</td>
                <td>
                  {leave.status === "pending" ? (
                    <>
                      <input
                        placeholder="Remarks"
                        value={remarks[leave._id] || ""}
                        onChange={(e) => setRemarks({ ...remarks, [leave._id]: e.target.value })}
                      />
                      <button onClick={() => handleAction(leave._id, "approved")}>Approve</button>
                      <button className="danger" onClick={() => handleAction(leave._id, "rejected")}>Reject</button>
                    </>
                  ) : (
                    leave.remarks || "-"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminRequests;
