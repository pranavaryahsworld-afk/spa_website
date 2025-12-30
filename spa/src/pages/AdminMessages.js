import { useEffect, useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import "./AdminDashboard.css";
import API_BASE_URL from "../utils/api";

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [replyText, setReplyText] = useState({});
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  /* =====================
     FETCH MESSAGES
  ===================== */
  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/contact`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data);
    } catch {
      toast.error("Failed to load messages");
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  /* =====================
     SEND REPLY
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

  /* =====================
     HELPERS
  ===================== */
  const openWhatsApp = (phone) => {
    if (!phone) {
      toast.error("Phone number not available");
      return;
    }

    const msg =
      "Hello! We have replied to your message. Thank you for contacting WellSpa 🌿";

    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  const callUser = (phone) => {
    if (!phone) {
      toast.error("Phone number not available");
      return;
    }

    window.location.href = `tel:${phone}`;
  };

  /* =====================
     UI
  ===================== */
  return (
    <div className="admin-dashboard">
      <Toaster position="top-right" />
      <h2>Contact Messages</h2>

      {messages.length === 0 && (
        <p style={{ textAlign: "center" }}>No messages found</p>
      )}

      {messages.map((m) => (
        <div key={m._id} className="card">
          <p>
            <b>
              {m.firstName} {m.lastName}
            </b>
          </p>
          <p>{m.message}</p>

          {m.phone ? (
            <p>📞 {m.phone}</p>
          ) : (
            <p style={{ color: "red" }}>No phone number</p>
          )}

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
            <button disabled={loading} onClick={() => sendReply(m._id)}>
              Reply (Email)
            </button>

            <button
              type="button"
              className="call-btn"
              onClick={() => callUser(m.phone)}
            >
              Call
            </button>

            <button
              type="button"
              className="whatsapp-btn"
              onClick={() => openWhatsApp(m.phone)}
            >
              WhatsApp
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
