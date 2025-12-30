import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import "./AdminDashboard.css";
import API from "../utils/api";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("appointments");

  const [appointments, setAppointments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [services, setServices] = useState([]);

  const [replyText, setReplyText] = useState({});
  const [loading, setLoading] = useState(false);

  /* =====================
     SERVICE FORM STATE
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
    const res = await API.get("/api/appointments");
    setAppointments(res.data);
  }, []);

  const fetchMessages = useCallback(async () => {
    const res = await API.get("/api/contact");
    setMessages(res.data);
  }, []);

  const fetchServices = useCallback(async () => {
    const res = await API.get("/api/services");
    setServices(res.data);
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
      toast.success(`Appointment ${status} & email sent`);
      fetchAppointments();
    } catch {
      toast.error("Status update failed");
    } finally {
      setLoading(false);
    }
  };

  /* =====================
     MESSAGE ACTIONS
  ===================== */
  const sendReply = async (id) => {
    const reply = replyText[id];
    if (!reply) return toast.error("Reply required");

    await API.post(`/api/contact/${id}/reply`, { reply });
    toast.success("Reply sent");
    setReplyText((p) => ({ ...p, [id]: "" }));
    fetchMessages();
  };

  /* =====================
     SERVICE ACTIONS
  ===================== */
  const handleServiceChange = (e) => {
    setServiceForm({ ...serviceForm, [e.target.name]: e.target.value });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setServiceForm((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const addService = async () => {
    const { title, description, price, duration } = serviceForm;
    if (!title || !description || !price || !duration) {
      return toast.error("All fields required");
    }

    await API.post("/api/services", serviceForm);
    toast.success("Service added");
    setServiceForm({
      title: "",
      description: "",
      price: "",
      duration: "",
      image: "",
    });
    fetchServices();
  };

  const deleteService = async (id) => {
    await API.delete(`/api/services/${id}`);
    toast.success("Service deleted");
    fetchServices();
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
        <button className="logout-btn" onClick={logout}>Logout</button>
      </div>

      <div className="admin-tabs">
        <button onClick={() => setActiveTab("appointments")} className={activeTab==="appointments"?"active":""}>Appointments</button>
        <button onClick={() => setActiveTab("messages")} className={activeTab==="messages"?"active":""}>Messages</button>
        <button onClick={() => setActiveTab("services")} className={activeTab==="services"?"active":""}>Services</button>
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
            </div>
          </div>
        ))}

      {/* ================= MESSAGES ================= */}
      {activeTab === "messages" &&
        messages.map((m) => (
          <div key={m._id} className="card">
            <p><b>{m.firstName} {m.lastName}</b></p>
            <p>{m.message}</p>

            <textarea
              value={replyText[m._id] || ""}
              onChange={(e) => setReplyText({ ...replyText, [m._id]: e.target.value })}
              placeholder="Reply..."
            />

            <div className="actions">
              <button onClick={() => sendReply(m._id)}>Reply</button>
              <a href={`tel:${m.phone}`} className="call-btn">Call</a>
              <a href={`https://wa.me/${m.phone}`} className="whatsapp-btn">WhatsApp</a>
            </div>
          </div>
        ))}

      {/* ================= SERVICES ================= */}
      {activeTab === "services" && (
        <>
          <div className="card">
            <h3>Add New Service</h3>

            <input name="title" placeholder="Title" value={serviceForm.title} onChange={handleServiceChange} />
            <input name="description" placeholder="Description" value={serviceForm.description} onChange={handleServiceChange} />
            <input name="price" placeholder="Price" value={serviceForm.price} onChange={handleServiceChange} />
            <input name="duration" placeholder="Duration" value={serviceForm.duration} onChange={handleServiceChange} />

            <input placeholder="Image URL" name="image" value={serviceForm.image} onChange={handleServiceChange} />
            <input type="file" accept="image/*" onChange={handleFileUpload} />

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
