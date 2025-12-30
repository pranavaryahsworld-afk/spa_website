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
     SERVICE FORM STATE
  ===================== */
  const [serviceForm, setServiceForm] = useState({
    _id: null,
    title: "",
    description: "",
    price: "",
    duration: "",
    image: "",
    imageFile: null,
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
    }
  };

  const deleteAppointment = async (id) => {
    if (!window.confirm("Delete appointment?")) return;
    await API.delete(`/api/appointments/${id}`);
    toast.success("Appointment deleted");
    fetchAppointments();
  };

  /* =====================
     MESSAGE ACTIONS
  ===================== */
  const sendReply = async (id) => {
    if (!replyText[id]) return toast.error("Reply empty");
    await API.post(`/api/contact/${id}/reply`, { reply: replyText[id] });
    toast.success("Reply sent");
    setReplyText({ ...replyText, [id]: "" });
    fetchMessages();
  };

  const deleteMessage = async (id) => {
    if (!window.confirm("Delete message?")) return;
    await API.delete(`/api/contact/${id}`);
    toast.success("Message deleted");
    fetchMessages();
  };

  /* =====================
     SERVICE ACTIONS
  ===================== */
  const submitService = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(serviceForm).forEach((k) => {
      if (serviceForm[k]) data.append(k, serviceForm[k]);
    });

    if (serviceForm._id) {
      await API.put(`/api/services/${serviceForm._id}`, data);
      toast.success("Service updated");
    } else {
      await API.post("/api/services", data);
      toast.success("Service added");
    }

    setServiceForm({
      _id: null,
      title: "",
      description: "",
      price: "",
      duration: "",
      image: "",
      imageFile: null,
    });

    fetchServices();
  };

  const editService = (s) => {
    setServiceForm(s);
    setActiveTab("services");
  };

  const deleteService = async (id) => {
    if (!window.confirm("Delete service?")) return;
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
      <Toaster />

      <div className="admin-header">
        <h2>Admin Dashboard</h2>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </div>

      <div className="admin-tabs">
        {["appointments", "messages", "services"].map((t) => (
          <button
            key={t}
            className={activeTab === t ? "active" : ""}
            onClick={() => setActiveTab(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
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
            <textarea
              placeholder="Reply..."
              value={replyText[m._id] || ""}
              onChange={(e) => setReplyText({ ...replyText, [m._id]: e.target.value })}
            />
            <div className="actions">
              <button onClick={() => sendReply(m._id)}>Reply</button>
              <button className="danger" onClick={() => deleteMessage(m._id)}>Delete</button>
            </div>
          </div>
        ))}

      {/* ================= SERVICES ================= */}
      {activeTab === "services" && (
        <>
          <form className="card" onSubmit={submitService}>
            <h3>{serviceForm._id ? "Edit Service" : "Add New Service"}</h3>

            <input placeholder="Title" value={serviceForm.title}
              onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })} />

            <textarea placeholder="Description" value={serviceForm.description}
              onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })} />

            <input placeholder="Price" value={serviceForm.price}
              onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })} />

            <input placeholder="Duration" value={serviceForm.duration}
              onChange={(e) => setServiceForm({ ...serviceForm, duration: e.target.value })} />

            <input placeholder="Image URL"
              onChange={(e) => setServiceForm({ ...serviceForm, image: e.target.value })} />

            <input type="file"
              onChange={(e) => setServiceForm({ ...serviceForm, imageFile: e.target.files[0] })} />

            <button type="submit">{serviceForm._id ? "Update" : "Add"} Service</button>
          </form>

          {services.map((s) => (
            <div key={s._id} className="card">
              <h3>{s.title}</h3>
              <p>{s.description}</p>
              <p>₹{s.price} | {s.duration}</p>
              <div className="actions">
                <button onClick={() => editService(s)}>Edit</button>
                <button className="danger" onClick={() => deleteService(s._id)}>Delete</button>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
