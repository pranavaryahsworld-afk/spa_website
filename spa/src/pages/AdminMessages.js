import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import "./AdminDashboard.css";

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(false);

  /* =====================
     FETCH MESSAGES
  ===================== */
  const fetchMessages = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/contact");
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
    if (!replyText.trim()) {
      toast.error("Reply cannot be empty");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `http://localhost:5000/api/contact/${id}/reply`,
        { reply: replyText }
      );
      toast.success("Reply sent");
      setReplyText("");
      fetchMessages();
    } catch {
      toast.error("Failed to send reply");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Contact Messages</h2>

      {messages.length === 0 && (
        <p className="empty">No messages yet</p>
      )}

      {messages.map((m) => (
        <div key={m._id} className="card">
          <p><b>{m.firstName} {m.lastName}</b></p>
          <p>📧 {m.email}</p>

          {/* 🔥 MOBILE NUMBER */}
          <p>📞 {m.phone}</p>

          <p>{m.message}</p>

          <textarea
            placeholder="Reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />

          <div className="actions">
            <button
              disabled={loading}
              onClick={() => sendReply(m._id)}
            >
              Reply
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
