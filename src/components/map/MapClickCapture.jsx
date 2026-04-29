import { useMapEvents } from "react-leaflet";

export default function MapClickCapture({ onMapClick }) {
  useMapEvents({
    click(event) {
      onMapClick?.({
        lat: event.latlng.lat,
        lng: event.latlng.lng,
      });
    },
  });

  return null;
}
