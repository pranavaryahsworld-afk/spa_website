import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import "./AdminDashboard.css";
import API_BASE_URL from "../utils/api";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeTab, setActiveTab] = useState("appointments");
  const [replyText, setReplyText] = useState({});
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  /* =====================
     FETCH DATA
  ===================== */
  const fetchAppointments = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(res.data);
    } catch {
      toast.error("Failed to load appointments");
    }
  }, [token]);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/contact`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data);
    } catch {
      toast.error("Failed to load messages");
    }
  }, [token]);

  useEffect(() => {
    fetchAppointments();
    fetchMessages();
  }, [fetchAppointments, fetchMessages]);

  /* =====================
     APPOINTMENT ACTIONS
  ===================== */
  const updateStatus = async (id, status, phone) => {
    setLoading(true);
    try {
      await axios.put(
        `${API_BASE_URL}/api/appointments/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(`Appointment ${status}`);
      fetchAppointments();

      // WhatsApp auto-open
      if (phone) {
        const msg = `Hello, your appointment has been ${status}. Thank you for choosing WellSpa 🌿`;
        window.open(
          `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`,
          "_blank"
        );
      }
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
      await axios.delete(`${API_BASE_URL}/api/appointments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
  const sendReply = async (id, email) => {
    const reply = replyText[id];
    if (!reply || !reply.trim()) {
      toast.error("Reply cannot be empty");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${API_BASE_URL}/api/contact/${id}/reply`,
        { reply },
        { headers: { Authorization: `Bearer ${token}` } }
      );
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
      await axios.put(
        `${API_BASE_URL}/api/contact/${id}/read`,
        { isRead: !isRead },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchMessages();
    } catch {
      toast.error("Failed to update read status");
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm("Delete this message?")) return;

    setLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/api/contact/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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

      {a.phone ? (
        <p>📞 {a.phone}</p>
      ) : (
        <p style={{ color: "red" }}>No phone number</p>
      )}

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
            <a href={`tel:${a.phone}`} className="call-btn">
              Call
            </a>

            <a
              href={`https://wa.me/${a.phone}?text=${encodeURIComponent(
                "Hello, your appointment has been updated. Thank you for choosing WellSpa 🌿"
              )}`}
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
            <p>📞 {m.phone}</p>

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
              <button onClick={() => sendReply(m._id, m.email)}>
                Reply (Email)
              </button>

              <a href={`tel:${m.phone}`} className="call-btn">
                Call
              </a>

              <a
                href={`https://wa.me/${m.phone}`}
                target="_blank"
                rel="noreferrer"
                className="whatsapp-btn"
              >
                WhatsApp
              </a>

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
