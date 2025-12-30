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
  });

  const [editingServiceId, setEditingServiceId] = useState(null);
  const [editService, setEditService] = useState({});

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
    try {
      await API.delete(`/api/appointments/${id}`);
      toast.success("Appointment deleted");
      fetchAppointments();
    } catch {
      toast.error("Delete failed");
    }
  };

  /* ================= MESSAGES ================= */
  const sendReply = async (id) => {
    const reply = replyText[id];
    if (!reply?.trim()) return toast.error("Reply cannot be empty");

    try {
      await API.post(`/api/contact/${id}/reply`, { reply });
      toast.success("Reply sent via email");
      setReplyText((p) => ({ ...p, [id]: "" }));
      fetchMessages();
    } catch {
      toast.error("Failed to send reply");
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
      return toast.error("Fill required fields");
    }

    try {
      await API.post("/api/services", {
        title: newService.title,
        description: newService.description,
        price: newService.price,
        duration: newService.duration,
        image: newService.imageUrl,
      });

      toast.success("Service added");
      setNewService({
        title: "",
        description: "",
        price: "",
        duration: "",
        imageUrl: "",
      });
      fetchServices();
    } catch {
      toast.error("Failed to add service");
    }
  };

  const startEdit = (service) => {
    setEditingServiceId(service._id);
    setEditService({ ...service });
  };

  const updateService = async () => {
    try {
      await API.put(`/api/services/${editingServiceId}`, editService);
      toast.success("Service updated");
      setEditingServiceId(null);
      fetchServices();
    } catch {
      toast.error("Update failed");
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

      {/* ================= SERVICES ================= */}
      {activeTab === "services" && (
        <>
          <div className="card service-form">
            <h3>Add New Service</h3>
            <input placeholder="Title" value={newService.title} onChange={(e) => setNewService({ ...newService, title: e.target.value })} />
            <input placeholder="Description" value={newService.description} onChange={(e) => setNewService({ ...newService, description: e.target.value })} />
            <input placeholder="Price" value={newService.price} onChange={(e) => setNewService({ ...newService, price: e.target.value })} />
            <input placeholder="Duration" value={newService.duration} onChange={(e) => setNewService({ ...newService, duration: e.target.value })} />
            <input placeholder="Image URL (optional)" value={newService.imageUrl} onChange={(e) => setNewService({ ...newService, imageUrl: e.target.value })} />
            <button onClick={addService}>Add Service</button>
          </div>

          {services.map((s) => (
            <div key={s._id} className="card service-card">
              {editingServiceId === s._id ? (
                <>
                  <input value={editService.title} onChange={(e) => setEditService({ ...editService, title: e.target.value })} />
                  <input value={editService.description} onChange={(e) => setEditService({ ...editService, description: e.target.value })} />
                  <input value={editService.price} onChange={(e) => setEditService({ ...editService, price: e.target.value })} />
                  <input value={editService.duration} onChange={(e) => setEditService({ ...editService, duration: e.target.value })} />
                  <input value={editService.image || ""} onChange={(e) => setEditService({ ...editService, image: e.target.value })} />
                  <div className="actions">
                    <button onClick={updateService}>Save</button>
                    <button onClick={() => setEditingServiceId(null)}>Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <h4>{s.title}</h4>
                  <p>{s.description}</p>
                  <p>₹{s.price} | {s.duration}</p>
                  <div className="actions">
                    <button onClick={() => startEdit(s)}>Edit</button>
                    <button className="danger" onClick={() => deleteService(s._id)}>Delete</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
