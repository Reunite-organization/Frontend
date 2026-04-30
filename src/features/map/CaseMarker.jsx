import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function CaseMarker({ caseData, isSelected = false }) {
  const navigate = useNavigate();
  
  const getMarkerIcon = () => {
    const priority = caseData.priority?.level || 'MEDIUM';
    const colors = {
      HIGH: '#EF4444',
      MEDIUM: '#F59E0B',
      LOW: '#10B981'
    };
    
    const size = isSelected ? 40 : 32;
    const color = colors[priority];
    
    return L.divIcon({
      html: `
        <div style="
          width: ${size}px;
          height: ${size}px;
          background: ${color};
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: ${isSelected ? '14px' : '12px'};
          ${priority === 'HIGH' ? 'animation: pulse 2s infinite;' : ''}
        ">
          ${caseData.person?.age || '?'}
        </div>
      `,
      className: 'custom-marker',
      iconSize: [size, size],
      iconAnchor: [size/2, size/2],
      popupAnchor: [0, -size/2]
    });
  };
  
  const formatTimeAgo = (timestamp) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };
  
  if (!caseData.lastSeen?.location?.coordinates) return null;
  
  return (
    <Marker
      position={[
        caseData.lastSeen.location.coordinates[1],
        caseData.lastSeen.location.coordinates[0]
      ]}
      icon={getMarkerIcon()}
    >
      <Popup>
        <div className="min-w-[250px] p-2">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-bold text-lg">
                {caseData.person?.name || 'Unknown'}
              </h3>
              <p className="text-sm text-gray-600">
                Age: {caseData.person?.age || 'Unknown'} • {caseData.person?.gender || 'Unknown'}
              </p>
            </div>
            <Badge className={
              caseData.priority?.level === 'HIGH' ? 'bg-red-500' :
              caseData.priority?.level === 'MEDIUM' ? 'bg-yellow-500' : 'bg-green-500'
            }>
              {caseData.priority?.level}
            </Badge>
          </div>
          
          <p className="text-sm text-gray-700 mb-2">
            {caseData.aiData?.summary || caseData.person?.description || 'No description'}
          </p>
          
          <div className="text-xs text-gray-500 space-y-1 mb-3">
            <p>📍 {caseData.lastSeen.address || 'Unknown location'}</p>
            <p>🕐 Last seen: {formatTimeAgo(caseData.lastSeen.timestamp)}</p>
            {caseData.sightings?.length > 0 && (
              <p>👁️ {caseData.sightings.length} sighting(s)</p>
            )}
          </div>
          
          {caseData.person?.clothing?.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {caseData.person.clothing.slice(0, 3).map((item, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {item}
                </Badge>
              ))}
            </div>
          )}
          
          <Button
            size="sm"
            className="w-full"
            onClick={() => navigate(`/case/${caseData.caseId}`)}
          >
            View Full Details
          </Button>
        </div>
      </Popup>
    </Marker>
  );
}
