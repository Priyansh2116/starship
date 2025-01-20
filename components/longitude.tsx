"use client"
import React, { useState, useEffect, useCallback } from 'react';

const LongitudeDisplay = () => {
  const [longitude, setLongitude] = useState<number | null>(null);
  const [isUpdated, setIsUpdated] = useState(true);

  const handleMessage = useCallback((event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data);
      
      if (data.type === 'gps' && !data.data?.longitude) {
        setIsUpdated(false);
        return;
      }

      if (data.type === 'gps' && data.data?.longitude) {
        const newLongitude = Number(data.data.longitude);
        if (!isNaN(newLongitude)) {
          setLongitude(newLongitude);
          setIsUpdated(true);
        }
      }
    } catch (error) {
      setIsUpdated(false);
    }
  }, []);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8786');
    ws.onmessage = handleMessage;

    return () => {
      ws.close();
    };
  }, [handleMessage]);

  return (
    <div className="p-4 bg-gray-1000 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-white mb-2">Longitude</h2>
      <div className="flex items-center space-x-2">
        <div className="text-3xl font-bold text-green-600">
          {longitude !== null ? longitude.toFixed(6) : '--'}°
        </div>
      </div>
      <div className="text-sm text-white mt-2">
        {longitude === null ? 'No data' : isUpdated ? 'Live data' : 'Updated earlier'}
      </div>
    </div>
  );
};

export default LongitudeDisplay;
