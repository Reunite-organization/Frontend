import L from "leaflet";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

export const getMarkerBounds = (locations = []) =>
  L.latLngBounds(locations.map((location) => [location.lat, location.lng]));

export function FitMapToMarkers({
  locations,
  padding = [48, 48],
  maxFitZoom = 14,
}) {
  const map = useMap();

  useEffect(() => {
    if (!locations.length) return;

    map.fitBounds(getMarkerBounds(locations), {
      padding,
      maxZoom: maxFitZoom,
    });
  }, [locations, map, maxFitZoom, padding]);

  return null;
}
