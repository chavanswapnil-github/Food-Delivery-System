import { useEffect, useRef, useState } from "react";
import { FiHome, FiBriefcase, FiMapPin, FiX, FiUser, FiPhone, FiCheck } from "react-icons/fi";
import LocationPicker from "../LocationPicker/LocationPicker";
import "./AddressFormModal.css";

const TYPE_OPTIONS = [
  { key: "Home", icon: <FiHome />, hint: "Delivered to your residence" },
  { key: "Work", icon: <FiBriefcase />, hint: "Delivered to your workplace" },
  { key: "Other", icon: <FiMapPin />, hint: "Any other delivery spot" },
];

const emptyForm = {
  full_name: "",
  phone: "",
  address_line: "",
  city: "",
  state: "",
  pincode: "",
  address_type: "Home",
  latitude: null,
  longitude: null,
};

const PHONE_RE = /^[6-9]\d{9}$/;
const PINCODE_RE = /^\d{6}$/;

function validate(form) {
  const errors = {};

  if (!form.full_name?.trim()) errors.full_name = "Name is required";

  const digits = (form.phone || "").replace(/\D/g, "").slice(-10);
  if (!PHONE_RE.test(digits)) errors.phone = "Enter a valid 10-digit mobile number";

  if (!form.address_line?.trim() || form.address_line.trim().length < 5) {
    errors.address_line = "Enter a complete address (at least 5 characters)";
  }

  if (!form.city?.trim()) errors.city = "City is required";

  if (!PINCODE_RE.test(form.pincode || "")) errors.pincode = "Enter a valid 6-digit pincode";

  return errors;
}

function AddressFormModal({ initialData, onClose, onSave }) {
  const [form, setForm] = useState(initialData ? { ...emptyForm, ...initialData } : emptyForm);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const nameInputRef = useRef(null);

  const update = (patch) => setForm((f) => ({ ...f, ...patch }));
  const markTouched = (field) => setTouched((t) => ({ ...t, [field]: true }));

  // Close on Escape, and focus the first field so typing can start right away.
  useEffect(() => {
    nameInputRef.current?.focus();
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // When a location is picked on the map, fill in the address fields —
  // but don't clobber anything the person already typed by hand.
  const handleLocationChange = (loc) => {
    setForm((f) => ({
      ...f,
      latitude: loc.lat,
      longitude: loc.lng,
      address_line: f.address_line?.trim() ? f.address_line : loc.address_line,
      city: f.city?.trim() ? f.city : loc.city,
      state: f.state?.trim() ? f.state : loc.state,
      pincode: f.pincode?.trim() ? f.pincode : loc.pincode,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const foundErrors = validate(form);
    setErrors(foundErrors);
    setTouched({
      full_name: true,
      phone: true,
      address_line: true,
      city: true,
      pincode: true,
    });

    if (Object.keys(foundErrors).length > 0) return;

    setSaving(true);
    try {
      await onSave({ ...form, phone: form.phone.replace(/\D/g, "").slice(-10) });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="afm-overlay" onClick={onClose}>
      <div className="afm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="afm-header">
          <div>
            <h2>{initialData ? "Edit Address" : "Add New Address"}</h2>
            <p className="afm-subtitle">Pin the exact spot so your delivery never goes astray</p>
          </div>
          <button type="button" className="afm-close" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <form className="afm-body" onSubmit={handleSubmit}>
          <section className="afm-section">
            <h4 className="afm-section-title">Delivery Location</h4>
            <LocationPicker
              latitude={form.latitude}
              longitude={form.longitude}
              onChange={handleLocationChange}
            />
          </section>

          <section className="afm-section">
            <h4 className="afm-section-title">Contact Details</h4>
            <div className="afm-grid">
              <div className="afm-field">
                <div className={`afm-input-icon ${touched.full_name && errors.full_name ? "afm-invalid" : ""}`}>
                  <FiUser />
                  <input
                    ref={nameInputRef}
                    required
                    placeholder="Full Name"
                    value={form.full_name}
                    onChange={(e) => update({ full_name: e.target.value })}
                    onBlur={() => markTouched("full_name")}
                  />
                </div>
                {touched.full_name && errors.full_name && (
                  <span className="afm-error">{errors.full_name}</span>
                )}
              </div>
              <div className="afm-field">
                <div className={`afm-input-icon ${touched.phone && errors.phone ? "afm-invalid" : ""}`}>
                  <FiPhone />
                  <input
                    required
                    placeholder="Phone Number"
                    value={form.phone}
                    maxLength={10}
                    onChange={(e) => update({ phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                    onBlur={() => markTouched("phone")}
                  />
                </div>
                {touched.phone && errors.phone && <span className="afm-error">{errors.phone}</span>}
              </div>
            </div>
          </section>

          <section className="afm-section">
            <h4 className="afm-section-title">Address Details</h4>
            <div className="afm-field">
              <textarea
                required
                className={touched.address_line && errors.address_line ? "afm-invalid" : ""}
                placeholder="Flat / House No. / Building / Street"
                value={form.address_line}
                onChange={(e) => update({ address_line: e.target.value })}
                onBlur={() => markTouched("address_line")}
              />
              {touched.address_line && errors.address_line && (
                <span className="afm-error">{errors.address_line}</span>
              )}
            </div>

            <div className="afm-grid afm-grid-3">
              <div className="afm-field">
                <input
                  required
                  className={touched.city && errors.city ? "afm-invalid" : ""}
                  placeholder="City"
                  value={form.city}
                  onChange={(e) => update({ city: e.target.value })}
                  onBlur={() => markTouched("city")}
                />
                {touched.city && errors.city && <span className="afm-error">{errors.city}</span>}
              </div>
              <input
                placeholder="State"
                value={form.state}
                onChange={(e) => update({ state: e.target.value })}
              />
              <div className="afm-field">
                <input
                  required
                  className={touched.pincode && errors.pincode ? "afm-invalid" : ""}
                  placeholder="Pincode"
                  value={form.pincode}
                  maxLength={6}
                  onChange={(e) => update({ pincode: e.target.value.replace(/\D/g, "").slice(0, 6) })}
                  onBlur={() => markTouched("pincode")}
                />
                {touched.pincode && errors.pincode && (
                  <span className="afm-error">{errors.pincode}</span>
                )}
              </div>
            </div>
          </section>

          <section className="afm-section">
            <h4 className="afm-section-title">Save As</h4>
            <div className="afm-type-cards">
              {TYPE_OPTIONS.map((t) => {
                const active = form.address_type === t.key;
                return (
                  <button
                    type="button"
                    key={t.key}
                    className={`afm-type-card ${active ? "active" : ""}`}
                    onClick={() => update({ address_type: t.key })}
                  >
                    {active && <FiCheck className="afm-type-check" />}
                    <span className="afm-type-icon">{t.icon}</span>
                    <span className="afm-type-name">{t.key}</span>
                    <span className="afm-type-hint">{t.hint}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <div className="afm-actions">
            <button type="button" className="afm-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="afm-save" disabled={saving}>
              {saving ? "Saving..." : initialData ? "Update Address" : "Save Address"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddressFormModal;
