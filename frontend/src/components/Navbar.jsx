import { NavLink } from "react-router-dom";

function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <h2>Leave Manager</h2>
      <div className="nav-links">
        {!user && (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        )}

        {user && user.role === "employee" && (
          <>
            <NavLink to="/apply-leave">Apply Leave</NavLink>
            <NavLink to="/my-leaves">My Leaves</NavLink>
          </>
        )}

        {user && user.role === "admin" && (
          <>
            <NavLink to="/admin/dashboard">Dashboard</NavLink>
            <NavLink to="/admin/requests">Requests</NavLink>
            <NavLink to="/admin/leave-types">Leave Types</NavLink>
          </>
        )}

        {user && (
          <>
            <span className="nav-user">Hi, {user.name} ({user.role})</span>
            <button onClick={onLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
