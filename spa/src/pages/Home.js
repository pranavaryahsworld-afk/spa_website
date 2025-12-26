import Hero from "../components/Hero/Hero";

import About from "../components/About/About";
import ServiceSection from "./Services";
import Appointment from "../components/Appointment/Appointment";
import Feedback from "../components/Feedback/Feedback";
import BlogPreview from "../components/Blog/BlogPreview";
import Contact from "../components/Contact/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <section className="home-about reveal">
  <div className="about-container">
    <div className="about-image">
      <img
        src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571"
        alt="Spa Relaxation"
      />
    </div>

    <div className="about-content">
      <h2>Where Wellness Meets Luxury</h2>

      <p>
        At WellSpa, we believe true relaxation comes from balance.
        Our therapies are carefully crafted to rejuvenate your body,
        calm your mind, and restore inner harmony.
      </p>

      <ul>
        <li>✔ Certified & experienced therapists</li>
        <li>✔ Premium natural oils & products</li>
        <li>✔ Personalized wellness treatments</li>
        <li>✔ Calm, hygienic & private environment</li>
      </ul>
    </div>
  </div>
</section>

      <About />
      <ServiceSection />
      <Appointment />
      <Feedback />
      <BlogPreview />
      <Contact />
    </>
  );
}
