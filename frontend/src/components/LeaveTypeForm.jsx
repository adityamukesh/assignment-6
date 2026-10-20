import { useState } from "react";

function LeaveTypeForm({ initialData, onSubmit, buttonText }) {
  const [formData, setFormData] = useState(
    initialData || { name: "", daysPerYear: "", description: "" }
  );
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await onSubmit({
        name: formData.name,
        daysPerYear: Number(formData.daysPerYear),
        description: formData.description,
      });
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      {error && <p className="error">{error}</p>}

      <label>Name</label>
      <input name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Casual" required />

      <label>Days per year</label>
      <input type="number" name="daysPerYear" value={formData.daysPerYear} onChange={handleChange} min="1" required />

      <label>Description</label>
      <input name="description" value={formData.description} onChange={handleChange} />

      <button type="submit" disabled={saving}>
        {saving ? "Saving..." : buttonText}
      </button>
    </form>
  );
}

export default LeaveTypeForm;
