import { useParams } from "react-router-dom";

export default function ServiceDetail() {
  const { slug } = useParams();

  return (
    <section style={{ padding: "100px", textAlign: "center" }}>
      <h1>{slug.replace("-", " ")}</h1>
      <p>
        Detailed information about this service will be displayed here.
      </p>
    </section>
  );
}
