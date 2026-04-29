import { Marker, Popup } from "react-leaflet";
import { useEffect, useRef } from "react";
import L from "leaflet";
import MarkerPopupCard from "./MarkerPopupCard";
import { markerStatusStyles } from "./statusStyles";

const createMarkerIcon = (status) => {
  const markerColor =
    markerStatusStyles[status]?.marker || markerStatusStyles.Active.marker;

  return L.divIcon({
    className: "city-map-marker",
    html: `
      <div class="city-map-marker__pin" style="display:flex;align-items:center;justify-content:center;width:18px;height:18px;border-radius:9999px;background:${markerColor};border:3px solid #FDFBF7;box-shadow:0 10px 24px rgba(44,40,37,0.18);"></div>
    `,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
};

export default function MapMarkers({ locations, activeMarkerId }) {
  return locations.map((location) => (
    <MarkerWithPopup
      key={`${location.caseId}-${location.lat}-${location.lng}`}
      location={location}
      shouldOpen={location.caseId === activeMarkerId}
    />
  ));
}

function MarkerWithPopup({ location, shouldOpen }) {
  const popupRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!shouldOpen || !markerRef.current) return;

    markerRef.current.openPopup();
  }, [shouldOpen]);

  return (
    <Marker
      ref={markerRef}
      position={[location.lat, location.lng]}
      icon={createMarkerIcon(location.status)}
    >
      <Popup ref={popupRef}>
        <MarkerPopupCard
          location={location}
          onClose={() => popupRef.current?._source?.closePopup()}
        />
      </Popup>
    </Marker>
  );
}
