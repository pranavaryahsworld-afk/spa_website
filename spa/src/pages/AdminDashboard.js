import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import "./AdminDashboard.css";
import API from "../utils/api";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [services, setServices] = useState([]);

  const [activeTab, setActiveTab] = useState("appointments");
  const [replyText, setReplyText] = useState({});
  const [loading, setLoading] = useState(false);

  /* =====================
     NEW SERVICE FORM
  ===================== */
  const [serviceForm, setServiceForm] = useState({
    title: "",
    description: "",
    price: "",
    duration: "",
    image: "",
  });

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
     SERVICE ACTIONS
  ===================== */
  const handleServiceChange = (e) => {
    setServiceForm({ ...serviceForm, [e.target.name]: e.target.value });
  };

  const addService = async (e) => {
    e.preventDefault();

    if (
      !serviceForm.title ||
      !serviceForm.description ||
      !serviceForm.price ||
      !serviceForm.duration
    ) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);
    try {
      await API.post("/api/services", serviceForm);
      toast.success("Service added successfully");
      setServiceForm({
        title: "",
        description: "",
        price: "",
        duration: "",
        image: "",
      });
      fetchServices();
    } catch {
      toast.error("Failed to add service");
    } finally {
      setLoading(false);
    }
  };

  const deleteService = async (id) => {
    if (!window.confirm("Delete this service?")) return;
    setLoading(true);
    try {
      await API.delete(`/api/services/${id}`);
      toast.success("Service deleted");
      fetchServices();
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
        <button
          className={activeTab === "services" ? "active" : ""}
          onClick={() => setActiveTab("services")}
        >
          Services
        </button>
      </div>

      {/* ================= SERVICES ================= */}
      {activeTab === "services" && (
        <>
          <form className="card" onSubmit={addService}>
            <h3>Add New Service</h3>

            <input
              name="title"
              placeholder="Title"
              value={serviceForm.title}
              onChange={handleServiceChange}
            />
            <input
              name="description"
              placeholder="Description"
              value={serviceForm.description}
              onChange={handleServiceChange}
            />
            <input
              name="price"
              placeholder="Price"
              value={serviceForm.price}
              onChange={handleServiceChange}
            />
            <input
              name="duration"
              placeholder="Duration"
              value={serviceForm.duration}
              onChange={handleServiceChange}
            />
            <input
              name="image"
              placeholder="Image URL (optional)"
              value={serviceForm.image}
              onChange={handleServiceChange}
            />

            <button type="submit" disabled={loading}>
              Add Service
            </button>
          </form>

          {services.map((s) => (
            <div key={s._id} className="card">
              <p><b>{s.title}</b></p>
              <p>{s.description}</p>
              <p>₹{s.price} | {s.duration}</p>

              <div className="actions">
                <button
                  className="danger"
                  onClick={() => deleteService(s._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
