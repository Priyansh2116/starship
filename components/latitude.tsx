"use client"
import React, { useState, useEffect, useCallback } from 'react';

const LatitudeDisplay = () => {
  const [latitude, setLatitude] = useState<number | null>(null);

  const handleMessage = useCallback((event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === 'gps' && data.data?.latitude != null) {
        const newLatitude = Number(data.data.latitude);
        if (!isNaN(newLatitude)) {
          setLatitude(newLatitude);
        }
      }
    } catch (error) {
      console.error('Error processing GPS data:', error);
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
      <h2 className="text-xl font-semibold text-white mb-2">Latitude</h2>
      <div className="flex items-center space-x-2">
        <div className="text-3xl font-bold text-green-600">
          {latitude !== null ? latitude.toFixed(6) : '--'}°
        </div>
      </div>
      <div className="text-sm text-white mt-2">Live data</div>
    </div>
  );
};

export default LatitudeDisplay;
