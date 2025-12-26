import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./Dashboard.css";

export default function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");

  const fetchAppointments = useCallback(async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/appointments/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAppointments(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const cancelAppointment = async (id) => {
    if (!window.confirm("Cancel this appointment?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/appointments/${id}/cancel`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchAppointments();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  if (loading) return <p style={{ padding: 80 }}>Loading...</p>;

  return (
    <section className="dashboard">
      <h2>Welcome, {name}</h2>

      <h3>My Appointments</h3>

      {appointments.length === 0 ? (
        <p>No appointments yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Treatment</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {appointments.map((a) => (
              <tr key={a._id}>
                <td>{a.treatment}</td>
                <td>{a.date}</td>
                <td>{a.timeSlot}</td>
                <td>
                  <span className={`status ${a.status}`}>
                    {a.status}
                  </span>
                </td>
                <td>
                  {a.status === "pending" && (
                    <button
                      className="cancel-btn"
                      onClick={() => cancelAppointment(a._id)}
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
