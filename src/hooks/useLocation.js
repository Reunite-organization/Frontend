import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export function useLocation() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getCurrentLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      toast.error('Geolocation not supported');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const locationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
          address: null // Will be filled by reverse geocoding
        };
        
        setLocation(locationData);
        setLoading(false);
        toast.success('Location captured successfully');
        
        // Optional: Reverse geocode to get address
        reverseGeocode(locationData.latitude, locationData.longitude);
      },
      (error) => {
        let errorMessage = 'Unknown error';
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }
        setError(errorMessage);
        toast.error(errorMessage);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      
      setLocation(prev => ({
        ...prev,
        address: data.display_name
      }));
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
    }
  };

  return {
    location,
    loading,
    error,
    getCurrentLocation
  };
}
