import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeTab, setActiveTab] = useState("appointments");

  // ✅ per-message reply state
  const [replyText, setReplyText] = useState({});

  const [loading, setLoading] = useState(false);

  const [confirmBox, setConfirmBox] = useState({
    open: false,
    action: null,
    id: null,
  });

  /* =====================
     FETCH DATA
  ===================== */
  useEffect(() => {
    fetchAppointments();
    fetchMessages();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/appointments");
      setAppointments(res.data);
    } catch {
      toast.error("Failed to load appointments");
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/contact");
      setMessages(res.data);
    } catch {
      toast.error("Failed to load messages");
    }
  };

  /* =====================
     APPOINTMENT ACTIONS
  ===================== */
  const updateStatus = async (id, status) => {
    setLoading(true);
    try {
      await axios.put(
        `http://localhost:5000/api/appointments/${id}/status`,
        { status }
      );
      toast.success(`Appointment ${status}`);
      fetchAppointments();
    } catch {
      toast.error("Status update failed");
    } finally {
      setLoading(false);
    }
  };

  const deleteAppointment = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/appointments/${id}`);
      toast.success("Appointment deleted");
      fetchAppointments();
    } catch {
      toast.error("Delete failed");
    } finally {
      setLoading(false);
      closeConfirm();
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
      await axios.post(
        `http://localhost:5000/api/contact/${id}/reply`,
        { reply }
      );
      toast.success("Reply sent");

      setReplyText((prev) => ({
        ...prev,
        [id]: "",
      }));

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
        `http://localhost:5000/api/contact/${id}/read`,
        { isRead: !isRead }
      );
      fetchMessages();
    } catch {
      toast.error("Failed to update read status");
    }
  };

  const deleteMessage = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/contact/${id}`);
      toast.success("Message deleted");
      fetchMessages();
    } catch {
      toast.error("Delete failed");
    } finally {
      setLoading(false);
      closeConfirm();
    }
  };

  /* =====================
     CONFIRM MODAL
  ===================== */
  const openConfirm = (action, id) => {
    setConfirmBox({ open: true, action, id });
  };

  const closeConfirm = () => {
    setConfirmBox({ open: false, action: null, id: null });
  };

  const confirmAction = () => {
    if (confirmBox.action === "deleteAppointment") {
      deleteAppointment(confirmBox.id);
    }
    if (confirmBox.action === "deleteMessage") {
      deleteMessage(confirmBox.id);
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

      {/* APPOINTMENTS */}
      {activeTab === "appointments" &&
        appointments.map((a) => (
          <div key={a._id} className="card">
            <div className="card-header">
              <p><b>{a.name}</b> — {a.treatment}</p>
              <span className={`status ${a.status}`}>{a.status}</span>
            </div>

            <p className="time">{a.date} | {a.timeSlot}</p>

     <div className="actions">
  <button
    disabled={loading || a.status === "approved"}
    onClick={() => updateStatus(a._id, "approved")}
  >
    Approve
  </button>

  <button
    disabled={loading || a.status === "rejected"}
    onClick={() => updateStatus(a._id, "rejected")}
  >
    Reject
  </button>

  {a.status === "approved" && (
    <a
      href={`https://wa.me/91${a.phone}?text=${encodeURIComponent(
        `Hello ${a.name} 👋\n\nYour appointment for ${a.treatment}\n📅 ${a.date}\n⏰ ${a.timeSlot}\n\n✅ Status: APPROVED\n\nThank you,\nWellSpa`
      )}`}
      target="_blank"
      rel="noopener noreferrer"
      className="btn-whatsapp"
    >
      💬 WhatsApp
    </a>
  )}
    {a.status === "rejected" && (
    <a
      href={`https://wa.me/91${a.phone}?text=${encodeURIComponent(
        `Hello ${a.name} 👋\n\nUnfortunately, your appointment for ${a.treatment}\n📅 ${a.date}\n⏰ ${a.timeSlot}\n\n❌ Status: REJECTED\n\nPlease contact us to reschedule.\n\n— WellSpa`
      )}`}
      target="_blank"
      rel="noopener noreferrer"
      className="btn-whatsapp rejected"
    >
      💬 WhatsApp
    </a>
  )}

  <button
    className="danger"
    onClick={() => openConfirm("deleteAppointment", a._id)}
  >
    Delete
  </button>
</div>

          </div>
        ))}

      {/* MESSAGES */}
      {activeTab === "messages" &&
        messages.map((m) => (
<div
  key={m._id}
  className="card"
  style={{
    borderLeft: m.isRead ? "none" : "5px solid #ff8a65",
  }}
>
            <p><b>{m.firstName} {m.lastName}</b></p>
            <p>📧 {m.email}</p>
            <p>📞 {m.phone}</p>
            <p>{m.message}</p>

            {/* 📞 CALL + 💬 WHATSAPP */}
            <div className="actions">
              <a
                href={`tel:${m.phone}`}
                className="btn-call"
              >
                📞 Call
              </a>

              <a
                href={`https://wa.me/91${m.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp"
              >
                💬 WhatsApp
              </a>
            </div>

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
              <button onClick={() => sendReply(m._id)}>Reply</button>
              <button onClick={() => toggleRead(m._id, m.isRead)}>
                {m.isRead ? "Unread" : "Read"}
              </button>
              <button
                className="danger"
                onClick={() => openConfirm("deleteMessage", m._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}

      {confirmBox.open && (
        <div className="modal">
          <div className="modal-box">
            <p>Are you sure?</p>
            <div className="actions">
              <button onClick={confirmAction}>Yes</button>
              <button onClick={closeConfirm}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
