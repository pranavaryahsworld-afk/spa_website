import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import "./Auth.css";

export default function Signup() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    otp: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendOTP = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/signup-otp", form);
      toast.success("OTP sent to email");
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP failed");
    }
  };

  const verifyOTP = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/verify-otp", {
        email: form.email,
        otp: form.otp,
      });
      toast.success("Signup successful");
      navigate("/login");
    } catch {
      toast.error("Invalid or expired OTP");
    }
  };

  return (
    <div className="auth-container">
      <h2>{step === 1 ? "Sign Up" : "Verify OTP"}</h2>

      {step === 1 && (
        <form onSubmit={sendOTP}>
          <input name="name" placeholder="Name" onChange={handleChange} />
          <input name="email" placeholder="Email" onChange={handleChange} />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
          />
          <button>Send OTP</button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={verifyOTP}>
          <input
            name="otp"
            placeholder="Enter OTP"
            onChange={handleChange}
          />
          <button>Verify OTP</button>
        </form>
      )}
    </div>
  );
}
