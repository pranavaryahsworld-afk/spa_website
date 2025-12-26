import { useEffect, useState } from "react";
import "./Feedback.css";

const testimonials = [
  {
    name: "Ananya Sharma",
    location: "Mumbai",
    rating: 5,
    message:
      "Absolutely loved the experience! The ambience and service were top-notch. Highly recommended.",
  },
  {
    name: "Rahul Mehta",
    location: "Pune",
    rating: 4,
    message:
      "Very relaxing massage and professional staff. Felt refreshed after the session.",
  },
  {
    name: "Sneha Kapoor",
    location: "Thane",
    rating: 5,
    message:
      "One of the best spa experiences I’ve had. Clean, calm and very welcoming.",
  },
];

export default function Feedback() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const current = testimonials[index];

  return (
    <section className="feedback-page">
      <h2 className="feedback-title">What Our Clients Say</h2>

      <div className="testimonial-wrapper">
        <div className="testimonial-card">
          <div className="stars">
            {"★".repeat(current.rating)}
            {"☆".repeat(5 - current.rating)}
          </div>

          <p className="message">“{current.message}”</p>

          <div className="client">
            <h4>{current.name}</h4>
            <span>{current.location}</span>
          </div>
        </div>
      </div>

      {/* DOTS */}
      <div className="dots">
        {testimonials.map((_, i) => (
          <span
            key={i}
            className={i === index ? "dot active" : "dot"}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </section>
  );
}
 