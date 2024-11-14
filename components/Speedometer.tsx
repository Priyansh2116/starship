
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
  
    const socket = new WebSocket("ws://localhost:8786");

    socket.onmessage = (event) => {
      const receivedSpeed = parseInt(event.data, 10);
      setSpeed(receivedSpeed);
    };

    
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
