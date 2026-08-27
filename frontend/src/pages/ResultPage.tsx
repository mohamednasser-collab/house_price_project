import { useLocation, useNavigate } from "react-router-dom";
import "./ResultPage.css";

const INR_TO_USD = 0.012; // تقريبي - سعر الصرف بيتغير

function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const predictedPrice = location.state?.predicted_price as number | undefined;
  const property = location.state?.property as Record<string, string> | undefined;

  if (predictedPrice === undefined) {
    return (
      <main className="home-page">
        <header className="topbar">
          <div className="brand">
            <div className="brand-logo">H</div>
            <span>HousePredict</span>
          </div>
        </header>
        <section className="main-content">
          <section className="property-card result-empty">
            <p>No estimate found.</p>
            <button className="predict-button" onClick={() => navigate("/")}>
              <span>Go back</span>
            </button>
          </section>
        </section>
      </main>
    );
  }

  const priceUSD = predictedPrice * INR_TO_USD;
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(priceUSD);

  const summary = property
    ? [
        { label: "Location", value: property.location },
        { label: "Area", value: `${property.area_sqm} sq m` },
        { label: "Floor", value: property.floor_num },
        { label: "Bathrooms", value: property.bathroom },
        { label: "Furnishing", value: property.furnishing },
        { label: "Transaction", value: property.transaction },
      ]
    : [];

  return (
    <main className="home-page">
      <header className="topbar">
        <div className="brand">
          <div className="brand-logo">H</div>
          <span>HousePredict</span>
        </div>
        <div className="topbar-actions">
          <div className="profile-circle">M</div>
        </div>
      </header>

      <section className="main-content">
        <div className="intro">
          <div className="small-badge">ESTIMATE READY</div>
          <h1>
            Your property is worth
            <br />
            <span>around this much.</span>
          </h1>
        </div>

        <section className="property-card">
          <div className="result-hero">
            <p className="result-label">Estimated Value</p>
            <p className="result-price">{formatted}</p>
            <p className="result-note">Approximate conversion from INR at current model output</p>
          </div>

          {summary.length > 0 && (
            <div className="summary-grid">
              {summary.map((item) => (
                <div className="summary-row" key={item.label}>
                  <span className="summary-label">{item.label}</span>
                  <span className="summary-value">{item.value}</span>
                </div>
              ))}
            </div>
          )}

          <div className="result-actions">
            <button type="button" className="predict-button" onClick={() => navigate("/")}>
              <span className="button-icon">↻</span>
              <span>Estimate another property</span>
            </button>
          </div>
        </section>
      </section>

      <footer className="page-footer">
        <span>HousePredict</span>
        <span>Property valuation platform</span>
      </footer>
    </main>
  );
}

export default ResultPage;