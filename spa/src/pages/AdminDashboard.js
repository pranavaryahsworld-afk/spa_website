import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import "./AdminDashboard.css";
import API from "../utils/api";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeTab, setActiveTab] = useState("appointments");
  const [replyText, setReplyText] = useState({});
  const [loading, setLoading] = useState(false);

  /* =====================
     FETCH DATA
  ===================== */
  const fetchAppointments = useCallback(async () => {
    try {
      const res = await API.get("/api/appointments");
      setAppointments(res.data);
    } catch {
      toast.error("Failed to load appointments");
    }
  }, []);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await API.get("/api/contact");
      setMessages(res.data);
    } catch {
      toast.error("Failed to load messages");
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
    fetchMessages();
  }, [fetchAppointments, fetchMessages]);

  /* =====================
     APPOINTMENT ACTIONS
  ===================== */
  const updateStatus = async (id, status) => {
    setLoading(true);
    try {
      await API.put(`/api/appointments/${id}/status`, { status });

      toast.success(
        status === "approved"
          ? "Appointment approved & email sent"
          : "Appointment rejected & email sent"
      );

      fetchAppointments();
    } catch {
      toast.error("Status update failed");
    } finally {
      setLoading(false);
    }
  };

  const deleteAppointment = async (id) => {
    if (!window.confirm("Delete this appointment?")) return;

    setLoading(true);
    try {
      await API.delete(`/api/appointments/${id}`);
      toast.success("Appointment deleted");
      fetchAppointments();
    } catch {
      toast.error("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  /* =====================
     MESSAGE ACTIONS
  ===================== */
  const sendReply = async (id) => {
    const reply = replyText[id];
    if (!reply || !reply.trim()) {
      toast.error("Reply cannot be empty");
      return;
    }

    setLoading(true);
    try {
      await API.post(`/api/contact/${id}/reply`, { reply });
      toast.success("Reply sent via email");
      setReplyText((prev) => ({ ...prev, [id]: "" }));
      fetchMessages();
    } catch {
      toast.error("Failed to send reply");
    } finally {
      setLoading(false);
    }
  };

  const toggleRead = async (id, isRead) => {
    try {
      await API.put(`/api/contact/${id}/read`, { isRead: !isRead });
      fetchMessages();
    } catch {
      toast.error("Failed to update read status");
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm("Delete this message?")) return;

    setLoading(true);
    try {
      await API.delete(`/api/contact/${id}`);
      toast.success("Message deleted");
      fetchMessages();
    } catch {
      toast.error("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  /* =====================
     LOGOUT
  ===================== */
  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  /* =====================
     UI
  ===================== */
  return (
    <div className="admin-dashboard">
      <Toaster position="top-right" />

      <div className="admin-header">
        <h2>Admin Dashboard</h2>
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

      <div className="admin-tabs">
        <button
          className={activeTab === "appointments" ? "active" : ""}
          onClick={() => setActiveTab("appointments")}
        >
          Appointments
        </button>
        <button
          className={activeTab === "messages" ? "active" : ""}
          onClick={() => setActiveTab("messages")}
        >
          Messages
        </button>
      </div>

      {/* ================= APPOINTMENTS ================= */}
      {activeTab === "appointments" &&
        appointments.map((a) => (
          <div key={a._id} className="card">
            <p><b>{a.name}</b> — {a.treatment}</p>
            <p>{a.date} | {a.timeSlot}</p>
            <p>📞 {a.phone || "N/A"}</p>

            <div className="actions">
              <button
                disabled={loading}
                onClick={() => updateStatus(a._id, "approved")}
              >
                Approve
              </button>

              <button
                disabled={loading}
                onClick={() => updateStatus(a._id, "rejected")}
              >
                Reject
              </button>

              {a.phone && (
                <>
                  <a href={`tel:${a.phone}`} className="call-btn">Call</a>
                  <a
                    href={`https://wa.me/${a.phone}`}
                    target="_blank"
                    rel="noreferrer"
                    className="whatsapp-btn"
                  >
                    WhatsApp
                  </a>
                </>
              )}

              <button
                className="danger"
                onClick={() => deleteAppointment(a._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}

      {/* ================= MESSAGES ================= */}
      {activeTab === "messages" &&
        messages.map((m) => (
          <div key={m._id} className="card">
            <p><b>{m.firstName} {m.lastName}</b></p>
            <p>{m.message}</p>
            <p>📧 {m.email}</p>
            <p>📞 {m.phone || "N/A"}</p>

            <textarea
              placeholder="Reply..."
              value={replyText[m._id] || ""}
              onChange={(e) =>
                setReplyText((prev) => ({
                  ...prev,
                  [m._id]: e.target.value,
                }))
              }
            />

            <div className="actions">
              <button onClick={() => sendReply(m._id)}>Reply (Email)</button>

              {m.phone && (
                <>
                  <a href={`tel:${m.phone}`} className="call-btn">Call</a>
                  <a
                    href={`https://wa.me/${m.phone}`}
                    target="_blank"
                    rel="noreferrer"
                    className="whatsapp-btn"
                  >
                    WhatsApp
                  </a>
                </>
              )}

              <button onClick={() => toggleRead(m._id, m.isRead)}>
                {m.isRead ? "Unread" : "Read"}
              </button>

              <button
                className="danger"
                onClick={() => deleteMessage(m._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
    </div>
  );
}
