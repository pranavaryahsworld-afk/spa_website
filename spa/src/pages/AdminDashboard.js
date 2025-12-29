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
  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `${API_BASE_URL}/api/appointments/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Appointment ${status}`);
      fetchAppointments();
    } catch {
      toast.error("Status update failed");
    }
  };

  const deleteAppointment = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/appointments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Appointment deleted");
      fetchAppointments();
    } catch {
      toast.error("Delete failed");
    }
  };

  /* =====================
     MESSAGE ACTIONS
  ===================== */
  const sendReply = async (id) => {
    const reply = replyText[id];
    if (!reply?.trim()) {
      toast.error("Reply cannot be empty");
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}/api/contact/${id}/reply`,
        { reply },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Reply sent");
      setReplyText((prev) => ({ ...prev, [id]: "" }));
      fetchMessages();
    } catch {
      toast.error("Failed to send reply");
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
    try {
      await axios.delete(`${API_BASE_URL}/api/contact/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Message deleted");
      fetchMessages();
    } catch {
      toast.error("Delete failed");
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

      {activeTab === "appointments" &&
        appointments.map((a) => (
          <div key={a._id} className="card">
            <p><b>{a.name}</b> — {a.treatment}</p>
            <p>{a.date} | {a.timeSlot}</p>

            <div className="actions">
              <button onClick={() => updateStatus(a._id, "approved")}>Approve</button>
              <button onClick={() => updateStatus(a._id, "rejected")}>Reject</button>
              <button className="danger" onClick={() => deleteAppointment(a._id)}>
                Delete
              </button>
            </div>
          </div>
        ))}

      {activeTab === "messages" &&
        messages.map((m) => (
          <div key={m._id} className="card">
            <p><b>{m.firstName} {m.lastName}</b></p>
            <p>{m.message}</p>

            <textarea
              placeholder="Reply..."
              value={replyText[m._id] || ""}
              onChange={(e) =>
                setReplyText((prev) => ({ ...prev, [m._id]: e.target.value }))
              }
            />

            <div className="actions">
              <button onClick={() => sendReply(m._id)}>Reply</button>
              <button onClick={() => toggleRead(m._id, m.isRead)}>
                {m.isRead ? "Unread" : "Read"}
              </button>
              <button className="danger" onClick={() => deleteMessage(m._id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
    </div>
  );
}
