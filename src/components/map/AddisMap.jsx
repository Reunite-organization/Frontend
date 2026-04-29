import { MapContainer, TileLayer, ZoomControl } from "react-leaflet";
import MapMarkers from "./MapMarkers";
import { FitMapToMarkers } from "./MapBounds";
import MapClickCapture from "./MapClickCapture";

const MIN_MAP_ZOOM = 6;
const MAX_MAP_ZOOM = 15;

export default function AddisMap({
  locations = [],
  activeMarkerId = null,
  onMapClick,
}) {
  return (
    <MapContainer
      minZoom={MIN_MAP_ZOOM}
      maxZoom={MAX_MAP_ZOOM}
      zoomControl={false}
      scrollWheelZoom
      className="h-full w-full"
    >
      <ZoomControl position="bottomright" />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitMapToMarkers
        locations={locations}
        maxFitZoom={14}
      />
      <MapClickCapture onMapClick={onMapClick} />
      <MapMarkers locations={locations} activeMarkerId={activeMarkerId} />
    </MapContainer>
  );
}
