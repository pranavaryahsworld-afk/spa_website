import "./Gallery.css";

const images = [
  "https://images.unsplash.com/photo-1540555700478-4be289fbecef",
  "https://images.unsplash.com/photo-1540555700478-4be289fbecef",
  "https://images.unsplash.com/photo-1540555700478-4be289fbecef",
  "https://images.unsplash.com/photo-1540555700478-4be289fbecef",
  "https://images.unsplash.com/photo-1540555700478-4be289fbecef",
  "https://images.unsplash.com/photo-1540555700478-4be289fbecef",
];

export default function Gallery() {
  return (
    <section className="gallery-section">
      <h2 className="section-title reveal">Our Gallery</h2>

      <div className="gallery-grid">
        {images.map((img, i) => (
       <div
  key={i}
  className="gallery-item reveal image up"
  style={{ transitionDelay: `${i * 0.12}s` }}
>

            <img src={img} alt="Spa Gallery" />
          </div>
        ))}
      </div>
      
    </section>
  );
}
