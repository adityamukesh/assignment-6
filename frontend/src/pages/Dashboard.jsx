import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDashboard } from "../api/leaveApi";

function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getDashboard()
      .then((result) => setData(result))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <div className="cards">
        <div className="card">
          <h3>Pending Requests</h3>
          <p className="big">{data.pendingCount}</p>
          <Link to="/admin/requests">View all</Link>
        </div>
        <div className="card">
          <h3>On Leave Today</h3>
          <p className="big">{data.onLeaveToday.length}</p>
        </div>
      </div>

      <h3>Employees on Leave Today</h3>
      {data.onLeaveToday.length === 0 ? (
        <p>Nobody is on leave today.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Department</th>
              <th>Type</th>
              <th>Till</th>
            </tr>
          </thead>
          <tbody>
            {data.onLeaveToday.map((leave) => (
              <tr key={leave._id}>
                <td>{leave.employee?.name}</td>
                <td>{leave.employee?.department}</td>
                <td>{leave.leaveType?.name}</td>
                <td>{leave.toDate.slice(0, 10)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h3>Approved Leaves per Department</h3>
      {data.departmentCounts.length === 0 ? (
        <p>No approved leaves yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Department</th>
              <th>Leaves</th>
              <th>Total Days</th>
            </tr>
          </thead>
          <tbody>
            {data.departmentCounts.map((d) => (
              <tr key={d.department}>
                <td>{d.department}</td>
                <td>{d.leaves}</td>
                <td>{d.days}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Dashboard;
