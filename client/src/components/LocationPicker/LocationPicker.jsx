import { useCallback, useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../../utils/leafletIcons";
import { FiSearch, FiCrosshair, FiLoader } from "react-icons/fi";
import "./LocationPicker.css";

const DEFAULT_CENTER = [18.5204, 73.8567]; // Pune — sensible fallback until a location is picked
const NOMINATIM_BASE = "https://nominatim.openstreetmap.org";

function parseNominatimResult(item) {
  const a = item.address || {};
  const line = [a.house_number, a.road || a.suburb || a.neighbourhood]
    .filter(Boolean)
    .join(" ");

  return {
    label: item.display_name || "",
    lat: parseFloat(item.lat),
    lng: parseFloat(item.lon),
    address_line: line || a.suburb || a.neighbourhood || "",
    city: a.city || a.town || a.village || a.county || "",
    state: a.state || "",
    pincode: a.postcode || "",
  };
}

// Keeps the map centered on the picked point without re-mounting it.
function RecenterOnChange({ lat, lng }) {
  const map = useMap();
  const hasCentered = useRef(false);

  useEffect(() => {
    if (lat == null || lng == null) return;
    map.flyTo([lat, lng], hasCentered.current ? map.getZoom() : 16, { duration: 0.6 });
    hasCentered.current = true;
  }, [lat, lng, map]);

  return null;
}

function ClickToPlace({ onPick }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function LocationPicker({ latitude, longitude, onChange }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [locating, setLocating] = useState(false);
  const debounceRef = useRef(null);

  const position = latitude != null && longitude != null ? [latitude, longitude] : DEFAULT_CENTER;

  const reverseGeocode = useCallback(async (lat, lng) => {
    try {
      const res = await fetch(
        `${NOMINATIM_BASE}/reverse?format=json&addressdetails=1&lat=${lat}&lon=${lng}`
      );
      const data = await res.json();
      const parsed = parseNominatimResult({ ...data, lat, lon: lng });
      setQuery(parsed.label);
      onChange(parsed);
    } catch {
      onChange({ lat, lng, label: "", address_line: "", city: "", state: "", pincode: "" });
    }
  }, [onChange]);

  const runSearch = useCallback((text) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!text || text.trim().length < 3) {
      setSuggestions([]);
      setSearching(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(
          `${NOMINATIM_BASE}/search?format=json&addressdetails=1&limit=5&q=${encodeURIComponent(text)}`
        );
        const data = await res.json();
        setSuggestions(data.map(parseNominatimResult));
      } catch {
        setSuggestions([]);
      } finally {
        setSearching(false);
      }
    }, 400);
  }, []);

  const handleQueryChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setShowSuggestions(true);
    runSearch(val);
  };

  const pickSuggestion = (s) => {
    setQuery(s.label);
    setShowSuggestions(false);
    setSuggestions([]);
    onChange(s);
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      window.alert("Geolocation isn't supported by this browser.");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
        setLocating(false);
      },
      () => {
        setLocating(false);
        window.alert("Couldn't get your location. Please allow location access and try again.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleMarkerDragEnd = (e) => {
    const { lat, lng } = e.target.getLatLng();
    reverseGeocode(lat, lng);
  };

  return (
    <div className="location-picker">
      <div className="lp-search-row">
        <div className="lp-search-box">
          <FiSearch className="lp-search-icon" />
          <input
            type="text"
            placeholder="Search area, street, landmark..."
            value={query}
            onChange={handleQueryChange}
            onFocus={() => setShowSuggestions(true)}
          />
          {searching && <FiLoader className="lp-spinner" />}
        </div>

        <button type="button" className="lp-locate-btn" onClick={useCurrentLocation} disabled={locating}>
          <FiCrosshair className={locating ? "lp-spinner" : ""} />
          {locating ? "Locating..." : "Use Current Location"}
        </button>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <ul className="lp-suggestions">
          {suggestions.map((s, i) => (
            <li key={i} onClick={() => pickSuggestion(s)}>
              {s.label}
            </li>
          ))}
        </ul>
      )}

      <div className="lp-map-wrap">
        <MapContainer center={position} zoom={latitude != null ? 16 : 12} scrollWheelZoom className="lp-map">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker
            position={position}
            draggable
            eventHandlers={{ dragend: handleMarkerDragEnd }}
          />
          <ClickToPlace onPick={reverseGeocode} />
          <RecenterOnChange lat={latitude} lng={longitude} />
        </MapContainer>
      </div>

      <p className="lp-hint">
        Drag the pin, tap the map, or search above to set the exact delivery spot.
      </p>
    </div>
  );
}

export default LocationPicker;
