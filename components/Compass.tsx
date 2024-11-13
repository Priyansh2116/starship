'use client'; // Ensure this is a client component

import React from 'react';

const Compass: React.FC = () => {
  return (
    <div className="compass-container text-center">
      <div className="compass">
        <div className="needle"></div>
      </div>
      <p className="mt-2 text-sm">Compass</p>

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
          animation: rotate-needle 2s infinite linear;
        }

        /* Animate the needle rotation to simulate direction */
        @keyframes rotate-needle {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        p {
          font-size: 14px;
        }
      `}</style>
    </div>
  );
};

export default Compass;
