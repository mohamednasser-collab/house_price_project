import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div style={{ padding: "24px" }}>
      <h1>404 - Page Not Found</h1>
      <button onClick={() => navigate("/")}>Go Home</button>
    </div>
  );
}