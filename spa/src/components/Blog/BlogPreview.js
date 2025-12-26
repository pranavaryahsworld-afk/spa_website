import { Link } from "react-router-dom";
import "./BlogPreview.css";

export default function BlogPreview() {
  const blogs = [
    {
      title: "Benefits of Massage Therapy",
      desc: "Why massage is important for your health.",
    },
    {
      title: "Skin Care Tips",
      desc: "Daily routines for glowing skin.",
    },
  ];

  return (
    <section className="blog reveal">
      <h2>Latest Blogs</h2>

      <div className="blog-grid">
        {blogs.map((b, i) => (
          <div className="blog-card reveal" key={i}>
            <h3>{b.title}</h3>
            <p>{b.desc}</p>

            {/* ✅ GO TO BLOG PAGE */}
            <Link to="/blog">Read More</Link>
          </div>
        ))}
      </div>
    </section>
  );
}
