"use client"
import React, { useState, useEffect } from 'react';

const LongitudeDisplay = () => {
  const [longitude, setLongitude] = useState<number | null>(null);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8786');

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'gps') {
        setLongitude(data.data.longitude);
      }
    };

    return () => ws.close();
  }, []);

  return (
    <div className="p-4 bg-gray-1000 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-white mb-2">Longitude</h2>
      <div className="flex items-center space-x-2">
        <div className="text-3xl font-bold text-green-600">
          {longitude !== null ? longitude.toFixed(6) : '--'}°
        </div>
      </div>
      <div className="text-sm text-white mt-2">
        {longitude !== null ? 'Live data' : 'data'}
      </div>
    </div>
  );
};

export default LongitudeDisplay;
