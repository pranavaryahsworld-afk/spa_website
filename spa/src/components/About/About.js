import "./About.css";

export default function About() {
  return (
    <section className="about-section">
      <div className="about-container">

        {/* TEXT CONTENT */}
        <div className="about-content reveal left">
          <h2>About WellSpa</h2>

          <p className="about-intro">
            A place where relaxation meets renewal.
          </p>

          <p>
            WellSpa was created with one simple belief — true wellness is not a
            luxury, it is a necessity. In today’s fast-paced life, your body
            and mind deserve moments of calm, care, and balance.
          </p>

          <p>
            Our therapies are thoughtfully designed to release stress, restore
            energy, and reconnect you with yourself. Every treatment at
            WellSpa blends traditional techniques with modern comfort to
            deliver a deeply rejuvenating experience.
          </p>

          {/* FEATURES */}
          <div className="about-features">
            <div className="feature reveal up" style={{ transitionDelay: "0.1s" }}>
              <h4>Experienced Therapists</h4>
              <p>
                Our certified professionals bring years of expertise and
                personalized care to every session.
              </p>
            </div>

            <div className="feature reveal up" style={{ transitionDelay: "0.25s" }}>
              <h4>Premium Treatments</h4>
              <p>
                From relaxation massages to advanced skin therapies, we use
                high-quality products and proven techniques.
              </p>
            </div>

            <div className="feature reveal up" style={{ transitionDelay: "0.4s" }}>
              <h4>Calm & Hygienic Space</h4>
              <p>
                A peaceful environment designed to help you disconnect,
                unwind, and feel completely at ease.
              </p>
            </div>
          </div>
        </div>

        {/* IMAGE */}
        <div className="about-image reveal right image">
          <img
            src="https://images.unsplash.com/photo-1556228578-8c89e6adf883"
            alt="Luxury Spa Experience"
          />
        </div>

      </div>
    </section>
  );
}
