import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/authApi";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee",
    employeeId: "",
    department: "",
    designation: "",
    joiningDate: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await registerUser(formData);
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Register</h1>
      <form className="form" onSubmit={handleSubmit}>
        {error && <p className="error">{error}</p>}

        <label>Name</label>
        <input name="name" value={formData.name} onChange={handleChange} required />

        <label>Email</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />

        <label>Password</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} minLength="6" required />

        <label>Role</label>
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="employee">Employee</option>
          <option value="admin">Manager / Admin</option>
        </select>

        <label>Employee ID</label>
        <input name="employeeId" value={formData.employeeId} onChange={handleChange} required />

        <label>Department</label>
        <input name="department" value={formData.department} onChange={handleChange} placeholder="e.g. IT, HR, Sales" required />

        <label>Designation</label>
        <input name="designation" value={formData.designation} onChange={handleChange} required />

        <label>Joining Date</label>
        <input type="date" name="joiningDate" value={formData.joiningDate} onChange={handleChange} required />

        <button type="submit">Register</button>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
