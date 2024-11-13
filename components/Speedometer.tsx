// components/Speedometer.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Speedometer, {
  Background,
  Arc,
  Needle,
  Progress,
  Marks,
  Indicator,
} from 'react-speedometer';

const SpeedometerComponent = () => {
  const [speed, setSpeed] = useState(0);

  useEffect(() => {
    // Connect to the WebSocket server at ws://localhost:8765
    const socket = new WebSocket("ws://localhost:8765");

    socket.onmessage = (event) => {
      const receivedSpeed = parseInt(event.data, 10);
      setSpeed(receivedSpeed);
    };

    // Clean up the WebSocket connection when the component unmounts
    return () => socket.close();
  }, []);

  return (
    <Speedometer value={speed} fontFamily="squada-one">
      <Background />
      <Arc />
      <Needle />
      <Progress />
      <Marks />
      <Indicator />
    </Speedometer>
  );
};

export default SpeedometerComponent;
