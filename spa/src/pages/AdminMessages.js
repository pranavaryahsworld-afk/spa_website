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
      toast.success("Reply sent");
      setReplyText((prev) => ({ ...prev, [id]: "" }));
      fetchMessages();
    } catch {
      toast.error("Failed to send reply");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-dashboard">
      <Toaster position="top-right" />
      <h2>Contact Messages</h2>

      {messages.map((m) => (
        <div key={m._id} className="card">
          <p><b>{m.firstName} {m.lastName}</b></p>
          <p>{m.message}</p>

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
              Reply
            </button>
            <a href={`tel:${m.phone}`} className="call-btn">Call</a>
            <a
              href={`https://wa.me/${m.phone}`}
              target="_blank"
              rel="noreferrer"
              className="whatsapp-btn"
            >
              WhatsApp
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
