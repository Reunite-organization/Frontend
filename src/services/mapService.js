import L from 'leaflet';
import 'leaflet.heat';
import 'leaflet-polylinedecorator';

const DEFAULT_CENTER = [9.0320, 38.7469]; 
const DEFAULT_ZOOM = 12;

const TILE_LAYERS = {
  openstreetmap: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
  },
  cartodb: {
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '© CartoDB',
    maxZoom: 19
  },
  esri: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: '© Esri',
    maxZoom: 19
  }
};

/**
 * Initialize Leaflet map with smart tile fallback
 */
export function initializeMap(elementId, options = {}) {
  const { center = DEFAULT_CENTER, zoom = DEFAULT_ZOOM } = options;
  
  const map = L.map(elementId).setView(center, zoom);
  
  // Try primary tile layer, fallback to alternatives
  let tileLayer;
  let layerIndex = 0;
  const layerKeys = Object.keys(TILE_LAYERS);
  
  const tryNextLayer = () => {
    if (layerIndex >= layerKeys.length) {
      console.warn('All tile layers failed. Map may not display properly.');
      return null;
    }
    
    const key = layerKeys[layerIndex];
    const config = TILE_LAYERS[key];
    
    const layer = L.tileLayer(config.url, {
      attribution: config.attribution,
      maxZoom: config.maxZoom,
      errorTileUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
    });
    
    layer.on('tileerror', () => {
      console.warn(`Tile layer ${key} failed, trying next...`);
      layerIndex++;
      const nextLayer = tryNextLayer();
      if (nextLayer) {
        map.removeLayer(layer);
        nextLayer.addTo(map);
      }
    });
    
    layer.addTo(map);
    tileLayer = layer;
    return layer;
  };
  
  tryNextLayer();

  map._currentTileLayer = tileLayer;
  
  return map;
}

export function createGoogleMapsUrl(lat, lng, zoom = 15) {
  return `https://www.google.com/maps?q=${lat},${lng}&z=${zoom}`;
}


export function createGoogleMapsDirectionsUrl(points) {
  if (!points || points.length === 0) return null;
  
  if (points.length === 1) {
    return `https://www.google.com/maps?q=${points[0][0]},${points[0][1]}`;
  }
  
  const origin = `${points[0][0]},${points[0][1]}`;
  const destination = `${points[points.length - 1][0]},${points[points.length - 1][1]}`;
  
  let url = `https://www.google.com/maps/dir/${origin}/${destination}`;
  
  if (points.length > 2) {
    const waypoints = points.slice(1, -1).map(p => `${p[0]},${p[1]}`).join('/');
    url += `/data=!4m2!4m1!3e2?waypoints=${waypoints}`;
  }
  
  return url;
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return {
    kilometers: distance,
    meters: distance * 1000,
    formatted: distance < 1 
      ? `${Math.round(distance * 1000)} meters`
      : `${distance.toFixed(1)} km`
  };
}

/**
 * Format distance for display
 */
export function formatDistance(distanceKm) {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`;
  }
  return `${distanceKm.toFixed(1)} km`;
}

/**
 * Create custom marker with animation
 */
export function createAnimatedMarker(latlng, options = {}) {
  const { color = '#3B82F6', pulse = true, label = null } = options;
  
  const markerHtml = `
    <div class="custom-marker ${pulse ? 'pulse-marker' : ''}" style="
      background-color: ${color};
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 5px rgba(0,0,0,0.3);
    "></div>
    ${label ? `<div class="marker-label">${label}</div>` : ''}
  `;
  
  const icon = L.divIcon({
    html: markerHtml,
    className: 'custom-marker-container',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15]
  });
  
  return L.marker(latlng, { icon });
}

/**
 * Create heatmap layer from points
 */
export function createHeatmapLayer(points, options = {}) {
  const {
    radius = 25,
    blur = 15,
    maxZoom = 18,
    gradient = {
      0.4: 'blue',
      0.6: 'cyan',
      0.7: 'lime',
      0.8: 'yellow',
      1.0: 'red'
    }
  } = options;
  
  return L.heatLayer(points, {
    radius,
    blur,
    maxZoom,
    gradient
  });
}

/**
 * Create movement trail with arrows
 */
export function createMovementTrail(map, points, options = {}) {
  const { color = '#3B82F6', weight = 3, opacity = 0.8 } = options;
  
  // Create polyline
  const polyline = L.polyline(points, {
    color,
    weight,
    opacity,
    smoothFactor: 1
  }).addTo(map);
  
  // Add directional arrows
  const decorator = L.polylineDecorator(polyline, {
    patterns: [
      {
        offset: 25,
        repeat: 50,
        symbol: L.Symbol.arrowHead({
          pixelSize: 15,
          polygon: false,
          pathOptions: {
            stroke: true,
            color: color,
            weight: 2
          }
        })
      }
    ]
  }).addTo(map);
  
  return { polyline, decorator };
}

/**
 * Fit map to show all points
 */
export function fitMapToPoints(map, points, padding = [50, 50]) {
  if (!points || points.length === 0) return;
  
  const bounds = L.latLngBounds(points);
  map.fitBounds(bounds, { padding });
}

/**
 * Check if tile layer is working
 */
export async function checkTileLayerHealth(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url.replace('{z}', '12').replace('{x}', '100').replace('{y}', '100');
    
    // Timeout after 5 seconds
    setTimeout(() => resolve(false), 5000);
  });
}

/**
 * Get best available map URL
 */
export async function getMapFallbackUrl(lat, lng) {
  // Check OpenStreetMap health first
  const osmHealthy = await checkTileLayerHealth('https://tile.openstreetmap.org/12/100/100.png');
  
  if (osmHealthy) {
    return {
      type: 'osm',
      url: `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=15/${lat}/${lng}`
    };
  }
  
  return {
    type: 'google',
    url: createGoogleMapsUrl(lat, lng)
  };
}
