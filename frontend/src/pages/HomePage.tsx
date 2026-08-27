import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

const locations = [
  "agra", "ahmadnagar", "ahmedabad", "allahabad", "aurangabad", "badlapur",
  "bangalore", "belgaum", "bhiwandi", "bhiwadi", "bhopal", "bhubaneswar",
  "chandigarh", "chennai", "coimbatore", "dehradun", "durgapur", "ernakulam",
  "faridabad", "ghaziabad", "goa", "greater-noida", "guntur", "gurgaon",
  "guwahati", "gwalior", "haridwar", "hyderabad", "indore", "jabalpur",
  "jaipur", "jamshedpur", "jodhpur", "kalyan", "kanpur", "kochi", "kolkata",
  "kozhikode", "lucknow", "ludhiana", "madurai", "mangalore", "mohali",
  "mumbai", "mysore", "nagpur", "nashik", "navi-mumbai", "navsari", "nellore",
  "new-delhi", "noida", "palakkad", "palghar", "panchkula", "patna",
  "pondicherry", "pune", "raipur", "rajahmundry", "ranchi", "satara",
  "shimla", "siliguri", "solapur", "sonipat", "surat", "thane", "thrissur",
  "tirupati", "trichy", "trivandrum", "udaipur", "udupi", "vadodara", "vapi",
  "varanasi", "vijayawada", "visakhapatnam", "vrindavan", "zirakpur", "other",
].sort();

const API_URL = "http://127.0.0.1:8000";
const SQM_TO_SQFT = 10.764;

