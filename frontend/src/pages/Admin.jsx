import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

const blank = {
  id: null,
  username: "",
  studentName: "",
  prn: "",
  branch: "Computer Engineering",
  semester: 4,
  subject1: "Data Structures & Algorithms",
  mse1: 0,
  ese1: 0,
  subject2: "Database Management Systems",
  mse2: 0,
  ese2: 0,
  subject3: "Web Technology",
  mse3: 0,
  ese3: 0,
  subject4: "Software Engineering",
  mse4: 0,
  ese4: 0
};

export default function Admin({ user, onLogout }) {
  const [results, setResults] = useState([]);
  const [form, setForm] = useState(blank);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const load = () => {
    api.get("/results")
      .then((res) => setResults(res.data))
      .catch((err) => setError(err.response?.data || "Could not load results."));
  };

  useEffect(() => {
    if (user?.role === "ADMIN") load();
  }, [user]);

  const update = (key, value) => setForm({ ...form, [key]: value });

  const startEdit = (item) => {
    setForm({
      id: item.id,
      username: item.username,
      studentName: item.studentName,
      prn: item.prn,
      branch: item.branch,
      semester: item.semester,
      subject1: item.subject1,
      mse1: item.mse1,
      ese1: item.ese1,
      subject2: item.subject2,
      mse2: item.mse2,
      ese2: item.ese2,
      subject3: item.subject3,
      mse3: item.mse3,
      ese3: item.ese3,
      subject4: item.subject4,
      mse4: item.mse4,
      ese4: item.ese4
    });
    setIsEditing(true);
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setForm(blank);
    setIsEditing(false);
    setMessage("");
    setError("");
  };

  const submit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const payload = {
      ...form,
      semester: Number(form.semester),
      mse1: Number(form.mse1), ese1: Number(form.ese1),
      mse2: Number(form.mse2), ese2: Number(form.ese2),
      mse3: Number(form.mse3), ese3: Number(form.ese3),
      mse4: Number(form.mse4), ese4: Number(form.ese4)
    };

    try {
      if (isEditing && form.id) {
        await api.put(`/results/${form.id}`, payload);
        setMessage("Result updated successfully!");
      } else {
        await api.post("/results", payload);
        setMessage("Result saved successfully!");
      }
      setForm(blank);
      setIsEditing(false);
      load();
    } catch (err) {
      setError(err.response?.data || "Could not save result.");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Are you sure you want to delete this result?")) return;
    try {
      await api.delete(`/results/${id}`);
      if (form.id === id) cancelEdit();
      load();
    } catch {
      setError("Could not delete result.");
    }
  };

  if (user?.role !== "ADMIN") {
    return <div className="loading">Access denied. Admin rights required.</div>;
  }

  return (
    <div className="app-page">
      <header className="topbar">
        <div>
          <div className="brand small">VIT</div>
          <span>Admin Result Management Panel</span>
        </div>
        <div className="top-actions">
          <Link to="/dashboard" className="admin-link">Student View</Link>
          <button className="secondary" onClick={onLogout}>Logout</button>
        </div>
      </header>

      <main className="container">
        <h1>{isEditing ? "Edit Semester Result" : "Prepare Semester Result"}</h1>
        <p className="muted">
          Four subjects with <b>MSE (30%)</b> and <b>ESE (70%)</b>. Total per subject is out of 100.
        </p>

        <form className="admin-form" onSubmit={submit}>
          <div className="grid two">
            <div>
              <label>Student Account Username</label>
              <input
                value={form.username}
                onChange={(e) => update("username", e.target.value)}
                placeholder="e.g. student"
                required
              />
            </div>
            <div>
              <label>Full Name</label>
              <input
                value={form.studentName}
                onChange={(e) => update("studentName", e.target.value)}
                placeholder="e.g. Pravin Tundurwar"
                required
              />
            </div>
            <div>
              <label>PRN (Permanent Registration Number)</label>
              <input
                value={form.prn}
                onChange={(e) => update("prn", e.target.value)}
                placeholder="e.g. 12210001"
                required
              />
            </div>
            <div>
              <label>Branch / Department</label>
              <input
                value={form.branch}
                onChange={(e) => update("branch", e.target.value)}
                required
              />
            </div>
            <div>
              <label>Semester</label>
              <input
                type="number"
                min="1"
                max="8"
                value={form.semester}
                onChange={(e) => update("semester", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="subject-grid">
            {[1, 2, 3, 4].map((i) => {
              const subTotal = (Number(form[`mse${i}`]) || 0) + (Number(form[`ese${i}`]) || 0);
              return (
                <div className="subject-card" key={i}>
                  <h3>Subject {i}</h3>
                  <label>Subject Name</label>
                  <input
                    value={form[`subject${i}`]}
                    onChange={(e) => update(`subject${i}`, e.target.value)}
                    required
                  />
                  <label>MSE Marks (Max 30)</label>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    step="0.5"
                    value={form[`mse${i}`]}
                    onChange={(e) => update(`mse${i}`, e.target.value)}
                    required
                  />
                  <label>ESE Marks (Max 70)</label>
                  <input
                    type="number"
                    min="0"
                    max="70"
                    step="0.5"
                    value={form[`ese${i}`]}
                    onChange={(e) => update(`ese${i}`, e.target.value)}
                    required
                  />
                  <div style={{ marginTop: "10px", fontSize: "13px", color: "#3158c9", fontWeight: "bold" }}>
                    Total: {subTotal.toFixed(1)} / 100
                  </div>
                </div>
              );
            })}
          </div>

          {message && <div className="success">{message}</div>}
          {error && <div className="error">{error}</div>}

          <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
            <button className="primary" type="submit">
              {isEditing ? "Update Result" : "Save Result"}
            </button>
            {isEditing && (
              <button className="secondary" type="button" onClick={cancelEdit}>
                Cancel Edit
              </button>
            )}
          </div>
        </form>

        <h2 className="section-title">Saved Results ({results.length})</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Student Name</th>
                <th>PRN</th>
                <th>Semester</th>
                <th>Total / 400</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {results.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", color: "#667085" }}>
                    No results saved yet. Use the form above to add one.
                  </td>
                </tr>
              ) : (
                results.map((r) => {
                  const grandTotal =
                    (Number(r.mse1) || 0) + (Number(r.ese1) || 0) +
                    (Number(r.mse2) || 0) + (Number(r.ese2) || 0) +
                    (Number(r.mse3) || 0) + (Number(r.ese3) || 0) +
                    (Number(r.mse4) || 0) + (Number(r.ese4) || 0);
                  return (
                    <tr key={r.id}>
                      <td><b>{r.username}</b></td>
                      <td>{r.studentName}</td>
                      <td>{r.prn}</td>
                      <td>Semester {r.semester}</td>
                      <td><b>{grandTotal.toFixed(1)}</b></td>
                      <td>
                        <button
                          className="secondary"
                          style={{ marginRight: "8px" }}
                          onClick={() => startEdit(r)}
                        >
                          Edit
                        </button>
                        <button className="danger" onClick={() => remove(r.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
