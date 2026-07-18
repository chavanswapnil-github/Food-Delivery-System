import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import icon2x from "leaflet/dist/images/marker-icon-2x.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

// Vite doesn't resolve Leaflet's default marker asset paths automatically —
// point them at the bundled images explicitly. Safe to import multiple times.
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: icon2x,
  iconUrl: icon,
  shadowUrl: iconShadow,
});
