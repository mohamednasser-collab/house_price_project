import { useState } from "react";
import type { PredictionRequest } from "../types/prediction";

interface Props {
  locations: string[];
  onSubmit: (data: PredictionRequest) => void;
  loading: boolean;
}

const SQM_TO_SQFT = 10.764;

export default function PredictionForm({ locations, onSubmit, loading }: Props) {
  const [areaInSqm, setAreaInSqm] = useState(0);

  const [form, setForm] = useState<PredictionRequest>({
    location: locations[0] || "other",
    carpet_area_sqft: 0,
    floor_num: 0,
    bathroom: 1,
    balcony: 0,
    car_parking: 0,
    furnishing: "Unfurnished",
    transaction: "Resale",
    ownership: "Freehold",
    facing: "East",
  });

  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleAreaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sqm = Number(e.target.value);
    setAreaInSqm(sqm);
    setForm((prev) => ({
      ...prev,
      carpet_area_sqft: sqm * SQM_TO_SQFT,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.carpet_area_sqft <= 0) {
      setError("Carpet area must be greater than 0");
      return;
    }
    setError("");
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="form-grid">
      <div className="form-field full">
        <label>Location</label>
        <select name="location" value={form.location} onChange={handleChange}>
          {locations.map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
      </div>

      <div className="form-field">
        <label>Carpet Area (sqm)</label>
        <input
          type="number"
          name="area_sqm"
          value={areaInSqm}
          onChange={handleAreaChange}
          min="1"
          required
          placeholder="60"
        />
      </div>

      <div className="form-field">
        <label>Floor Number</label>
        <input
          type="number"
          name="floor_num"
          value={form.floor_num}
          onChange={handleChange}
          placeholder="5"
        />
      </div>

      <div className="form-field">
        <label>Bathrooms</label>
        <input
          type="number"
          name="bathroom"
          value={form.bathroom}
          onChange={handleChange}
          min="0"
        />
      </div>

      <div className="form-field">
        <label>Balconies</label>
        <input
          type="number"
          name="balcony"
          value={form.balcony}
          onChange={handleChange}
          min="0"
        />
      </div>

      <div className="form-field">
        <label>Car Parking</label>
        <input
          type="number"
          name="car_parking"
          value={form.car_parking}
          onChange={handleChange}
          min="0"
        />
      </div>

      <div className="form-field">
        <label>Furnishing</label>
        <select name="furnishing" value={form.furnishing} onChange={handleChange}>
          <option value="Unfurnished">Unfurnished</option>
          <option value="Semi-Furnished">Semi-Furnished</option>
          <option value="Furnished">Furnished</option>
        </select>
      </div>

      <div className="form-field">
        <label>Transaction</label>
        <select name="transaction" value={form.transaction} onChange={handleChange}>
          <option value="Resale">Resale</option>
          <option value="New Property">New Property</option>
          <option value="Other">Other</option>
          <option value="Rent/Lease">Rent/Lease</option>
        </select>
      </div>

      <div className="form-field">
        <label>Ownership</label>
        <select name="ownership" value={form.ownership} onChange={handleChange}>
          <option value="Freehold">Freehold</option>
          <option value="Co-operative Society">Co-operative Society</option>
          <option value="Power Of Attorney">Power Of Attorney</option>
          <option value="Leasehold">Leasehold</option>
        </select>
      </div>

      <div className="form-field">
        <label>Facing</label>
        <select name="facing" value={form.facing} onChange={handleChange}>
          <option value="East">East</option>
          <option value="West">West</option>
          <option value="North">North</option>
          <option value="South">South</option>
          <option value="North - East">North - East</option>
          <option value="North - West">North - West</option>
          <option value="South -West">South - West</option>
          <option value="South - East">South - East</option>
        </select>
      </div>

      {error && <p className="error-text">{error}</p>}

      <button type="submit" className="submit-btn" disabled={loading}>
        {loading ? "Predicting..." : "Predict Price"}
      </button>
    </form>
  );
}