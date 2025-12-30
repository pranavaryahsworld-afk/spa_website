import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import "./AdminDashboard.css";
import API from "../utils/api";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("appointments");
  const [loading, setLoading] = useState(false);

  const [appointments, setAppointments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [services, setServices] = useState([]);

  const [replyText, setReplyText] = useState({});

  const [newService, setNewService] = useState({
    title: "",
    description: "",
    price: "",
    duration: "",
    imageUrl: "",
    imageFile: null,
  });

  /* ================= FETCH ================= */
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

  const fetchServices = useCallback(async () => {
    try {
      const res = await API.get("/api/services");
      setServices(res.data);
    } catch {
      toast.error("Failed to load services");
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
    fetchMessages();
    fetchServices();
  }, [fetchAppointments, fetchMessages, fetchServices]);

  /* ================= APPOINTMENTS ================= */
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

  /* ================= MESSAGES ================= */
  const sendReply = async (id) => {
    const reply = replyText[id];
    if (!reply?.trim()) {
      toast.error("Reply cannot be empty");
      return;
    }

    setLoading(true);
    try {
      await API.post(`/api/contact/${id}/reply`, { reply });
      toast.success("Reply sent via email");
      setReplyText((p) => ({ ...p, [id]: "" }));
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
      toast.error("Failed to update status");
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      await API.delete(`/api/contact/${id}`);
      toast.success("Message deleted");
      fetchMessages();
    } catch {
      toast.error("Delete failed");
    }
  };

  /* ================= SERVICES ================= */
  const addService = async () => {
    if (!newService.title || !newService.price || !newService.duration) {
      toast.error("Fill required fields");
      return;
    }

    const payload = {
      title: newService.title,
      description: newService.description,
      price: newService.price,
      duration: newService.duration,
      image: newService.imageUrl,
    };

    try {
      await API.post("/api/services", payload);
      toast.success("Service added");
      setNewService({
        title: "",
        description: "",
        price: "",
        duration: "",
        imageUrl: "",
        imageFile: null,
      });
      fetchServices();
    } catch {
      toast.error("Failed to add service");
    }
  };

  const deleteService = async (id) => {
    if (!window.confirm("Delete this service?")) return;
    try {
      await API.delete(`/api/services/${id}`);
      toast.success("Service deleted");
      fetchServices();
    } catch {
      toast.error("Delete failed");
    }
  };

  /* ================= LOGOUT ================= */
  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  /* ================= UI ================= */
  return (
    <div className="admin-dashboard">
      <Toaster position="top-right" />

      <div className="admin-header">
        <h2>Admin Dashboard</h2>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </div>

      <div className="admin-tabs">
        <button className={activeTab === "appointments" ? "active" : ""} onClick={() => setActiveTab("appointments")}>Appointments</button>
        <button className={activeTab === "messages" ? "active" : ""} onClick={() => setActiveTab("messages")}>Messages</button>
        <button className={activeTab === "services" ? "active" : ""} onClick={() => setActiveTab("services")}>Services</button>
      </div>

      {/* ================= APPOINTMENTS ================= */}
      {activeTab === "appointments" &&
        appointments.map((a) => (
          <div key={a._id} className="card">
            <p><b>{a.name}</b> — {a.treatment}</p>
            <p>{a.date} | {a.timeSlot}</p>
            <p>📞 {a.phone}</p>

            <div className="actions">
              <button onClick={() => updateStatus(a._id, "approved")}>Approve</button>
              <button onClick={() => updateStatus(a._id, "rejected")}>Reject</button>
              <a href={`tel:${a.phone}`} className="call-btn">Call</a>
              <a href={`https://wa.me/${a.phone}`} target="_blank" rel="noreferrer" className="whatsapp-btn">WhatsApp</a>
              <button className="danger" onClick={() => deleteAppointment(a._id)}>Delete</button>
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
              onChange={(e) => setReplyText({ ...replyText, [m._id]: e.target.value })}
            />

            <div className="actions">
              <button onClick={() => sendReply(m._id)}>Reply (Email)</button>
              <a href={`tel:${m.phone}`} className="call-btn">Call</a>
              <a href={`https://wa.me/${m.phone}`} target="_blank" rel="noreferrer" className="whatsapp-btn">WhatsApp</a>
              <button onClick={() => toggleRead(m._id, m.isRead)}>{m.isRead ? "Unread" : "Read"}</button>
              <button className="danger" onClick={() => deleteMessage(m._id)}>Delete</button>
            </div>
          </div>
        ))}

      {/* ================= SERVICES ================= */}
      {activeTab === "services" && (
        <>
          <div className="card">
            <h3>Add New Service</h3>

            <input placeholder="Title" value={newService.title} onChange={(e) => setNewService({ ...newService, title: e.target.value })} />
            <input placeholder="Description" value={newService.description} onChange={(e) => setNewService({ ...newService, description: e.target.value })} />
            <input placeholder="Price" value={newService.price} onChange={(e) => setNewService({ ...newService, price: e.target.value })} />
            <input placeholder="Duration" value={newService.duration} onChange={(e) => setNewService({ ...newService, duration: e.target.value })} />

            <input placeholder="Image URL (optional)" value={newService.imageUrl} onChange={(e) => setNewService({ ...newService, imageUrl: e.target.value })} />

            <button onClick={addService}>Add Service</button>
          </div>

          {services.map((s) => (
            <div key={s._id} className="card">
              <h4>{s.title}</h4>
              <p>{s.description}</p>
              <p>₹{s.price} | {s.duration}</p>
              <button className="danger" onClick={() => deleteService(s._id)}>Delete</button>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
