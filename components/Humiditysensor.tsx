"use client"
import { useEffect, useState } from 'react';

const GasSensor = () => {
  const [humidvalue, setHumidValue] = useState<number | null>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8786");

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data); 
        if (data.type === "humidvalue") {
          setHumidValue(parseInt(data.value, 10));
        }
      } catch (err) {
        console.error("Error parsing WebSocket message:", err);
      }
    };

    return () => socket.close();
  }, []);

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      {humidvalue !== null ? (
        <p>Current Gas Value: <strong>{humidvalue}</strong></p>
      ) : (
        <p>Waiting for data...</p>
      )}
    </div>
  );
};
