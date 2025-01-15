import React, { useState, useEffect, useRef } from 'react';

const LatitudeDisplay = () => {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [isError, setIsError] = useState(false);
  const lastValidLatitude = useRef<number | null>(null);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8786');
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'gps' && data.data.latitude !== undefined) {
          setLatitude(data.data.latitude);
          lastValidLatitude.current = data.data.latitude;
          setIsError(false);
        } else {
          // Keep the last valid latitude but show error state
          setLatitude(lastValidLatitude.current);
          setIsError(true);
        }
      } catch (error) {
        // In case of parsing error, keep last valid latitude
        setLatitude(lastValidLatitude.current);
        setIsError(true);
      }
    };

    ws.onerror = () => {
      setLatitude(lastValidLatitude.current);
      setIsError(true);
    };

    return () => ws.close();
  }, []);

  return (
    <div className="p-4 bg-gray-900 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-white mb-2">Latitude</h2>
      <div className="flex items-center space-x-2">
        <div className={`text-3xl font-bold ${isError ? 'text-yellow-500' : 'text-blue-500'}`}>
          {latitude !== null ? latitude.toFixed(6) : '--'}°
        </div>
      </div>
      <div className="text-sm text-gray-300 mt-2">
        {isError ? 'Using last valid data' : 'Live data'}
      </div>
    </div>
  );
};

export default LatitudeDisplay;
