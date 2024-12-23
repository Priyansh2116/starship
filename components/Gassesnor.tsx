"use client"
import { useEffect, useState } from 'react';

const GasSensor = () => {
  const [gasvalue, setGasValue] = useState<number | null>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8786");

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data); // Parse incoming message as JSON
        if (data.type === "gasvalue") {
          setGasValue(parseInt(data.value, 10));
        }
      } catch (err) {
        console.error("Error parsing WebSocket message:", err);
      }
    };

    return () => socket.close();
  }, []);

  return (
    <div style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
      {gasvalue !== null ? (
        <p>Sensor 1: <strong>{gasvalue}</strong></p>
      ) : (
        <p>Waiting for data...</p>
      )}
    </div>
  );
};

export default GasSensor;
