'use client';
import React, { useState, useRef } from 'react';

const Stopwatch: React.FC = () => {
  const [time, setTime] = useState(0); // Time in milliseconds
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Start the stopwatch
  const start = () => {
    if (!isRunning) {
      setIsRunning(true);
      timerRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 10); // Increase time by 10 milliseconds
      }, 10);
    }
  };

  // Stop the stopwatch
  const stop = () => {
    if (isRunning && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
      setIsRunning(false);
    }
  };

  // Reset the stopwatch
  const reset = () => {
    stop();
    setTime(0);
  };

  // Format time to display in mm:ss:ms
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const milliseconds = Math.floor((time % 1000) / 10);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(milliseconds).padStart(2, '0')}`;
  };

  return (
    <div className="stopwatch">
      <h2>{formatTime(time)}</h2>
      <div className="buttons">
        <button onClick={start} disabled={isRunning}>Start</button>
        <button onClick={stop} disabled={!isRunning}>Stop</button>
        <button onClick={reset}>Reset</button>
      </div>
      <style jsx>{`
        .stopwatch {
          display: flex;
          flex-direction: column;
          align-items: center;
          font-family: Arial, sans-serif;
        }
        h2 {
          font-size: 2em;
          margin: 0.5em 0;
        }
        .buttons {
          display: flex;
          gap: 10px;
        }
        button {
          padding: 0.5em 1em;
          font-size: 1em;
          cursor: pointer;
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 5px;
        }
        button:disabled {
          background-color: #ddd;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default Stopwatch;