function HomePage() {
  const navigate = useNavigate();

  const [areaSqm, setAreaSqm] = useState("");

  const [formData, setFormData] = useState({
    location: "",
    carpet_area_sqft: "",
    floor_num: "1",
    bathroom: "1",
    balcony: "0",
    car_parking: "0",
    furnishing: "",
    transaction: "",
    ownership: "",
    facing: "",
  });

  const [locationSearch, setLocationSearch] = useState("");
  const [locationOpen, setLocationOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const filteredLocations = locations.filter((location) =>
    location.toLowerCase().includes(locationSearch.toLowerCase())
  );

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocationSearch(value);
    setLocationOpen(true);
    setFormData((prev) => ({ ...prev, location: "" }));
  };

  const selectLocation = (location: string) => {
    setFormData((prev) => ({ ...prev, location }));
    setLocationSearch(location);
    setLocationOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ---- المساحة بالمتر المربع -> تتحول تلقائي لـ sqft قبل الإرسال ----
  const handleAreaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAreaSqm(value);

    const sqm = Number(value);
    setFormData((prev) => ({
      ...prev,
      carpet_area_sqft: value === "" || isNaN(sqm) ? "" : String(sqm * SQM_TO_SQFT),
    }));
  };

  const changeNumber = (
    field: "floor_num" | "bathroom" | "balcony" | "car_parking",
    amount: number
  ) => {
    setFormData((prev) => {
      const current = Number(prev[field]);
      const next = Math.max(0, current + amount);
      return { ...prev, [field]: String(next) };
    });
  };

  const handlePredict = async () => {
    setError("");

    if (!formData.location) return setError("Please select a location.");
    if (!formData.carpet_area_sqft) return setError("Please enter the carpet area.");
    if (!formData.furnishing) return setError("Please select the furnishing type.");
    if (!formData.transaction) return setError("Please select the transaction type.");
    if (!formData.ownership) return setError("Please select the ownership type.");
    if (!formData.facing) return setError("Please select the property facing.");

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: formData.location,
          carpet_area_sqft: Number(formData.carpet_area_sqft),
          floor_num: Number(formData.floor_num),
          bathroom: Number(formData.bathroom),
          balcony: Number(formData.balcony),
          car_parking: Number(formData.car_parking),
          furnishing: formData.furnishing,
          transaction: formData.transaction,
          ownership: formData.ownership,
          facing: formData.facing,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Prediction request failed.");
      }

      navigate("/result", {
        state: {
          predicted_price: data.predicted_price,
          property: { ...formData, area_sqm: areaSqm },
        },
      });
    } catch (err) {
      console.error(err);
      if (err instanceof TypeError) {
        setError("Cannot connect to the server. Make sure FastAPI is running.");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="home-page">
      <header className="topbar">
        <div className="brand">
          <div className="brand-logo">H</div>
          <span>HousePredict</span>
        </div>
        <div className="topbar-actions">
          <button className="icon-button" type="button" aria-label="Favorites">♡</button>
          <div className="profile-circle">M</div>
        </div>
      </header>

      <section className="main-content">
        <div className="intro">
          <div className="small-badge">PROPERTY VALUE</div>
          <h1>
            Find out what your
            <br />
            <span>property is worth.</span>
          </h1>
          <p>Enter your property details and get an estimated market value in seconds.</p>
        </div>

        <section className="property-card">
          <div className="card-header">
            <div>
              <span className="section-label">PROPERTY DETAILS</span>
              <h2>Tell us about your property</h2>
            </div>
            <div className="step-indicator">
              <span className="active-step">01</span>
              <span>/</span>
              <span>01</span>
            </div>
          </div>

          <div className="form-content">
            <div className="input-section">
              <label>Location</label>
              <div className={`location-wrapper ${locationOpen ? "location-active" : ""}`}>
                <div className="dark-input location-input">
                  <span className="location-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 10.5C20 15.5 12 21 12 21C12 21 4 15.5 4 10.5C4 6.91 7.58 4 12 4C16.42 4 20 6.91 20 10.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.8" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    value={locationOpen ? locationSearch : formData.location}
                    onFocus={() => { setLocationSearch(formData.location); setLocationOpen(true); }}
                    onChange={handleLocationChange}
                    placeholder="Search location..."
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    className={`location-arrow ${locationOpen ? "arrow-open" : ""}`}
                    onClick={() => setLocationOpen((prev) => !prev)}
                    aria-label="Toggle locations"
                  >
                    ↓
                  </button>
                </div>

                {locationOpen && (
                  <div className="location-dropdown">
                    {filteredLocations.length > 0 ? (
                      filteredLocations.map((location) => (
                        <button
                          key={location}
                          type="button"
                          className={`location-option ${formData.location === location ? "location-selected" : ""}`}
                          onClick={() => selectLocation(location)}
                        >
                          <span>{location}</span>
                          {formData.location === location && <span className="location-check">✓</span>}
                        </button>
                      ))
                    ) : (
                      <div className="no-location">No locations found</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="input-section">
              <label htmlFor="area_sqm">Carpet area</label>
              <div className="dark-input">
                <input
                  id="area_sqm"
                  type="number"
                  name="area_sqm"
                  value={areaSqm}
                  onChange={handleAreaChange}
                  placeholder="Enter area"
                  min="1"
                />
                <span className="unit">sq m</span>
              </div>
            </div>

            <div className="counter-grid">
              <Counter label="Floor" value={formData.floor_num} onMinus={() => changeNumber("floor_num", -1)} onPlus={() => changeNumber("floor_num", 1)} />
              <Counter label="Bathrooms" value={formData.bathroom} onMinus={() => changeNumber("bathroom", -1)} onPlus={() => changeNumber("bathroom", 1)} />
              <Counter label="Balconies" value={formData.balcony} onMinus={() => changeNumber("balcony", -1)} onPlus={() => changeNumber("balcony", 1)} />
              <Counter label="Car parking" value={formData.car_parking} onMinus={() => changeNumber("car_parking", -1)} onPlus={() => changeNumber("car_parking", 1)} />
            </div>

            <ChoiceGroup label="Furnishing" value={formData.furnishing} options={["Furnished", "Semi-Furnished", "Unfurnished"]} onChange={(value) => setFormData((prev) => ({ ...prev, furnishing: value }))} />
            <ChoiceGroup label="Transaction" value={formData.transaction} options={["New Property", "Resale", "Other", "Rent/Lease"]} onChange={(value) => setFormData((prev) => ({ ...prev, transaction: value }))} />
            <ChoiceGroup label="Ownership" value={formData.ownership} options={["Freehold", "Co-operative Society", "Power Of Attorney", "Leasehold"]} onChange={(value) => setFormData((prev) => ({ ...prev, ownership: value }))} />
            <ChoiceGroup label="Facing" value={formData.facing} options={["North", "North-East", "East", "South-East", "South", "South-West", "West", "North-West"]} onChange={(value) => setFormData((prev) => ({ ...prev, facing: value }))} />

            {error && <div className="error-message">{error}</div>}

            <button type="button" className="predict-button" onClick={handlePredict} disabled={loading}>
              <span className="button-icon">{loading ? "..." : "✦"}</span>
              <span>{loading ? "Estimating..." : "Estimate property value"}</span>
              <span className="button-arrow">{loading ? "" : "→"}</span>
            </button>

            <div className="privacy">Your property details are only used for this estimate.</div>
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

type CounterProps = { label: string; value: string; onMinus: () => void; onPlus: () => void; };

function Counter({ label, value, onMinus, onPlus }: CounterProps) {
  return (
    <div className="counter-section">
      <label>{label}</label>
      <div className="counter">
        <button type="button" className="counter-button" onClick={onMinus} aria-label={`Decrease ${label}`}>−</button>
        <div className="counter-value">{value}</div>
        <button type="button" className="counter-button" onClick={onPlus} aria-label={`Increase ${label}`}>+</button>
      </div>
    </div>
  );
}

type ChoiceGroupProps = { label: string; value: string; options: string[]; onChange: (value: string) => void; };

function ChoiceGroup({ label, value, options, onChange }: ChoiceGroupProps) {
  return (
    <div className="choice-section">
      <label>{label}</label>
      <div className="choices">
        {options.map((option) => (
          <button key={option} type="button" className={`choice ${value === option ? "selected" : ""}`} onClick={() => onChange(option)}>
            {option}
            {value === option && <span className="choice-check">✓</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

export default HomePage;