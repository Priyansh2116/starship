"use client";

import React, { useEffect, useState } from 'react';

const Compass: React.FC = () => {
  const [compassDegree, setCompassDegree] = useState<number>(0);

  useEffect(() => {
    const ws = new WebSocket('ws://127.0.0.1:8786');

    ws.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data); // Ensure the data is parsed correctly
      if (data.type === "compass") {
        const degree = parseFloat(data.value);
        setCompassDegree(degree);
        console.log(`Received Compass Degree: ${degree}°`);
      }
    };

    ws.onclose = () => {
      console.log("Disconnected from WebSocket server");
    };

    return () => {
      ws.close();
    };
  }, []);

  const needleRotation = `rotate(${compassDegree}deg)`;

  return (
    <div className="compass-container text-center">
      <div className="compass">
        <div className="needle" style={{ transform: needleRotation }}></div>

        {/* Cardinal Directions */}
        <div className="compass-label north">N</div>
        <div className="compass-label east">E</div>
        <div className="compass-label south">S</div>
        <div className="compass-label west">W</div>

        {/* Intermediate Directions */}
        <div className="compass-label northeast">NE</div>
        <div className="compass-label southeast">SE</div>
        <div className="compass-label southwest">SW</div>
        <div className="compass-label northwest">NW</div>

        {/* Degree Labels */}
        <div className="compass-label degree-0">0°</div>
        <div className="compass-label degree-90">90°</div>
        <div className="compass-label degree-180">180°</div>
        <div className="compass-label degree-270">270°</div>
      </div>

      {/* Display Degree */}
      <p className="mt-2 text-sm">Current Degree: {compassDegree.toFixed(2)}°</p>

      <style jsx>{`
        .compass-container {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .compass {
          position: relative;
          width: 150px;
          height: 150px;
          border-radius: 50%;
          border: 5px solid #333;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f0f0f0;
        }

        .needle {
          position: absolute;
          width: 2px;
          height: 60px;
          background-color: red;
          top: 20px;
          transform-origin: 50% 100%;
        }

        /* Compass labels */
        .compass-label {
          position: absolute;
          font-size: 14px;
          font-weight: bold;
          color: #333;
        }

        /* Positioning the labels */
        .north {
          top: 5px;
          left: 50%;
          transform: translateX(-50%);
        }

        .east {
          right: 5px;
          top: 50%;
          transform: translateY(-50%);
        }

        .south {
          bottom: 5px;
          left: 50%;
          transform: translateX(-50%);
        }

        .west {
          left: 5px;
          top: 50%;
          transform: translateY(-50%);
        }

        .northeast {
          top: 20px;
          right: 20px;
        }

        .southeast {
          bottom: 20px;
          right: 20px;
        }

        .southwest {
          bottom: 20px;
          left: 20px;
        }

        .northwest {
          top: 20px;
          left: 20px;
        }

        .degree-0 {
          top: 25px;
          left: 50%;
          transform: translateX(-50%);
        }

        .degree-90 {
          right: 25px;
          top: 50%;
          transform: translateY(-50%);
        }

        .degree-180 {
          bottom: 25px;
          left: 50%;
          transform: translateX(-50%);
        }

        .degree-270 {
          left: 25px;
          top: 50%;
          transform: translateY(-50%);
        }

        p {
          font-size: 14px;
        }
      `}</style>
    </div>
  );
};

export default Compass;

