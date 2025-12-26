import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    duration: "",
    image: "",
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/services");
      setServices(res.data);
    } catch {
      toast.error("Failed to load services");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addService = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("http://localhost:5000/api/services", {
        ...form,
        price: Number(form.price),
      });

      toast.success("Service added");
      setForm({
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

    try {
      await axios.delete(`http://localhost:5000/api/services/${id}`);
      toast.success("Service deleted");
      fetchServices();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Manage Services</h2>

      {/* ADD SERVICE FORM */}
      <form onSubmit={addService} style={{ marginBottom: "30px" }}>
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <input
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
        />

        <input
          name="duration"
          placeholder="Duration"
          value={form.duration}
          onChange={handleChange}
          required
        />

        <input
          name="image"
          placeholder="Image URL"
          value={form.image}
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        />

        <button disabled={loading}>
          {loading ? "Adding..." : "Add Service"}
        </button>
      </form>

      {/* SERVICE LIST */}
      {services.length === 0 ? (
        <p>No services yet</p>
      ) : (
        services.map((s) => (
          <div
            key={s._id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginBottom: "10px",
            }}
          >
            <h4>{s.title}</h4>
            <p>{s.description}</p>
            <p>
              ₹{s.price} • {s.duration}
            </p>

            <button onClick={() => deleteService(s._id)}>Delete</button>
          </div>
        ))
      )}
    </div>
  );
}
