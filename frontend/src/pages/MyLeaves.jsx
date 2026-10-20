import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyLeaves, getMyBalance } from "../api/leaveApi";

function MyLeaves({ user }) {
  const [leaves, setLeaves] = useState([]);
  const [balance, setBalance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getMyLeaves(), getMyBalance()])
      .then(([leavesData, balanceData]) => {
        setLeaves(leavesData);
        setBalance(balanceData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div>
      <h1>My Leaves</h1>
      <p>
        {user.name} | {user.employeeId} | {user.department} | {user.designation}
      </p>

      <h3>Leave Balance ({new Date().getFullYear()})</h3>
      {balance.length === 0 ? (
        <p>No leave types yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Total</th>
              <th>Used</th>
              <th>Remaining</th>
            </tr>
          </thead>
          <tbody>
            {balance.map((b) => (
              <tr key={b._id}>
                <td>{b.name}</td>
                <td>{b.total}</td>
                <td>{b.used}</td>
                <td>{b.remaining}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h3>Leave History</h3>
      {leaves.length === 0 ? (
        <p>
          You have not applied for any leave. <Link to="/apply-leave">Apply now</Link>
        </p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>From</th>
              <th>To</th>
              <th>Days</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((leave) => (
              <tr key={leave._id}>
                <td>{leave.leaveType?.name}</td>
                <td>{leave.fromDate.slice(0, 10)}</td>
                <td>{leave.toDate.slice(0, 10)}</td>
                <td>{leave.days}</td>
                <td className={`status ${leave.status}`}>{leave.status}</td>
                <td>
                  <Link to={`/my-leaves/${leave._id}`}>View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default MyLeaves;
